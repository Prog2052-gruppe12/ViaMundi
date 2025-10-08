"use client";

import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"

import { House } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export const Nav = () => {
    return (
        <NavigationMenu className="p-0 h-10 max-w-fit list-none gap-2">
            <NavigationMenuItem className="!h-full">
                <NavigationMenuLink href={"/"} asChild>
                    <Link href="/">Hjem</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/finn-reise" asChild>
                    <Link href="/finn-reise">Finn reise</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/sporsmal" asChild>
                    <Link href="/sporsmal">Spørsmål</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/teknologi" asChild>
                    <Link href="/teknologi">Teknologi</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/om-oss" asChild>
                    <Link href="/om-oss">Om oss</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
        </NavigationMenu>
    )
}