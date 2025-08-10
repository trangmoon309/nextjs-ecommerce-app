'use client';

import { Review } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReviewForm from './review-form';
import { getReviews } from '@/lib/actions/review.action';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import Rating from '@/components/shared/product/rating';

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res);
    };

    loadReviews();
  }, [productId]);

  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews(res);
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet.</div>}
      {userId ? (
        <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
      ) : (
        <div>
          Please
          <Link
            className="text-blue-700 px-2"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id} className="border p-4 rounded-md">
            <CardHeader>
              <div className="flex-betwwen">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-600">{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center text-gray-600">
                  <User className="mr-1 h-4 w-4" />
                  {review.user ? review.user.name : 'Anonymous'}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-1 h-4 w-4" />
                  {review.createdAt.toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
