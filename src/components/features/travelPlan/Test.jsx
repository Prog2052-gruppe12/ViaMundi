"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import LoadingPage from "@/app/loading";
import { decodeCityToCord } from "@/utils/decodeCityToCord";
import { parseYMD } from "@/lib/date/parseYMD";
import { formatYMDLocal } from "@/lib/date/formatYMDLocal";

async function runSummarize(params) {
    const res = await fetch("/api/ai/summarize", {
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
    const data = await res.json();
    return data;
}

async function fetchLocationIds(destination, interests) {
    // Build query more safely (avoid calling toString on undefined)
    const qs = new URLSearchParams();
    if (destination) qs.set("destination", destination);
    if (interests) qs.set("interests", interests);
    const res = await fetch(`/api/attractions?${qs.toString()}`);
    const data = await res.json();
    return data;
}

async function fetchRestaurantIds(destination, interests) {
    // Build query more safely (avoid calling toString on undefined)
    const qs = new URLSearchParams();
    let lat, long = null;
    try {
        const coords = await decodeCityToCord(destination.split(',')[1].trim());
        lat = coords?.latitude ?? null;
        long = coords?.longitude ?? null;
    } catch {
        console.error("Failed to decode city to coordinates");
    }
    const latLong = lat != null && long != null ? `${lat},${long}` : "";
    if (destination) qs.set("latLong", latLong);
    if (interests) qs.set("searchQuery", interests);
    const res = await fetch(`/api/restaurants?${qs.toString()}`);
    const data = await res.json();
    return data;
}

/*async function fetchDetails(id) {
    const res = await fetch(`/api/location/details?locationId=${id}`);
    const data = await res.json();
    return data;
}*/

function createPlanSkeleton(dateFrom, dateTo) {
    const startDate = parseYMD(dateFrom);
    const endDate = parseYMD(dateTo);

    if (!startDate || !endDate || startDate > endDate) return {};

    const days = [];
    const current = new Date(startDate);
    while (current <= endDate) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    const dayKeys = days.map((date) => formatYMDLocal(date));

    const planSkeleton = dayKeys.reduce((plan, key, index) => {
        plan[key] = { dayNumber: index + 1 };
        return plan;
    }, {});

    for (const dayKey in planSkeleton) {
        planSkeleton[dayKey].attractions = [];
        planSkeleton[dayKey].restaurants = [];
    }
    return planSkeleton;
}

function fillPlan(planSkeleton, locationIds, restaurantIds) {
    const filledPlan = { ...planSkeleton };

    const attractions = locationIds?.location_ids ?? [];
    const restaurants = restaurantIds?.location_ids ?? [];

    const dayKeys = Object.keys(filledPlan);

    dayKeys.forEach((dayKey, index) => {
        // Pick attraction/restaurant by index for each day
        const attraction = attractions[index] ? [attractions[index]] : [];
        const restaurant = restaurants[index] ? [restaurants[index]] : [];

        filledPlan[dayKey].attractions = attraction;
        filledPlan[dayKey].restaurants = restaurant;
    });

    return filledPlan;
}

export default function Test() {
    const searchParams = useSearchParams();
    const destinationParam = searchParams.get("destination") || "";
    const dateFromParam = searchParams.get("dateFrom") || "";
    const dateToParam = searchParams.get("dateTo") || "";
    const travelersParam = searchParams.get("travelers") || "";
    const interestsParam = searchParams.get("interests") || "";
    const otherParam = searchParams.get("other") || "";

    const [loading, setLoading] = useState(true);
    const [summaryResult, setSummaryResult] = useState(null);
    const [locationIdsResult, setLocationIdsResult] = useState(null);
    const [restaurantIdsResult, setRestaurantIdsResult] = useState(null);
    const [planSkeleton, setPlanSkeleton] = useState(null);
    const [basePlan, setBasePlan] = useState(null);

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
                const summaryData = await runSummarize(params);
                if (mounted) setSummaryResult(summaryData);

                // choose what to pass to fetchLocationIds:
                // prefer summaryData.interests if the summarizer returned something useful,
                // otherwise fall back to the interests query param.
                const interestsForFetch = summaryData?.data ?? interestsParam;

                // await and capture returned data instead of relying on state variables
                const locationsData = await fetchLocationIds(destinationParam, interestsForFetch);
                if (mounted) setLocationIdsResult(locationsData);

                const restaurantsData = await fetchRestaurantIds(destinationParam, interestsForFetch);
                if (mounted) setRestaurantIdsResult(restaurantsData);

                // create skeleton synchronously and set state
                const skeletonData = createPlanSkeleton(params.dateFrom, params.dateTo);
                if (mounted) setPlanSkeleton(skeletonData);

                // call fillPlan only after both fetches finished, passing returned data
                const basePlanData = fillPlan(skeletonData, locationsData, restaurantsData);
                if (mounted) setBasePlan(basePlanData);

            } catch (error) {
                console.error("Error in summary or fetchLocationIds, fetchRestaurantIds or createPlanSkeleton:", error);
            } finally {
                if (mounted) setLoading(false);
                console.log("All async work completed");
            }
        })();

        return () => {
            mounted = false;
        };
        // run when params that affect the fetch change
    }, [destinationParam, dateFromParam, dateToParam, travelersParam, interestsParam, otherParam]);

    if (loading) {
        return <LoadingPage />;
    }

    return <div>
        <h1>Test Summarize Component</h1>
        <pre>{JSON.stringify(planSkeleton, null, 2)}</pre>
    </div>;
}