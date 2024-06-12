"use server";

import db from "@/app/db/db";
import OrderHistoryEmail from "@/email/order-history";
import { Resend } from "resend";

export async function sendOrderHistory(userEmail: string): Promise<{
    message: "success" | "error";
}> {
    const user = await db.user.findUnique({
        where: {
            email: userEmail,
        },
        select: {
            email: true,
            orders: {
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    pricePaidInPaise: true,
                    id: true,
                    createdAt: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            imagePath: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        return {
            message: "success",
        };
    }

    const orders = user.orders.map(async (order) => {
        return {
            ...order,
            downloadVerificationId: (
                await db.downloadVerification.create({
                    data: {
                        expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
                        productId: order.product.id,
                    },
                })
            ).id,
        };
    });

    const resend = new Resend(process.env.RESEND_API_KEY as string);
    const data = await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject: "Order History",
        react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
    });

    if (data.error) {
        return {
            message: "error",
        };
    }

    return {
        message: "success",
    };
}
