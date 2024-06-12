"use server";

import Razorpay from "razorpay";

export async function initiatePayment(amount: number) {
    const KEY_ID = process.env.RAZORPAY_KEY_ID ?? "razorpay key id not found";
    const KEY_SECRET =
        process.env.RAZORPAY_KEY_SECRET ?? "razorpay key secret not found";

    // console.log(KEY_ID, KEY_SECRET);

    const instance = new Razorpay({
        key_id: KEY_ID,
        key_secret: KEY_SECRET,
    });

    const order = await instance.orders.create({
        amount: amount,
        currency: "INR",
    });

    // console.log("initiated: ", order.id);

    return order;
}
