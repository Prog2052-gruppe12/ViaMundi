import React from "react";
import { Nav } from "@/components/layout/Nav"
import { AuthButtons } from "@/components/layout/AuthButtons"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/common/Logo";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Menu } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export const Header = () => {
    return (
        <header
            className="sticky top-0 left-0 w-full h-20 px-4 md:px-16 lg:px-32 py-5 lg:mb-12 mb-6 flex items-center justify-center z-39 bg-card">
            <div className="max-w-[1700px] w-full h-full flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="xl:hidden w-10 h-10 rounded-md border border-transparent" />
                    {/*
                    <div className="hidden xl:block">
                        <Logo/>
                    </div>
                    */}
                    <Link href="/" className="text-2xl h-10 pt-0.75 font-bold text-accent rounded-md relative px-1">
                        <span className="">viamundi.no</span>
                    </Link>
                </div>

                {/* Center: Nav */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden xl:block">
                    <Nav />
                </div>



                {/* Right: Auth buttons */}
                <div className="flex items-center">
                    <AuthButtons />
                </div>
            </div>
        </header>

    )
}