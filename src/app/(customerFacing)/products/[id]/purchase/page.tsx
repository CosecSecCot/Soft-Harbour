import { PaymentForm } from "@/app/(customerFacing)/_components/payment-form";
import db from "@/app/db/db";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPurchasePage({
    params: { id },
}: {
    params: { id: string };
}) {
    const product = await db.product.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            description: true,
            priceInPaise: true,
            imagePath: true,
        },
    });

    if (!product) {
        return notFound();
    }

    return (
        <main>
            <div className="flex flex-col justify-center gap-16">
                <div className="w-full flex flex-row-reverse gap-6 justify-center items-center">
                    <div className="relative lg:w-[25%] w-[50%] h-auto aspect-square">
                        <Image
                            alt={product.name + " cover_image"}
                            className="rounded-md object-cover"
                            src={`${product.imagePath}`}
                            fill
                        />
                    </div>
                    <div className="flex flex-col justify-center lg:w-[50%] w-[50%] gap-8">
                        <div>
                            <h1 className="sm:text-5xl text-4xl font-semibold mb-4 line-clamp-3 break-words">
                                {product.name}
                            </h1>
                            <p className="text-muted-foreground sm:line-clamp-4 line-clamp-2 break-words">
                                {product.description}
                            </p>
                        </div>
                        <div className="max-lg:hidden">
                            <TotalPrice priceInPaise={product.priceInPaise} />
                        </div>
                        {/* <Button className="max-lg:hidden">
                            <Link href={`/products/${id}/purchase`}>
                                Order Now
                            </Link>
                        </Button> */}
                    </div>
                </div>
                <div className="flex flex-col lg:items-center w-full gap-2 pb-8">
                    <div className="lg:hidden">
                        <TotalPrice priceInPaise={product.priceInPaise} />
                    </div>
                    <div className="lg:w-[70vw]">
                        <PaymentForm
                            amount={product.priceInPaise}
                            productId={product.id}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

function TotalPrice({ priceInPaise }: { priceInPaise: number }) {
    return (
        <div>
            <h3 className="text-2xl">Total Amount: </h3>
            <span className="text-[2.5rem] md:text-6xl">
                {formatCurrency(priceInPaise / 100)}
            </span>
        </div>
    );
}
