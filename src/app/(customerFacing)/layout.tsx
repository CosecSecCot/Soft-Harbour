import { AdminNav, AdminNavLink } from "@/components/admin-nav";
import { Toaster } from "@/components/ui/toaster";

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminNav>
                <AdminNavLink href="/products">Products</AdminNavLink>
                <AdminNavLink href="/orders">My Orders</AdminNavLink>
            </AdminNav>
            <Toaster />
            <div className="w-full mx-auto px-8 my-6">{children}</div>
        </>
    );
}
