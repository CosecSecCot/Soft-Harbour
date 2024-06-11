import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import db from "@/app/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import PageHeader from "@/components/page-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { DeleteDropDownItem } from "./_components/user-actions";
import { Button } from "@/components/ui/button";

function getUsers() {
    return db.user.findMany({
        select: {
            id: true,
            email: true,
            orders: { select: { pricePaidInPaise: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export default function UsersPage() {
    return (
        <>
            <PageHeader>Customers</PageHeader>
            <UsersTable />
        </>
    );
}

async function UsersTable() {
    const users = await getUsers();

    if (users.length === 0) return <p>No customers found</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            {formatNumber(user.orders.length)}
                        </TableCell>
                        <TableCell>
                            {formatCurrency(
                                user.orders.reduce(
                                    (sum, o) => o.pricePaidInPaise + sum,
                                    0
                                ) / 100
                            )}
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
                                    <DeleteDropDownItem id={user.id} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
