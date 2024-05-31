import { AdminNav, AdminNavLink } from "@/components/admin-nav";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminNav>
                <AdminNavLink href="/">Home</AdminNavLink>
                <AdminNavLink href="/admin">Dashboard</AdminNavLink>
                <AdminNavLink href="/admin/products">Products</AdminNavLink>
                <AdminNavLink href="/admin/users">Customers</AdminNavLink>
                <AdminNavLink href="/admin/orders">Sales</AdminNavLink>
            </AdminNav>
            <div className="container my-6">{children}</div>
        </>
    );
}
