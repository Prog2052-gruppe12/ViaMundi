"use client";

import React, { useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LocationView({ info, image }) {
    const router = useRouter();

    if (!info && !image) {
        return (<div className="h-16 w-full bg-primary/10 animate-pulse rounded-lg" />)
    }

    const location = info || {};

    const elements = {
        name: location?.["name"] || "Ukjent sted",
        groups: location?.["subcategory"] || [],
        rating: location?.["rating"] || "N/A",
        ratingInfo: location?.["ranking_data"]?.["ranking_string"] || "Ukjent rangering",
        ratingImage: location?.["rating_image_url"] || "N/A",
        ratingAmount: location?.["num_reviews"] || "0",
        description: location?.["description"] || "Ingen beskrivelse tilgjengelig",
        url: location?.["web_url"] || "#",
    }

    return (
        <Card className="shadow-none p-4 gap-4 bg-card">
            <div className="flex flex-row justify-between items-start w-full">
                <div className="flex flex-row gap-2 flex-wrap line-clamp-2">
                    <Badge>{elements.ratingInfo}</Badge>
                    {elements.groups.map((group, i) => (
                        <Badge key={i} variant="secondary">{group["localized_name"]}</Badge>
                    ))}
                </div>
                {/*}
                <a
                    href={elements.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit"
                >
                    <Button
                        size="sm"
                        variant="secondary"
                        className="w-fit h-fit !px-4 !py-1 rounded-lg text-xs"
                    >
                        Les mer <ArrowUpRight />
                    </Button>
                </a>
                */}
            </div>
            <div className="w-full flex flex-row gap-4">
                <div className="w-32 md:w-52 h-32 rounded-lg overflow-hidden">
                    <img src={image} alt="location image" className="w-full h-full object-cover object-center" />
                </div>
                <div className="flex-1 flex flex-col gap-x-4 gap-y-2 w-full">
                    <CardHeader className="px-0 gap-1">
                        <CardTitle className="text-lg font-medium break-words whitespace-normal line-clamp-1 text-pretty">
                            <a href={elements.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {elements.name}
                            </a>
                        </CardTitle>
                        <CardDescription className="flex flex-row">
                            <span className="text-primary font-semibold">{elements.rating}</span>
                            <img src={elements.ratingImage} alt="rating" />
                            ({elements.ratingAmount})
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-0 px-0 overflow-hidden">
                        <span className="break-words whitespace-normal h-15 line-clamp-3 text-pretty">
                            {!!elements.description ? elements.description : "Ingen beskrivelse"}
                        </span>
                    </CardContent>
                </div>
            </div>
            <CardFooter className="p-0">
                <p className="text-xs text-muted-foreground">Informasjon hentet fra © 2025 TripAdvisor</p>
            </CardFooter>
        </Card>
    )
}