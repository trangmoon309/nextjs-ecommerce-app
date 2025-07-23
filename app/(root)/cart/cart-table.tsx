'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import Cart from '@/types';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h1 className="py-4 h2-bold">Your Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link href={`/product/${item.slug}`} className="flex items-center">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="ml-2 rounded"
                          />
                        )}
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(item.productId);
                            if (!res.success) {
                              toast.error(res.message);
                              return;
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="p-2 text-lg">{item.qty}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) {
                              toast.error(res.message);
                              return;
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="p4 gap-4">
              <div className="pb-3 text-lg">
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
                <span className="font-bold">
                  {formatCurrency(cart.items.reduce((acc, item) => acc + item.price * item.qty, 0))}
                </span>
              </div>
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 py-3 px-4 text-base font-semibold"
                disabled={isPending}
                onClick={() => startTransition(() => router.push('/shipping-address'))}
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}{' '}
                Process to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
