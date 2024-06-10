import db from "@/app/db/db";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";

export default async function CustomerProductsPage() {
    const products = await db.product.findMany({
        where: { isAvailableForPurchase: true },
        // orderBy: {
        //     orders: {
        //         _count: "desc",
        //     },
        // },
    });

    return (
        <Table className="mx-auto max-w-[90vw]">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[15%]">
                        <span className="sr-only">Product Image</span>
                    </TableHead>
                    <TableHead className="w-[60%]">Product Details</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => {
                    return (
                        <>
                            <TableRow>
                                <TableCell>
                                    <Image
                                        alt={product.name + " cover_image"}
                                        className="rounded-md object-cover aspect-square"
                                        src={`/${product.imagePath}`}
                                        width={200}
                                        height={200}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-8 ">
                                        <div className="flex flex-col gap-2 ">
                                            <h2 className="text-3xl font-medium">
                                                {product.name}
                                            </h2>
                                            <p className="text-muted-foreground line-clamp-3">
                                                {product.description}
                                            </p>
                                        </div>
                                        <Button className="w-[20%]" asChild>
                                            <Link
                                                href={`/products/${product.id}`}
                                            >
                                                View Details
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <h3 className="text-2xl">
                                        {formatCurrency(
                                            product.priceInPaise / 100
                                        )}
                                    </h3>
                                </TableCell>
                            </TableRow>
                        </>
                    );
                })}
            </TableBody>
        </Table>
    );
}
