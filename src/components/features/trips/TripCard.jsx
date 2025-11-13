"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Calendar, MapPin, Users, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

/**
 * TripCard component - displays a summary of a saved trip
 * @param {Object} trip - Trip data object
 * @param {Function} onDelete - Callback when trip is deleted
 */
export default function TripCard({ trip, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Er du sikker på at du vil slette denne reisen?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/user/trips/${trip.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || "Failed to delete trip");
      }

      onDelete?.(trip.id);
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Kunne ikke slette reisen. Prøv igjen.");
    } finally {
      setIsDeleting(false);
    }
  };

  const dateFrom = new Date(trip.dateFrom);
  const dateTo = new Date(trip.dateTo);
  const cityName = trip.metadata?.cityName || trip.destination;
  const dayCount = trip.metadata?.dayCount || 0;
  const thumbnailUrl = trip.metadata?.thumbnailUrl;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/bruker/reiser/${trip.id}`}>
        {/* Thumbnail Image */}
        <div className="relative h-48 bg-muted overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={cityName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
              <MapPin size={64} className="text-primary/40" />
            </div>
          )}
          {/* Day count badge */}
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {dayCount} dag{dayCount !== 1 ? "er" : ""}
          </div>
        </div>

        <CardContent className="pt-4">
          {/* Destination */}
          <h3 className="font-bold text-xl mb-2 line-clamp-1">{cityName}</h3>

          {/* Dates */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar size={16} />
            <span>
              {format(dateFrom, "d. MMM", { locale: nb })} - {format(dateTo, "d. MMM yyyy", { locale: nb })}
            </span>
          </div>

          {/* Travelers */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            <span>{trip.travelers} reisende</span>
          </div>

          {/* Saved date */}
          <p className="text-xs text-muted-foreground mt-3">
            Lagret {format(new Date(trip.createdAt), "d. MMM yyyy", { locale: nb })}
          </p>
        </CardContent>
      </Link>

      <CardFooter className="pt-0">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 size={16} className="mr-2" />
          {isDeleting ? "Sletter..." : "Slett reise"}
        </Button>
      </CardFooter>
    </Card>
  );
}
