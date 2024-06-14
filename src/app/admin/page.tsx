import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import db from "../db/db";
import { LineChart, Package, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

async function getSalesData() {
    const data = await db.order.aggregate({
        _sum: { pricePaidInPaise: true },
        _count: true,
    });

    return {
        amount: (data._sum.pricePaidInPaise || 0) / 100,
        numberOfSales: data._count,
    };
}

async function getUserData() {
    const [userCount, orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum: { pricePaidInPaise: true },
        }),
    ]);

    return {
        userCount,
        averageValuePerUser:
            userCount === 0
                ? 0
                : (orderData._sum.pricePaidInPaise || 0) / userCount / 100,
    };
}

async function getProductData() {
    const [activeCount, inactiveCount] = await Promise.all([
        db.product.count({
            where: { isAvailableForPurchase: true },
        }),
        db.product.count({
            where: { isAvailableForPurchase: false },
        }),
    ]);

    return {
        activeCount,
        inactiveCount,
    };
}

export default async function Home() {
    const [salesData, userData, productData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData(),
    ]);
    return (
        // <div className="flex flex-wrap gap-4 justify-evenly">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AdminDashboardCard
                title="Sales"
                body={formatCurrency(salesData.amount)}
                subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
                icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
            />
            <AdminDashboardCard
                title="Customers"
                body={`${formatCurrency(userData.averageValuePerUser)} Avg.`}
                subtitle={`${formatNumber(userData.userCount)} Users`}
                icon={<UserRound className="h-4 w-4 text-muted-foreground" />}
            />
            <AdminDashboardCard
                title="Active Products"
                subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
                body={`${formatNumber(productData.activeCount)} Active`}
                icon={<Package className="h-4 w-4 text-muted-foreground" />}
            />
        </div>
    );
}

type AdminDashboardCardProps = {
    title: string;
    subtitle: string;
    body: string;
    icon: React.ReactNode;
};

function AdminDashboardCard({
    title,
    subtitle,
    body,
    icon,
}: AdminDashboardCardProps) {
    return (
        <Card className="py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{body}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
        </Card>
    );
}
