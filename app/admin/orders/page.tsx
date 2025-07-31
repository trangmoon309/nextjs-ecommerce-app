import { auth } from '@/auth';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteOrder, getAllOrders } from '@/lib/actions/order.action';
import { getUserById } from '@/lib/actions/user.action';
import { shortenUUID, formatDateTime, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Metadata } from 'next';
import DeleteDialog from '@/components/shared/delete-dialog';

export const metadata: Metadata = {
  title: 'Admin Orders',
  description: 'Manage all orders in the admin panel',
};

const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) => {
  const { page = '1' } = await props.searchParams;
  const session = await auth();
  const user = await getUserById(session?.user.id || '');

  if (user?.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  const orders = await getAllOrders({
    page: Number(page),
    limit: 2,
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
                  <Button variant="outline" className="bg-neutral-800 text-white">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
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

export default AdminOrdersPage;
