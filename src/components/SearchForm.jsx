"use client";

import React, { useState } from "react";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import citiesData from "@/assets/cities.json";
import { useForm } from "react-hook-form";
import { format, addYears } from "date-fns";
import { nb } from "date-fns/locale";
import { Input } from "@/components/ui/input";

const tripTypes = [
    { label: "Syden", value: "syden" },
    { label: "Storbyferie", value: "storby" },
    { label: "Skiferie", value: "ski" },
    { label: "Eksotisk", value: "eksotisk" },
];

export const SearchForm = () => {
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState("");

    const form = useForm({
        defaultValues: {
            destination: "",
            dateFrom: "",
            dateTo: "",
            travelers: "",
        },
    });

    const allOptions = [
        {
            group: "Reisetype",
            items: tripTypes,
        },
        {
            group: "Land",
            items: Object.keys(citiesData).map((land) => ({
                label: land,
                value: land,
            })),
        },
        {
            group: "Sted",
            items: Object.entries(citiesData).flatMap(([land, byer]) =>
                byer.map((by) => ({
                    label: `${by}, ${land}`,
                    value: by,
                }))
            ),
        },
    ];

    function onSubmit(form) {
        console.log(form);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-center w-full h-full py-5 px-5 rounded-xl shadow bg-popover text-popover-foreground gap-y-3"
            >
                {/* Destination */}
                <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild className="w-full">
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between rounded-md py-5 px-5",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {selection ? selection : "Reisemål"}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-(--radix-popover-trigger-width) p-0 bg-popover text-popover-foreground"
                                >
                                    <Command>
                                        <CommandInput
                                            placeholder="Søk..."
                                            className="h-9 placeholder:text-muted-foreground"
                                        />
                                        <CommandList>
                                            <CommandEmpty>Ingen treff.</CommandEmpty>
                                            {allOptions.map((section) => (
                                                <CommandGroup key={section.group} heading={section.group}>
                                                    {section.items.map((opt) => (
                                                        <CommandItem
                                                            key={opt.value}
                                                            value={opt.label}
                                                            onSelect={() => {
                                                                setSelection(opt.label);
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            {opt.label}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto text-primary",
                                                                    selection === opt.label
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            ))}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex w-full items-center gap-x-3">
                    {/* Date From */}
                    <FormField
                        control={form.control}
                        name="dateFrom"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal rounded-md font-medium",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "d. MMMM yyyy", { locale: nb })
                                                ) : (
                                                    <span>Dato fra</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="flex w-(--radix-popover-trigger-width) p-0 justify-center bg-popover text-popover-foreground"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date > addYears(new Date(), 5)
                                            }
                                            captionLayout="dropdown"
                                            startMonth={new Date()}
                                            endMonth={addYears(new Date(), 5)}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date To */}
                    <FormField
                        control={form.control}
                        name="dateTo"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal rounded-md font-medium",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "d. MMMM yyyy", { locale: nb })
                                                ) : (
                                                    <span>Dato til</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="flex w-(--radix-popover-trigger-width) p-0 justify-center bg-popover text-popover-foreground"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date > addYears(new Date(), 5)
                                            }
                                            captionLayout="dropdown"
                                            startMonth={new Date()}
                                            endMonth={addYears(new Date(), 5)}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Travelers */}
                    <FormField
                        control={form.control}
                        name="travelers"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                                <Input
                                    type="number"
                                    placeholder="Hvor mange?"
                                    min={0}
                                    max={20}
                                    className="bg-background text-foreground"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button type="submit" className="w-fit bg-primary text-primary-foreground">
                        Søk
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default SearchForm;
