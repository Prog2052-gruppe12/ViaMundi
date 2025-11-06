"use client";

import { useRouter } from "next/navigation";

import React, {useEffect, useState} from "react";
import {CalendarIcon, Check, ChevronDown, ChevronRight, ChevronUp, MapPin, User, Trash, CircleX} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Form,
    FormControl,
    FormField,
    FormItem, FormLabel,
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
import {useIsMobile} from "@/hooks/use-mobile";
import LoadingPage from "@/app/loading";

const tripTypes = [
    { label: "Syden", value: "syden" },
    { label: "Storbyferie", value: "storby" },
    { label: "Skiferie", value: "ski" },
    { label: "Eksotisk", value: "eksotisk" },
];

export const SearchForm = () => {
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
            group: "Sted",
            items: Object.entries(citiesData).flatMap(([land, byer]) =>
                byer.map((by) => ({
                    label: `${land}, ${by}`,
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
        if (dateFromValue && dateTo && new Date(dateTo) <= new Date(dateFromValue)) {
            form.setValue("dateTo", undefined);
        }
    }, [dateFromValue]);

    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Validate schema manually
            formSchema.parse(data);

            const params = new URLSearchParams({
                destination: data.destination,
                dateFrom: data.dateFrom.toISOString(),
                dateTo: data.dateTo.toISOString(),
                travelers: data.travelers.toString(),
            });

            // If valid
            router.push(`/interesse?${params.toString()}`);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex xl:flex-row flex-col w-full h-full py-4 px-4 rounded-xl bg-card/20 ring-2 ring-card/30 text-popover-foreground gap-2"
            >
                {/* Destination */}
                <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => {
                        const [open, setOpen] = useState(false);
                        const isMobile = useIsMobile();

                        if (!isMobile) {
                            return (
                                <FormItem className="flex flex-col justify-start w-full xl:w-3/5 gap-y-1">
                                    <FormLabel className="font-bold text-sm text-card">Hvor går reisen?</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild className="w-full">
                                            <FormControl>
                                                <Button
                                                    variant="fake"
                                                    size="fake"
                                                    role="combobox"
                                                    className={cn(
                                                        "bg-card w-full justify-between rounded-md py-5 text-md",
                                                        open ? "cursor-default" : "cursor-pointer",
                                                        !field.value && "text-muted-foreground",
                                                        form.formState.errors.destination && "ring-[3px] ring-destructive/30"
                                                    )}
                                                >
                                                    <div className="flex flex-row items-center gap-3">
                                                        <MapPin strokeWidth={2.5} />
                                                        {field.value ? field.value : "Reisemål..."}
                                                    </div>

                                                    {open ? <ChevronUp /> : <ChevronDown />}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            align="center"
                                            className="w-(--radix-popover-trigger-width) p-0 bg-popover border-none text-popover-foreground"
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
                                                                    className={cn(
                                                                        selection === opt.label
                                                                            ? "bg-accent/0"
                                                                            : "bg-accent/0",
                                                                    )}
                                                                    key={opt.value}
                                                                    value={opt.label}
                                                                    onSelect={() => {
                                                                        if (field.value === opt.label) {
                                                                            // Uncheck if selecting same again
                                                                            field.value = "";
                                                                            field.onChange("");
                                                                        } else {
                                                                            // Otherwise select new
                                                                            field.value = opt.label;
                                                                            field.onChange(opt.label);
                                                                        }
                                                                        setOpen(true);
                                                                    }}
                                                                >
                                                                    <div className="w-6">
                                                                        <div className={cn(
                                                                            "size-4.5 border rounded-xs",
                                                                            field.value === opt.label
                                                                                ? "bg-accent/100 border-accent"
                                                                                : "bg-accent/0 border-primary/75 hover:bg-accent/20 cursor-pointer"
                                                                        )}>
                                                                            <Check
                                                                                strokeWidth={2.5}
                                                                                className={cn(
                                                                                    "text-primary-foreground",
                                                                                    field.value === opt.label
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {opt.label}

                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    ))}
                                                </CommandList>
                                            </Command>
                                            {/* Clear and close buttons */}
                                            <div className="bg-popover border-t w-full p-2 flex justify-between gap-2">
                                                <Button
                                                    type="button"
                                                    variant="default"
                                                    className="rounded-md"
                                                    size="sm"
                                                    onClick={() => {
                                                        setOpen(false);
                                                    }}
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
                                                            field.value = "";
                                                            field.onChange("");
                                                            setOpen(true);
                                                        }}
                                                    >
                                                        <Trash /> Tøm
                                                    </Button>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )
                        }

                        return (
                            <FormItem className="gap-y-1">
                                <FormLabel className="font-bold text-sm text-card">Hvor går reisen?</FormLabel>
                                <Drawer open={open} onOpenChange={setOpen} direction="bottom">
                                    <DrawerTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="fake"
                                                size="fake"
                                                role="combobox"
                                                className={cn(
                                                    "bg-card w-full justify-between rounded-md py-5 text-md",
                                                    open ? "cursor-default" : "cursor-pointer",
                                                    !field.value && "text-muted-foreground",
                                                    form.formState.errors.destination && "ring-[3px] ring-destructive/30"
                                                )}
                                            >
                                                <div className="flex flex-row items-center gap-3">
                                                    <MapPin strokeWidth={2.5} />
                                                    {field.value ? field.value : "Reisemål..."}
                                                </div>

                                                {open ? <ChevronUp /> : <ChevronDown />}
                                            </Button>
                                        </FormControl>
                                    </DrawerTrigger>
                                    <DrawerContent className="overflow-hidden border-none pt-1 h-fit">
                                        <div>
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
                                                                    className={cn(
                                                                        selection === opt.label
                                                                            ? "bg-accent/0"
                                                                            : "bg-accent/0",
                                                                    )}
                                                                    key={opt.value}
                                                                    value={opt.label}
                                                                    onSelect={() => {
                                                                        if (field.value === opt.label) {
                                                                            // Uncheck if selecting same again
                                                                            field.value = "";
                                                                            field.onChange("");
                                                                        } else {
                                                                            // Otherwise select new
                                                                            field.value = opt.label;
                                                                            field.onChange(opt.label);
                                                                        }
                                                                        setOpen(true);
                                                                    }}
                                                                >
                                                                    <div className="w-6">
                                                                        <div className={cn(
                                                                            "size-4.5 border rounded-xs",
                                                                            field.value === opt.label
                                                                                ? "bg-accent/100 border-accent"
                                                                                : "bg-accent/0 border-primary/75"
                                                                        )}>
                                                                            <Check
                                                                                strokeWidth={2.5}
                                                                                className={cn(
                                                                                    "text-primary-foreground",
                                                                                    field.value === opt.label
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {opt.label}

                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    ))}
                                                </CommandList>
                                                {/* Clear and close buttons */}
                                                <div className="bg-popover border-t w-full p-2 flex justify-between gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="default"
                                                        className="rounded-md"
                                                        size="sm"
                                                        onClick={() => {
                                                            setOpen(false);
                                                        }}
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
                                                                field.value = "";
                                                                field.onChange("");
                                                                setOpen(true);
                                                            }}
                                                        >
                                                            <Trash /> Tøm
                                                        </Button>
                                                    )}
                                                </div>
                                            </Command>

                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </FormItem>
                        )
                    }}
                />

                <div className="flex flex-col md:flex-row w-full items-center md:items-end gap-2">
                    <div className="flex flex-col sm:flex-row w-fit gap-2 w-full">
                        {/* Date From */}
                        <FormField
                            control={form.control}
                            name="dateFrom"
                            render={({ field }) => {
                                const [open, setOpen] = useState(false);

                                return (
                                    <FormItem className="flex flex-col justify-start w-full min-w-40 gap-y-1">
                                            <FormLabel className="font-bold text-sm text-card">Dato fra</FormLabel>
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="fake"
                                                            size="fake"
                                                            className={cn(
                                                                "bg-card w-full justify-between font-normal rounded-md text-md font-medium",
                                                                open ? "cursor-default" : "cursor-pointer",
                                                                !field.value && "text-muted-foreground",
                                                                form.formState.errors.dateFrom && "ring-[3px] ring-destructive/30"
                                                            )}
                                                        >
                                                            <div className="flex flex-row items-center gap-3">
                                                                <CalendarIcon strokeWidth={2.5}/>
                                                                {field.value ? (
                                                                    format(field.value, "d. MMM yyyy", {locale: nb})
                                                                ) : (
                                                                    <span>Velg...</span>
                                                                )}
                                                            </div>

                                                            {open ? <ChevronUp/> : <ChevronDown/>}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="flex flex-col w-fit p-0 justify-center bg-popover text-popover-foreground border-none"
                                                    align="start"
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
                                                    {/* Clear and close buttons */}
                                                    <div className="bg-popover border-t w-full p-2 flex justify-between gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="default"
                                                            className="rounded-md"
                                                            size="sm"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <CircleX/> Lukk
                                                        </Button>

                                                        {field.value && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="rounded-md"
                                                                size="sm"
                                                                onClick={() => {
                                                                    field.onChange(null);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                <Trash/> Tøm
                                                            </Button>
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                )
                            }}
                        />

                        {/* Date To */}
                        <FormField
                            control={form.control}
                            name="dateTo"
                            render={({ field }) => {
                                const [open, setOpen] = useState(false);

                                return (
                                    <FormItem className="flex flex-col justify-start w-full min-w-40 gap-y-1">
                                    <FormLabel className="font-bold text-sm text-card">Dato til</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="fake"
                                                    size="fake"
                                                    className={cn(
                                                        "bg-card w-full justify-between font-normal rounded-md text-md font-medium",
                                                        open ? "cursor-default" : "cursor-pointer",
                                                        !field.value && "text-muted-foreground",
                                                        form.formState.errors.dateFrom && "ring-[3px] ring-destructive/30"
                                                    )}
                                                >
                                                    <div className="flex flex-row items-center gap-3">
                                                        <CalendarIcon strokeWidth={2.5}/>
                                                        {field.value ? (
                                                            format(field.value, "d. MMM yyyy", {locale: nb})
                                                        ) : (
                                                            <span>Velg...</span>
                                                        )}
                                                    </div>

                                                    {open ? <ChevronUp/> : <ChevronDown/>}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="flex flex-col w-fit p-0 justify-center bg-popover text-popover-foreground border-none"
                                            align="end"
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
                                            {/* Clear and close buttons */}
                                            <div className="bg-popover border-t w-full p-2 flex justify-between gap-2">
                                                <Button
                                                    type="button"
                                                    variant="default"
                                                    className="rounded-md"
                                                    size="sm"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <CircleX/> Lukk
                                                </Button>

                                                {field.value && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="rounded-md"
                                                        size="sm"
                                                        onClick={() => {
                                                            field.onChange(null);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Trash/> Tøm
                                                    </Button>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                                )
                            }}
                        />
                    </div>

                    {/* Travelers */}
                    <FormField
                        control={form.control}
                        name="travelers"
                        render={({ field }) => (
                            <FormItem className="relative flex flex-col justify-start w-full md:w-2/5 min-w-32 gap-y-1">
                                <FormLabel className="font-bold text-sm text-card">Antall reisende</FormLabel>
                                <User strokeWidth={2.5}  className="absolute left-2.25 top-9 h-4" color={field.value ? "var(--foreground)" : "var(--muted-foreground)"} />
                                <Input
                                    type="number"
                                    placeholder="Antall..."
                                    min={0}
                                    max={20}
                                    className={cn(
                                        "w-full bg-card text-foreground text-md font-medium pl-10.25 rounded-md",
                                        form.formState.errors.travelers && "ring-[3px] ring-destructive/40"
                                    )}
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button
                        variant="secondary"
                        type="submit"
                        className="w-full md:w-fit mt-2"
                        disabled={loading}
                    >
                        Søk
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default SearchForm;
