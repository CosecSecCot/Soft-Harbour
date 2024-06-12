import { z } from "zod";
import { initiatePayment } from "./razorpay-payment";

const paymentProviderSchema = z.enum(["stripe", "razorpay"]);

export const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    payemntOption: paymentProviderSchema,
});

export async function onPaymentSubmit(
    productId: string,
    amount: number,
    values: z.infer<typeof formSchema>
) {
    // console.log(values);
    // console.log(amount);
    // USER DB HANDLE

    if (values.payemntOption == "stripe") {
    } else {
        await payWithRazorPay(productId, values.name, values.email, amount);
    }
}

function loadScript(src: string): Promise<boolean> {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            console.log("razorpay loaded successfully");
            resolve(true);
        };
        script.onerror = () => {
            console.log("error in loading razorpay");
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

export async function payWithRazorPay(
    productId: string,
    name: string,
    email: string,
    amount: number
) {
    const order = await initiatePayment(amount);
    // console.log("frontend: ", order.id);
    const opts = {
        key_id: process.env.RAZORPAY_KEY_ID as string,
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Soft Harbour",
        description: "Test Transaction",
        image: "",
        order_id: order.id,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay?productId=${productId}&email=${email}&amount=${amount}`,
        prefill: {
            //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
            name: name, //your customer's name
            email: email,
        },
        notes: {
            // produtctId: productId,
            addinfo: "deez nuts",
        },
        theme: {
            color: "#000000",
        },
    };

    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        console.log("Razorpay SDK failed to load. Are you online?");
        return;
    }

    // All information is loaded in options which we will discuss later.
    const rzp1 = new window.Razorpay(opts);
    // to open razorpay checkout modal.
    rzp1.open();
}
