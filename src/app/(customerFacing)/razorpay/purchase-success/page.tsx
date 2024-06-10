import db from "@/app/db/db";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { validateDownloadVerificationId } from "../../_actions/downloadVerification";

export default async function RazorpayPurchaseSuccessPage({
    searchParams: { productId, tok },
}: {
    searchParams: { productId: string; tok: string };
}) {
    if (!productId || !tok) {
        return notFound();
    }

    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
    });

    const validDownloadLink = await validateDownloadVerificationId(tok);

    if (
        !product ||
        !validDownloadLink ||
        product.id != validDownloadLink.productId
    ) {
        return notFound();
    }

    return (
        <div>
            <div>{`Product: ${product.name}`}</div>
            <Button asChild>
                <a href={`/products/download/${tok}`}>Download</a>
            </Button>
        </div>
    );
}
