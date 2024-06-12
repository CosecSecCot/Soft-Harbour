import db from "@/app/db/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { ArrowRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function CustomerProductsPage() {
    // move to actions and implement sorting and filtering
    const products = await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: {
            orders: {
                _count: "desc",
            },
        },
    });

    return (
        <div className="lg:max-w-[70vw] mx-auto flex flex-col md:gap-4 gap-8">
            {products.map((product) => {
                return (
                    <Card
                        className="transition ease-in-out hover:bg-primary-foreground duration-300"
                        key={product.id}
                    >
                        <Link
                            href={`/products/${product.id}`}
                            className="flex md:flex-row flex-col items-center gap-4"
                        >
                            <CardHeader className="lg:w-[30%] md:w-[40%] w-full">
                                <div className="relative w-full h-auto aspect-square">
                                    <Image
                                        alt={product.name + " cover_image"}
                                        className="rounded-lg object-cover aspect-square"
                                        src={`/${product.imagePath}`}
                                        fill
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="lg:w-[70%] md:w-[60%] w-full flex flex-col gap-4 md:pl-0 pr-8 md:py-8">
                                <div className="w-full flex flex-col gap-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-3xl font-bold">
                                            {product.name}
                                        </CardTitle>
                                        <h3 className="text-xl font-normal text-left">
                                            {formatCurrency(
                                                product.priceInPaise / 100 || 0
                                            )}
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground line-clamp-3 break-words">
                                        {product.description}
                                    </p>
                                    <Button
                                        className="w-fit"
                                        variant="ghost"
                                        asChild
                                    >
                                        <div className="flex items-center gap-2">
                                            <div>View Details</div>
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                );
            })}
        </div>
    );
}
