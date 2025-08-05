'use client';

import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validator';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import slugify from 'slugify';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createProduct, updateProduct } from '@/lib/actions/product.action';
import { toast } from 'react-toastify';

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product && type === 'Update' ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (data) => {
    if (type === 'Create') {
      const res = await createProduct(data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success('Product created successfully!');
    } else {
      if (!productId) {
        toast.error('Product ID is required for update.');
        return;
      }

      const res = await updateProduct(productId, {
        ...data,
        id: productId,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success('Product updated successfully!');
    }
  };

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Product Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Input
                      {...field}
                      type="text"
                      placeholder="Product Slug"
                      className="rounded-r-none"
                    />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-l-none rounded ml-2"
                      onClick={() => {
                        form.setValue('slug', slugify(field.value, { lower: true, strict: true }));
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Product Slug" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Product Category" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Product Brand" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Product Price" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Product Stock" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5"></div>
        <div className="upload-field"></div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'>;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Product Description" className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit" className="bg-black text-white hover:bg-gray-800 py-3 px-4 w-full">
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
