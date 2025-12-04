"use client";

import React from "react";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TripCard from "@/components/features/trips/TripCard";
import { useTrips } from "@/hooks/useTrips";
import { Plane } from "lucide-react";
import LoadingPage from "@/app/loading";
import { useEffect } from "react";
import { cn } from "@/utils/cn";

export default function MineReiserPage() {
  const [tripTypes, setTripTypes] = React.useState(new Set());
  const [selectedDestination, setSelectedDestination] = React.useState(null);

  const { trips, isLoading, error, refetch } = useTrips();

  const handleTripDeleted = (tripId) => {
    // Refetch trips after deletion
    refetch();
  };

  const handleDestinationClick = (destination) => {
    setSelectedDestination(prev => prev === destination ? null : destination);
  };


  useEffect(() => {
    if (!trips) return;

    setTripTypes(prev => {
      const updated = new Set(prev);

      trips.forEach((trip) => {
        if (trip.destination) {
          updated.add(trip.destination);
        }
      });

      return updated;
    });
  }, [trips]);


  if (isLoading) return <LoadingPage />;

  return (
    <Section>
      <div className="flex flex-row items-center gap-4 justify-center">
        <h1 className="font-bold text-4xl md:text-5xl text-center text-primary-foreground">Mine reiser</h1>
      </div>
      {error && (
        <div className="flex flex-col items-center justify-center bg-card p-6 rounded-lg gap-6 border-none">
          <div className="flex flex-row items-center justify-center gap-4">
            <div className="bg-gradient-primary rounded-full p-0 h-18 aspect-square flex items-center justify-center">
              <Plane size={40} strokeWidth={0.5} className="text-muted-foreground drop-shadow-md" fill="white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-1">Kunne ikke laste reiser</h2>
              <h3 className="text-muted-foreground font-medium max-w-md break-words whitespace-normal line-clamp-2 text-pretty">
                {error}
              </h3>
            </div>

          </div>
          <a href="/" className="w-full h-fit">
            <Button variant="secondary" className="w-full rounded-md">
              Gå tilbake til startsiden
            </Button>
          </a>
        </div>
      )}
      {!error && trips.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-card p-6 rounded-lg gap-6 border-none">
          <div className="flex flex-row items-center justify-center gap-4">
            <div className="bg-gradient-primary rounded-full p-0 h-18 aspect-square flex items-center justify-center">
              <Plane size={40} strokeWidth={0.5} className="text-muted-foreground drop-shadow-md" fill="white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-1">Ingen lagrede reiser</h2>
              <h3 className="text-muted-foreground font-medium max-w-md break-words whitespace-normal line-clamp-2 text-pretty">
                Du har ikke lagret noen reiser ennå. Planlegg en reise og lagre den for å se den her!
              </h3>
            </div>

          </div>
          <a href="/" className="w-full h-fit">
            <Button variant="secondary" className="w-full rounded-md">
              Planlegg en reise
            </Button>
          </a>
        </div>
      )}
      {!error && trips.length > 0 && (
        <div className="w-full bg-card/20 ring-2 ring-card/30 rounded-lg p-4">
          {console.log(tripTypes)}
          <div className="text-primary-foreground text-lg font-semibold">
            <h2>
              Du har {trips.length} lagret{trips.length !== 1 ? "e" : ""} reise{trips.length !== 1 ? "r" : ""}
            </h2>
            {tripTypes.size > 0 && (
              <div className="flex flex-row flex-wrap gap-3 text-sm mt-2">
                {[...tripTypes].map((type) => {
                  const isSelected = selectedDestination === type;

                  return (
                    <div
                      key={type}
                      onClick={() => handleDestinationClick(type)}
                      className={cn(
                        "ring-2 ring-card/25 text-card/50 hover:text-card/75 hover:ring-card/50 cursor-pointer px-2.5 py-0.75 font-semibold clickable select-non transition duration-100 rounded-md",
                        isSelected && "bg-accent/75 text-card ring-card hover:ring-card hover:text-card",
                      )}
                    >
                      {type}
                    </div>
                  );
                })}

              </div>
            )}
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips
              .filter(trip => {
                if (!selectedDestination) return true; // no filter
                return trip.destination === selectedDestination;
              })
              .map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={handleTripDeleted}
                />
              ))}
          </div>
        </div>
      )
      }
    </Section>
  );

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
