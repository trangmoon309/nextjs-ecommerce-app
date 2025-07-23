'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.action';
import { getUserById } from './user.action';
import { insertOrderSchema } from '../validator';
import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';
import { CartItem } from '@/types';
import { Item } from '@radix-ui/react-dropdown-menu';

// Create order and create order items
export async function createOrder() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Cart is empty',
        redirect: '/cart',
      };
    }

    const user = await getUserById(userId);

    if (!user?.address) {
      return {
        success: false,
        message: 'Shipping address is required',
        redirect: '/shipping-address',
      };
    }

    if (!user?.paymentMethod) {
      return {
        success: false,
        message: 'No payment method found',
        redirect: '/payment-method',
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: userId,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      items: cart.items.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        price: item.price,
        name: item.name,
        image: item.image,
        slug: item.slug,
      })),
      itemsPrice: cart.itemsPrice,
      totalPrice: cart.totalPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      paymentResult: Prisma.JsonNull,
    });

    console.log('order :>> ', order);

    // Create transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      try {
        const insertedOrder = await tx.order.create({
          data: {
            ...order,
            paymentResult: Prisma.JsonNull,
          },
        });

        // Create order items from cart items
        for (const item of cart.items as CartItem[]) {
          try {
            await tx.orderItem.create({
              data: {
                ...item,
                price: item.price,
                orderId: insertedOrder.id,
              },
            });
          } catch (itemErr) {
            console.error('Error creating orderItem:', item, itemErr);
            throw itemErr;
          }
        }

        // clear cart after order is created
        await tx.cart.update({
          where: { id: cart.id },
          data: {
            items: [],
            itemsPrice: 0,
            totalPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
          },
        });

        return insertedOrder.id;
      } catch (txErr) {
        console.error('Transaction error:', txErr);
        throw txErr;
      }
    });

    if (!insertedOrderId) {
      throw new Error('Failed to create order');
    }

    return {
      success: true,
      message: 'Order created successfully',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
}
