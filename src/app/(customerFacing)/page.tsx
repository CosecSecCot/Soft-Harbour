import { Product } from "@prisma/client";
import db from "../db/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Suspense } from "react";
import {
    ProductDisplayCard,
    ProductDisplayCardSkeleton,
} from "./_components/product-display-card";

async function getPopularProducts() {
    return await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: {
            orders: {
                _count: "desc",
            },
        },
    });
}

async function getNewestProducts() {
    return await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export default function Home() {
    return (
        <main>
            <div className="flex flex-col gap-4">
                <ProductsSection
                    title="Most Popular"
                    productsFetcher={getPopularProducts}
                />
                <ProductsSection
                    title="Newest Products"
                    productsFetcher={getNewestProducts}
                />
            </div>
        </main>
    );
}

type ProductSectionProps = {
    title: string;
    productsFetcher: () => Promise<Product[]>;
};

function ProductsSection({ title, productsFetcher }: ProductSectionProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4">
                <h2 className="text-4xl font-semibold">{title}</h2>
                <Button variant="ghost" asChild>
                    <Link href="/products" className="flex gap-2">
                        View All
                        <ArrowUpRight />
                    </Link>
                </Button>
            </div>
            <ScrollArea className="w-full">
                <div className="flex gap-4 w-full h-auto rounded-md p-4">
                    <Suspense
                        fallback={
                            <>
                                <ProductDisplayCardSkeleton />
                                <ProductDisplayCardSkeleton />
                                <ProductDisplayCardSkeleton />
                            </>
                        }
                    >
                        <ServerProductDisplayCard
                            productsFetcher={productsFetcher}
                        />
                    </Suspense>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}

type ServerProductDisplayCardProps = {
    productsFetcher: () => Promise<Product[]>;
};

async function ServerProductDisplayCard({
    productsFetcher,
}: ServerProductDisplayCardProps) {
    const products = await productsFetcher();
    return <ProductDisplayCard products={products} />;
}
