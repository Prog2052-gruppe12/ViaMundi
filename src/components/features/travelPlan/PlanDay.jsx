"use client";

import React, { useMemo } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { da, nb } from "date-fns/locale";
import LocationView from "@/components/features/travelPlan/LocationInfo";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Safely parse yyyy-MM-dd (local) to Date.
 * Returns null on invalid input.
 */
function safeParseYMD(ymd) {
    if (!ymd || typeof ymd !== "string") return null;
    const [y, m, d] = ymd.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return Number.isNaN(dt.getTime()) ? null : dt;
}

const PlanDay = React.memo(function PlanDay({ dateKey, dayNumber, attractions, restaurants }) {

    const attractionObj = attractions[0];
    const restaurantObj = restaurants[0]

    const dateObj = useMemo(() => safeParseYMD(dateKey), [dateKey]);
    const dateLabel = useMemo(() => {
        if (!dateObj) return dateKey;
        return format(dateObj, "d. MMMM", { locale: nb });
    }, [dateObj]);

    return (
        <div className="flex flex-col rounded-xl border bg-card">
            <Accordion type="single" collapsible defaultValue={1}>
                <AccordionItem value={dayNumber}>
                    <AccordionTrigger className="p-4 flex flex-row items-center">
                        <div className="flex flex-row items-center gap-3">
                            <div className="flex flex-row items-center gap-2 font-medium text-sm px-3 py-1 border border-primary rounded-md">
                                Dag {dayNumber}
                            </div>
                            <div className="flex flex-row items-center gap-2 font-medium text-sm px-3 py-1 bg-primary/5 text-muted-foreground rounded-md">
                                <Calendar size={14} />
                                {dateLabel}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-4 h-fit px-4">
                            <div className="flex flex-col gap-2">
                                <h4 className="font-medium text-primary">Aktivitet</h4>
                                <LocationView
                                    info={attractionObj || null}
                                    image={attractionObj?.image || null}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-medium text-primary">Restaurant</h4>
                                <LocationView
                                    info={restaurantObj || null}
                                    image={restaurantObj?.image || null}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
});

export default PlanDay;
