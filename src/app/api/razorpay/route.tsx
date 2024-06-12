"use server";
import { createDownloadVerificationId } from "@/app/(customerFacing)/_actions/downloadVerification";
import db from "@/app/db/db";
import PurchaseReceiptEmail from "@/email/purchase-receipt";
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
        const product = await db.product.findUnique({
            where: {
                id: productId,
            },
        });
        const downloadVerificationId =
            await createDownloadVerificationId(productId);

        // with order, send email to user
        const resend = new Resend(process.env.RESEND_API_KEY ?? "");
        if (product) {
            await resend.emails.send({
                from: `Support <${process.env.SENDER_EMAIL}>`,
                to: email,
                subject: "Order Confirmation",
                react: (
                    <PurchaseReceiptEmail
                        order={order}
                        product={product}
                        downloadVerificationId={downloadVerificationId}
                    />
                ),
            });
        } else {
            await resend.emails.send({
                from: `Support <${process.env.SENDER_EMAIL}>`,
                to: email,
                subject: "Order Confirmation",
                react: (
                    <>
                        <h1>Payement Successful</h1>
                        <p>
                            Get the download link from{" "}
                            <strong>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_URL}/orders`}
                                >
                                    My Orders
                                </a>
                            </strong>{" "}
                            page
                        </p>
                    </>
                ),
            });
        }

        // http://localhost:3000/api/razorpay?productId=0cbdf5ac-6657-41fc-b466-b16cc5a30044&email=cosecseccot581@gmail.com&amount=42099

        const url = new URL(
            `${process.env.NEXT_PUBLIC_URL}/razorpay/purchase-success?productId=${productId}&orderId=${order.id}&tok=${downloadVerificationId}`,
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
