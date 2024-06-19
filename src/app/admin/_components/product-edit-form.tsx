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
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { updateProductInDb } from "../_actions/products";
import { Product } from "@prisma/client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
    file: fileSchema.refine((file) => file.size > 0, "Required").optional(),
});

// async function urlToFile(url: string) {
//     const response = await fetch(url);
//     const blob = await response.blob();
//
//     console.log("URL: ", url);
//
//     const filetype = url.split(".").pop();
//     const fileName = url.split("/").pop();
//     const mimeType = "image/" + filetype;
//     return new File([blob], fileName ?? crypto.randomUUID().toString(), {
//         type: mimeType,
//     });
// }

export function ProductEditForm({ product }: { product: Product }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            priceInPaise: product.priceInPaise,
            file: undefined,
        },
    });

    const { edgestore } = useEdgeStore();
    const router = useRouter();

    const [imageFile, setImageFile] = useState<File | null>(null);
    // const [evaluatedPrice, setEvaluatedPrice] = useState("");

    // const [initialLoad, setInitialLoad] = useState(true);
    // const { data: retrievedImageFile, error } = useSwr(
    //     product.imagePath,
    //     urlToFile,
    //     { revalidateOnFocus: false, revalidateOnReconnect: false }
    // );
    // if (error) {
    //     router.refresh();
    // }
    // useEffect(() => {
    //     if (initialLoad && retrievedImageFile) {
    //         setImageFile(retrievedImageFile);
    //         setInitialLoad(false);
    //     }
    // }, [retrievedImageFile]);
    //

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatusMessage, setUploadStatusMessage] = useState("");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // setUploading(
        //     imageFile != null ||
        //         values.file != null ||
        //         values.name != product.name ||
        //         values.description != product.description ||
        //         values.priceInPaise != product.priceInPaise
        // );
        setUploading(true);
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
        } | null = null;

        if (imageFile) {
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
        }
        let fileUploadResult: {
            url: string;
            size: number;
            uploadedAt: Date;
            metadata: Record<string, never>;
            path: Record<string, never>;
            pathOrder: string[];
        } | null = null;
        if (values.file) {
            fileUploadResult = await edgestore.softhubProductFiles.upload({
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
        }
        console.log(values);

        setUploadStatusMessage("Uploading data to database ...");
        await updateProductInDb(
            product.id,
            {
                name: values.name,
                description: values.description,
                priceInPaise: values.priceInPaise,
            },
            fileUploadResult?.url,
            imageUploadResult?.url
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
                                <FormLabel>Upload New Product File</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        placeholder="Your Product File"
                                        onChange={(event) => {
                                            if (event.target.files) {
                                                onChange(event.target.files[0]);
                                            }
                                        }}
                                        {...fieldProps}
                                    />
                                </FormControl>
                                <FormDescription>
                                    If you do nott want to change the file, do
                                    not change this field.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Upload New Image
                        </div>
                        <div className="flex sm:flex-row flex-col gap-4 items-center">
                            <div className="relative text-center rounded-md overflow-hidden w-[300px] h-[300px]">
                                <Image
                                    src={product.imagePath}
                                    alt={`${product.name}_cover`}
                                    fill
                                />
                            </div>
                            <ArrowRight className="w-10 h-10" />
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
                    </div>
                    <Button
                        type="submit"
                        className="min-w-[10%]"
                        disabled={uploading}
                    >
                        {uploading ? "Saving..." : "Save"}
                    </Button>
                </form>
            </Form>
            <Button
                variant="outline"
                className="mt-4 min-w-[10%]"
                onClick={() => router.back()}
            >
                Reset
            </Button>
        </>
    );
}
