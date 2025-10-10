import React from "react";
import {Nav} from "@/components/layout/Nav"
import {AuthButtons} from "@/components/layout/AuthButtons"
import {Button} from "@/components/ui/button"
import {Logo} from "@/components/common/Logo";
import {SidebarNav} from "@/components/layout/SidebarNav";
import {Menu} from "lucide-react";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

export const Header = () => {
    return (
        <header
            className=" top-0 left-0 w-full h-20 px-4 md:px-16 lg:px-32 py-5 flex items-center justify-between bg-card/50 backdrop-blur-md shadow">
            {/* Left: Logo */}
            <div className="flex items-center gap-5">
                <SidebarTrigger className="xl:hidden w-10 h-10 rounded-md" />
                <Logo/>
            </div>

            {/* Center: Nav */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden xl:block">
                <Nav/>
            </div>

            {/* Right: Auth buttons */}
            <div className="flex items-center">
                <AuthButtons/>
            </div>
        </header>

    )
}