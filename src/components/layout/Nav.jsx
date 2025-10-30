"use client";

import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export const Nav = () => {
    return (
        <NavigationMenu className="flex items-center list-none gap-1">
            <NavigationMenuItem>
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