import { getDownloadUrl } from "@edgestore/react/utils";
import db from "@/app/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    const product = await db.product.findUnique({
        where: {
            id: id,
        },
        select: { filePath: true, name: true },
    });

    if (!product) return notFound();

    // const { size } = await fs.stat(product.filePath);
    // const file = await fs.readFile(product.filePath);
    const fileExtension = product.filePath.split(".").pop();

    console.log("URL: ", product.filePath);

    return NextResponse.redirect(
        getDownloadUrl(product.filePath, `${product.name}.${fileExtension}`)
    );

    // return new NextResponse(file, {
    //     headers: {
    //         "Content-type": `application/${fileExtension}`,
    //         "Content-Disposition": `attachment; filename="${product.name}.${fileExtension}"`,
    //         "Content-Length": file.length.toString(),
    //     },
    // });
}
