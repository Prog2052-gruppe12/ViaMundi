import React from "react";
import {Card, CardContent} from "@/components/ui/card";

export const Section = (props) => {
    const type = props.type;
    let bgColor = "bg-gradient-primary"
    if (type === "secondary") {
        bgColor = "bg-gradient-secondary"
    } else if (type === "transparent") {
        bgColor = "bg-transparent";
    }
    return (
        <section className="w-full px-4 md:px-16 lg:px-32 pt-2">
            <Card className={`px-4 md:px-6 lg:px-16 2xl:px-32 py-12 overflow-hidden rounded-2xl shadow-md border-none ${bgColor}`}>
                <CardContent className="flex flex-col p-0 gap-y-8">
                    {props.children}
                </CardContent>
            </Card>
        </section>
    )
}