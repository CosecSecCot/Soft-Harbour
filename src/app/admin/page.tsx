import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import db from "../db/db";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AdminDashboardCard
                title="Sales"
                subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
                body={formatCurrency(salesData.amount)}
            />
            <AdminDashboardCard
                title="Customers"
                subtitle={`${formatNumber(userData.userCount)} Users`}
                body={`${formatCurrency(userData.averageValuePerUser)} per customer`}
            />
            <AdminDashboardCard
                title="Active Products"
                subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
                body={`${formatNumber(productData.activeCount)} Active`}
            />
        </div>
    );
}

type AdminDashboardCardProps = {
    title: string;
    subtitle: string;
    body: string;
};

function AdminDashboardCard({
    title,
    subtitle,
    body,
}: AdminDashboardCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    );
}
