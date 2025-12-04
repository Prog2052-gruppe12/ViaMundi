"use client";

import React, { useMemo } from "react";
import { Calendar, Ticket, UtensilsCrossed } from "lucide-react";
import { format } from "date-fns";
import { da, nb } from "date-fns/locale";
import LocationView from "@/components/features/travelPlan/LocationInfo";
import SmallView from "@/components/features/travelPlan/SmallView";
import { getWeatherIcon } from "@/utils/getIconFromWc";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUp } from "lucide-react";
import { ArrowDown } from "lucide-react";

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



const PlanDay = React.memo(function PlanDay({ dateKey, dayNumber, attractions, restaurants, planSummary, weatherSummary }) {

    //console.log(planSummary);

    if (!dateKey || !dayNumber || !attractions || !restaurants || !planSummary) {
        return null;
    }

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
        <div className="flex flex-col rounded-lg">
            <Accordion type="single" collapsible defaultValue={1}>
                <AccordionItem value={dayNumber}>
                    <AccordionTrigger className="px-1 py-2 flex flex-row items-center data-[state=closed]:cursor-pointer hover:bg-primary/2 rounded-lg">
                        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                            <div className="flex-1 w-full flex flex-row font-semibold text-sm gap-4 items-center">
                                <div className="hidden px-3 py-1 flex items-center justify-center rounded-md bg-gradient-secondary text-primary-foreground">
                                    <span className="text-lg">Dag {dayNumber}</span>
                                </div>
                                <div className="flex flex-1 flex-row justify-between items-center gap-4">
                                    <div className="flex-1 break-words whitespace-normal line-clamp-1 text-pretty">
                                        <span className="text-lg font-bold flex-1">Dag {dayNumber}</span>
                                        <span className="ml-4 text-[16px] font-medium text-muted-foreground">{planSummary.daySummary}</span>
                                    </div>
                                    <div className="border flex flex-row items-center gap-2 font-semibold text-sm px-3 py-1 text-muted-foreground rounded-lg">
                                        <Calendar size={14} strokeWidth={2.5} />
                                        <span>{dateLabel}</span>
                                    </div>
                                </div>








                            </div>
                            {/*
                            <div className="flex flex-row items-center gap-2 px-3 py-1 bg-primary/5 text-muted-foreground rounded-md">
                                {getWeatherIcon(weatherSummary["weather_code"], 16)}
                                <span className="flex flex-row items-center gap-1">
                                    <ArrowDown size={10} />
                                    {weatherSummary["tmp_min"]}
                                    °C
                                </span>
                                <span className="flex flex-row items-center gap-1">
                                    <ArrowUp size={10} />
                                    {weatherSummary["tmp_max"]}
                                    °C
                                </span>
                            </div>
                            <div className="flex flex-row items-center gap-2 font-medium text-sm px-3 py-1 bg-primary/5 text-muted-foreground rounded-md">
                                <Calendar size={14} />
                                {dateLabel}
                            </div>
                            */}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 rounded-b-lg">
                        <div className="grid gap-4 h-fit py-2 px-0 w-full">
                            <div className="hidden flex-row items-center gap-4 w-full border p-2">

                                <span>
                                    {weatherSummary?.["summaryOfTheDay"] || "Ingen værinformasjon tilgjengelig"}
                                </span>
                            </div>
                            <div className="flex flex-row w-full gap-3">
                                <div className="hidden md:flex flex-col items-center gap-4">
                                    <div className="!w-7 !h-7 min-h-7 bg-gradient-secondary flex items-center justify-center rounded-md">
                                        <Ticket size={16} strokeWidth={2} className="text-primary-foreground" />
                                    </div>
                                    <span className="h-full w-0.75 rounded bg-gradient-secondary"></span>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-row gap-2">
                                        <h4 className="flex items-center justify-center bg-card text-xs font-semibold text-primary border w-fit px-2 py-1 rounded-md pointer-events-none">Aktivitet</h4>
                                        <h2 className="text-lg font-semibold break-words whitespace-normal line-clamp-1 text-pretty">{attractionObj?.["name"] || "Kunne ikke hente aktivitet"}</h2>
                                    </div>
                                    <div className="pl-1">
                                        <span>
                                            {attractionSummaryObj?.["attraction_summary"] || "Ingen beskrivelse tilgjengelig"}
                                        </span>
                                    </div>
                                    {/* 
                                    <LocationView
                                        info={attractionObj || null}
                                        image={attractionObj?.image || null}
                                    />
                                    */}
                                    <SmallView
                                        info={attractionObj || null}
                                        image={attractionObj?.image || null}
                                    />

                                </div>
                            </div>
                            <div className="flex flex-row w-full gap-3">
                                <div className="hidden md:flex flex-col items-center gap-4">
                                    <div className="!w-7 !h-7 min-h-7 bg-gradient-secondary flex items-center justify-center rounded-md">
                                        <UtensilsCrossed size={14} strokeWidth={2} className="text-primary-foreground" />
                                    </div>
                                    <span className="h-full w-0.75 rounded bg-gradient-secondary"></span>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-row gap-2">
                                        <h4 className="flex items-center justify-center bg-card text-xs font-semibold text-primary border w-fit px-2 py-1 rounded-md pointer-events-none">Restaurant</h4>
                                        <h2 className="text-lg font-semibold break-words whitespace-normal line-clamp-1 text-pretty">{restaurantObj?.["name"] || "Kunne ikke hente restaurant"}</h2>

                                    </div>
                                    <div className="pl-1">
                                        <span>
                                            {restaurantSummaryObj?.["restaurant_summary"] || "Ingen beskrivelse tilgjengelig"}
                                        </span>
                                    </div>
                                    {/* 
                                    <LocationView
                                        info={restaurantObj || null}
                                        image={restaurantObj?.image || null}
                                    />
                                    */}
                                    <SmallView
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
