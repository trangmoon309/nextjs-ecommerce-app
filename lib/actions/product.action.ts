import { convertToPlainObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { prisma } from '@/db/prisma';
import { Product } from '@prisma/client';

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
  console.log('slug :>> ', slug);
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
