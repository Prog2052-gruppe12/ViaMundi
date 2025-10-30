"use client";

import { Section } from "@/components/common/Section";
import { useSearchParams } from "next/navigation";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getCityName } from "@/utils/cityFromDest";
import LoadingPage from "@/app/loading";
import LocationView from "@/components/features/travelPlan/LocationInfo";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { decodeCityToCord } from "@/utils/decodeCityToCord";

/** Small stable hash for seeding random picks (no crypto, just stable) */
function hashString(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

/** Simple seeded RNG (mulberry32) */
function rng(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Pick N items from array using seeded randomness, allowing repeats if needed */
function pickSeeded(arr, count, seedKey) {
    const r = rng(hashString(seedKey));
    const copy = [...arr];
    const chosen = [];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    for (let i = 0; i < count; i++) {
        if (i < copy.length) chosen.push(copy[i]);
        else if (copy.length > 0) chosen.push(copy[Math.floor(r() * copy.length)]);
        else chosen.push(undefined);
    }
    return chosen;
}

/* ===================== CACHE ===================== */
const CACHE_VERSION = 1;
const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes (for testing)

function makeCacheKey({ destination, dateFrom, dateTo, interests }) {
    return `tripcache/v${CACHE_VERSION}:${destination || ""}|${dateFrom || ""}|${dateTo || ""}|${interests || ""}`;
}

function safeGetLS(key) {
    try {
        if (typeof window === "undefined") return null;
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function safeSetLS(key, value) {
    try {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore quota / privacy errors
    }
}
/* ================================================= */

export default function ResultContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests");

    const [error, setError] = useState(null);

    // ---------- Locations ----------
    const [locationIds, setLocationIds] = useState([]);
    const [isFetchingAttractions, setIsFetchingAttractions] = useState(false);

    // ---------- Restaurants ----------
    const [restaurantIds, setRestaurantIds] = useState([]);
    const [isFetchingRestaurants, setIsFetchingRestaurants] = useState(false);

    // ---------- Details Cache (memory only) ----------
    const [detailsCache, setDetailsCache] = useState({}); // { [id]: {info, image} }

    // ==== CACHE: hydrate on mount/param change (before any fetchers run)
    const cacheKey = useMemo(
        () => makeCacheKey({ destination, dateFrom, dateTo, interests }),
        [destination, dateFrom, dateTo, interests]
    );
    const hydratedOnceRef = useRef(false);

    useEffect(() => {
        // Only attempt hydration once per cacheKey
        if (hydratedOnceRef.current || !cacheKey) return;

        const cached = safeGetLS(cacheKey);
        if (cached && typeof cached === "object") {
            const { ts, locationIds, restaurantIds, detailsCache } = cached;
            const fresh = typeof ts === "number" ? Date.now() - ts < MAX_AGE_MS : false;

            if (fresh) {
                if (Array.isArray(locationIds) && locationIds.length) {
                    setLocationIds(locationIds);
                }
                if (Array.isArray(restaurantIds) && restaurantIds.length) {
                    setRestaurantIds(restaurantIds);
                }
                if (detailsCache && typeof detailsCache === "object") {
                    setDetailsCache(detailsCache);
                }
            }
        }
        hydratedOnceRef.current = true;
    }, [cacheKey]);

    // ---------- Travel Plan skeleton ----------
    const dayDates = useMemo(() => {
        if (!dateFrom || !dateTo) return [];
        const days = [];
        const current = new Date(dateFrom);
        const last = new Date(dateTo);
        current.setHours(0, 0, 0, 0);
        last.setHours(0, 0, 0, 0);
        while (current <= last) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    }, [dateFrom, dateTo]);

    const dayKeys = useMemo(() => dayDates.map((d) => d.toISOString().split("T")[0]), [dayDates]);

    const basePlan = useMemo(() => {
        const plan = {};
        dayKeys.forEach((k, i) => {
            plan[k] = { dayNumber: i + 1, activityId: undefined, restaurantId: undefined };
        });
        return plan;
    }, [dayKeys]);

    // ---------- Choose IDs ONLY for days (seeded, stable for given inputs) ----------
    const idsFingerprint = useMemo(() => {
        const locHash = hashString(JSON.stringify(locationIds || []));
        const restHash = hashString(JSON.stringify(restaurantIds || []));
        return `${locHash}:${restHash}`;
    }, [locationIds, restaurantIds]);

    const seededKey = useMemo(() => {
        return [destination || "", interests || "", dateFrom || "", dateTo || "", idsFingerprint].join("|");
    }, [destination, interests, dateFrom, dateTo, idsFingerprint]);

    const chosenActivityIds = useMemo(() => {
        if (locationIds.length === 0 || dayKeys.length === 0) return [];
        return pickSeeded(locationIds, dayKeys.length, `act:${seededKey}`);
    }, [locationIds, dayKeys.length, seededKey]);

    const chosenRestaurantIds = useMemo(() => {
        if (restaurantIds.length === 0 || dayKeys.length === 0) return [];
        return pickSeeded(restaurantIds, dayKeys.length, `rest:${seededKey}`);
    }, [restaurantIds, dayKeys.length, seededKey]);

    const plannedIds = useMemo(() => {
        const list = [];
        for (let i = 0; i < dayKeys.length; i++) {
            const a = chosenActivityIds[i];
            const r = chosenRestaurantIds[i];
            if (a) list.push(a);
            if (r) list.push(r);
        }
        return Array.from(new Set(list.filter(Boolean)));
    }, [dayKeys, chosenActivityIds, chosenRestaurantIds]);

    // ========= FETCHERS (unchanged behavior but now short-circuits thanks to cache hydration)
    useEffect(() => {
        let cancelled = false;
        if (!destination || !interests || locationIds.length > 0) return;

        const fetchAttractions = async () => {
            try {
                setIsFetchingAttractions(true);
                const city = getCityName(destination) || "";
                const params = new URLSearchParams({ destination: city, interests: interests || "" });
                const res = await fetch(`/api/attractions?${params.toString()}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to fetch attractions");
                if (!cancelled) setLocationIds(Array.isArray(data.location_ids) ? data.location_ids : []);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setIsFetchingAttractions(false);
            }
        };

        fetchAttractions();
        return () => {
            cancelled = true;
        };
    }, [destination, interests, locationIds.length]);

    useEffect(() => {
        let cancelled = false;
        if (!destination || !interests || restaurantIds.length > 0) return;

        const fetchRestaurants = async () => {
            try {
                setIsFetchingRestaurants(true);
                const city = getCityName(destination) || "";
                let lat = null,
                    lon = null;
                try {
                    const coords = await decodeCityToCord(city);
                    lat = coords?.latitude ?? null;
                    lon = coords?.longitude ?? null;
                } catch (e) {
                    console.warn("decodeCityToCord failed:", e);
                }
                const cords = lat != null && lon != null ? `${lat},${lon}` : "";
                const params = new URLSearchParams({ latLong: cords, searchQuery: "restaurant" });
                const res = await fetch(`/api/restaurants?${params.toString()}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to fetch restaurants");
                if (!cancelled) setRestaurantIds(Array.isArray(data.location_ids) ? data.location_ids : []);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setIsFetchingRestaurants(false);
            }
        };

        fetchRestaurants();
        return () => {
            cancelled = true;
        };
    }, [destination, interests, restaurantIds.length]);

    // ---------- Details fetching with de-dupe & throttling ----------
    const inFlightRef = useRef(new Set());

    useEffect(() => {
        if (plannedIds.length === 0) return;

        let cancelled = false;
        const controller = new AbortController();

        const missing = plannedIds.filter((id) => !detailsCache[id] && !inFlightRef.current.has(id));
        if (missing.length === 0) return;

        missing.forEach((id) => inFlightRef.current.add(id));

        const CONCURRENCY = 2;
        const DELAY_MS = 250;

        const queue = [...missing];

        const fetchOne = async (id) => {
            try {
                const infoRes = await fetch(`/api/location/details?locationId=${encodeURIComponent(id)}`, {
                    signal: controller.signal,
                });
                if (!infoRes.ok) throw new Error(`Details failed for ${id}`);
                const info = await infoRes.json();

                let image = null;
                try {
                    const imgRes = await fetch(`/api/location/image?locationId=${encodeURIComponent(id)}`, {
                        signal: controller.signal,
                    });
                    if (imgRes.ok) image = await imgRes.json();
                } catch (imgErr) {
                    console.warn("image fetch failed for", id, imgErr);
                }

                if (!cancelled) {
                    setDetailsCache((prev) => (prev[id] ? prev : { ...prev, [id]: { info, image } }));
                }
            } catch (e) {
                if (!cancelled) console.error("details fetch failed for", id, e);
            } finally {
                inFlightRef.current.delete(id);
            }
        };

        const runWorker = async () => {
            while (queue.length && !cancelled) {
                const id = queue.shift();
                await fetchOne(id);
                await new Promise((r) => setTimeout(r, DELAY_MS));
            }
        };

        const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, runWorker);
        Promise.all(workers).catch((e) => console.error(e));

        return () => {
            cancelled = true;
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plannedIds]);

    // ==== CACHE: persist whenever we have useful data
    useEffect(() => {
        if (!cacheKey) return;

        // Only persist once we know what IDs we plan to use (so refresh can skip calls)
        const haveIds = locationIds.length > 0 || restaurantIds.length > 0;

        if (!haveIds) return;

        // Keep details only for planned IDs (smaller cache)
        const prunedDetails = {};
        for (const id of plannedIds) {
            if (detailsCache[id]) prunedDetails[id] = detailsCache[id];
        }

        safeSetLS(cacheKey, {
            ts: Date.now(),
            locationIds,
            restaurantIds,
            detailsCache: prunedDetails,
        });
    }, [cacheKey, locationIds, restaurantIds, plannedIds, detailsCache]);

    // ---------- Final plan with hydrated details ----------
    const finalPlan = useMemo(() => {
        const plan = {};
        for (let i = 0; i < dayKeys.length; i++) {
            const date = dayKeys[i];
            const activityId = chosenActivityIds[i];
            const restaurantId = chosenRestaurantIds[i];
            plan[date] = {
                dayNumber: basePlan[date]?.dayNumber ?? i + 1,
                activity: activityId ? detailsCache[activityId] || "" : "",
                restaurant: restaurantId ? detailsCache[restaurantId] || "" : "",
            };
        }
        return plan;
    }, [dayKeys, chosenActivityIds, chosenRestaurantIds, basePlan, detailsCache]);

    // ---------- Loader Control ----------
    const initialLoading =
        (isFetchingAttractions && locationIds.length === 0) ||
        (isFetchingRestaurants && restaurantIds.length === 0);

    if (initialLoading) return <LoadingPage />;

    // ---------- Render ----------
    return (
        <div className="flex flex-col items-center w-full h-fit gap-y-12">
            <Section>
                <SearchParameters
                    destination={destination}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    travelers={travelers}
                    interests={interests}
                />

                <h1 className="font-bold text-4xl text-center text-primary-foreground">Reiseplan</h1>

                {error && <p className="text-red-500 mt-4">Error: {error}</p>}

                {dayKeys.length > 0 ? (
                    <div className="mt-8 flex flex-col gap-6 w-full">
                        {Object.entries(finalPlan).map(([date, plan]) => (
                            <div key={date} className="border rounded-xl p-4 shadow-sm bg-white/5 h-fit">
                                <h3 className="text-xl font-semibold mb-2">
                                    Day {plan.dayNumber} – {format(new Date(date), "d. MMM yyyy", { locale: nb })}
                                </h3>

                                <div className="grid gap-8 h-fit pb-6">
                                    <div className="min-h-32 h-full">
                                        <h4 className="font-bold text-primary">Activity</h4>
                                        {plan.activity && plan.activity.info && plan.activity.image ? (
                                            <LocationView info={plan.activity.info} image={plan.activity.image} />
                                        ) : (
                                            <div className="h-full w-full bg-white/30 animate-pulse rounded-lg"/>
                                        )}
                                    </div>

                                    <div className="min-h-32 h-full">
                                        <h4 className="font-bold text-primary">Restaurant</h4>
                                        {plan.restaurant && plan.restaurant.info && plan.restaurant.image ? (
                                            <LocationView info={plan.restaurant.info} image={plan.restaurant.image} />
                                        ) : (
                                            <div className="h-full w-full bg-white/30 animate-pulse rounded-lg"/>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-6 opacity-70">Building your plan…</p>
                )}
            </Section>
        </div>
    );
}
