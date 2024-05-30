"use server";

import db from "@/app/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";

const fileSchema = z.instanceof(File);
const imageSchema = fileSchema.refine(
    // if filesize is not 0, i.e. when submitted a file, check its type
    (file) => file.size === 0 || file.type.startsWith("image/")
);

const newProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInPaise: z.coerce.number().int().min(0),
    file: fileSchema.refine((file) => file.size > 0, "Required"),
    image: imageSchema.refine((file) => file.size > 0, "Required"),
});

const editProductSchema = newProductSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional(),
});

export async function addProductAction(
    _prevState: unknown,
    formData: FormData
) {
    const result = newProductSchema.safeParse(
        /**
         * The name attribute should be same as the object keys in zod object
         * other wise it will not match and give you ZodError
         * */
        Object.fromEntries(formData.entries())
    );
    if (!result.success) {
        return result.error.formErrors.fieldErrors;
    }

    const productData = result.data;

    await fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${productData.file.name}`;
    // convert file into buffer so that nodejs can write it
    await fs.writeFile(
        filePath,
        Buffer.from(await productData.file.arrayBuffer())
    );

    await fs.mkdir("public/products", { recursive: true });
    // yaha / ka ho sakta hai kuchh
    const imagePath = `products/${crypto.randomUUID()}-${productData.image.name}`;
    await fs.writeFile(
        `public/${imagePath}`,
        Buffer.from(await productData.image.arrayBuffer())
    );

    await db.product.create({
        data: {
            isAvailableForPurchase: false,
            name: productData.name,
            description: productData.description,
            priceInPaise: productData.priceInPaise,
            filePath,
            imagePath,
        },
    });

    redirect("/admin/products");
}

export async function updateProductAction(
    productId: string,
    _prevState: unknown,
    formData: FormData
) {
    const result = editProductSchema.safeParse(
        /**
         * The name attribute should be same as the object keys in zod object
         * other wise it will not match and give you ZodError
         * */
        Object.fromEntries(formData.entries())
    );
    if (!result.success) {
        return result.error.formErrors.fieldErrors;
    }

    const newData = result.data;
    const productData = await findProductAction(productId);

    if (!productData) {
        return notFound();
    }

    let filePath = productData.filePath;
    if (newData.file && newData.file?.size > 0) {
        await fs.unlink(productData.filePath);
        filePath = `products/${crypto.randomUUID()}-${newData.file.name}`;
        // convert file into buffer so that nodejs can write it
        await fs.writeFile(
            filePath,
            Buffer.from(await newData.file.arrayBuffer())
        );
    }

    let imagePath = productData.imagePath;
    if (newData.image && newData.image?.size > 0) {
        await fs.unlink(`public/${productData.imagePath}`);
        imagePath = `products/${crypto.randomUUID()}-${newData.image.name}`;
        await fs.writeFile(
            `public/${imagePath}`,
            Buffer.from(await newData.image.arrayBuffer())
        );
    }

    await db.product.update({
        where: {
            id: productId,
        },
        data: {
            name: newData.name,
            description: newData.description,
            priceInPaise: newData.priceInPaise,
            filePath,
            imagePath,
        },
    });

    redirect("/admin/products");
}

export async function toggleProductAvailabilityAction(
    productId: string,
    isAvailableForPurchase: boolean
) {
    await db.product.update({
        where: { id: productId },
        data: {
            isAvailableForPurchase: isAvailableForPurchase,
        },
    });
}

export async function findProductAction(productId: string) {
    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
    });

    return product;
}

export async function deleteProductAction(productId: string) {
    const product = await db.product.delete({
        where: { id: productId },
    });

    if (product == null) {
        return notFound();
    }

    fs.unlink(product.filePath);
    fs.unlink(`public/${product.imagePath}`);
}
