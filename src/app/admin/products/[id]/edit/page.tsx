import PageHeader from "@/components/page-header";
import { ProductEditForm } from "@/app/admin/_components/product-edit-form";
import db from "@/app/db/db";
import { notFound } from "next/navigation";

export default async function EditProductPage({
    params: { id },
}: {
    params: { id: string };
}) {
    const product = await db.product.findUnique({
        where: {
            id: id,
        },
    });

    if (!product) {
        return notFound();
    }

    return (
        <>
            <PageHeader>Edit Product</PageHeader>
            <ProductEditForm product={product} />
        </>
    );
}
