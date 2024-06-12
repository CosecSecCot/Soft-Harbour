import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Tailwind,
} from "@react-email/components";
import OrderInformation from "./_components/order-information";
import React from "react";

type OrderHistoryEmailProps = {
    orders: {
        id: string;
        pricePaidInPaise: number;
        createdAt: Date;
        downloadVerificationId: string;
        product: {
            name: string;
            imagePath: string;
            description: string;
        };
    }[];
};

OrderHistoryEmail.PreviewProps = {
    orders: [
        {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            pricePaidInPaise: 10000,
            downloadVerificationId: crypto.randomUUID(),
            product: {
                name: "Product name",
                description:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, inventore delectus dolore voluptatem ea eum repellat temporibus perferendis ipsum beatae et, quam nesciunt, magnam quaerat illum doloremque atque quis suscipit!",
                imagePath:
                    "products/e4d6cc1d-dc42-4541-b903-fb976426a09c-pexels-pixabay-53594.jpg",
            },
        },
        {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            pricePaidInPaise: 2000,
            downloadVerificationId: crypto.randomUUID(),
            product: {
                name: "Product name 2",
                description:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, inventore delectus dolore voluptatem ea eum repellat temporibus perferendis ipsum beatae et, quam nesciunt, magnam quaerat illum doloremque atque quis suscipit!",
                imagePath:
                    "products/720a89c5-5968-431f-80f9-16b1330d998e-fba8cff0ca4e12cd3486fe2bdb383326.jpg",
            },
        },
    ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
    return (
        <Html>
            <Preview>Order History & Downloads</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Heading>Order History</Heading>
                        {orders.map((order, index) => (
                            <React.Fragment key={order.id}>
                                <OrderInformation
                                    order={order}
                                    product={order.product}
                                    downloadVerificationId={
                                        order.downloadVerificationId
                                    }
                                />
                                {index < orders.length - 1 && (
                                    <Hr className="my-4" />
                                )}
                            </React.Fragment>
                        ))}
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
