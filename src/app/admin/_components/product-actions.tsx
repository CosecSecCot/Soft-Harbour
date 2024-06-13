"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
    deleteProductAction,
    findProductInDb,
    toggleProductAvailabilityAction,
} from "../_actions/products";
import { useEdgeStore } from "@/lib/edgestore";
import { useToast } from "@/components/ui/use-toast";

export function ActiveToggleDropdownItem({
    id,
    isAvailableForPurchase,
}: {
    id: string;
    isAvailableForPurchase: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();
    return (
        <DropdownMenuItem
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    toast({
                        title: `${isAvailableForPurchase ? "Deactivating" : "Activating"} Product ...`,
                    });
                    await toggleProductAvailabilityAction(
                        id,
                        !isAvailableForPurchase
                    );
                    toast({
                        title: `Product ${isAvailableForPurchase ? "Deactivated" : "Activated"}!`,
                    });
                    router.refresh();
                });
            }}
        >
            {isAvailableForPurchase ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
    );
}

export function DeleteDropdownItem({
    productId,
    disabled,
}: {
    productId: string;
    disabled: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { edgestore } = useEdgeStore();
    const router = useRouter();
    return (
        <DropdownMenuItem
            variant="destructive"
            disabled={disabled || isPending}
            onClick={() => {
                startTransition(async () => {
                    const product = await findProductInDb(productId);
                    if (!product) {
                        router.refresh();
                        return;
                    }

                    toast({
                        title: "Deleting Product ...",
                    });

                    await edgestore.softhubProductImages.delete({
                        url: product.imagePath,
                    });
                    await edgestore.softhubProductFiles.delete({
                        url: product.filePath,
                    });
                    const res = await deleteProductAction(productId);
                    if (!res) {
                        toast({
                            variant: "destructive",
                            title: "Something Went Wrong!",
                            description: "Please try again.",
                        });
                    }
                    router.refresh();
                    toast({
                        title: "Product Deleted!",
                    });
                });
            }}
        >
            Delete
        </DropdownMenuItem>
    );
}
