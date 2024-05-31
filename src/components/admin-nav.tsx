"use client";
import React, { ComponentProps } from "react";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminNav({ children }: { children: React.ReactNode }) {
    return (
        <nav className="bg-secondary text-primary flex justify-between items-center pr-4">
            <div className="bg-secondary text-primary flex justify-start">
                {children}
            </div>
            <span>
                <ModeToggle />
                <span className="sr-only">Theme Button</span>
            </span>
        </nav>
    );
}

export function AdminNavLink(
    props: Omit<ComponentProps<typeof Link>, "className">
) {
    const pathName = usePathname();
    return (
        <Link
            {...props}
            className={cn(
                "p-4 hover:bg-primary-foreground hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
                pathName === props.href ? "bg-background text-foreground" : ""
            )}
        />
    );
}
