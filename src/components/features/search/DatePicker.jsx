"use client";

import React, { useEffect, useState } from "react";
import {
    CalendarIcon,
    ChevronDown,
    ChevronUp,
    Trash,
    CircleX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/utils/cn";
import { format, addYears } from "date-fns";
import { nb } from "date-fns/locale";

export const DatePicker = ({ label, form, today, dateMax, dateFromWatch }) => {
    const [loading, setLoading] = useState(true);
    const currentForm = form;

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (today && dateMax) setLoading(false);
    }, [today, dateMax]);

    const TriggerButton = ({ field }) => (
        <Button
            variant="fake"
            size="fake"
            className={cn(
                "bg-card w-full justify-between rounded-md text-md",
                !field.value && "text-muted-foreground",
                currentForm.formState.errors[field.name] && "ring-[3px] ring-destructive/30"
            )}
            disabled={loading}
        >
            <div className="flex flex-row items-center gap-3">
                <CalendarIcon strokeWidth={2.5} />
                {field.value
                    ? format(field.value, "d. MMM yyyy", { locale: nb })
                    : "Velg..."}
            </div>
            {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
    );

    const ClearAndClose = ({ field }) => (
        <div className="bg-popover w-full p-2 flex justify-between gap-2">
            <Button
                type="button"
                variant="default"
                className="rounded-md"
                size="sm"
                onClick={() => setOpen(false)}
            >
                <CircleX /> Lukk
            </Button>
            {field.value && (
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-md"
                    size="sm"
                    onClick={() => {
                        field.onChange(null);
                        setOpen(true);
                    }}
                >
                    <Trash /> Tøm
                </Button>
            )}
        </div>
    );

    // Determine if this is the "date to" field
    const isDateTo = label.toLowerCase().includes("til");

    return (
        <div className={cn(open && "overlay-active", "min-w-40 w-full gap-y-1")}>
            <FormField
                control={currentForm.control}
                name={label === "Dato fra" ? "dateFrom" : "dateTo"}
                render={({ field }) => (
                    <FormItem className="flex flex-col justify-start w-full gap-y-1">
                        <FormLabel className="font-bold text-sm text-card">{label}</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>{TriggerButton({ field })}</FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                align = {isDateTo ? "end" : "start"}
                                className="flex flex-col p-0 border-none bg-popover"
                            >
                                <Calendar
                                    mode="single"
                                    today={dateFromWatch}
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => {
                                        if (isDateTo && dateFromWatch) {
                                            return date <= dateFromWatch || date > dateMax;
                                        }
                                        return date < today || date > dateMax;
                                    }}
                                    captionLayout="dropdown"
                                    startMonth={today}
                                    endMonth={dateMax}
                                />
                                <ClearAndClose field={field} />
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                )}
            />
        </div>
    );
};
