import db from "@/app/db/db";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { Download, RotateCcw } from "lucide-react";
import Link from "next/link";

// razorpay/purchase-success?
// productId=0cbdf5ac-6657-41fc-b466-b16cc5a30044&
// orderId=order_OL45ha2xD2o2ZI&
// tok=1b6a3134-270f-4901-b507-7a3050de5e89

export async function PaymentSuccess({
    productId,
    orderId,
    tok,
}: {
    productId: string;
    orderId: string;
    tok: string;
}) {
    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
    });

    const downloadVerification = await db.downloadVerification.findUnique({
        where: {
            id: tok,
        },
    });

    if (!product || !downloadVerification) {
        return (
            <div className="p-4 flex flex-col gap-4 justify-center items-center">
                <h1 className="text-destructive text-center text-4xl font-bold">
                    Something Went Wrong
                </h1>
                <p className="text-destructive text-center">
                    An Unknown Error Occoured
                </p>
                {/* <p className="text-muted-foreground text-center">
                Try getting the download link from orders page
            </p> */}
                <Button asChild>
                    <div className="flex items-center gap-2">
                        <Link href="/orders">Try Again</Link>
                        <RotateCcw className="w-4 h-4" />
                    </div>
                </Button>
            </div>
        );
    }
    return (
        <>
            <div className="flex flex-col gap-8 justify-center items-center">
                <div className="flex flex-col gap-4 justify-center items-center">
                    <h1 className="text-6xl text-center font-bold">
                        Payment Successful
                    </h1>
                    <p className="text-muted-foreground text-center">
                        You have succesfully purchased - {product.name}
                    </p>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">
                                {orderId}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(
                                    product.priceInPaise / 100 || 0
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={2}>Total Amount Paid</TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(
                                    product.priceInPaise / 100 || 0
                                )}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>

                <div className="mt-8">
                    <Button asChild>
                        <div className="flex items-center gap-2">
                            <a href={`/products/download/${tok}`}>
                                Download Now
                            </a>
                            <Download className="w-4 h-4" />
                        </div>
                    </Button>
                </div>
                <p className="text-destructive">
                    This link will expire at{" "}
                    {msToDHMS(
                        downloadVerification.expiresAt.getTime() - Date.now()
                    )}
                </p>
            </div>
        </>
    );
}

function msToDHMS(ms: number): string {
    // const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000);
    return hours + " hours " + minutes + " minutes " + sec + " seconds";
}
