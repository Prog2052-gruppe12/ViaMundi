"use client";

import { Section } from "@/components/common/Section";
import TripCard from "@/components/features/trips/TripCard";
import { useTrips } from "@/hooks/useTrips";
import { Plane } from "lucide-react";
import LoadingPage from "@/app/loading";

export default function MineReiserPage() {
  const { trips, isLoading, error, refetch } = useTrips();

  const handleTripDeleted = (tripId) => {
    // Refetch trips after deletion
    refetch();
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-4 md:px-16 lg:px-32 py-12">
      <Section>
        <div className="max-w-[1400px] w-full">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Plane size={32} className="text-primary" />
            <h1 className="text-4xl font-bold">Mine reiser</h1>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
              <p className="font-medium">Kunne ikke laste reiser</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!error && trips.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted rounded-full p-8 mb-6">
                <Plane size={64} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Ingen lagrede reiser</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Du har ikke lagret noen reiser ennå. Planlegg en reise og lagre den for å se den her!
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Planlegg en reise
              </a>
            </div>
          )}

          {/* Trips Grid */}
          {!error && trips.length > 0 && (
            <>
              <p className="text-muted-foreground mb-6">
                Du har {trips.length} lagret{trips.length !== 1 ? "e" : ""} reise{trips.length !== 1 ? "r" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onDelete={handleTripDeleted}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Section>
    </div>
  );
}
