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
    console.log(res);
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

async function fillPlanWithDetails(planSkeleton, locationIds, restaurantIds, weatherSummary) {
    console.log(weatherSummary);
    const filled = { ...planSkeleton };
    const attractions = locationIds?.location_ids ?? [];
    const restaurants = restaurantIds?.location_ids ?? [];

    const keys = Object.keys(filled);

    for (let i = 0; i < keys.length; i++) {
        const dayKey = keys[i];
        const attractionId = attractions[i];
        const restaurantId = restaurants[i];

        // Fetch details for each ID
        const [attractionDetails, restaurantDetails] = await Promise.all([
            attractionId ? fetchDetails(attractionId) : null,
            restaurantId ? fetchDetails(restaurantId) : null
        ]);

        const [attractionImage, restaurantImage] = await Promise.all([
            attractionId ? fetchImage(attractionId) : null,
            restaurantId ? fetchImage(restaurantId) : null
        ]);

        filled[dayKey].attractions = attractionDetails ? [{ ...attractionDetails, image: attractionImage ?? null }] : [];
        filled[dayKey].restaurants = restaurantDetails ? [{ ...restaurantDetails, image: restaurantImage ?? null }] : [];
    }

    return filled;
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
                const summary = await runSummarize(params);
                if (mounted) setSummarized(summary?.data.interests.queries[0] ?? interestsParam);
                const locationQuery = summary?.data.interests.queries[0] ?? interestsParam;
                const restaurantQuery = summary?.data.restaurants.queries[0] ?? interestsParam;

                const [locationIds, restaurantIds] = await Promise.all([
                    fetchLocationIds(destinationParam, locationQuery),
                    fetchRestaurantIds(destinationParam, restaurantQuery)
                ]);

                const weatherSummary = await fetchWeather(destinationParam, dateFromParam, dateToParam);

                const skeleton = createPlanSkeleton(dateFromParam, dateToParam);

                const fullPlan = await fillPlanWithDetails(skeleton, locationIds, restaurantIds, weatherSummary);

                if (mounted) {
                    setFullPlan(fullPlan);
                }
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
                <div className="flex justify-between items-center px-5 py-4 border-b bg-card">

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

            <pre>
                {JSON.stringify(fullPlan, null, 2)}
            </pre>
        </div>
    );
}
