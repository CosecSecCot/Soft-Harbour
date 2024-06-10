import db from "@/app/db/db";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { validateDownloadVerificationId } from "../../_actions/downloadVerification";
import { PaymentSuccess } from "../../_components/payment-status";

export default async function RazorpayPurchaseSuccessPage({
    searchParams: { productId, orderId, tok },
}: {
    searchParams: { productId: string; orderId: string; tok: string };
}) {
    if (!productId || !tok || !orderId) {
        return notFound();
    }

    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
    });

    const validDownloadLink = await validateDownloadVerificationId(tok);

    const orders = await db.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (
        !product ||
        !orders ||
        !validDownloadLink ||
        product.id != validDownloadLink.productId
    ) {
        return notFound();
    }

    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <PaymentSuccess tok={tok} orderId={orderId} productId={productId} />
        </div>
    );
}
