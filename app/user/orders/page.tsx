import { Metadata } from 'next';
import { getMyOrders } from '@/lib/actions/order.action';
import { formatCurrency, formatDateTime, shortenUUID } from '@/lib/utils';
import Link from 'next/link';
import { get } from 'http';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View your past orders',
};

const OrdersPage = async (props: { searchParams: Promise<{ page: string }> }) => {
  const { page } = await props.searchParams;
  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

  return (
    <div className="space-y-2">
      <h2 className="font-bold text-2xl lg:text-3xl;">Orders</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/order/${order.id}`}>{shortenUUID(order.id)}</Link>
                </TableCell>
                <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                <TableCell>{formatCurrency(Number(order.totalPrice))}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    formatDateTime(order.paidAt)
                  ) : (
                    <span className="text-red-500">Not Paid</span>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    formatDateTime(order.deliveredAt)
                  ) : (
                    <span className="text-red-500">Not Delivered</span>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`} className="text-blue-500 hover:underline">
                    <span className="px-2">Details</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders?.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
