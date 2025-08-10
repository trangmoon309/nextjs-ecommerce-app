'use server';

import z from 'zod';
import { insertReviewSchema } from '../validator';
import { prisma } from '@/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { Review } from '@/types';

// Create & Update Reviews
export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      var review = insertReviewSchema.parse({ ...data, userId: session.user.id });
      var product = await prisma.product.findFirst({
        where: { id: review.productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const reviewExist = await prisma.review.findFirst({
        where: {
          productId: review.productId,
          userId: review.userId,
        },
      });

      await prisma.$transaction(async (tx) => {
        if (reviewExist) {
          await tx.review.update({
            where: { id: reviewExist.id },
            data: { title: review.title, description: review.description, rating: review.rating },
          });
        } else {
          await tx.review.create({
            data: { ...review },
          });
        }

        // Get avg rating
        const averageRating = await tx.review.aggregate({
          _avg: { rating: true },
          where: { productId: review.productId },
        });

        // Get number of reviews
        const numberOfReviews = await tx.review.count({
          where: { productId: review.productId },
        });

        // Update the rating and numReview in product table
        await tx.product.update({
          where: { id: review.productId },
          data: {
            rating: averageRating._avg.rating || 0,
            numReviews: numberOfReviews,
          },
        });
      });
    } catch (error) {
      console.error('Error parsing review data:', error);
      return { success: false, message: 'Invalid review data' };
    }

    revalidatePath(`/product/${product.slug}`);

    return { success: true, message: 'Review created/updated successfully' };
  } catch (error) {
    console.error('Error creating/updating review:', error);
    return { success: false, message: 'Failed to create/update review' };
  }
}

// Get all reviews for a product
export async function getReviews({ productId }: { productId: string }): Promise<Review[]> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return reviews.map(
    (review) =>
      ({
        ...review,
        title: review.title ?? '',
        description: review.description ?? '',
        user: review.user ? { name: review.user.name ?? '' } : undefined,
      }) as Review
  );
}

// Get a review written by the current user
export async function getCurrentUserReview(productId: string): Promise<Review | null> {
  const session = await auth();

  if (!session) {
    return null;
  }

  const review = await prisma.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
    include: { user: { select: { id: true, email: true } } },
  });

  if (!review) {
    return null;
  }

  return {
    ...review,
    title: review.title ?? '',
    description: review.description ?? '',
    user: review.user ? { id: review.user.id, email: review.user.email ?? '' } : undefined,
  } as Review;
}
