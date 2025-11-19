import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarIcon, MapPin, User, ClipboardList } from "lucide-react";
import React from "react";

export const SearchParameters = ({ destination, dateFrom, dateTo, travelers, interests }) => {
    return (
        <div className="w-full">
            <div className="rounded-none flex md:flex-row flex-col justify-center items-center h-fit gap-3 w-full p-4 bg-card border-b">
                <div className="w-full pointer-events-none">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-sm text-muted-foreground border px-3 py-1.5 rounded-lg">
                        <MapPin size={"24"} strokeWidth={1.5} />
                        <div>
                            <Label className="font-bold text-xs">Reisemål</Label>
                            <div className="break-words whitespace-normal line-clamp-1 text-pretty"
                                title={destination}
                            >
                                {destination}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full pointer-events-none">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-sm text-muted-foreground border px-3 py-1.5 rounded-lg">
                        <CalendarIcon size={"24"} strokeWidth={1.5} />
                        <div>
                            <Label className="font-bold text-xs">Datoer</Label>
                            <div className="break-words whitespace-normal line-clamp-1 text-pretty"
                                title={`${format(dateFrom, "d. MMM yyyy", { locale: nb })} - ${format(dateTo, "d. MMM yyyy", { locale: nb })}`}
                            >
                                {format(dateFrom, "d. MMM", { locale: nb })}
                                {" - "}
                                {format(dateTo, "d. MMM", { locale: nb })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full pointer-events-none">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-sm text-muted-foreground border px-3 py-1.5 rounded-lg">
                        <User size={"24"} strokeWidth={1.5} />
                        <div>
                            <Label className="font-bold text-xs">Antall</Label>
                            <div className="break-words whitespace-normal line-clamp-1 text-pretty"
                                title={`${travelers} personer`}
                            >
                                {travelers} personer
                            </div>
                        </div>
                    </div>
                </div>
                {interests && (
                    <div className="w-full pointer-events-none">
                        <div
                            className="flex flex-row items-center gap-3 font-medium text-sm text-muted-foreground border px-3 py-1.5 rounded-lg">
                            <ClipboardList size={"24"} strokeWidth={1.5} />
                            <div>
                                <Label className="font-bold text-xs">Interesser</Label>
                                <div className="break-words whitespace-normal line-clamp-1 text-pretty"
                                    title={interests}
                                >
                                    {interests}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}