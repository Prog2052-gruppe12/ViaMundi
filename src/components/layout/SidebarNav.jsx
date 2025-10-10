"use client";

import Link from "next/link";
import * as Icons from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarProvider, SidebarSeparator
} from "@/components/ui/sidebar";

import navData from "@/assets/navLinks.json";

export const SidebarNav = () => {
    return (
            <Sidebar variant="floating" isMobile={true}>
                <SidebarContent className="p-4">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-card text-2xl rounded-none px-1 py-3 pb-7 border-b border-card/20 font-bold">ViaMundi</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="mt-4 gap-3">
                                {navData.map((item) => {
                                    const Icon = Icons[item.icon];
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                className="text-card rounded-full px-4 py-4.5 bg-card/20 hover:bg-card/40 hover:text-card focus:bg-card/20 focus:text-card font-medium">
                                                <Link href={item.url}>
                                                    {Icon && <Icon className="mr-2 h-4 w-4"/>}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
    );
};

export default SidebarNav;
