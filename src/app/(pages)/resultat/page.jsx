"use client";

import { Section } from "@/components/common/Section";
import { useSearchParams } from "next/navigation";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import React, { useEffect, useState, Suspense } from "react";
import {getCityName} from "@/utils/cityFromDest";
import LoadingPage from "@/app/loading";
import LocationView from "@/components/features/travelPlan/LocationInfo";

export default function ResultContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests");

    const [locationIds, setLocationIds] = useState([]);
    const [locationResult, setLocationResult] = useState([]);
    const [locationImage, setLocationImage] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch attractions first
    useEffect(() => {
        async function fetchAttractions() {
            try {
                setLoading(true);
                const city = getCityName(destination);
                const params = new URLSearchParams({
                    destination: city || "",
                    interests: interests || "",
                });

                const res = await fetch(`/api/attractions?${params.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch attractions");

                setLocationIds(prev => [...prev, ...data["location_ids"]]);

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        if (destination && interests) {
            fetchAttractions().then();
        }
    }, [destination, interests]);

    useEffect(() => {
        async function fetchInfoLocation(locationId) {
            try {
                const params = new URLSearchParams({ locationId });
                const res = await fetch(`/api/location/details?${params.toString()}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch location info");

                setLocationResult(prev => [...prev, data]);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (locationIds.length > 0) {
            fetchInfoLocation(locationIds.at(0)).then();
            fetchInfoLocation(locationIds.at(1)).then();
        }
    }, [locationIds]);

    useEffect(() => {
        async function fetchLocationImage(locationId) {
            try {
                const params = new URLSearchParams({ locationId });
                const res = await fetch(`/api/location/image?${params.toString()}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch location image");

                setLocationImage(prev => [...prev, data]);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (locationIds.length > 0) {
            fetchLocationImage(locationIds.at(0)).then();
            fetchLocationImage(locationIds.at(1)).then();
        }
    }, [locationIds]);

    if (loading) {
        return <LoadingPage/>
    }

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

                <h1 className="font-bold text-4xl text-center text-primary-foreground">
                    Reiseplan
                </h1>

                {error && <p className="text-red-500 mt-4">Error: {error}</p>}

                {loading && <p className="mt-4 text-gray-500">Loading attractions...</p>}

                {/*
                {!loading && locationIds && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-4 rounded-xl w-full">
                        <h2 className="text-lg font-semibold mb-2">Attraction Results</h2>
                        {locationIds.map((id, i) => (
                            <p key={i}>LocationID: <span>{id}</span></p>
                        ))}
                    </div>
                )}

                {!loading && locationResult && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-4 rounded-xl w-full overflow-scroll">
                        <h2 className="text-lg font-semibold mb-2">Location Details</h2>
                        {locationResult.map((info, i) => (
                            <div key={i}>
                                <LocationView info={info} />
                            </div>
                        ))}
                    </div>
                )}
                */}

                {!loading && locationResult && locationImage && (
                    <div className="w-full h-fit flex flex-col gap-4">
                        {locationResult.map((info, i) => (
                            <div key={i}>
                                <LocationView info={info} image={locationImage.at(i)} />
                            </div>
                        ))}
                    </div>
                )}

            </Section>
        </div>
    );
}
