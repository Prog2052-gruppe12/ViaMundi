"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DynamicBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <Breadcrumb className="mt-14 px-4 md:px-16 lg:px-32">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Hjem</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, i) => {
                    const href = "/" + segments.slice(0, i + 1).join("/");
                    const isLast = i === segments.length;

                    const name = decodeURIComponent(segment)
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());

                    return (
                        <div className="flex items-center gap-1">
                            {!isLast && segments.length >= 1 && <BreadcrumbSeparator/>}
                            <BreadcrumbItem key={href}>
                                <BreadcrumbLink asChild>
                                    <Link href={href}>{name}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
