import type { Metadata } from "next";
// import { JetBrains_Mono as FontSans } from "next/font/google";
import { GeistSans as FontSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

// const fontSans = FontSans({
//     subsets: ["latin"],
//     variable: "--font-sans",
// });

export const metadata: Metadata = {
    title: "Soft Harbour",
    description: "An e-commerce website for distributing software online",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    // fontSans.variable
                    FontSans.variable
                )}
            >
                <EdgeStoreProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </EdgeStoreProvider>
            </body>
        </html>
    );
}
