'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createUpdateReview, getCurrentUserReview } from '@/lib/actions/review.action';
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { StarIcon } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });

  const handleOpenForm = async () => {
    form.setValue('productId', productId);
    form.setValue('userId', userId);

    const review = await getCurrentUserReview(productId);

    if (review) {
      form.setValue('title', review.title);
      form.setValue('description', review.description);
      form.setValue('rating', review.rating);
    }

    setOpen(true);
  };

  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (data) => {
    console.log('Submitting');
    const response = await createUpdateReview({ ...data, userId, productId });
    if (response.success) {
      onReviewSubmitted();
      setOpen(false);

      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={handleOpenForm}
        variant="outline"
        className="bg-black text-white hover:bg-gray-800"
      >
        Write a review
      </Button>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a review</DialogTitle>
              <DialogDescription>Share your thoughts with other customers</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter review title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter review description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue
                            placeholder={field.value ? `${field.value} ⭐` : 'Select rating'}
                          />{' '}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <SelectItem key={index} value={(index + 1).toString()}>
                            {index + 1} <StarIcon className="inline-block w-4 h-4" />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-black text-white hover:bg-gray-800">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
