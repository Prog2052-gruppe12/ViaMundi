"use client";

import { Section } from "@/components/common/Section";
import { useSearchParams } from "next/navigation";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import React, { useEffect, useState, Suspense } from "react";

function ResultContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests");

    const [attractionResult, setAttractionResult] = useState(null);
    const [locationResult, setLocationResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch attractions first
    useEffect(() => {
        async function fetchAttractions() {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    destination: destination || "",
                    interests: interests || "",
                });

                const res = await fetch(`/api/attractions?${params.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch attractions");

                setAttractionResult(data);

                // If the API returns location IDs, pick the first one to fetch info
                if (data?.location_ids?.length > 0) {
                    await fetchInfoLocation(data.location_ids[0]);
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        async function fetchInfoLocation(locationId) {
            try {
                const params = new URLSearchParams({ locationId });
                const res = await fetch(`/api/location/details?${params.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch location info");
                setLocationResult(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        if (destination && interests) {
            fetchAttractions().then();
        }
    }, [destination, interests]);

    return (
        <div className="flex flex-col items-center w-full h-fit gap-y-12">
            <SearchParameters
                destination={destination}
                dateFrom={dateFrom}
                dateTo={dateTo}
                travelers={travelers}
                interests={interests}
            />

            <Section>
                <h1 className="font-bold text-4xl text-center text-primary-foreground">
                    Reiseplan
                </h1>

                {error && <p className="text-red-500 mt-4">Error: {error}</p>}

                {loading && <p className="mt-4 text-gray-500">Loading attractions...</p>}

                {!loading && attractionResult && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-4 rounded-xl w-full">
                        <h2 className="text-lg font-semibold mb-2">Attraction Results</h2>
                        <pre>{JSON.stringify(attractionResult, null, 2)}</pre>
                    </div>
                )}

                {!loading && locationResult && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-4 rounded-xl w-full overflow-scroll">
                        <h2 className="text-lg font-semibold mb-2">Location Details</h2>
                        <pre>{JSON.stringify(locationResult, null, 2)}</pre>
                    </div>
                )}
            </Section>
        </div>
    );
}

export default function Result() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Laster...</div>}>
            <ResultContent />
        </Suspense>
    );
}
