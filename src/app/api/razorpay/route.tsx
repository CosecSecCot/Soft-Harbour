"use server";
import { createDownloadVerification } from "@/app/(customerFacing)/_actions/downloadVerification";
import db from "@/app/db/db";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const body = Object.fromEntries(data);

    const paymentVerification = validatePaymentVerification(
        {
            order_id: body.razorpay_order_id.toString(),
            payment_id: body.razorpay_payment_id.toString(),
        },
        body.razorpay_signature.toString(),
        process.env.RAZORPAY_KEY_SECRET ?? ""
    );

    if (paymentVerification) {
        const productId = req.nextUrl.searchParams.get("productId");
        const email = req.nextUrl.searchParams.get("email");
        const amountString = req.nextUrl.searchParams.get("amount");

        if (!productId || !email || !amountString) {
            return NextResponse.json({
                success: false,
                message: "Invalid Request",
            });
        }

        const amount = parseInt(amountString);

        /*
         * WEBHOOKS SHOULD BE USED FOR VERIFYING IF PAYMENT HAS BEEN CAPTURED
         * THIS IS ONLY FOR EDUCATIONAL PURPOSED AND NOT SUPPOSED TO BE
         * RUN IN PRODUCTION
         * */
        const razorpayInstance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
            key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
        });

        const paymentStatus = await razorpayInstance.payments.fetch(
            body.razorpay_payment_id.toString()
        );

        if (
            paymentStatus.error_code != null ||
            paymentStatus.status == "failed"
        ) {
            return NextResponse.json({
                success: false,
                message: "Payment Unsuccessful",
            });
        } else {
            /*
             * there is no need to check authorized here,
             * but again this is supposed to be done with webhooks
             * it may take some time for authorized payments to be captured
             * and we dont want to continue if payment is not captured
             * here, I'm assuming all authorized payments will be captured
             * */
            if (
                !paymentStatus.captured &&
                paymentStatus.status != "authorized"
            ) {
                return NextResponse.json({
                    success: false,
                    message: "Payment not yet captured",
                });
            }
        }

        // Creating user
        const {
            orders: [order],
        } = await db.user.upsert({
            where: { email },
            create: {
                email,
                orders: {
                    create: {
                        productId,
                        pricePaidInPaise: amount,
                    },
                },
            },
            update: {
                email,
                orders: {
                    create: {
                        // this can be undefined also, need to handle before this
                        // method needs to be implemented
                        // id: body.razorpay_order_id.toString(),

                        productId,
                        pricePaidInPaise: amount,
                    },
                },
            },
            select: {
                orders: { orderBy: { createdAt: "desc" }, take: 1 },
            },
        });

        // with order, send email to user
        const resend = new Resend(process.env.RESEND_API_KEY ?? "");
        await resend.emails.send({
            from: `Support <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Order Confirmation",
            react: <h1>Payment Successfull</h1>,
        });

        const url = new URL(
            `${process.env.NEXT_PUBLIC_URL}/razorpay/purchase-success?productId=${productId}&orderId=${order.id}&tok=${await createDownloadVerification(productId)}`,
            req.url
        );

        return NextResponse.redirect(url);
    } else {
        return NextResponse.json({
            success: false,
            message: "Payment Verification Failed",
        });
    }
}
