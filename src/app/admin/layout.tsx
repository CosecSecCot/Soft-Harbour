import { AdminNav, AdminNavLink } from "@/components/admin-nav";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminNav>
                <AdminNavLink href="/admin">Dashboard</AdminNavLink>
                <AdminNavLink href="/admin/products">Products</AdminNavLink>
                <AdminNavLink href="/admin/users">Customers</AdminNavLink>
                <AdminNavLink href="/admin/orders">Sales</AdminNavLink>
            </AdminNav>
            <Toaster />
            <div className="container my-6">{children}</div>
        </>
    );
}
