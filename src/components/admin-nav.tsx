"use client";
import React, { ComponentProps } from "react";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CircleUser, Home, Menu, Package2, Search } from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import path from "path";

export function AdminNav({ children }: { children: React.ReactNode }) {
    return (
        // <nav className="sticky top-0 z-50 bg-primary bg-opacity-20 backdrop-blur-sm text-primary flex justify-between items-center pr-4">
        //     <div className="bg-secondary text-primary flex justify-start">
        //         {children}
        //     </div>
        //     <span>
        //         <ModeToggle />
        //         <span className="sr-only">Theme Button</span>
        //     </span>
        // </nav>

        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b dark:bg-background/60 bg-background/70 backdrop-blur px-4 md:px-6">
            <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Button
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    variant="ghost"
                    asChild
                >
                    <Link href="/">
                        <Home className="text-primary h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </Link>
                </Button>
                {children}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <>
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">
                                Toggle navigation menu
                            </span>
                        </>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="flex flex-col gap-12 text-lg font-medium">
                        <SheetHeader>
                            <SheetClose asChild>
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <Home className="h-6 w-6" />
                                    <span className="sr-only">Home</span>
                                </Link>
                            </SheetClose>
                        </SheetHeader>
                        <div className="flex flex-col gap-2 text-lg font-medium">
                            {React.Children.map(children, (child, index) => (
                                <SheetClose asChild key={index}>
                                    {child}
                                </SheetClose>
                            ))}
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="relative ml-auto flex-1 sm:flex-initial">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="bg-background/65 pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full"
                        >
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
            </div>
        </header>
    );
}

export function AdminNavLink(
    props: Omit<ComponentProps<typeof Link>, "className">
) {
    const pathName = usePathname();
    return (
        <Link
            {...props}
            // className={cn(
            //     "p-4 hover:bg-primary-foreground hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
            //     pathName === props.href ? "bg-background text-foreground" : ""
            // )}
            className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                pathName === props.href ? "text-foreground" : ""
            )}
        />
    );
}
