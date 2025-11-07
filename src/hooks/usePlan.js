"use client";

import { useMemo } from "react";
import { hashString, pickSeeded } from "@/utils/random";

/**
 * Parse a date string in yyyy-MM-dd format to a Date object.
 * Returns null for invalid or empty inputs.
 * @param {string} dateStr
 * @returns {Date | null}
 */
function parseYMD(dateStr) {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * Format a Date object to yyyy-MM-dd (local time).
 * @param {Date} date
 * @returns {string}
 */
function formatYMDLocal(date) {
    if (!(date instanceof Date)) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Custom hook to generate a structured travel plan.
 */
export function usePlan({
                            dateFrom,
                            dateTo,
                            locationIds = [],
                            restaurantIds = [],
                            detailsCache = {},
                            destination = "",
                            interests = "",
                        }) {
    // 1. Convert string dates to Date objects
    const startDate = useMemo(() => parseYMD(dateFrom), [dateFrom]);
    const endDate = useMemo(() => parseYMD(dateTo), [dateTo]);

    // 2. Create a list of days between start and end dates
    const dayDates = useMemo(() => {
        if (!startDate || !endDate || startDate > endDate) return [];
        const days = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    }, [startDate, endDate]);

    // 3. Convert each day to "yyyy-MM-dd" format
    const dayKeys = useMemo(
        () => dayDates.map((date) => formatYMDLocal(date)),
        [dayDates]
    );

    // 4. Base plan with day numbers
    const basePlan = useMemo(() => {
        return dayKeys.reduce((plan, key, index) => {
            plan[key] = { dayNumber: index + 1 };
            return plan;
        }, {});
    }, [dayKeys]);

    // 5. Create stable hash for seeded randomization
    const idsFingerprint = useMemo(() => {
        return `${hashString(JSON.stringify(locationIds))}:${hashString(
            JSON.stringify(restaurantIds)
        )}`;
    }, [locationIds, restaurantIds]);

    const seededKey = useMemo(
        () => [destination, interests, dateFrom, dateTo, idsFingerprint].join("|"),
        [destination, interests, dateFrom, dateTo, idsFingerprint]
    );

    // 6. Deterministic selection of daily activities
    const chosenActivityIds = useMemo(() => {
        if (!locationIds.length || !dayKeys.length) return [];
        return pickSeeded(locationIds, dayKeys.length, `act:${seededKey}`);
    }, [locationIds, dayKeys.length, seededKey]);

    // 7. Deterministic selection of daily restaurants
    const chosenRestaurantIds = useMemo(() => {
        if (!restaurantIds.length || !dayKeys.length) return [];
        return pickSeeded(restaurantIds, dayKeys.length, `rest:${seededKey}`);
    }, [restaurantIds, dayKeys.length, seededKey]);

    // 8. Unique list of all IDs we need details for
    const plannedIds = useMemo(() => {
        if (!locationIds.length && !restaurantIds.length) return [];
        return Array.from(
            new Set(
                dayKeys
                    .flatMap((_, i) => [chosenActivityIds[i], chosenRestaurantIds[i]])
                    .filter(Boolean)
            )
        );
    }, [locationIds.length, restaurantIds.length, dayKeys, chosenActivityIds, chosenRestaurantIds]);

    // 9. Check whether all required info is already cached
    const isPlanFullyCached = useMemo(() => {
        return plannedIds.length > 0 && plannedIds.every((id) => detailsCache[id]);
    }, [plannedIds, detailsCache]);

    // 10. Build the final structured plan
    const finalPlan = useMemo(() => {
        return dayKeys.reduce((plan, dateKey, i) => {
            plan[dateKey] = {
                dayNumber: basePlan[dateKey]?.dayNumber || i + 1,
                activity: detailsCache[chosenActivityIds[i]] || null,
                restaurant: detailsCache[chosenRestaurantIds[i]] || null,
            };
            return plan;
        }, {});
    }, [dayKeys, chosenActivityIds, chosenRestaurantIds, basePlan, detailsCache]);

    return { dayKeys, finalPlan, plannedIds, isPlanFullyCached };
}
