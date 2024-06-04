"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema, onPaymentSubmit } from "../_actions/payment-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardDescription } from "@/components/ui/card";
import Image from "next/image";

export function PaymentForm({ amount }: { amount: number }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            payemntOption: "stripe",
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onPaymentSubmit.bind(null, amount))}
                className="space-y-4"
            >
                <h3 className={"text-2xl font-normal pt-8"}>
                    Personal Information
                </h3>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your name"
                                    required
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    required
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is email is required for you to access this
                                product. Make sure to fill your own email, or an
                                email trusted by you.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <h3 className={"text-2xl font-normal pt-4"}>
                    Select Payment Option
                </h3>
                <FormField
                    control={form.control}
                    name="payemntOption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    // className="flex flex-col gap-2 border-2 border-secondary rounded-sm"
                                >
                                    <Card className="flex flex-col gap-6 p-6 justify-center">
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    className="w-auto aspect-square"
                                                    value="stripe"
                                                />
                                            </FormControl>
                                            <FormLabel className="flex max-sm:flex-col sm:items-center sm:gap-4 font-normal">
                                                <Image
                                                    src={
                                                        "/Stripe_wordmark_-_slate.svg"
                                                    }
                                                    className="dark:invert"
                                                    alt="Stripe"
                                                    width={100}
                                                    height={100}
                                                />
                                                <FormDescription>
                                                    (Recommended for
                                                    International Payments)
                                                </FormDescription>
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    className="w-auto aspect-square"
                                                    value="razorpay"
                                                />
                                            </FormControl>
                                            <FormLabel className="flex max-sm:flex-col sm:items-center sm:gap-4 font-normal">
                                                <Image
                                                    src="/razorpay_logo.svg"
                                                    alt="RazorPay"
                                                    className="dark:invert-[0.25] dark:brightness-150 px-2 cursor-pointer"
                                                    width={125}
                                                    height={100}
                                                />
                                                <FormDescription>
                                                    (Recommended for UPI
                                                    Payments)
                                                </FormDescription>
                                            </FormLabel>
                                        </FormItem>
                                    </Card>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="max-md:w-full w-[25%]" type="submit">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
