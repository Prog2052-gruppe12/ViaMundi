// javascript
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Section } from "@/components/common/Section";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import LocationView from "@/components/features/travelPlan/LocationInfo";
import LoadingPage from "@/app/loading";
import { Calendar } from "lucide-react";

import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { useCache } from "@/hooks/useCache";
import { usePlan } from "@/hooks/usePlan";
import { useDetailsFetcher } from "@/hooks/useDetailsFetcher";
import { getCityName } from "@/utils/cityFromDest";
import { decodeCityToCord } from "@/utils/decodeCityToCord";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ResultContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const travelers = searchParams.get("travelers");
    const interests_tmp = searchParams.get("interests"); // user selections from previous page (comma-separated)

    const [interests, setInterests] = useState(null); // AI summarized interests
    const [isFetchingInterests, setIsFetchingInterests] = useState(false);

    // Single cache hook: key is based on the user's selected interests from the URL
    const {
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
    } = useCache({ destination, dateFrom, dateTo, interests: interests_tmp || "" });

    // Use cached AI summary when available; wait for hydration so we don't call AI on refresh
    useEffect(() => {
        if (!destination || !dateFrom || !dateTo || !isHydrated) return;

        if (interestsCache) {
            setInterests(interestsCache);
            return;
        }

        let cancelled = false;
        setIsFetchingInterests(true);

        fetch('/api/ai/summarize', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination, dateFrom, dateTo, travelers, interests: interests_tmp })
        })
            .then(res => res.json())
            .then(data => {
                if (!cancelled) {
                    const value = data?.data?.queries?.[0] || "";
                    setInterests(value);
                    setInterestsCache(value);
                }
            })
            .catch(() => !cancelled && setInterests(null))
            .finally(() => !cancelled && setIsFetchingInterests(false));

        return () => { cancelled = true; };
    }, [destination, dateFrom, dateTo, travelers, interests_tmp, interestsCache, setInterestsCache, isHydrated]);

    // Reset the "ids requested" guard when the cache key changes (new trip)
    const idsRequestedRef = useRef(false);
    useEffect(() => {
        idsRequestedRef.current = false;
    }, [cacheKey]);

    // If cache is hydrated and ids are present, mark ids as already requested so we don't refetch
    useEffect(() => {
        if (!isHydrated) return;
        if (locationIds.length > 0 && restaurantIds.length > 0) {
            idsRequestedRef.current = true;
        }
    }, [isHydrated, locationIds.length, restaurantIds.length]);

    // Clear details cache when switching to a new trip that has no cached ids
    useEffect(() => {
        // If we changed trip (cacheKey changed) and there are no ids loaded, clear details
        if (!locationIds.length && !restaurantIds.length) {
            setDetailsCache({});
        }
    }, [cacheKey, locationIds.length, restaurantIds.length, setDetailsCache]);

    // Build plan data
    const { dayKeys, finalPlan, plannedIds, isPlanFullyCached } = usePlan({
        dateFrom,
        dateTo,
        locationIds,
        restaurantIds,
        detailsCache,
        destination,
        interests, // AI summary used for final plan selection if available
    });

    // Fetch state
    const [isFetchingAttractions, setIsFetchingAttractions] = useState(false);
    const [isFetchingRestaurants, setIsFetchingRestaurants] = useState(false);

    // Fetch attractions & restaurants (ids)
    useEffect(() => {
        // Wait for hydration and require destination and either AI summary or the original interests string
        if (!isHydrated) return;
        if (!destination || !(interests || interests_tmp)) return;
        if (idsRequestedRef.current) return;
        if (locationIds.length > 0 && restaurantIds.length > 0) return;

        let cancelled = false;

        const fetchAttractions = async () => {
            try {
                setIsFetchingAttractions(true);
                const city = getCityName(destination) || "";
                const params = new URLSearchParams({ destination: city, interests: interests || interests_tmp || "" });
                const res = await fetch(`/api/attractions?${params.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data?.error || "Failed to fetch attractions");
                if (!cancelled) {
                    setLocationIds(Array.isArray(data["location_ids"]) ? data["location_ids"] : []);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setIsFetchingAttractions(false);
            }
        };

        const fetchRestaurants = async () => {
            try {
                setIsFetchingRestaurants(true);
                const city = getCityName(destination) || "";
                let lat = null, lon = null;

                try {
                    const coords = await decodeCityToCord(city);
                    lat = coords?.latitude ?? null;
                    lon = coords?.longitude ?? null;
                } catch (e) {}

                const cords = lat != null && lon != null ? `${lat},${lon}` : "";
                const params = new URLSearchParams({ latLong: cords, searchQuery: "restaurant" });
                const res = await fetch(`/api/restaurants?${params.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data?.error || "Failed to fetch restaurants");
                if (!cancelled) {
                    setRestaurantIds(Array.isArray(data["location_ids"]) ? data["location_ids"] : []);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setIsFetchingRestaurants(false);
            }
        };

        Promise.all([fetchAttractions(), fetchRestaurants()]).finally(() => {
            idsRequestedRef.current = true;
        });

        return () => { cancelled = true; };
    }, [
        destination,
        interests,
        interests_tmp,
        setLocationIds,
        setRestaurantIds,
        setError,
        locationIds.length,
        restaurantIds.length,
        isHydrated,
    ]);

    // consider ids ready when both fetches finished AND either we have ids or we've requested them
    const idsReady = !isFetchingAttractions && !isFetchingRestaurants && (locationIds.length > 0 || restaurantIds.length > 0 || idsRequestedRef.current);

    // stable key for plannedIds so memo runs when ids actually change
    const plannedIdsKey = Array.isArray(plannedIds) ? plannedIds.join("|") : String(plannedIds);

    const isDetailsReady = useMemo(() => {
        if (!idsReady) return false;
        if (!plannedIds || plannedIds.length === 0) return true;

        return plannedIds.every((id) => {
            const entry = detailsCache?.[id];
            // require at least an info object or an image string to consider the detail present
            return Boolean(entry && (entry.info || entry.image));
        });
    }, [idsReady, plannedIdsKey, detailsCache]);

    // Fetch missing details (worker hook)
    useDetailsFetcher(
        !isPlanFullyCached ? plannedIds : [],
        detailsCache,
        setDetailsCache,
        isHydrated,
        cacheKey,
        idsReady
    );

    const safeParse = (s) => {
        const [y, m, d] = s.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    // Page readiness: wait for hydration, interests (AI or cached), ids, and details
    const [pageReady, setPageReady] = useState(false);
    useEffect(() => {
        if (!pageReady && isHydrated && !isFetchingInterests && idsReady && isDetailsReady) {
            setPageReady(true);
        }
    }, [pageReady, isHydrated, isFetchingInterests, idsReady, isDetailsReady]);

    //if (!pageReady) return (<LoadingPage />);

    return (
        <div className="flex flex-col items-center w-full h-fit px-4 md:px-16 lg:px-32 ">
            {error && <p className="absolute border p-1 px-3 bg-card text-red-500 text-xs top-22 opacity-50">Error: {error}</p>}
            <div className="flex flex-col w-full overflow-hidden rounded-2xl border max-w-[1700px]">
                <SearchParameters
                    destination={destination}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    travelers={travelers}
                    interests={interests}
                />
                <Section type="plan">
                    {dayKeys.length > 0 ? (
                        <div className="flex flex-col gap-4 w-full">
                            {Object.entries(finalPlan).map(([date, plan]) => (
                                <div key={date} className="flex flex-col rounded-xl border bg-card">
                                    <Accordion type="single" collapsible defaultValue={1}>
                                        <AccordionItem value={plan.dayNumber}>
                                            <AccordionTrigger className="p-4 flex flex-row items-center">
                                                <div className="flex flex-row items-center gap-3">
                                                    <div className="flex flex-row items-center gap-2 font-medium text-sm px-3 py-1 border border-primary rounded-md">
                                                        Dag {plan.dayNumber}
                                                    </div>
                                                    <div className="flex flex-row items-center gap-2 font-medium text-sm px-3 py-1 bg-primary/5 text-muted-foreground rounded-md">
                                                        <Calendar size={14} />
                                                        {format(safeParse(date), "d. MMMM", { locale: nb })}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid gap-4 h-fit px-4">
                                                    <div className="flex flex-col gap-2">
                                                        <h4 className="font-medium text-primary">Aktivitet</h4>
                                                        <LocationView info={plan.activity?.info || null} image={plan.activity?.image || null} />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <h4 className="font-medium text-primary">Restaurant</h4>
                                                        <LocationView info={plan.restaurant?.info || null} image={plan.restaurant?.image || null} />
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-6 opacity-70">Building your plan…</p>
                    )}
                </Section>
            </div>
        </div>
    );
}
