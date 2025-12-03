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

async function fetchTravelStory(params) {
    const res = await fetch("/api/ai/create-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            destination: params.destination,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            travelers: params.travelers,
            interests: params.interests,
            other: params.other
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

async function curateDayActivities(activities, restaurants, activityInterests, restaurantInterests, destination) {
    try {
        const res = await fetch('/api/ai/curate-day', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                activities,
                restaurants,
                activityInterests,
                restaurantInterests,
                destination
            })
        });

        const data = await res.json();

        if (!data.success) {
            console.error('Day curation failed:', data.error);
            return {
                curatedActivity: null,
                curatedRestaurant: null,
            };
        }

        console.log(data);

        // Expect API to return a *single* best activity + restaurant object each
        return {
            curatedActivity: data.activityId[0] || null,
            curatedRestaurant: data.restaurantId[0] || null,
        };
    } catch (error) {
        console.error('Error during day curation:', error);
        return {
            curatedActivity: null,
            curatedRestaurant: null,
        };
    }

    /*
    try {
        const res = await fetch('/api/ai/curate-activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                locations: details,
                userInterests,
                destination
            })
        });

        const data = await res.json();

        if (!data.success) {
            console.error('Curation failed:', data.error);
            // Fallback: return all location IDs if curation fails
            return details;
        }

        //console.log(`AI Curation: kept ${data.kept_count}/${details.length} locations. Reason: ${data.reason}`);
        const out = details.filter(loc => data.curated.includes(loc.location_id));
        return out[0];
    } catch (error) {
        console.error('Error during curation:', error);
        // Fallback: return all location IDs if curation fails
        return details.map(loc => loc.location_id);
    }
        */
}

function simplifyActivity(act) {
    try {
        const out = {
            location_id: act.location_id,
            name: act.name || "Unknown",
            subcategory:
                act.subcategory?.map(s => s.localized_name || s.name).join(", ") ||
                "Unknown",
            description: act.description
                ? act.description.substring(0, 200)
                : "No description",
            rating: act.rating || "N/A",
            num_reviews: act.num_reviews || "0",
            ranking_data: act.ranking_data?.ranking_string || "Not ranked"
        }
        return out;
    } catch (e) {
        console.error("Error simplifying activity:", e);
        return act;
    }
}

