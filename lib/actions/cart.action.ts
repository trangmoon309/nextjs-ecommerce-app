'use server';

import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validator';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 100),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function getMyCart() {
  try {
    const cookieStore = cookies();
    const session = await auth();
    const userId = session?.user?.id ? (session?.user.id as string) : '1';
    const cart = await prisma.cart.findFirst({
      where: { userId: userId },
    });
    if (!cart) {
      return {
        success: false,
        message: 'Cart not found',
      };
    }
    const cartItems = (cart.items as CartItem[]).map((item) => {
      return {
        ...item,
        price: Number(item.price).toFixed(2),
      };
    });
    const cartTotals = calcPrice(cartItems);
    return {
      ...convertToPlainObject(cart),
      items: cartItems,
      ...cartTotals,
    };
  } catch (error) {
    return null;
  }
}

export async function addItemToCart(data: CartItem) {
  try {
    const cookieStore = cookies();
    const session = await auth();
    const userId = session?.user?.id ? (session?.user.id as string) : '1';
    const item = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    const cart = await prisma.cart.findFirst({
      where: { userId: userId },
    });

    if (!cart) {
      const cartTotals = calcPrice([item]);
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: '1',
        ...cartTotals,
      });

      try {
        await prisma.cart.create({ data: newCart });
      } catch (err) {
        console.error('Error creating cart:', err);
        throw err;
      }

      // Revaliate product page
      revalidatePath(`/product/${product?.slug}`);

      return {
        success: true,
        message: `${product?.name} added to cart`,
      };
    } else {
      // Check if the item already exists in the cart
      const existingItem = (cart.items as CartItem[]).find((i) => i.productId === item.productId);

      if (existingItem) {
        // Check stock
        if (product.stock < existingItem.qty + 1) {
          throw new Error('Not enough stock available');
        }

        // Increment quantity if item exists
        (cart.items as CartItem[]).find((i) => i.productId === item.productId).qty =
          existingItem.qty + 1;
      } else {
        // Check stock
        if (product.stock < 1) {
          throw new Error('Not enough stock available');
        }

        // Add new item to cart
        (cart.items as CartItem[]).push(item);
      }

      // Save the database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product?.slug}`);

      return {
        success: true,
        message: `${product?.name} ${existingItem ? 'updated in' : 'added to'} to cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function removeItemFromCart(productId: string) {
  try {
    const cookieStore = cookies();
    const session = await auth();
    const userId = session?.user?.id ? (session?.user.id as string) : '1';
    const cart = await prisma.cart.findFirst({
      where: { userId: userId },
    });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if the item exists in the cart
    const existingItem = (cart.items as CartItem[]).find((i) => i.productId === productId);
    if (!existingItem) {
      throw new Error('Item not found in cart');
    }

    if (existingItem.qty > 1) {
      // Decrement quantity if more than 1
      (cart.items as CartItem[]).find((i) => i.productId === productId).qty = existingItem.qty - 1;
    } else {
      // Remove item if quantity is 1
      (cart.items as CartItem[]) = (cart.items as CartItem[]).filter(
        (i) => i.productId !== productId
      );
    }

    // Update the cart in the database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product?.slug}`);

    return {
      success: true,
      message: `${product?.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
