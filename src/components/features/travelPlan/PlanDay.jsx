"use client";

import React, { useMemo } from "react";
import { Calendar, Ticket, UtensilsCrossed } from "lucide-react";
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



const PlanDay = React.memo(function PlanDay({ dateKey, dayNumber, attractions, restaurants, planSummary }) {

    const attractionObj = attractions[0];
    const attractionSummaryObj = planSummary["attractions"][0];
    const restaurantObj = restaurants[0];
    const restaurantSummaryObj = planSummary["restaurants"][0];

    const dateObj = useMemo(() => safeParseYMD(dateKey), [dateKey]);
    const dateLabel = useMemo(() => {
        if (!dateObj) return dateKey;
        return format(dateObj, "d. MMM", { locale: nb });
    }, [dateObj]);

    return (
        <div className="flex flex-col">
            <Accordion type="single" collapsible defaultValue={1}>
                <AccordionItem value={dayNumber}>
                    <AccordionTrigger className="p-4 flex flex-row items-center rounded-none bg-card border-b">
                        <div className="flex flex-row items-center gap-3 w-full">
                            <div className="flex-1 w-full flex flex-row font-semibold text-sm gap-3">
                                <div className="px-3 py-1 flex items-center justify-center rounded-md bg-gradient-secondary text-primary-foreground">
                                    <span className="text-sm">Dag {dayNumber}</span>
                                </div>
                                <div className="flex-1 break-words whitespace-normal line-clamp-1 text-pretty">
                                    <span className="text-lg flex-1">{attractionObj?.["name"]} og middag på {restaurantObj?.["name"]}</span>
                                </div>

                            </div>
                            <div className="flex flex-row items-center gap-2 font-medium text-sm px-3 py-1 bg-primary/5 text-muted-foreground rounded-md">
                                <Calendar size={14} />
                                {dateLabel}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 bg-card border-b">
                        <div className="grid gap-4 h-fit py-4 px-4 w-full">
                            <div className="flex flex-row w-full gap-4">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="!w-10 !h-10 min-h-10 bg-gradient-secondary flex items-center justify-center rounded-md">
                                        <Ticket size={26} className="text-primary-foreground" />
                                    </div>
                                    <span className="h-full w-1 rounded bg-gradient-secondary"></span>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-row gap-2">
                                        <h4 className="flex items-center justify-center bg-card text-xs font-semibold text-primary border w-fit px-2 py-1 rounded-md pointer-events-none">Aktivitet</h4>
                                        <h2 className="text-lg font-semibold">{attractionObj?.["name"] || "Kunne ikke hente aktivitet"}</h2>
                                    </div>
                                    <div>
                                        <span>
                                            {attractionSummaryObj["attraction_summary"] || "Ingen beskrivelse tilgjengelig"}
                                        </span>
                                    </div>
                                    <LocationView
                                        info={attractionObj || null}
                                        image={attractionObj?.image || null}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row w-full gap-4">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="!w-10 !h-10 min-h-10 bg-gradient-secondary flex items-center justify-center rounded-md">
                                        <UtensilsCrossed size={26} className="text-primary-foreground" />
                                    </div>
                                    <span className="h-full w-1 rounded bg-gradient-secondary"></span>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-row gap-2">
                                        <h4 className="flex items-center justify-center bg-card text-xs font-semibold text-primary border w-fit px-2 py-1 rounded-md pointer-events-none">Restaurant</h4>
                                        <h2 className="text-lg font-semibold">{restaurantObj?.["name"] || "Kunne ikke hente restaurant"}</h2>
                                    </div>
                                    <div>
                                        <span>
                                            {restaurantSummaryObj["restaurant_summary"] || "Ingen beskrivelse tilgjengelig"}
                                        </span>
                                    </div>
                                    <LocationView
                                        info={restaurantObj || null}
                                        image={restaurantObj?.image || null}
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
});

export default PlanDay;
