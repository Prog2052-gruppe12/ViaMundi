"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/app/loading";
import { Section } from "@/components/common/Section";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import PlanDay from "@/components/features/travelPlan/PlanDay";

export default function SavedTripPage() {
  const params = useParams();
  const tripId = params?.tripId;

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/user/trips/${tripId}`);
        const result = await response.json();

        if (!result.ok) {
          throw new Error(result.error || "Failed to fetch trip");
        }

        setTrip(result.trip);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  if (isLoading) return <LoadingPage />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Kunne ikke laste reisen</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-muted-foreground">Reise ikke funnet</p>
      </div>
    );
  }

  const interestsEffective = trip.interests || trip.interestsRaw || "";

  return (
    <div className="flex flex-col items-center w-full h-fit px-4 md:px-16 lg:px-32">
      <div className="flex flex-col w-full overflow-hidden rounded-2xl border max-w-[1700px]">
        <SearchParameters
          destination={trip.destination}
          dateFrom={trip.dateFrom}
          dateTo={trip.dateTo}
          travelers={trip.travelers}
          interests={interestsEffective}
        />

        <Section type="plan">
          {Object.keys(trip.finalPlan || {}).length > 0 ? (
            <div className="flex flex-col gap-4 w-full">
              {Object.entries(trip.finalPlan).map(([dateKey, plan]) => (
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
            <p className="mt-6 opacity-70">Ingen planlagte aktiviteter</p>
          )}
        </Section>
      </div>
    </div>
  );
}
