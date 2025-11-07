// javascript
// File: `src/components/features/travelPlan/hooks/useCache.js`
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { makeCacheKey, safeGetLS, safeSetLS, MAX_AGE_MS } from "@/utils/cache";

export function useCache({ destination, dateFrom, dateTo, interests }) {
    const [locationIds, setLocationIds] = useState([]);
    const [restaurantIds, setRestaurantIds] = useState([]);
    const [detailsCache, setDetailsCache] = useState({});
    const [interestsCache, setInterestsCache] = useState("");
    const [error, setError] = useState(null);

    const cacheKey = useMemo(
        () => makeCacheKey({ destination, dateFrom, dateTo, interests }),
        [destination, dateFrom, dateTo, interests]
    );

    const lastCacheKeyRef = useRef(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cache from localStorage whenever the cacheKey changes.
    // If the key changed, reset in-memory state first to avoid cross-key contamination.
    useEffect(() => {
        if (!cacheKey) return;

        // If we switched trips, clear current in-memory data before reading new cache
        if (lastCacheKeyRef.current && lastCacheKeyRef.current !== cacheKey) {
            setLocationIds([]);
            setRestaurantIds([]);
            setDetailsCache({});
            setInterestsCache("");
        }

        setIsHydrated(false);

        const cached = safeGetLS(cacheKey);

        if (cached && typeof cached === "object") {
            const { ts, locationIds: lIds, restaurantIds: rIds, detailsCache: dCache, interests } = cached;
            const fresh = typeof ts === "number" ? Date.now() - ts < MAX_AGE_MS : false;

            if (fresh) {
                if (Array.isArray(lIds)) setLocationIds(lIds);
                if (Array.isArray(rIds)) setRestaurantIds(rIds);
                if (dCache && typeof dCache === "object") setDetailsCache(dCache);
                if (typeof interests === "string") setInterestsCache(interests);
            } else {
                // expired cache - ensure we start from empty in-memory state
                setLocationIds([]);
                setRestaurantIds([]);
                setDetailsCache({});
                setInterestsCache("");
            }
        } else {
            // no cache found for this key
            setLocationIds([]);
            setRestaurantIds([]);
            setDetailsCache({});
            setInterestsCache("");
        }

        lastCacheKeyRef.current = cacheKey;
        setIsHydrated(true);
    }, [cacheKey]);

    // Save to localStorage when data changes. Keep other trip fields intact when updating.
    useEffect(() => {
        if (!cacheKey) return;

        const hasData =
            locationIds.length > 0 ||
            restaurantIds.length > 0 ||
            Object.keys(detailsCache).length > 0 ||
            interestsCache !== "";

        if (!hasData) return;

        // Merge with any existing raw object so we don't drop unrelated fields
        try {
            const raw = safeGetLS(cacheKey) || {};

            const mergedDetails = {
                ...(raw.detailsCache || {}),
                ...(detailsCache || {}),
            };

            const merged = {
                ...raw,
                ts: Date.now(),
                locationIds,
                restaurantIds,
                detailsCache: mergedDetails,
                interests: interestsCache,
            };
            safeSetLS(cacheKey, merged);
        } catch {
            // swallow LS errors
        }
    }, [cacheKey, locationIds, restaurantIds, detailsCache, interestsCache]);

    return {
        locationIds,
        restaurantIds,
        detailsCache,
        interestsCache,
        setInterestsCache,
        setLocationIds,
        setRestaurantIds,
        setDetailsCache,
        error,
        setError,
        isHydrated,
        cacheKey,
    };
}
