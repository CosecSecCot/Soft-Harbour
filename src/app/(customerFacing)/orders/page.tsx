"use client";
import PageHeader from "@/components/page-header";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sendOrderHistory } from "@/actions/orders";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
    email: z.string().email(),
});

export default function MyOrdersPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const [pending, setPending] = useState(false);
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setPending(true);
        const result = await sendOrderHistory(values.email);
        if (result.message == "success") {
            toast({
                title: "Email has been sent successfully!",
                description: "Check your email for order history.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description:
                    "There was a problem sending the email. Try Again.",
            });
        }
        setPending(false);
    }

    return (
        <main>
            <div className="sm:w-[80vw] sm:container">
                <Card>
                    <CardHeader>
                        <PageHeader>My Orders</PageHeader>
                        <CardDescription>
                            Fill in your email to view your order history and
                            get download links for all your orders.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your Email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={pending}>
                                    {pending ? "Sending..." : "Send"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
