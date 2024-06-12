"use server";

import db from "@/app/db/db";

type OrderDetailsProps = {
    userEmail: string;
    onLoadCallback: () => void;
};

export default async function OrderDetails({
    userEmail,
    onLoadCallback,
}: OrderDetailsProps) {
    const userDetails = await db.user.findUnique({
        where: {
            email: userEmail,
        },
        select: {
            email: true,
            orders: {
                select: {
                    pricePaidInPaise: true,
                    id: true,
                    createdAt: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            imagePath: true,
                        },
                    },
                },
            },
        },
    });

    if (!userDetails) {
        return <div>USER NOT FOUND</div>;
    }

    onLoadCallback();
}
