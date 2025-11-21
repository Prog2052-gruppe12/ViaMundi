// Updated code using fetchDetails.

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingPage from "@/app/loading";
import { decodeCityToCord } from "@/utils/decodeCityToCord";
import { parseYMD } from "@/lib/date/parseYMD";
import { formatYMDLocal } from "@/lib/date/formatYMDLocal";
import { Section } from "@/components/common/Section";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import PlanDay from "@/components/features/travelPlan/PlanDay";
import { useSaveTrip } from "@/hooks/useSaveTrip";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { getCityName } from "@/utils/cityFromDest";

async function runSummarize(params, paramType) {
    const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            destination: params.destination,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            travelers: params.travelers,
            interests: params.interests,
            other: params.other,
            type: paramType = "both"
        })
    });
    return res.json();
}

async function fetchLocationIds(destination, interests) {
    const qs = new URLSearchParams();

    if (destination) qs.set("destination", destination);
    if (interests) qs.set("interests", interests);
    const res = await fetch(`/api/attractions?${qs.toString()}`);
    return res.json();
}

async function fetchRestaurantIds(destination, interests) {
    const qs = new URLSearchParams();

    if (destination) qs.set("destination", destination);
    if (interests) qs.set("searchQuery", interests);
    const res = await fetch(`/api/restaurants?${qs.toString()}`);
    return res.json();
}

async function fetchDetails(id) {
    const res = await fetch(`/api/location/details?locationId=${id}`);
    return res.json();
}

async function fetchImage(id) {
    const res = await fetch(`/api/location/image?locationId=${id}`);
    return res.json();
}

async function fetchWeather(destination, dateFrom, dateTo) {
    const qs = new URLSearchParams();

    if (destination) qs.set("destination", destination);
    if (dateFrom) qs.set("dateFrom", dateFrom);
    if (dateTo) qs.set("dateTo", dateTo);
    const res = await fetch(`/api/weather-summary?${qs.toString()}`);
    return res.json();
}

function createPlanSkeleton(dateFrom, dateTo) {
    const start = parseYMD(dateFrom);
    const end = parseYMD(dateTo);
    if (!start || !end || start > end) return {};

    const days = [];
    const cursor = new Date(start);
    while (cursor <= end) {
        days.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return days.reduce((acc, date, idx) => {
        const key = formatYMDLocal(date);
        acc[key] = {
            dayNumber: idx + 1,
            attractions: [],
            restaurants: []
        };
        return acc;
    }, {});
}

async function curateLocations(locations, userInterests, destination) {
    try {
        const res = await fetch('/api/ai/curate-activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                locations,
                userInterests,
                destination
            })
        });

        const data = await res.json();

        if (!data.success) {
            console.error('Curation failed:', data.error);
            // Fallback: return all location IDs if curation fails
            return locations.map(loc => loc.location_id);
        }

        console.log(`AI Curation: kept ${data.kept_count}/${locations.length} locations. Reason: ${data.reason}`);
        return data.curated;
    } catch (error) {
        console.error('Error during curation:', error);
        // Fallback: return all location IDs if curation fails
        return locations.map(loc => loc.location_id);
    }
}

