import {Label} from "@/components/ui/label";
import {format} from "date-fns";
import {nb} from "date-fns/locale";
import {CalendarIcon, MapPin, User, Activity} from "lucide-react";
import React from "react";

export const SearchParameters = ({destination, dateFrom, dateTo, travelers, interests}) => {
    return (
        <div className="flex flex-row w-full pt-2 px-4 md:px-16 lg:px-32">
            <div className="flex md:flex-row flex-col gap-3 w-full p-4 bg-gradient-primary rounded-xl">
                <div className="w-full">
                    <Label className="text-card font-bold">Reisemål</Label>
                    <div
                        className="flex flex-row items-center gap-2 font-medium text-card/75 mt-1 bg-card/20 px-3 py-1 rounded-md">
                        <MapPin size={"16"} strokeWidth={2}/>
                        {destination}
                    </div>
                </div>
                <div className="w-full">
                    <Label className="text-card font-bold">Dato Fra</Label>
                    <div
                        className="flex flex-row items-center gap-2 font-medium text-card/75 mt-1 bg-card/20 px-3 py-1 rounded-md">
                        <CalendarIcon size={"16"} strokeWidth={2}/>
                        {format(new Date(dateFrom), "d. MMM yyyy", {locale: nb})}
                    </div>
                </div>
                <div className="w-full">
                    <Label className="text-card font-bold">Dato Til</Label>
                    <div
                        className="flex flex-row items-center gap-2 font-medium text-card/75 mt-1 bg-card/20 px-3 py-1 rounded-md">
                        <CalendarIcon size={"16"} strokeWidth={2}/>
                        {format(new Date(dateTo), "d. MMM yyyy", {locale: nb})}
                    </div>
                </div>
                <div className="w-full">
                    <Label className="text-card font-bold">Antall reisende</Label>
                    <div
                        className="flex flex-row items-center gap-2 font-medium text-card/75 mt-1 bg-card/20 px-3 py-1 rounded-md">
                        <User size={"16"} strokeWidth={2}/>
                        {travelers}
                    </div>
                </div>
                {interests && interests.trim() !== "" && (
                    <div className="w-full">
                        <Label className="text-card font-bold">Interesser</Label>
                        <div className="flex flex-row items-center gap-2 font-medium text-card/75 mt-1 bg-card/20 px-3 py-1 rounded-md">
                            <Activity size={16} strokeWidth={2} />
                            {interests}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}