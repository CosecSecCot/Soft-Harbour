import db from "@/app/db/db";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({
    params: { id },
}: {
    params: { id: string };
}) {
    const product = await db.product.findUnique({
        where: {
            id: id,
        },
        select: {
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
            <div className="w-full flex md:flex-row flex-col gap-6 justify-center items-center">
                <div className="relative md:w-[40%] w-full h-auto aspect-square">
                    <Image
                        alt={product.name + " cover_image"}
                        className="rounded-md object-cover"
                        src={`/${product.imagePath}`}
                        fill
                    />
                </div>
                <div className="flex flex-col justify-center md:w-[40%] w-full gap-8">
                    <div>
                        <PageHeader>{product.name}</PageHeader>
                        <h2 className="text-2xl">
                            {formatCurrency(product.priceInPaise / 100)}
                        </h2>
                    </div>
                    <p className="text-muted-foreground break-words">
                        {product.description}
                    </p>
                    <Button asChild>
                        <Link href={`/products/${id}/purchase`}>Purchase</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
