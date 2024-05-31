"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ProductDisplayCardProps = {
    products: Product[];
};

export function ProductDisplayCard({ products }: ProductDisplayCardProps) {
    return (
        <>
            {products.length > 0 ? (
                products.map((product) => {
                    return (
                        <Card className=" overflow-hidden sm:w-[50vh] w-[35vh] cursor-pointer">
                            <Link
                                href={`products/${product.id}`}
                                className="flex flex-col justify-between h-full"
                            >
                                <div>
                                    <CardHeader>
                                        <CardTitle className="sm:text-3xl text-2xl">
                                            {product.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="relative w-full h-auto aspect-square">
                                            <Image
                                                alt={
                                                    product.name +
                                                    " cover_image"
                                                }
                                                className="rounded-md object-cover"
                                                src={`/${product.imagePath}`}
                                                fill
                                            />
                                        </div>
                                        <CardDescription className="w-full line-clamp-3 break-words">
                                            {product.description}
                                        </CardDescription>
                                    </CardContent>
                                </div>
                                <CardFooter>
                                    <div className="text-2xl font-medium">
                                        {formatCurrency(
                                            product.priceInPaise / 100
                                        )}
                                    </div>
                                </CardFooter>
                            </Link>
                        </Card>
                    );
                })
            ) : (
                <div className="w-full min-h-[50vh] flex justify-center items-center">
                    No products are available
                </div>
            )}
        </>
    );
}

export function ProductDisplayCardSkeleton() {
    return (
        <Card className="flex flex-col justify-between overflow-hidden w-[50vh]">
            <div>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="w-3/4 h-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="relative w-full h-auto aspect-video" />
                    <Skeleton className="w-full h-16" />
                </CardContent>
            </div>
            <CardFooter>
                <div className="flex w-full justify-between">
                    <Skeleton className="w-10 h-10" />
                    <Skeleton className="w-[50%] h-10" />
                </div>
            </CardFooter>
        </Card>
    );
}
