"use client";

import React, {useEffect, useState} from "react";
import {CalendarIcon, Check, ChevronDown, ChevronUp, MapPin, User} from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"

const tripTypes = [
    { label: "Syden", value: "syden" },
    { label: "Storbyferie", value: "storby" },
    { label: "Skiferie", value: "ski" },
    { label: "Eksotisk", value: "eksotisk" },
];

export const SearchForm = () => {
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState("");
    const [loading, setLoading] = useState(false);

    const dateToday = new Date();
    dateToday.setHours(0,0,0,0);
    const dateMax = addYears(dateToday, 5);
    dateMax.setHours(0,0,0,0);

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

    const formSchema = z
        .object({
            destination: z.string().min(1, "Velg et reisemål"),
            dateFrom: z.date({
                error: issue => issue.input === undefined ? "Velg startdato" : "Ugyldig dato"
            }),
            dateTo: z.date({
                error: issue => issue.input === undefined ? "Velg sluttdato" : "Ugyldig dato"
            }),
            travelers: z.coerce
                .number({
                    error: "Velg antall"
                })
                .int("Antall reisende må være et helt tall")
                .min(1, "Minimum 1 reisende")
                .max(10, "Maks 10 reisende"),
        })
        .refine(
            (data) => !data.dateTo || !data.dateFrom || data.dateTo >= data.dateFrom,
            {
                message: "Sluttdato må være etter startdato",
                path: ["dateTo"],
            }
        );

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            destination: "",
            dateFrom: undefined,
            dateTo: undefined,
            travelers: "",
        },
        shouldFocusError: false,
    });

    const dateFromValue = form.watch("dateFrom");

    useEffect(() => {
        const dateTo = form.getValues("dateTo");
        if (dateFromValue && dateTo && new Date(dateTo) < new Date(dateFromValue)) {
            form.setValue("dateTo", undefined);
        }
    }, [dateFromValue]);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const onSubmit = async (data) => {
        setLoading(true);
        await sleep(1000);
        try {
            // Validate schema manually
            formSchema.parse(data);

            // If valid
            console.log(data)
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex xl:flex-row flex-col w-full h-full py-5 px-5 rounded-xl border border-white/25 text-popover-foreground gap-3"
            >
                {/* Destination */}
                <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                        <FormItem className="w-full xl:w-2/3">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild className="w-full">
                                    <FormControl>
                                        <Button
                                            variant="fake"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between rounded-md py-5 text-md",
                                                !field.value && "text-muted-foreground",
                                                form.formState.errors.destination && "ring-[2px] ring-red-600"
                                            )}
                                        >
                                            <div className="flex flex-row items-center gap-3">
                                                <MapPin />
                                                {selection ? selection : "Reisemål"}
                                            </div>

                                            {open ? <ChevronUp /> : <ChevronDown />}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="center"
                                    className="w-(--radix-popover-trigger-width) p-1 bg-popover text-popover-foreground"
                                >
                                    <Command>
                                        <CommandInput
                                            placeholder="Søk..."
                                            className="placeholder:text-muted-foreground text-md"
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
                                                                field.onChange(opt.label);
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
                            <FormMessage className="font-medium text-destructive" />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col md:flex-row w-full items-center md:items-start gap-3">
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
                                                variant="fake"
                                                className={cn(
                                                    "w-full justify-start gap-3 font-normal rounded-md text-md font-medium",
                                                    !field.value && "text-muted-foreground",
                                                    form.formState.errors.dateFrom && "ring-[2px] ring-red-600"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {field.value ? (
                                                    format(field.value, "d. MMM yyyy", { locale: nb })
                                                ) : (
                                                    <span>Dato fra</span>
                                                )}

                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="flex w-fit p-0 justify-center bg-popover text-popover-foreground"
                                        align="center"
                                    >
                                        <Calendar
                                            mode="single"
                                            today={field.value}
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < dateToday || date > dateMax
                                            }
                                            captionLayout="dropdown"
                                            startMonth={dateToday}
                                            endMonth={dateMax}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage className="font-medium text-destructive" />
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
                                                variant="fake"
                                                className={cn(
                                                    "w-full justify-start gap-3 font-normal rounded-md text-md font-medium",
                                                    !field.value && "text-muted-foreground",
                                                    form.formState.errors.dateTo && "ring-[2px] ring-red-600"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {field.value ? (
                                                    format(field.value, "d. MMM yyyy", { locale: nb })
                                                ) : (
                                                    <span>Dato til</span>
                                                )}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="flex w-fit p-0 justify-center bg-popover text-popover-foreground"
                                        align="center"
                                    >
                                        <Calendar
                                            mode="single"
                                            today={dateFromValue}
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => {
                                                const min = dateFromValue ? new Date(dateFromValue) : dateToday;
                                                return date <= min || date > dateMax
                                            }}
                                            captionLayout="dropdown"
                                            startMonth={dateFromValue ? dateFromValue : dateToday}
                                            endMonth={dateMax}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage className="font-medium text-destructive" />
                            </FormItem>
                        )}
                    />

                    {/* Travelers */}
                    <FormField
                        control={form.control}
                        name="travelers"
                        render={({ field }) => (
                            <FormItem className="relative w-full items-center">
                                <User className="absolute left-2.25 top-3 h-4" color={field.value ? "var(--foreground)" : "var(--muted-foreground)"} />
                                <Input
                                    type="number"
                                    placeholder="Antall"
                                    min={0}
                                    max={20}
                                    className={cn(
                                        "w-full bg-white text-foreground text-md font-medium pl-10.25 rounded-md",
                                        form.formState.errors.travelers && "ring-[2px] ring-destructive"
                                    )}
                                    {...field}
                                />
                                <FormMessage className="font-medium text-destructive" />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-fit bg-primary text-primary-foreground"
                        disabled={loading}
                    >
                        {loading ? "Laster..." : "Søk"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default SearchForm;