async function fillPlanWithDetails(planSkeleton, locationIds, restaurantIds, userInterests, destination) {
    //console.log("Filling plan with details...");
    const filled = { ...planSkeleton };

    for (const [dayKey, entries] of Object.entries(planSkeleton)) {
        if (!entries || !entries.dayNumber) continue;

        // Use dayKey (same as storyResult keys)
        const activities = locationIds[entries.dayNumber] || [];
        const restaurants = restaurantIds[entries.dayNumber] || [];

        if (activities.length === 0 && restaurants.length === 0) continue;

        // Fetch details in parallel
        const [activityDetails, restaurantDetails] = await Promise.all([
            Promise.all(activities.map(id => fetchDetails(id))),
            Promise.all(restaurants.map(id => fetchDetails(id)))
        ]);

        const validActivities = activityDetails.filter(Boolean);
        const validRestaurants = restaurantDetails.filter(Boolean);

        const simplifiedActivities = validActivities.map(simplifyActivity);
        const simplifiedRestaurants = validRestaurants.map(simplifyActivity);

        // Get per-day interests from storyResult
        const dayStory = userInterests[entries.dayNumber] || {};
        const activityQuery = dayStory.activity || "";
        const restaurantQuery = dayStory.restaurant || "";

        /*console.log(JSON.stringify({
            simplifiedActivities,
            simplifiedRestaurants,
            activityQuery,
            restaurantQuery,
            destination
        }));*/

        // Single AI call for this day
        let aiResult = { activity: null, restaurant: null, reason: "" };
        try {
            aiResult = await curateDayActivities(
                simplifiedActivities,
                simplifiedRestaurants,
                activityQuery,
                restaurantQuery,
                destination
            );
        } catch (e) {
            console.error("Day curation failed, using fallback for", dayKey, e);
        }

        //console.log(aiResult);

        // Map curated IDs back to full detail objects
        const chosenActivity =
            validActivities.find(a => a.location_id === aiResult.curatedActivity) ||
            validActivities[0] ||
            null;

        const chosenRestaurant =
            validRestaurants.find(r => r.location_id === aiResult.curatedRestaurant) ||
            validRestaurants[0] ||
            null;

        // Fetch images only for the chosen ones
        const [activityImage, restaurantImage] = await Promise.all([
            chosenActivity ? fetchImage(chosenActivity.location_id) : null,
            chosenRestaurant ? fetchImage(chosenRestaurant.location_id) : null
        ]);

        const activityWithImage = chosenActivity
            ? { ...chosenActivity, image: activityImage ?? null }
            : null;

        const restaurantWithImage = chosenRestaurant
            ? { ...chosenRestaurant, image: restaurantImage ?? null }
            : null;

        filled[dayKey].attractions = activityWithImage ? [activityWithImage] : [];
        filled[dayKey].restaurants = restaurantWithImage ? [restaurantWithImage] : [];
    }

    return filled;

    /*
    async function fillPlanWithDetails(planSkeleton, locationIds, restaurantIds, userInterests, destination) {
        const filled = { ...planSkeleton };
    
        for (const [day, entries] of Object.entries(planSkeleton)) {
            if (!entries || !entries.dayNumber) continue;
    
            const activities = locationIds[entries.dayNumber];
            const restaurants = restaurantIds[entries.dayNumber];
    
            // Fetch details in parallel
            const [activityDetails, restaurantDetails] = await Promise.all([
                Promise.all(activities.map(id => fetchDetails(id))),
                Promise.all(restaurants.map(id => fetchDetails(id)))
            ]);
    
            let aiResult = { activity: null, restaurant: null, reason: "" };
            try {
                aiResult = await curateDayActivities(
                    validActivities,
                    validRestaurants,
                    // Pass a combined interest string so the day model
                    // can consider both activity + restaurant prefs
                    `${activityQuery || ""} | ${restaurantQuery || ""}`.trim() ||
                    null,
                    destination
                );
            } catch (e) {
                console.error("Day curation failed, using fallback for", dayKey, e);
            }
    
            if (!curatedActivity && !curatedRestaurant) {
                filled[day].attractions = activityDetails.get(0) ? [activityDetails.get(0)] : [];
                filled[day].restaurants = restaurantDetails.get(0) ? [restaurantDetails.get(0)] : [];
                continue;
            }
    
            // Fetch images only for the curated activity and restaurant
            const [activityImage, restaurantImage] = await Promise.all([
                curatedActivity ? fetchImage(curatedActivity.location_id) : null,
                curatedRestaurant ? fetchImage(curatedRestaurant.location_id) : null
            ]);
    
            // Combine curated details with images
            const activityWithImage = curatedActivity
                ? { ...curatedActivity, image: activityImage ?? null }
                : null;
    
            const restaurantWithImage = curatedRestaurant
                ? { ...curatedRestaurant, image: restaurantImage ?? null }
                : null;
    
            // Save the curated activity and restaurant
            filled[day].attractions = activityWithImage ? [activityWithImage] : [];
            filled[day].restaurants = restaurantWithImage ? [restaurantWithImage] : [];
        }
    
        return filled;
    
        */

    /*

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
    */
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
                // ---------------------------------------------------------
                // CRITICAL: Fetch story data
                // ---------------------------------------------------------
                const storyData = await fetchTravelStory(params);
                if (
                    !storyData ||
                    !storyData.data ||
                    !storyData.success ||
                    !storyData.data.story ||
                    !storyData.data.story.days
                ) {
                    throw new Error("Invalid story data");
                }

                const storyResult = storyData.data.story.days;
                const skeleton = createPlanSkeleton(dateFromParam, dateToParam);

                // Build activity + restaurant ID lists
                const locationIds = {};
                const restaurantIds = {};

                for (const [day, queries] of Object.entries(storyResult)) {
                    if (!queries) continue;

                    const lIds1 = await fetchLocationIds(destinationParam, queries.activity);
                    const lIds2 = await fetchLocationIds(destinationParam, queries.activity);
                    const rIds1 = await fetchRestaurantIds(destinationParam, queries.restaurant);
                    const rIds2 = await fetchRestaurantIds(destinationParam, queries.restaurant);

                    const fetchedLocationIds = [...new Set([
                        ...(lIds1["location_ids"] ?? []),
                        ...(lIds2["location_ids"] ?? [])
                    ])];

                    const fetchedRestaurantIds = [...new Set([
                        ...(rIds1["location_ids"] ?? []),
                        ...(rIds2["location_ids"] ?? [])
                    ])];

                    // Random + non-duplicate logic
                    const usedActivityIds = new Set(Object.values(locationIds).flat());
                    const uniqueActivityIds = fetchedLocationIds.filter(id => !usedActivityIds.has(id));
                    for (let i = uniqueActivityIds.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [uniqueActivityIds[i], uniqueActivityIds[j]] = [uniqueActivityIds[j], uniqueActivityIds[i]];
                    }
                    const randomActivityIds = uniqueActivityIds.slice(0, 2);
                    if (randomActivityIds.length > 0) locationIds[day] = randomActivityIds;

                    const usedRestaurantIds = new Set(Object.values(restaurantIds).flat());
                    const uniqueRestaurantIds = fetchedRestaurantIds.filter(id => !usedRestaurantIds.has(id));
                    for (let i = uniqueRestaurantIds.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [uniqueRestaurantIds[i], uniqueRestaurantIds[j]] = [uniqueRestaurantIds[j], uniqueRestaurantIds[i]];
                    }
                    const randomRestaurantIds = uniqueRestaurantIds.slice(0, 2);
                    if (randomRestaurantIds.length > 0) restaurantIds[day] = randomRestaurantIds;
                }

                //console.log("Location IDs per day:", locationIds);
                //console.log("Restaurant IDs per day:", restaurantIds);

                // ---------------------------------------------------------
                // CRITICAL: Full plan generation
                // ---------------------------------------------------------
                const fullPlanResult = await fillPlanWithDetails(
                    skeleton,
                    locationIds,
                    restaurantIds,
                    storyResult,
                    params.destination
                );

                if (mounted) setFullPlan(fullPlanResult);

                // ---------------------------------------------------------
                // NON-CRITICAL: Weather fetch (SAFE)
                // ---------------------------------------------------------
                let weatherSummaryResult = {};
                try {
                    const weatherData = await fetchWeather(destinationParam, dateFromParam, dateToParam);
                    const times = weatherData?.weatherData?.daily?.time ?? [];

                    for (const [idx, date] of times.entries()) {
                        weatherSummaryResult[date] = {
                            tmp_min: parseInt(weatherData.weatherData.daily.temperature_2m_min?.[idx]) ?? null,
                            tmp_max: parseInt(weatherData.weatherData.daily.temperature_2m_max?.[idx]) ?? null,
                            weather_code: weatherData.weatherData.daily.weather_code?.[idx] ?? null
                        };
                    }
                } catch (err) {
                    console.warn("Weather failed:", err);
                }

                if (mounted) setWeatherSummary(weatherSummaryResult);

                // ---------------------------------------------------------
                // NON-CRITICAL: Plan summary fetch (SAFE)
                // ---------------------------------------------------------
                let summarizedPlanResult = null;
                try {
                    summarizedPlanResult = await fetchSummarizedPlan(fullPlanResult);
                } catch (err) {
                    console.warn("Summary generation failed:", err);
                }

                if (mounted) setSummarizedPlan(summarizedPlanResult);

            } catch (error) {
                // Only triggers for CRITICAL failures
                console.error("Error generating travel plan:", error);
            } finally {
                if (mounted) setLoading(false);
            }

        })();

        return () => { mounted = false; };
    }, [
        destinationParam,
        dateFromParam,
        dateToParam,
        travelersParam,
        interestsParam,
        otherParam
    ]);


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
            <div className="flex flex-col w-full overflow-hidden border max-w-[1700px] gap-4 rounded-lg">
                <div className="">
                    <SearchParameters
                        destination={params.destination}
                        dateFrom={params.dateFrom}
                        dateTo={params.dateTo}
                        travelers={params.travelers}
                        interests={summarized}
                    />

                    {/* Save Trip Button */}
                    <div className="hidden flex justify-between items-center px-4 py-2 bg-card/50 border-b">

                        {/* Left side summary */}
                        <div className="text-sm text-muted-foreground ml-1">
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
                </div>



                <Section type="plan" className="p-0 bg-card">
                    {Object.keys(fullPlan || {}).length > 0 ? (
                        <div className="flex flex-col w-full px-4 py-4 gap-4 bg-card">
                            <div className="flex flex-row px-0 justify-between items-end">
                                <h1 className="text-xl font-bold">Reiseplan</h1>
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
                            {Object.entries(fullPlan).map(([dateKey, plan]) => {
                                if (!plan) {
                                    return (
                                        <div key={dateKey} className="plan-error">
                                            Could not generate plan for {dateKey}.
                                        </div>
                                    );
                                }

                                return (
                                    <PlanDay
                                        key={dateKey}
                                        dateKey={dateKey}
                                        dayNumber={plan.dayNumber}
                                        attractions={plan.attractions}
                                        restaurants={plan.restaurants}
                                        planSummary={summarizedPlan?.summarizedPlan?.[dateKey] || null}
                                        weatherSummary={weatherSummary?.[dateKey] || null}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <p className="mt-6 opacity-70">Building your plan…</p>
                    )}
                </Section>

                <div className="flex items-center justify-center p-4 bg-card">
                    <div className="text-sm text-muted-foreground">
                        Reise generert av © 2025 ViaMundi med hjelp av AI
                    </div>
                </div>
            </div>
        </div>
    );
}
