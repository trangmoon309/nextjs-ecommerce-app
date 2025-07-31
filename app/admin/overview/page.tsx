import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrderSummary } from '@/lib/actions/order.action';
import { getUserById } from '@/lib/actions/user.action';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils';
import { BadgeDollarSign, Barcode, CreditCard, User } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import Charts from './charts';

export const metadata: Metadata = {
  title: 'Admin Overview',
  description: 'Overview page for admin dashboard',
};

const AdminOverviewPage = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id ?? '');

  if (!session || user?.role !== 'admin') {
    throw new Error('User is not authorized');
  }

  const summary = await getOrderSummary();

  return (
    <div className="space-y-2">
      <h1 className="font-bold text-2xl lg:text-3xl;">Dashboard</h1>
      <div className="grid gap-4 md:grid:cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatCurrency(summary.totalSales._sum.totalPrice!.toString() || '0')}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatNumber(summary.ordersCount)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <User />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatNumber(summary.usersCount)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatNumber(summary.productsCount)}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <Charts
              data={{
                monthlySales: summary.monthlySales,
                latestSales: summary.latestSales,
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <Table>
              <TableHeader>
                <TableHead>BUYER</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale?.user?.name ?? 'Deleted User'}</TableCell>
                    <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(Number(sale?.totalPrice))}</TableCell>
                    <TableCell>
                      <Link href={`/order/${sale.id}`} className="text-blue-600 hover:underline">
                        <span className="px-2">Details</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
