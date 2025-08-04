'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, shortenUUID } from '@/lib/utils';
import { Order } from '@/types';
import { Link } from 'lucide-react';
import Image from 'next/image';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPaypalOrder,
  approvePaypalOrder,
  updateCODOrderToPaid,
  updateCODOrderToDelivered,
} from '@/lib/actions/order.action';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
}: {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';
    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error loading PayPal';
    }

    return status;
  };

  const handleCreatePaypalOrder = async (data: any, actions: any) => {
    const res = await createPaypalOrder(id);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    return res.data;
  };

  const handleApprovePaypalOrder = async (data: { orderID: string }, actions: any) => {
    const res = await approvePaypalOrder(order.id, data);

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  };

  const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        type="button"
        disabled={isPending}
        className="w-full bg-neutral-800 text-white"
        onClick={() =>
          startTransition(async () => {
            const res = await updateCODOrderToPaid(orderId);
            if (res.success) {
              toast.success('Order marked as paid successfully!');
            } else {
              toast.error(res.message);
            }
          })
        }
      >
        {isPending ? 'Processing...' : 'Mark as Paid'}
      </Button>
    );
  };

  const MarkAsDeliveredButton = ({ orderId }: { orderId: string }) => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        type="button"
        disabled={isPending}
        className="w-full bg-neutral-800 text-white"
        onClick={() =>
          startTransition(async () => {
            const res = await updateCODOrderToDelivered(orderId);
            if (res.success) {
              toast.success('Order marked as delivered successfully!');
            } else {
              toast.error(res.message);
            }
          })
        }
      >
        {isPending ? 'Processing...' : 'Mark as Delivered'}
      </Button>
    );
  };

  return (
    <>
      <h1 className="py-4 text-2xl">Order {shortenUUID(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y-overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge className="mt-2 bg-green-600 text-white">
                  Paid at {formatDateTime(paidAt!)}
                </Badge>
              ) : (
                <Badge className="mt-2 bg-red-600 text-white">Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-2">
                {shippingAddress.address}, {shippingAddress.city}
                {shippingAddress.postalCode} {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge className="mt-2 bg-green-600 text-white">
                  Delivered at {formatDateTime(deliveredAt!)}
                </Badge>
              ) : (
                <Badge className="mt-2 bg-red-600 text-white">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`}>
                          <Image src={item.image} alt={item.name} width={50} height={50} />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="px-2">{item.qty}</TableCell>
                      <TableCell className="px-2">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {/* PayPal payment section */}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePaypalOrder}
                      onApprove={handleApprovePaypalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* COD payment section */}
              {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                <MarkAsPaidButton orderId={order.id} />
              )}
              {isAdmin && isPaid && !isDelivered && paymentMethod === 'CashOnDelivery' && (
                <MarkAsDeliveredButton orderId={order.id} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
