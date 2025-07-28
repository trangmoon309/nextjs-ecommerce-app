'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.action';
import { getUserById } from './user.action';
import { insertOrderSchema } from '../validator';
import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';
import { CartItem, PaymentResult } from '@/types';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants';

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

// Get order by id
export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return convertToPlainObject(order);
}

// Create new paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

    // Update order with PayPal order ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          status: '',
          email_address: '',
          pricePaid: 0,
        },
      },
    });

    return {
      success: true,
      message: 'PayPal order created successfully',
      data: paypalOrder.id,
    };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Approve PayPal order and update order to paid
export async function approvePaypalOrder(orderId: string, data: { orderID: string }) {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const captureOrder = await paypal.capturePayment(orderId);

    if (
      !captureOrder ||
      captureOrder.id !== (order.paymentResult as PaymentResult).id ||
      captureOrder.status !== 'COMPLETED'
    ) {
      throw new Error('PayPal order capture failed');
    }

    // Update order with PayPal payment details
    await updateOrderToPaid({
      orderId: orderId,
      paymentResult: {
        id: captureOrder.id,
        status: captureOrder.status,
        email_address: captureOrder.payer.email_address,
        pricePaid: captureOrder.purchase_units[0]?.payments?.captures[0]?.amount?.value || '0',
      } as PaymentResult,
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Your order has been paid successfully',
    };
  } catch (error) {
    console.error('Error approving PayPal order:', error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult: PaymentResult;
}) {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  if (order.isPaid) {
    throw new Error('Order is already paid');
  }

  // Transaction to update order and payment result
  await prisma.$transaction(async (tx) => {
    // Iterate over order items and update product stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: -item.qty,
          },
        },
      });
    }

    // Set the order as paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: paymentResult,
      },
    });
  });

  const updatedOrder = await getOrderById(orderId);

  if (!updatedOrder) {
    throw new Error('Failed to update order to paid');
  }
}

// Get all orders for a user
export async function getMyOrders({ limit = PAGE_SIZE, page }: { limit?: number; page: number }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        orderitems: true,
      },
    });

    const totalOrders = await prisma.order.count({ where: { userId: session.user.id } });

    return {
      data: orders,
      totalPages: Math.ceil(totalOrders / limit),
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}
