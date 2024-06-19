"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SingleImageDropzone } from "./single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { addProductToDb } from "../_actions/products";

const fileSchema = z.instanceof(File, {
    message: "invalid File",
});
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be atleast 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Product description must be atleast 10 words.",
    }),
    priceInPaise: z.coerce.number().int().min(0, {
        message: "Price must be greater than or equal to 0",
    }),
    file: fileSchema.refine((file) => file.size > 0, "Required"),
});

export function ProductForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            priceInPaise: undefined,
            file: undefined,
        },
    });

    const { edgestore } = useEdgeStore();
    const { toast } = useToast();
    const router = useRouter();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [evaluatedPrice, setEvaluatedPrice] = useState("");

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatusMessage, setUploadStatusMessage] = useState("");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // values.priceInPaise = Math.round(values.priceInPaise * 100);
        let imageUploadResult: {
            url: string;
            thumbnailUrl: string | null;
            size: number;
            uploadedAt: Date;
            metadata: Record<string, never>;
            path: {
                type: string;
            };
            pathOrder: "type"[];
        };

        if (imageFile) {
            setUploading(true);
            imageUploadResult = await edgestore.softhubProductImages.upload({
                file: imageFile,
                input: { type: "cover" },
                // options: {
                //     temporary: true,
                // },
                onProgressChange: (progress) => {
                    setUploadProgress(progress);
                    setUploadStatusMessage("Uploading Cover Image ...");
                },
            });
            console.log(imageUploadResult.url);
        } else {
            toast({
                variant: "destructive",
                title: "Cover image is reqired!",
                description: "Please upload a cover image.",
            });
            return;
        }
        const fileUploadResult = await edgestore.softhubProductFiles.upload({
            file: values.file,
            // options: {
            //     temporary: true,
            // },
            onProgressChange: (progress) => {
                setUploadProgress(progress);
                setUploadStatusMessage("Uploading Product File ...");
            },
        });
        console.log(fileUploadResult.url);
        console.log(values);

        setUploadStatusMessage("Uploading data to database ...");
        await addProductToDb(
            {
                name: values.name,
                description: values.description,
                priceInPaise: values.priceInPaise,
            },
            fileUploadResult.url,
            imageUploadResult.url
        );

        router.push("/admin/products");
        setUploading(false);
    }

    return (
        <>
            <AlertDialog open={uploading}>
                <AlertDialogContent className="w-11/12 sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Uploading Content</AlertDialogTitle>
                        <AlertDialogDescription>
                            This may take a while, be patient with us.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div>
                        <Progress value={uploadProgress} className="w-full" />
                    </div>
                    <AlertDialogFooter>
                        {uploadStatusMessage} {uploadProgress}%
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Name of your product"
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
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your product in atleast 10 words ..."
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
                        name="priceInPaise"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (in INR)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Price of your product in INR."
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
                        name="file"
                        render={({
                            field: { value, onChange, ...fieldProps },
                        }) => (
                            <FormItem>
                                <FormLabel>Product File</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        placeholder="Your Product File"
                                        onChange={(event) => {
                                            if (event.target.files) {
                                                onChange(event.target.files[0]);
                                            }
                                        }}
                                        required
                                        {...fieldProps}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Upload Image
                        </div>
                        <SingleImageDropzone
                            width={300}
                            height={300}
                            value={imageFile ? imageFile : undefined}
                            disabled={uploading}
                            onChange={(file) =>
                                setImageFile(file ? file : null)
                            }
                        />
                    </div>
                    <Button type="submit" disabled={uploading}>
                        {uploading ? "Saving..." : "Save"}
                    </Button>
                </form>
                {}
            </Form>
        </>
    );
}
