"use client";

import React from "react";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ArrowUpRight} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function LocationView({info, image}) {
    const router = useRouter();

    const location = info || {};
    if (!location) {
        return <div>Feil (ingen destinasjons info)</div>;
    }

    const elements = {
        name: location["name"],
        groups: location["subcategory"],
        rating: location["rating"],
        ratingInfo: location["ranking_data"]["ranking_string"],
        ratingImage: location["rating_image_url"],
        ratingAmount: location["num_reviews"],
        description: location["description"],
        url: location["web_url"],
    }

    console.log(elements.description);

    return (
        <Card>
            <div className="flex flex-row gap-2 flex-wrap px-6">
                <Badge>{elements.ratingInfo}</Badge>
                {elements.groups.map((group, i) => (
                    <Badge key={i} variant="secondary">{group["localized_name"]}</Badge>
                ))}
            </div>
            <div className="w-full px-6 flex flex-row gap-4">
                <div className="w-80 h-52 rounded-lg overflow-hidden">
                    <img src={image} alt="location image" className="w-full h-full object-cover object-center"/>
                </div>
                <div className="flex flex-col gap-x-4 gap-y-2 w-full h-52 max-h-52">
                    <CardHeader className="px-0">
                        <CardTitle className="text-2xl">{elements.name}</CardTitle>
                        <CardDescription className="flex flex-row">
                            <span className="text-primary font-semibold">{elements.rating}</span>
                            <img src={elements.ratingImage} alt="rating"/>
                            ({elements.ratingAmount})
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 px-0 overflow-hidden">
                        <p className="break-words whitespace-normal h-32 line-clamp-4 text-pretty">
                            {!!elements.description ? elements.description : "Ingen beskrivelse"}
                        </p>
                        <a
                            href={elements.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit"
                        >
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-fit h-fit !px-4 !py-1"
                            >
                                Les mer <ArrowUpRight/>
                            </Button>
                        </a>
                    </CardContent>
                </div>
            </div>
            <CardFooter>
                <p className="text-sm text-muted-foreground">Informasjon hentet fra © 2025 TripAdvisor</p>
            </CardFooter>
        </Card>
    )
}