"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCityName } from "@/utils/cityFromDest";
import { decodeCityToCord } from "@/utils/decodeCityToCord";

export function useIdsLoader({
                                 destination,
                                 interestsEffective,
                                 isHydrated,
                                 cacheKey,
                                 locationIds,
                                 restaurantIds,
                                 setLocationIds,
                                 setRestaurantIds,
                                 setDetailsCache,
                                 setError,
                             }) {
    const [isFetchingAttractions, setIsFetchingAttractions] = useState(false);
    const [isFetchingRestaurants, setIsFetchingRestaurants] = useState(false);

    const attractionsLoaded = useRef(false);
    const restaurantsLoaded = useRef(false);
    const idsRequestedRef = useRef(false); // tracks whether both have been initially triggered

    // Reset flags when trip changes
    useEffect(() => {
        attractionsLoaded.current = false;
        restaurantsLoaded.current = false;
        idsRequestedRef.current = false;
    }, [cacheKey]);

    // Clear stale details on new trip if no IDs are cached
    useEffect(() => {
        if (!locationIds.length && !restaurantIds.length) {
            setDetailsCache?.({});
        }
    }, [cacheKey, locationIds.length, restaurantIds.length, setDetailsCache]);

    // Fetch attractions independently
    useEffect(() => {
        if (!isHydrated || !destination) return;
        if (attractionsLoaded.current) return; // already loaded successfully
        if (locationIds.length > 0) {
            attractionsLoaded.current = true;
            return; // already available from cache
        }

        const city = getCityName(destination) || "";
        const interests = (interestsEffective || "").trim();
        const controller = new AbortController();

        async function fetchAttractions() {
            try {
                setIsFetchingAttractions(true);
                const params = new URLSearchParams({ destination: city, interests });
                const res = await fetch(`/api/attractions?${params.toString()}`, { signal: controller.signal });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to fetch attractions");
                setLocationIds?.(Array.isArray(data.location_ids) ? data.location_ids : []);
                attractionsLoaded.current = true;
            } catch (err) {
                if (err.name !== "AbortError") setError?.(err.message || "Attractions fetch failed");
            } finally {
                setIsFetchingAttractions(false);
            }
        }

        fetchAttractions().then();
        return () => controller.abort();
    }, [destination, interestsEffective, isHydrated, locationIds.length, setLocationIds, setError]);

    // Fetch restaurants independently
    useEffect(() => {
        if (!isHydrated || !destination) return;
        if (restaurantsLoaded.current) return; // already loaded successfully
        if (restaurantIds.length > 0) {
            restaurantsLoaded.current = true;
            return; // already available from cache
        }

        const controller = new AbortController();
        const city = getCityName(destination) || "";

        async function fetchRestaurants() {
            try {
                setIsFetchingRestaurants(true);

                // Try decode city → coordinates
                let lat = null, lon = null;
                try {
                    const coords = await decodeCityToCord(city);
                    lat = coords?.latitude ?? null;
                    lon = coords?.longitude ?? null;
                } catch {}

                const latLong = lat != null && lon != null ? `${lat},${lon}` : "";
                const params = new URLSearchParams({ latLong, searchQuery: "restaurant" });

                const res = await fetch(`/api/restaurants?${params.toString()}`, { signal: controller.signal });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to fetch restaurants");
                setRestaurantIds?.(Array.isArray(data.location_ids) ? data.location_ids : []);
                restaurantsLoaded.current = true;
            } catch (err) {
                if (err.name !== "AbortError") setError?.(err.message || "Restaurants fetch failed");
            } finally {
                setIsFetchingRestaurants(false);
            }
        }

        fetchRestaurants().then();
        return () => controller.abort();
    }, [destination, isHydrated, restaurantIds.length, setRestaurantIds, setError]);

    // Now compute readiness:
    const idsReady = useMemo(() => {
        return (
            !isFetchingAttractions &&
            !isFetchingRestaurants &&
            (attractionsLoaded.current || locationIds.length > 0) &&
            (restaurantsLoaded.current || restaurantIds.length > 0)
        );
    }, [isFetchingAttractions, isFetchingRestaurants, locationIds.length, restaurantIds.length]);

    return { idsReady, isFetchingAttractions, isFetchingRestaurants };
}
