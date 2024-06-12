import OrderInformation from "./_components/order-information";
import {
    Html,
    Preview,
    Tailwind,
    Body,
    Container,
    Heading,
} from "@react-email/components";

type PurchaseReceiptEmailProps = {
    product: {
        name: string;
        description: string;
        imagePath: string;
    };
    order: { id: string; createdAt: Date; pricePaidInPaise: number };
    downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
    product: {
        name: "Sample Product Name",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, nesciunt veniam tempora minima voluptatum, dolore recusandae nostrum, dolor deserunt eius quas illo ad ipsam. Sapiente nesciunt inventore ipsum dolores quibusdam!",
        imagePath:
            "products/720a89c5-5968-431f-80f9-16b1330d998e-fba8cff0ca4e12cd3486fe2bdb383326.jpg",
    },
    order: {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInPaise: Math.random() * 100000,
    },
    downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
    product,
    order,
    downloadVerificationId,
}: PurchaseReceiptEmailProps) {
    return (
        <Html>
            <Preview>Download {product.name} and view receipt</Preview>
            <Tailwind>
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Heading>Purchase Receipt</Heading>
                        <OrderInformation
                            product={product}
                            order={order}
                            downloadVerificationId={downloadVerificationId}
                        />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