async function fillPlanWithDetails(planSkeleton, locationIds, restaurantIds, weatherSummary, userInterests, destination) {
    const filled = { ...planSkeleton };
    const attractionIds = locationIds?.location_ids ?? [];
    const restaurantIdsArray = restaurantIds?.location_ids ?? [];

    // Fetch ALL details first (for AI curation)
    console.log(`Fetching details for ${attractionIds.length} attractions and ${restaurantIdsArray.length} restaurants...`);

    const [allAttractionDetails, allRestaurantDetails] = await Promise.all([
        Promise.all(attractionIds.map(id => fetchDetails(id))),
        Promise.all(restaurantIdsArray.map(id => fetchDetails(id)))
    ]);

    // Filter out null/failed fetches
    const validAttractions = allAttractionDetails.filter(Boolean);
    const validRestaurants = allRestaurantDetails.filter(Boolean);

    // AI CURATION STEP
    console.log('Running AI curation on attractions and restaurants...');
    const [curatedAttractionIds, curatedRestaurantIds] = await Promise.all([
        curateLocations(validAttractions, userInterests, destination),
        curateLocations(validRestaurants, userInterests, destination)
    ]);

    // Filter details to only curated ones
    const curatedAttractions = validAttractions.filter(loc =>
        curatedAttractionIds.includes(loc.location_id)
    );
    const curatedRestaurants = validRestaurants.filter(loc =>
        curatedRestaurantIds.includes(loc.location_id)
    );

    console.log(`After curation: ${curatedAttractions.length} attractions, ${curatedRestaurants.length} restaurants`);

    // Fetch images for curated locations
    const [attractionImages, restaurantImages] = await Promise.all([
        Promise.all(curatedAttractions.map(loc => fetchImage(loc.location_id))),
        Promise.all(curatedRestaurants.map(loc => fetchImage(loc.location_id)))
    ]);

    // Add images to curated details
    const attractionsWithImages = curatedAttractions.map((loc, idx) => ({
        ...loc,
        image: attractionImages[idx] ?? null
    }));

    const restaurantsWithImages = curatedRestaurants.map((loc, idx) => ({
        ...loc,
        image: restaurantImages[idx] ?? null
    }));

    // Distribute curated locations across days
    const keys = Object.keys(filled);

    for (let i = 0; i < keys.length; i++) {
        const dayKey = keys[i];
        const attraction = attractionsWithImages[i] || null;
        const restaurant = restaurantsWithImages[i] || null;

        filled[dayKey].attractions = attraction ? [attraction] : [];
        filled[dayKey].restaurants = restaurant ? [restaurant] : [];
    }

    return filled;
}

async function fetchSummarizedPlan(fullPlan) {
    const res = await fetch('/api/travelPlan-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travelPlan: fullPlan })
    });
    const data = await res.json();
    return data;
}

