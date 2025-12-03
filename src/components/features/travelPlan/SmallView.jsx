"use client";

import React, { useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SmallView({ info, image }) {
    //console.log(info);

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
        url: location?.["web_url"] || "#",
        address: location?.["address_obj"] || null,
    }

    return (
        <Card className="shadow-none p-4 gap-2 bg-card overflow-hidden flex-row">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex-row justify-between items-start w-full">
                    <div className="flex flex-row gap-2 flex-wrap line-clamp-2">
                        <Badge>{elements.ratingInfo}</Badge>
                        {Array.isArray(elements?.groups) && elements.groups.length > 0 &&
                            elements.groups.slice(0, 2).map((group, i) => (
                                <Badge key={i} variant="secondary">
                                    {group?.localized_name || "Ukjent gruppe"}
                                </Badge>
                            ))
                        }
                    </div>
                </div>
                <div className="w-full flex flex-row gap-4">
                    <div className="w-22 h-18 overflow-hidden rounded-lg">
                        {!image || !image?.data?.length > 0 ? (
                            <div className="w-full h-full bg-primary/10 animate-pulse" />
                        ) : (
                            console.log(image),
                            <img src={image} alt="location image" className="w-full h-full object-cover object-center" />
                        )}

                    </div>
                    <div className="flex-1 flex flex-col gap-x-4 gap-y-0">
                        <CardHeader className="px-0 gap-0">
                            <CardTitle className="text-lg font-medium break-words whitespace-normal line-clamp-1 text-pretty w-fit">
                                {elements.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col col h-full justify-between px-0 overflow-hidden">
                            <div className="flex flex-row">
                                <span className="text-primary font-semibold hidden sm:block">{elements.rating}</span>
                                <img src={elements.ratingImage} alt="rating" />
                                ({elements.ratingAmount})
                            </div>
                            <div>
                                {elements.address ? (
                                    //console.log(elements.address),
                                    <a
                                        className="text-muted-foreground underline underline-offset-2 break-words whitespace-normal line-clamp-1 text-pretty"
                                        href={elements.address["address_string"] ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(elements.address["address_string"])}` : "#"}
                                        target="_blank"
                                    >
                                        {elements.address["address_string"] || "Ingen adresse tilgjengelig"}
                                    </a>
                                ) : (
                                    <span>Ingen adresse tilgjengelig</span>
                                )}
                            </div>
                        </CardContent>
                    </div>
                </div>
            </div>
            <div className="flex items-start w-fit">
                <a
                    href={elements.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit"
                >
                    <Button
                        variant="outline"
                        className="w-fit h-fit !px-4 !py-1.5 text-sm border-primary text-primary"
                    >
                        Les mer <ArrowUpRight />
                    </Button>
                </a>
            </div>
        </Card>
    )
}