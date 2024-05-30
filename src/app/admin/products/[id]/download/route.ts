import { findProductAction } from "@/app/admin/_actions/products";
import db from "@/app/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { headers } from "next/headers";

export async function GET(
    req: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    const product = await db.product.findUnique({
        where: {
            id: id,
        },
        select: { filePath: true, name: true },
    });

    if (!product) return notFound();

    const { size } = await fs.stat(product.filePath);
    const file = await fs.readFile(product.filePath);
    const fileExtension = product.filePath.split(".").pop();

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename="${product.name}.${fileExtension}"`,
            "Content-Length": size.toString(),
        },
    });
}