export default function ResultContent() {
    const searchParams = useSearchParams();
    const destinationParam = searchParams.get("destination") || "";
    const dateFromParam = searchParams.get("dateFrom") || "";
    const dateToParam = searchParams.get("dateTo") || "";
    const travelersParam = searchParams.get("travelers") || "";
    const interestsParam = searchParams.get("interests") || "";
    const otherParam = searchParams.get("other") || "";

    const [loading, setLoading] = useState(true);
    const [summarized, setSummarized] = useState(null);
    const [fullPlan, setFullPlan] = useState(null);
    const [summarizedPlan, setSummarizedPlan] = useState(null);
    const [weatherSummary, setWeatherSummary] = useState(null);

    const params = {
        destination: destinationParam,
        dateFrom: dateFromParam,
        dateTo: dateToParam,
        travelers: travelersParam,
        interests: interestsParam,
        other: otherParam
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            setLoading(true);
            try {
                console.log(
                    JSON.stringify({
                        destination: params.destination,
                        dateFrom: params.dateFrom,
                        dateTo: params.dateTo,
                        travelers: params.travelers,
                        interests: params.interests,
                        other: params.other,
                        type: "both"
                    })
                );
                const summary = await runSummarize(params);
                console.log('Summary response:', summary);

                if (!summary || !summary.data) {
                    console.error('Invalid summary response:', summary);
                }

                /*

                if (mounted) setSummarized(summary?.data?.interests?.queries?.[0] ?? interestsParam);
                const locationQuery = summary?.data?.interests?.queries?.[0] ?? interestsParam;
                const restaurantQuery = summary?.data?.restaurants?.queries?.[0] ?? interestsParam;

                const [locationIds, restaurantIds] = await Promise.all([
                    fetchLocationIds(destinationParam, locationQuery),
                    fetchRestaurantIds(destinationParam, restaurantQuery)
                ]);

                const weatherSummary = await fetchWeather(destinationParam, dateFromParam, dateToParam);

                const skeleton = createPlanSkeleton(dateFromParam, dateToParam);

                const fullPlan = await fillPlanWithDetails(
                    skeleton,
                    locationIds,
                    restaurantIds,
                    null,
                    interestsParam,
                    destinationParam
                );

                const summarizedPlan = await fetchSummarizedPlan(fullPlan);

                if (mounted) {
                    setFullPlan(fullPlan);
                    setSummarizedPlan(summarizedPlan);
                    setWeatherSummary(weatherSummary);
                }
                    */
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [destinationParam, dateFromParam, dateToParam, travelersParam, interestsParam, otherParam]);

    // Save trip functionality
    const { saveTrip, isSaving, error: saveError } = useSaveTrip();
    const [saveSuccess, setSaveSuccess] = useState(false);

    const dayKeys = Object.keys(fullPlan || {});

    const handleSaveTrip = async () => {
        setSaveSuccess(false);

        // Extract thumbnail from first day's activity if available
        const firstDayKey = dayKeys[0];
        const firstAttraction = fullPlan[firstDayKey]?.attractions?.[0] ?? null;
        const thumbnailUrl = firstAttraction?.image?.url || null;

        const tripData = {
            destination: params.destination,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            travelers: parseInt(params.travelers) || 1,
            interests: summarized || "",
            interestsRaw: params.interests || "",
            finalPlan: fullPlan,
            summarizedPlan: summarizedPlan?.summarizedPlan || {},
            weatherSummary: weatherSummary?.aiSummary || {},
            metadata: {
                cityName: getCityName(params.destination) || params.destination,
                dayCount: dayKeys.length,
                thumbnailUrl,
            },
        };

        const result = await saveTrip(tripData);
        if (result.success) {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (loading) return <LoadingPage />;

    return (
        <div className="flex flex-col items-center w-full h-fit px-4 md:px-16 lg:px-32 ">
            <div className="flex flex-col w-full overflow-hidden rounded-2xl border max-w-[1700px]">
                <SearchParameters
                    destination={params.destination}
                    dateFrom={params.dateFrom}
                    dateTo={params.dateTo}
                    travelers={params.travelers}
                    interests={summarized}
                />

                {/* Save Trip Button */}
                <div className="flex justify-between items-center p-4 border-b bg-card">

                    {/* Left side summary */}
                    <div className="text-sm text-muted-foreground">
                        {dayKeys.length} dag{dayKeys.length !== 1 ? "er" : ""} planlagt •{" "}
                        {
                            Object.values(fullPlan || {})
                                .reduce((total, day) => {
                                    const a = day.attractions?.length || 0;
                                    const r = day.restaurants?.length || 0;
                                    return total + a + r;
                                }, 0)
                        }{" "}
                        lokasjoner
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center gap-3">
                        {saveSuccess && (
                            <span className="text-sm text-green-600 font-medium">
                                ✓ Reise lagret!
                            </span>
                        )}

                        {saveError && (
                            <span className="text-sm text-red-600">
                                {saveError}
                            </span>
                        )}

                        <Button
                            onClick={handleSaveTrip}
                            disabled={isSaving || dayKeys.length === 0}
                            className="flex items-center gap-2 rounded-lg !px-5"
                            variant="default"
                            size="sm"
                        >
                            <Save size={16} />
                            {isSaving ? "Lagrer..." : "Lagre reise"}
                        </Button>
                    </div>
                </div>


                <Section type="plan" className="p-0">
                    {Object.keys(fullPlan || {}).length > 0 ? (
                        <div className="flex flex-col w-full">
                            {Object.entries(fullPlan).map(([dateKey, plan]) => (
                                <PlanDay
                                    key={dateKey}
                                    dateKey={dateKey}
                                    dayNumber={plan.dayNumber}
                                    attractions={plan.attractions}
                                    restaurants={plan.restaurants}
                                    planSummary={summarizedPlan["summarizedPlan"][dateKey]}
                                    weatherSummary={weatherSummary["aiSummary"]["days"][plan.dayNumber - 1]}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-6 opacity-70">Building your plan…</p>
                    )}
                </Section>

                <div className="flex items-center justify-center p-6 bg-card">
                    <div className="text-sm text-muted-foreground">
                        Reise generert av © 2025 ViaMundi med hjelp av AI
                    </div>
                </div>
            </div>
        </div>
    );
}
