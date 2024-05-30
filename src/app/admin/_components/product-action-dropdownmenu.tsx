import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

type ProductDropdownProps = {
    product_id: string;
    product_isAvailableForPurchase: boolean;
    product_order_count: number;
};
export default function ProductDropdownMenu({
    product_id,
    product_isAvailableForPurchase,
    product_order_count,
}: ProductDropdownProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <a
                            download
                            href={`/admin/products/${product_id}/download`}
                        >
                            Download
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setOpen(true)}>
                        Edit
                    </DropdownMenuItem>
                    <ActiveToggleDropdownItem
                        id={product_id}
                        isAvailableForPurchase={product_isAvailableForPurchase}
                    />
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem
                        id={product_id}
                        disabled={product_order_count > 0}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            <ProductEditDialog
                open={open}
                setOpen={setOpen}
                product_id={product_id}
            />
        </div>
    );
}
