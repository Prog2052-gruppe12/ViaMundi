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
import {usePathname} from "next/navigation";

export const SidebarNav = () => {
    const pathname = usePathname();

    return (
            <Sidebar variant="floating" isMobile={true}>
                <SidebarContent className="px-2 py-6 h-fit">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-card text-3xl rounded-none px-1 py-3 pb-7 font-bold">ViaMundi</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="mt-2 gap-2">
                                {navData.map((item) => {
                                    const Icon = Icons[item.icon];
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive} // 👈 dynamic active state
                                                className={`text-card px-4 py-5 hover:bg-card/20 hover:text-card focus:bg-card/20 focus:text-card font-medium data-[active=true]:bg-card/20 data-[active=true]:text-primary-foreground${
                                                    isActive ? "bg-card/20 text-card font-semibold" : ""
                                                }`}
                                            >
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
