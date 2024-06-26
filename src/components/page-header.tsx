export default function PageHeader({
    children,
}: {
    children: React.ReactNode;
}) {
    return <h1 className="text-5xl font-semibold mb-4">{children}</h1>;
}
