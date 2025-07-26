import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.action';
import { notFound } from 'next/navigation';
import { ShippingAddress } from '@/types';
import OrderDetailsTable from './order-details-table';

const metadata: Metadata = {
  title: 'Order Detail',
  description: 'View your order details',
};

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const order = await getOrderById(id);

  console.log('order :>> ', order);

  if (!order) {
    notFound();
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
    />
  );
};

export default OrderDetailPage;
