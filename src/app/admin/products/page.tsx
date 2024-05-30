import { Button } from "@/components/ui/button";
import PageHeader from "../_components/page-header";
import Link from "next/link";
import db from "@/app/db/db";
import { CheckCircle2, Table, XCircle } from "lucide-react";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";

export default function AdminProductsPage() {
    return (
        <>
            <div className="flex justify-between gap-4">
                <PageHeader>Products</PageHeader>
                <Button asChild>
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>
            <ProductsTable />
        </>
    );
}

async function ProductsTable() {
    const products = await db.product.findMany({
        select: {
            id: true,
            name: true,
            priceInPaise: true,
            isAvailableForPurchase: true,
            _count: { select: { orders: true } },
        },
        orderBy: { name: "asc" },
    });

    if (products.length === 0) {
        return <p>No Products Found</p>;
    }

    // return (
    //     <Table>
    //         <TableHeader>
    //             <TableRow>
    //                 <TableHead className="w-0">
    //                     <span className="sr-only">Available For Purchase</span>
    //                 </TableHead>
    //                 <TableHead>Name</TableHead>
    //                 <TableHead>Price</TableHead>
    //                 <TableHead>Orders</TableHead>
    //                 <TableHead className="w-0">
    //                     <span className="sr-only">Available For Purchase</span>
    //                 </TableHead>
    //             </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //             {products.map((product) => {
    //                 return (
    //                     <TableRow key={product.id}>
    //                         <TableCell>
    //                             {product.isAvailableForPurchase ? (
    //                                 <>
    //                                     <CheckCircle2 className="text-primary" />
    //                                     <span className="sr-only">
    //                                         Available
    //                                     </span>
    //                                 </>
    //                             ) : (
    //                                 <>
    //                                     <XCircle className="text-destructive" />
    //                                     <span className="sr-only">
    //                                         Unavailable
    //                                     </span>
    //                                 </>
    //                             )}
    //                         </TableCell>
    //                         <TableCell>{product.name}</TableCell>
    //                         <TableCell>
    //                             {formatCurrency(
    //                                 product.priceInPaise / 100 || 0
    //                             )}
    //                         </TableCell>
    //                         <TableCell>{product._count.orders}</TableCell>
    //                         <TableCell>
    //                             <ProductDropdownMenu
    //                                 product_id={product.id}
    //                                 product_isAvailableForPurchase={
    //                                     product.isAvailableForPurchase
    //                                 }
    //                                 product_order_count={product._count.orders}
    //                             />
    //                         </TableCell>
    //                     </TableRow>
    //                 );
    //             })}
    //         </TableBody>
    //     </Table>
    // );

    return <div>TABLE</div>;
}
