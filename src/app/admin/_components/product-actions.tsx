"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
    deleteProductAction,
    toggleProductAvailabilityAction,
} from "../_actions/products";

export function ActiveToggleDropdownItem({
    id,
    isAvailableForPurchase,
}: {
    id: string;
    isAvailableForPurchase: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    return (
        <DropdownMenuItem
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    await toggleProductAvailabilityAction(
                        id,
                        !isAvailableForPurchase
                    );
                    router.refresh();
                });
            }}
        >
            {isAvailableForPurchase ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
    );
}

export function DeleteDropdownItem({
    id,
    disabled,
}: {
    id: string;
    disabled: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    return (
        <DropdownMenuItem
            variant="destructive"
            disabled={disabled || isPending}
            onClick={() => {
                startTransition(async () => {
                    await deleteProductAction(id);
                    router.refresh();
                });
            }}
        >
            Delete
        </DropdownMenuItem>
    );
}