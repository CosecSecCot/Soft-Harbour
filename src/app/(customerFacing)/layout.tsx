import { AdminNav, AdminNavLink } from "@/components/admin-nav";

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminNav>
                <AdminNavLink href="/">Home</AdminNavLink>
                <AdminNavLink href="/products">Products</AdminNavLink>
                <AdminNavLink href="/orders">My Orders</AdminNavLink>
            </AdminNav>
            <div className="w-full mx-auto px-8 my-6">{children}</div>
        </>
    );
}
