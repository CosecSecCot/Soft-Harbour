import { formatCurrency, formatDate } from "@/lib/formatters";
import {
    Button,
    Column,
    Img,
    Row,
    Section,
    Text,
} from "@react-email/components";

type OrderInformationProps = {
    order: { id: string; createdAt: Date; pricePaidInPaise: number };
    product: { imagePath: string; name: string; description: string };
    downloadVerificationId: string;
};

export default function OrderInformation({
    order,
    product,
    downloadVerificationId,
}: OrderInformationProps) {
    return (
        <>
            <Section className="border border-solid border-gray-500 rounded-lg p-4">
                <Row>
                    <Column>
                        <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                            Order ID
                        </Text>
                        <Text className="text-gray-900 mr-4">{order.id}</Text>
                    </Column>
                    <Column>
                        <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                            Purchased On
                        </Text>
                        <Text className="text-gray-900 mr-4">
                            {formatDate(order.createdAt)}
                        </Text>
                    </Column>
                    <Column>
                        <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap">
                            Price Paid
                        </Text>
                        <Text className="text-gray-900">
                            {formatCurrency(order.pricePaidInPaise / 100 || 0)}
                        </Text>
                    </Column>
                </Row>
                <Img
                    width="65%"
                    alt={product.name}
                    src={`${process.env.NEXT_PUBLIC_URL}/${product.imagePath}`}
                />
                <Row className="mt-8">
                    <Column className="align-middle">
                        <Text className="text-lg text-gray-900 font-bold m-0 mr-4">
                            {product.name}
                        </Text>
                    </Column>
                    <Column align="right">
                        <Button
                            href={`${process.env.NEXT_PUBLIC_URL}/products/download/${downloadVerificationId}`}
                            className="bg-black text-white px-6 py-4 rounded text-lg"
                        >
                            Download
                        </Button>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Text className="text-gray-500 mb-0">
                            {product.description}
                        </Text>
                    </Column>
                </Row>
                {/* <Row>
                    <Column>
                        <Text className="text-s text-gray-100">
                            {crypto.randomUUID()}
                        </Text>
                    </Column>
                </Row> */}
            </Section>
        </>
    );
}
