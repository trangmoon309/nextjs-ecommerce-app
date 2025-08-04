import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.action';
import { notFound } from 'next/navigation';
import { ShippingAddress } from '@/types';
import OrderDetailsTable from './order-details-table';
import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user.action';

const metadata: Metadata = {
  title: 'Order Detail',
  description: 'View your order details',
};

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const session = await auth();
  const user = await getUserById(session?.user?.id || '');
  const isAdmin = user?.role === 'admin';

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={isAdmin}
    />
  );
};

export default OrderDetailPage;
