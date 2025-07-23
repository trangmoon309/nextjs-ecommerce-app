'use client';

import { ShippingAddress } from '@/types';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Form,
  useForm,
  UseFormStateReturn,
  FormProvider,
  SubmitHandler,
} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import { shippingAddressDefaultValue } from '@/lib/constants';
import { shippingAddressSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ArrowRight, FormInput, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateUserAddress } from '@/lib/actions/user.action';

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    data: z.infer<typeof shippingAddressSchema>
  ) => {
    try {
      startTransition(async () => {
        const res = await updateUserAddress(data);
        if (res.success) {
          toast.success('Shipping address saved successfully!');

          router.push('/payment-method');
        } else {
          toast.error(res.message);
        }
      });
    } catch (error) {
      toast.error('Failed to save shipping address. Please try again.');
    }
  };

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValue,
  });

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="font-bold text-2xl lg:text-3xl mt-4">Shipping Address</h1>
        <p className="text-sm text-gray-500">Please enter your shipping address details below.</p>
        <FormProvider {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="fullName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'>;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="fullName">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="address"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'address'>;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="city"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'>;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="city">City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="postalCode"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'postalCode'>;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="country"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'country'>;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="country">Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
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

export default ShippingAddressForm;
