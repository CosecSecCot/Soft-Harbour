import db from "@/app/db/db";

export async function createDownloadVerificationId(id: string) {
    return (
        await db.downloadVerification.create({
            data: {
                productId: id,
                // 24 hours from now
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
        })
    ).id;
}

export async function validateDownloadVerificationId(tok: string) {
    return db.downloadVerification.findUnique({
        where: {
            id: tok,
            expiresAt: {
                gt: new Date(),
            },
        },
    });
}
