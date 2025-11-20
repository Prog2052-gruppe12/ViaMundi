"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/app/loading";
import { Section } from "@/components/common/Section";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import PlanDay from "@/components/features/travelPlan/PlanDay";
import { usePdfExport } from "@/hooks/usePdfExport";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function SavedTripPage() {
  const params = useParams();
  const tripId = params?.tripId;

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { exportPdf, isExporting, error: pdfError } = usePdfExport();

  const handleExportPdf = async () => {
    if (trip) {
      await exportPdf(trip);
    }
  };

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

        {/* PDF Export Button */}
        <div className="flex justify-end items-center p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            {pdfError && (
              <span className="text-sm text-red-600">
                {pdfError}
              </span>
            )}
            <Button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-lg !px-5"
              variant="default"
              size="sm"
            >
              <Download size={16} />
              {isExporting ? "Genererer PDF..." : "Last ned som PDF"}
            </Button>
          </div>
        </div>

        <Section type="plan" className="p-0">
          {Object.keys(trip.finalPlan || {}).length > 0 ? (
            <div className="flex flex-col w-full">
              {Object.entries(trip.finalPlan).map(([dateKey, plan]) => {
                // Handle both old and new data structures
                const attractions = plan.attractions || (plan.activity ? [plan.activity] : []);
                const restaurants = plan.restaurants || (plan.restaurant ? [plan.restaurant] : []);

                // Get AI summaries and weather data
                const planSummary = trip.summarizedPlan?.[dateKey] || { attractions: [], restaurants: [] };
                const weatherSummary = trip.weatherSummary?.days?.[plan.dayNumber - 1] || {};

                return (
                  <PlanDay
                    key={dateKey}
                    dateKey={dateKey}
                    dayNumber={plan.dayNumber}
                    attractions={attractions}
                    restaurants={restaurants}
                    planSummary={planSummary}
                    weatherSummary={weatherSummary}
                  />
                );
              })}
            </div>
          ) : (
            <p className="mt-6 opacity-70">Ingen planlagte aktiviteter</p>
          )}
        </Section>
      </div>
    </div>
  );
}
