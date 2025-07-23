'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validator';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import z from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.action';

const PaymentMethodForm = ({ preferredPaymentMethod }: { preferredPaymentMethod: string }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: z.infer<typeof paymentMethodSchema>) => {
    try {
      startTransition(async () => {
        const res = await updateUserPaymentMethod(data);
        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success('Payment method saved successfully!');
        router.push('/place-order');
      });
    } catch (error) {
      toast.error('Failed to save payment method. Please try again.');
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="font-bold text-2xl lg:text-3xl mt-4">Payment Method</h1>
        <p className="text-sm text-gray-500">Please select a payment method.</p>
        <FormProvider {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel htmlFor="type">Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-2"
                      >
                        {PAYMENT_METHODS.map((paymentMethod) => (
                          <FormItem
                            key={paymentMethod}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={paymentMethod}
                                checked={field.value === paymentMethod}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium">{paymentMethod}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-black text-white hover:bg-gray-800 "
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}{' '}
                Continue
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default PaymentMethodForm;
