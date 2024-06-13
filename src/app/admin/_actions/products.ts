"use server";

import db from "@/app/db/db";

export async function addProductToDb(
    productData: {
        name: string;
        description: string;
        priceInPaise: number;
    },
    filePath: string,
    imagePath: string
) {
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
}

export async function updateProductInDb(
    productId: string,
    newData: {
        name?: string;
        description?: string;
        priceInPaise?: number;
    },
    filePath?: string,
    imagePath?: string
) {
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

export async function findProductInDb(productId: string) {
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

    if (!product) {
        return false;
    }

    return true;
}
