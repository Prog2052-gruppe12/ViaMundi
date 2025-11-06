"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Section } from "@/components/common/Section";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import LocationView from "@/components/features/travelPlan/LocationInfo";
import LoadingPage from "@/app/loading";
import { Calendar } from "lucide-react";

import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { useCache } from "./hooks/useCache";
import { usePlan } from "./hooks/usePlan";
import { useDetailsFetcher } from "./hooks/useDetailsFetcher";
import { getCityName } from "@/utils/cityFromDest";
import { decodeCityToCord } from "@/utils/decodeCityToCord";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import * as nextResponse from "zod";

export default function ResultContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const travelers = searchParams.get("travelers");
    const interests_tmp = searchParams.get("interests");

    const [interests, setInterest] = useState(null);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await fetch('api/ai/summarize', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "destination": destination,
                        "dateFrom": dateFrom,
                        "dateTo": dateTo,
                        "travelers": travelers,
                        "interests": interests_tmp,
                    })
                });
                const data = await res.json();
                setInterest(data.data.queries[0]);
                if (!res.ok) throw new Error(data?.error || "Failed to fetch interests from summarizer");
            } catch (err) {
                console.error(err);
            }
        };

        fetchInterests().then();

    }, [interests_tmp]);

    // ✅ Cache Hook (loads cached values from localStorage if available)
    const {
        locationIds,
        restaurantIds,
        detailsCache,
        setLocationIds,
        setRestaurantIds,
        setDetailsCache,
        error,
        setError,
        isHydrated,
    } = useCache({ destination, dateFrom, dateTo, interests });

    // ✅ Reset details cache on new destination/date range/interests
    useEffect(() => {
        // Only clear details cache if we are switching to a totally new trip (no cache available)
        if (locationIds.length === 0 && restaurantIds.length === 0) {
            setDetailsCache({});
        }
    }, [destination, dateFrom, dateTo, interests, locationIds.length, restaurantIds.length]);


    // ✅ Build plan data (chooses which IDs to show per day)
    const { dayKeys, finalPlan, plannedIds, isPlanFullyCached } = usePlan({
        dateFrom,
        dateTo,
        locationIds,
        restaurantIds,
        detailsCache,
        destination,
        interests,
    });

    console.log(isPlanFullyCached);
    useDetailsFetcher(
        !isPlanFullyCached ? plannedIds : [],   // Fetch only if data is missing
        detailsCache,
        setDetailsCache
    );

    // ================== Fetch State ==================
    const [isFetchingAttractions, setIsFetchingAttractions] = useState(false);
    const [isFetchingRestaurants, setIsFetchingRestaurants] = useState(false);

    // ✅ Prevent duplicate fetch calls using refs
    const hasFetchedAttractions = useRef(false);
    const hasFetchedRestaurants = useRef(false);

    // ============ Fetch Attractions ============
    useEffect(() => {
        if (!destination || !interests) return;
        if (hasFetchedAttractions.current || locationIds.length > 0) return;

        let cancelled = false;
        hasFetchedAttractions.current = true;

        const fetchAttractions = async () => {
            try {
                setIsFetchingAttractions(true);
                const city = getCityName(destination) || "";
                const params = new URLSearchParams({ destination: city, interests: interests || "" });
                const res = await fetch(`/api/attractions?${params.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data?.error || "Failed to fetch attractions");
                if (!cancelled) {
                    setLocationIds(Array.isArray(data.location_ids) ? data.location_ids : []);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setIsFetchingAttractions(false);
            }
        };

        fetchAttractions().then();
        return () => { cancelled = true; };
    }, [destination, interests, setLocationIds, setError, locationIds.length]);

    // ============ Fetch Restaurants ============
    useEffect(() => {
        if (!destination || !interests) return;
        if (hasFetchedRestaurants.current || restaurantIds.length > 0) return;

        let cancelled = false;
        hasFetchedRestaurants.current = true;

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
                    setRestaurantIds(Array.isArray(data.location_ids) ? data.location_ids : []);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setIsFetchingRestaurants(false);
            }
        };

        fetchRestaurants().then();
        return () => { cancelled = true; };
    }, [destination, interests, setRestaurantIds, setError, restaurantIds.length]);

    // ✅ UI should show only when data or cache is ready
    const [isReadyToShowUI, setIsReadyToShowUI] = useState(false);
    useEffect(() => {
        if (
            (locationIds.length > 0 && restaurantIds.length > 0) ||
            isFetchingAttractions ||
            isFetchingRestaurants
        ) {
            setIsReadyToShowUI(true);
        }
    }, [locationIds, restaurantIds, isFetchingAttractions, isFetchingRestaurants]);

    const safeParse = (s) => {
        const [y, m, d] = s.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    if (
        !isReadyToShowUI &&
        locationIds.length === 0 &&
        restaurantIds.length === 0 &&
        Object.keys(detailsCache).length === 0 &&
        isHydrated
    ) {
        return <LoadingPage />;
    } else {
        // ============ Render UI ============
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
}
