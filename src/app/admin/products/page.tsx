import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    CheckCircle2,
    MoreHorizontal,
    MoreVertical,
    XCircle,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/page-header";
import db from "@/app/db/db";
import {
    ActiveToggleDropdownItem,
    DeleteDropdownItem,
} from "../_components/product-actions";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
    return (
        <>
            <div className="flex justify-between items-center gap-4">
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

    if (products.length === 0) return <p>No products found</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">
                        {/* <span className="sr-only">Available For Purchase</span> */}
                        Status
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                            {product.isAvailableForPurchase ? (
                                <>
                                    {/* <span className="sr-only">Available</span> */}
                                    {/* <CheckCircle2 /> */}
                                    <Badge variant="default">Active</Badge>
                                </>
                            ) : (
                                <>
                                    {/* <span className="sr-only">Unavailable</span> */}
                                    {/* <XCircle className="stroke-destructive" /> */}
                                    <Badge variant="destructive">
                                        Inactive
                                    </Badge>
                                </>
                            )}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                            {formatCurrency(product.priceInPaise / 100)}
                        </TableCell>
                        <TableCell>
                            {formatNumber(product._count.orders)}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <a
                                            download
                                            href={`/admin/products/${product.id}/download`}
                                        >
                                            Download
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                        >
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <ActiveToggleDropdownItem
                                        id={product.id}
                                        isAvailableForPurchase={
                                            product.isAvailableForPurchase
                                        }
                                    />
                                    <DropdownMenuSeparator />
                                    <DeleteDropdownItem
                                        productId={product.id}
                                        disabled={product._count.orders > 0}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
