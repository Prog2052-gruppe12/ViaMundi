import {Label} from "@/components/ui/label";
import {format} from "date-fns";
import {nb} from "date-fns/locale";
import {CalendarIcon, MapPin, User, ClipboardList} from "lucide-react";
import React from "react";

export const SearchParameters = ({destination, dateFrom, dateTo, travelers, interests}) => {
    return (
        <div className="w-full">
            <div className="rounded-none flex md:flex-row flex-col justify-center items-center h-fit gap-3 w-full p-4 bg-card border-b">
                <div className="w-full">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-sm text-primary border border-muted-foreground px-3 py-1.5 rounded-lg">
                        <MapPin size={"24"} strokeWidth={1.5}/>
                        <div>
                            <Label className="font-bold text-xs">Reisemål</Label>
                            {destination}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-sm text-primary border border-muted-foreground px-3 py-1.5 rounded-lg">
                        <CalendarIcon size={"24"} strokeWidth={1.5}/>
                        <div>
                            <Label className="font-bold text-xs">Datoer</Label>
                            {format(dateFrom, "d. MMM", {locale: nb})}
                            {" - "}
                            {format(dateTo, "d. MMM", {locale: nb})}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-sm text-primary border border-muted-foreground px-3 py-1.5 rounded-lg">
                        <User size={"24"} strokeWidth={1.5}/>
                        <div>
                            <Label className="font-bold text-xs">Antall</Label>
                            {travelers} personer
                        </div>
                    </div>
                </div>
                {interests && interests.trim() !== "" && (
                    <div className="w-full">
                        <div
                            className="flex flex-row items-center gap-3 font-medium text-sm text-primary border border-muted-foreground px-3 py-1.5 rounded-lg">
                            <ClipboardList size={"24"} strokeWidth={1.5}/>
                            <div>
                                <Label className="font-bold text-xs">Interesser</Label>
                                {interests}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}