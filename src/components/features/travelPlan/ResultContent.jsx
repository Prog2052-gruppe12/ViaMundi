"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Section } from "@/components/common/Section";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import LoadingPage from "@/app/loading";

import { useCache } from "@/hooks/useCache"
import { usePlan } from "@/hooks/usePlan";
import { useDetailsFetcher } from "@/hooks/useDetailsFetcher";
import PlanDay from "@/components/features/travelPlan/PlanDay";

import { useInterestsLoader } from "@/hooks/useInterestsLoader";
import { useIdsLoader } from "@/hooks/useIdsLoader";
import { useDetailsReady } from "@/hooks/useDetailsReady";
import { usePageReady } from "@/hooks/usePageReady";
import { useSaveTrip } from "@/hooks/useSaveTrip";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { getCityName } from "@/utils/cityFromDest";

export default function ResultContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const travelers = searchParams.get("travelers") || "";
    const interestsFromUrl = searchParams.get("interests") || "";

    // Cache/hydration
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
    } = useCache({
        destination,
        dateFrom,
        dateTo,
        interests: interestsFromUrl,
    });

    // AI (or fallback) interests
    const { interests, isFetchingInterests } = useInterestsLoader({
        destination,
        dateFrom,
        dateTo,
        travelers,
        interestsFromUrl,
        isHydrated,
        interestsCache,
        setInterestsCache,
    });
    const interestsEffective = interests ?? interestsFromUrl;

    // Plan (deterministic selection)
    const { dayKeys, finalPlan, plannedIds, isPlanFullyCached } = usePlan({
        dateFrom,
        dateTo,
        locationIds,
        restaurantIds,
        detailsCache,
        destination,
        interests: interestsEffective,
    });

    // IDs loading
    const { idsReady } = useIdsLoader({
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
    });

    // Details loading (worker)
    useDetailsFetcher(
        idsReady ? plannedIds : [],
        detailsCache,
        setDetailsCache,
        isHydrated,
        cacheKey,
        idsReady
    );

    // Readiness gates
    const { isDetailsReady } = useDetailsReady({ idsReady, plannedIds, detailsCache });
    const { pageReady } = usePageReady({
        isHydrated,
        isFetchingInterests,
        idsReady,
        isDetailsReady,
    });

    // Save trip functionality
    const { saveTrip, isSaving, error: saveError } = useSaveTrip();
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSaveTrip = async () => {
        setSaveSuccess(false);
        
        // Extract thumbnail from first day's activity if available
        const firstDayKey = dayKeys[0];
        const thumbnailUrl = finalPlan[firstDayKey]?.activity?.image?.images?.large?.url || null;

        const tripData = {
            destination,
            dateFrom,
            dateTo,
            travelers: parseInt(travelers) || 1,
            interests: interestsEffective || "",
            interestsRaw: interestsFromUrl || "",
            locationIds,
            restaurantIds,
            plannedIds,
            finalPlan,
            detailsCache,
            metadata: {
                cityName: getCityName(destination) || destination,
                dayCount: dayKeys.length,
                thumbnailUrl,
            }
        };

        const result = await saveTrip(tripData);
        if (result.success) {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (!pageReady) return <LoadingPage />;

    return (
        <div className="flex flex-col items-center w-full h-fit px-4 md:px-16 lg:px-32 ">
            {error && (
                <p className="absolute border p-1 px-3 bg-card text-red-500 text-xs top-22 opacity-70">
                    Error: {error}
                </p>
            )}
            <div className="flex flex-col w-full overflow-hidden rounded-2xl border max-w-[1700px]">
                <SearchParameters
                    destination={destination}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    travelers={travelers}
                    interests={interestsEffective}
                />
                
                {/* Save Trip Button */}
                <div className="flex justify-between items-center p-4 border-b bg-card">
                    <div className="text-sm text-muted-foreground">
                        {dayKeys.length} dag{dayKeys.length !== 1 ? "er" : ""} planlagt • {plannedIds.length} lokasjoner
                    </div>
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
                            disabled={isSaving || !pageReady || dayKeys.length === 0 || plannedIds.length === 0}
                            className="flex items-center gap-2"
                            variant="default"
                        >
                            <Save size={16} />
                            {isSaving ? "Lagrer..." : "Lagre reise"}
                        </Button>
                    </div>
                </div>
                
                <Section type="plan">
                    {Object.keys(finalPlan || {}).length > 0 ? (
                        <div className="flex flex-col gap-4 w-full">
                            {Object.entries(finalPlan).map(([dateKey, plan]) => (
                                <PlanDay
                                    key={dateKey}
                                    dateKey={dateKey}
                                    dayNumber={plan.dayNumber}
                                    activity={plan.activity}
                                    restaurant={plan.restaurant}
                                />
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
