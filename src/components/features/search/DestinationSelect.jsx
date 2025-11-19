"use client";

import React, { useEffect, useState } from "react";
import { MapPin, ChevronDown, ChevronUp, Check, Trash, CircleX } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { allOptions } from "./constants";

export const DestinationSelect = ({ label, form }) => {
    const [loading, setLoading] = useState(true);

    const currentForm = form;

    const isMobile = useIsMobile();

    const [open, setOpen] = useState(false);

    const TriggerButton = ({ field }) => {
        return (
            <Button
                variant="fake"
                size="fake"
                role="combobox"
                className={cn(
                    "bg-card w-full justify-between rounded-md xl:rounded-l-md xl:rounded-r-none py-5 text-md",
                    open ? "cursor-default" : "cursor-pointer",
                    !field.value && "text-muted-foreground",
                    currentForm.formState.errors.destination && "ring-[3px] ring-destructive/30"
                )}
            >
                <div className="flex flex-row items-center gap-3">
                    <MapPin strokeWidth={2.5} />
                    {field.value ? field.value : "Reisemål..."}
                </div>

                {open ? <ChevronUp /> : <ChevronDown />}
            </Button>
        )
    };

    const DestinationList = ({ field }) => {
        return (
            allOptions.map((section) => (
                <CommandGroup key={section.group} heading={section.group}>
                    {section.items.map((opt) => (
                        <CommandItem
                            key={opt.value}
                            value={opt.label}
                            onSelect={() => {
                                if (field.value === opt.label) {
                                    // Uncheck if selecting same again
                                    field.value = "";
                                    field.onChange("");
                                    setOpen(true);
                                } else {
                                    // Otherwise select new
                                    field.value = opt.label;
                                    field.onChange(opt.label);
                                    setOpen(false);
                                }
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
            ))
        )
    };

    const ClearAndClose = ({ field, position }) => {
        return (
            <div className={cn(
                "bg-popover w-full p-2 flex justify-between gap-2",
                position === "top" ? "border-none" : "border-t",
            )
            }
            >
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
        )
    };

    return (
        <div className={cn(open && "overlay-active", "w-full xl:w-4/5 gap-y-1")}>
            <FormField
                control={currentForm.control}
                name="destination"
                render={({ field }) => {
                    if (!isMobile) {
                        return (
                            <FormItem className="flex flex-col justify-start w-full gap-y-1">
                                <FormLabel className="font-bold text-sm text-card">{label}</FormLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild className="w-full">
                                        <FormControl>
                                            {TriggerButton({ field })}
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
                                                {DestinationList({ field })}
                                            </CommandList>
                                            {ClearAndClose({ field })}
                                        </Command>
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
                                        {TriggerButton({ field })}
                                    </FormControl>
                                </DrawerTrigger>
                                <DrawerContent className="overflow-hidden border-none pt-1 h-fit">
                                    <div>
                                        <Command>
                                            {ClearAndClose({ field, position: "top" })}
                                            <CommandInput
                                                placeholder="Søk..."
                                                className="placeholder:text-muted-foreground text-md"
                                            />
                                            <CommandList className="max-h-96 min-h-96">
                                                <CommandEmpty>Ingen treff.</CommandEmpty>
                                                {DestinationList({ field })}
                                            </CommandList>
                                        </Command>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </FormItem>
                    )
                }}
            />
        </div>
    )
};
