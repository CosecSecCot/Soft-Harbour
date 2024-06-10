import db from "@/app/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
    req: NextRequest,
    {
        params: { downloadVerificationId },
    }: { params: { downloadVerificationId: string } }
) {
    const data = await db.downloadVerification.findUnique({
        where: {
            id: downloadVerificationId,
            expiresAt: {
                gt: new Date(),
            },
        },
        select: {
            product: {
                select: {
                    filePath: true,
                    name: true,
                },
            },
        },
    });

    if (!data) {
        return NextResponse.redirect(
            new URL("/products/download/invalid", req.url)
        );
    }

    const { size } = await fs.stat(data.product.filePath);
    const file = await fs.readFile(data.product.filePath);
    const fileExtension = data.product.filePath.split(".").pop();

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename="${data.product.name}.${fileExtension}"`,
            "Content-Length": size.toString(),
        },
    });
}
