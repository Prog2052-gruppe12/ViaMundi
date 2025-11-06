"use client";

import { useMemo } from "react";
import { hashString, pickSeeded } from "@/utils/random";

// Parse yyyy-MM-dd (local)
function parseYMD(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
}

// Format as yyyy-MM-dd (local)
function formatYMDLocal(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}


export function usePlan({
                            dateFrom,
                            dateTo,
                            locationIds = [],
                            restaurantIds = [],
                            detailsCache = {},
                            destination,
                            interests,
                        }) {
    // Convert to Date objects
    const startDate = useMemo(() => parseYMD(dateFrom), [dateFrom]);
    const endDate = useMemo(() => parseYMD(dateTo), [dateTo]);

    // Create list of all day dates between from → to
    const dayDates = useMemo(() => {
        if (!startDate || !endDate) return [];
        const days = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    }, [startDate, endDate]);

    // Keys like "2025-01-14", "2025-01-15", etc.
    const dayKeys = useMemo(
        () => dayDates.map((d) => formatYMDLocal(d)),
        [dayDates]
    );

    // Create a plan object with day numbers only
    const basePlan = useMemo(() => {
        const plan = {};
        dayKeys.forEach((key, index) => {
            plan[key] = { dayNumber: index + 1 };
        });
        return plan;
    }, [dayKeys]);

    // Create stable key for seeded random selection
    const idsFingerprint = useMemo(() => {
        return `${hashString(JSON.stringify(locationIds))}:${hashString(
            JSON.stringify(restaurantIds)
        )}`;
    }, [locationIds, restaurantIds]);

    const seededKey = useMemo(
        () =>
            [destination || "", interests || "", dateFrom, dateTo, idsFingerprint].join(
                "|"
            ),
        [destination, interests, dateFrom, dateTo, idsFingerprint]
    );

    // Activity selection per day (deterministic)
    const chosenActivityIds = useMemo(() => {
        if (!locationIds.length || !dayKeys.length) return [];
        return pickSeeded(locationIds, dayKeys.length, `act:${seededKey}`);
    }, [locationIds, dayKeys.length, seededKey]);

    // Restaurant selection per day (deterministic)
    const chosenRestaurantIds = useMemo(() => {
        if (!restaurantIds.length || !dayKeys.length) return [];
        return pickSeeded(restaurantIds, dayKeys.length, `rest:${seededKey}`);
    }, [restaurantIds, dayKeys.length, seededKey]);

    // Unique list of IDs to fetch
    const plannedIds = useMemo(() => {
        if (!locationIds.length && !restaurantIds.length) return []; // ✅ wait!
        return Array.from(
            new Set(
                dayKeys.flatMap((_, i) => [
                    chosenActivityIds[i],
                    chosenRestaurantIds[i],
                ]).filter(Boolean)
            )
        );
    }, [locationIds.length, restaurantIds.length, dayKeys, chosenActivityIds, chosenRestaurantIds]);

    const isPlanFullyCached = useMemo(() => {
        if (!plannedIds.length) return false;
        return plannedIds.every(id => detailsCache[id]); // info + image should already be stored
    }, [plannedIds, detailsCache]);

    // Final structured plan with info/image when available
    const finalPlan = useMemo(() => {
        const plan = {};
        dayKeys.forEach((dateKey, i) => {
            const activityId = chosenActivityIds[i];
            const restaurantId = chosenRestaurantIds[i];

            plan[dateKey] = {
                dayNumber: basePlan[dateKey]?.dayNumber || i + 1,
                activity: detailsCache[activityId] || null,
                restaurant: detailsCache[restaurantId] || null,
            };
        });
        return plan;
    }, [dayKeys, chosenActivityIds, chosenRestaurantIds, basePlan, detailsCache]);

    return { dayKeys, finalPlan, plannedIds, isPlanFullyCached };
}
