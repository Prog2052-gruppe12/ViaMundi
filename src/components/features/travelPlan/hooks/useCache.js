"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { makeCacheKey, safeGetLS, safeSetLS, MAX_AGE_MS } from "@/utils/cache";

export function useCache({ destination, dateFrom, dateTo, interests }) {
    const [locationIds, setLocationIds] = useState([]);
    const [restaurantIds, setRestaurantIds] = useState([]);
    const [detailsCache, setDetailsCache] = useState({});
    const [error, setError] = useState(null);

    // Generate unique cache key for this trip input
    const cacheKey = useMemo(
        () => makeCacheKey({ destination, dateFrom, dateTo, interests }),
        [destination, dateFrom, dateTo, interests]
    );

    const hydratedOnceRef = useRef(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // ✅ Load cache from localStorage
    useEffect(() => {
        if (hydratedOnceRef.current || !cacheKey) return;
        const cached = safeGetLS(cacheKey);

        if (cached && typeof cached === "object") {
            const { ts, locationIds, restaurantIds, detailsCache } = cached;
            const fresh = typeof ts === "number" ? Date.now() - ts < MAX_AGE_MS : false;
            if (fresh) {
                if (Array.isArray(locationIds)) setLocationIds(locationIds);
                if (Array.isArray(restaurantIds)) setRestaurantIds(restaurantIds);
                if (detailsCache && typeof detailsCache === "object") setDetailsCache(detailsCache);
            }
        }
        hydratedOnceRef.current = true;
        setIsHydrated(true);  // ✅ important
    }, [cacheKey]);

    useEffect(() => {
        if (!cacheKey) return;
        // Only store if we have something meaningful
        if (
            locationIds.length > 0 ||
            restaurantIds.length > 0 ||
            Object.keys(detailsCache).length > 0
        ) {
            safeSetLS(cacheKey, {
                ts: Date.now(),
                locationIds,
                restaurantIds,
                detailsCache,
            });
        }
    }, [cacheKey, locationIds, restaurantIds, detailsCache]);

    return {
        locationIds,
        restaurantIds,
        detailsCache,
        setLocationIds,
        setRestaurantIds,
        setDetailsCache,
        error,
        setError,
        cacheKey,
        isHydrated
    };
}
