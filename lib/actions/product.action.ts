'use server';

import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { prisma } from '@/db/prisma';
import { Product } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validator';
import z from 'zod';

// Get latest products
export async function getLatestProducts(): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({
      take: LATEST_PRODUCTS_LIMIT,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return convertToPlainObject(data);
  } catch (err) {
    console.error('🔥 Prisma findMany failed:', err);
    return []; // fallback in case of error
  }
}

// Get single product by its slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a product
export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) {
      throw Error('Product not found.');
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product deleted successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = await prisma.product.create({
      data: {
        ...data,
      },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully!',
      data: product,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a product
export async function updateProduct(id: string, data: z.infer<typeof updateProductSchema>) {
  try {
    try {
      const product = updateProductSchema.parse(data);

      const productExists = await prisma.product.findFirst({
        where: { id },
      });

      if (!productExists) {
        throw new Error('Product not found');
      }

      await prisma.product.update({
        where: { id },
        data: {
          ...product,
        },
      });

      revalidatePath('/admin/products');

      return {
        success: true,
        message: 'Product updated successfully!',
        data: product,
      };
    } catch (error) {
      console.log('Parsing fail >> ' + error);
      throw error;
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
