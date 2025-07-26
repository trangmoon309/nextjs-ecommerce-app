import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.action';
import { notFound } from 'next/navigation';
import { ShippingAddress } from '@/types';
import OrderDetailsTable from './order-details-table';

const metadata: Metadata = {
  title: 'Order Detail',
  description: 'View your order details',
};

const OrderDetailPage = async (props: { param: Promise<{ id: string }> }) => {
  const { id } = await props.param;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
    />
  );
};

export default OrderDetailPage;
