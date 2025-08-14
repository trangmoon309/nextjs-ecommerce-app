import sampleData from '@/db/sample-data';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

require('dotenv').config();

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: '123',
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    paymentMethod: 'Stripe',
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Main Street',
      city: 'Anytown',
      country: 'USA',
      postalCode: '12345',
    },
    createdAt: new Date(),
    totalPrice: '100',
    taxPrice: '10',
    shippingPrice: '5',
    itemsPrice: '100',
    orderitems: sampleData.products.map((product) => ({
      name: product.name,
      orderId: '123',
      productId: '123',
      slug: product.slug,
      qty: product.stock,
      image: product.images[0],
      price: product.price.toString(),
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    // paymentResult: {
    //   id: '123',
    //   status: 'succeeded',
    //   pricePaid: '100',
    //   email_address: 'john.doe@example.com',
    // },
  },
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
});

type OrderInformationProps = {
  order: Order;
};

export default function PurchaseReceiptEmail({ order }: { order: Order }) {
  return (
    <Html>
      <Preview>Your order has been received!</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Order ID
                  </Text>
                  <Text className="mb-0 mr-4">{order.id.toString()}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>
                  <Text className="mb-0 mr-4">
                    {dateFormatter.format(new Date(order.createdAt))}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Price Paid
                  </Text>
                  <Text className="mb-0 mr-4">{formatCurrency(order.totalPrice)}</Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6">
              {order.orderitems.map((item) => (
                <Row key={item.productId} className="mt-8">
                  <Column className="w-20">
                    <Img
                      width={80}
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    {item.name} x {item.qty}
                  </Column>
                  <Column align="right">{formatCurrency(item.price)}</Column>
                </Row>
              ))}
              {[
                {
                  name: 'Items',
                  price: order.itemsPrice,
                },
                {
                  name: 'Tax',
                  price: order.taxPrice,
                },
                {
                  name: 'Shipping',
                  price: order.shippingPrice,
                },
                {
                  name: 'Total',
                  price: order.totalPrice,
                },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}: </Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
