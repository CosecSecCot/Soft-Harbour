import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import db from "@/app/db/db";
import { formatCurrency, formatDate } from "@/lib/formatters";
import PageHeader from "@/components/page-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { DeleteDropDownItem } from "./_components/OrderActions";
import { Button } from "@/components/ui/button";

function getOrders() {
    return db.order.findMany({
        select: {
            id: true,
            pricePaidInPaise: true,
            createdAt: true,
            product: { select: { name: true } },
            user: { select: { email: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export default function OrdersPage() {
    return (
        <>
            <PageHeader>Sales</PageHeader>
            <OrdersTable />
        </>
    );
}

async function OrdersTable() {
    const orders = await getOrders();

    if (orders.length === 0) return <p>No sales found</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="w-[15%]">Purchased On</TableHead>
                    <TableHead>Price Paid</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>{order.product.name}</TableCell>
                        <TableCell>{order.user.email}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                            {formatCurrency(order.pricePaidInPaise / 100)}
                        </TableCell>
                        <TableCell className="text-center">
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
                                    <DeleteDropDownItem id={order.id} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
