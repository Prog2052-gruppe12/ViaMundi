import {Label} from "@/components/ui/label";
import {format} from "date-fns";
import {nb} from "date-fns/locale";
import {CalendarIcon, MapPin, User, Volleyball} from "lucide-react";
import React from "react";

export const SearchParameters = ({destination, dateFrom, dateTo, travelers, interests}) => {
    return (
            <div className="rounded-lg flex md:flex-row flex-col justify-center items-center h-fit gap-3 w-full">
                <div className="w-full">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-card/75 bg-card/20 ring-2 ring-card/30 px-3 py-1.5 rounded-md">
                        <MapPin size={"24"} strokeWidth={1.5}/>
                        <div>
                            <Label className="text-card font-bold">Reisemål</Label>
                            {destination}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-card/75 bg-card/20 ring-2 ring-card/30 px-3 py-1.5 rounded-md">
                        <CalendarIcon size={"24"} strokeWidth={1.5}/>
                        <div>
                            <Label className="text-card font-bold">Datoer</Label>
                            {format(new Date(dateFrom), "d. MMM", {locale: nb})}
                            {" - "}
                            {format(new Date(dateTo), "d. MMM", {locale: nb})}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div
                        className="flex flex-row items-center gap-3 font-medium text-card/75 bg-card/20 ring-2 ring-card/30 px-3 py-1.5 rounded-md">
                        <User size={"24"} strokeWidth={1.5}/>
                        <div>
                            <Label className="text-card font-bold">Antall</Label>
                            {travelers} personer
                        </div>
                    </div>
                </div>
                {interests && interests.trim() !== "" && (
                    <div className="w-full">
                        <div className="flex flex-row items-center gap-3 font-medium text-card/75 bg-card/20 ring-2 ring-card/30 px-3 py-1.5 rounded-md">
                            <Volleyball size={"24"} strokeWidth={1.5} />
                            <div>
                                <Label className="text-card font-bold">Interesser</Label>
                                {interests}
                            </div>
                        </div>
                    </div>
                )}
            </div>
    )
}