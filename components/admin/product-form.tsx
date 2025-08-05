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
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import Image from 'next/image';

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
  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

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

    router.push('/admin/products');
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
                <FormMessage className="text-red-500" />
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
                        const name = form.getValues('name');
                        form.setValue('slug', slugify(name, { lower: true, strict: true }));
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
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
                <FormMessage className="text-red-500" />
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
                <FormMessage className="text-red-500" />
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
                <FormMessage className="text-red-500" />
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
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          className="bg-emerald-950 text-white py-3 px-4"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, ...res.map((file) => file.url)]);
                            toast.success('Images uploaded successfully!');
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`Error uploading images: ${error.message}`);
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          Feature Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 items-center">
                    <FormLabel>Is Featured?</FormLabel>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <div className="flex items-center space-x-2">
                  <Image
                    src={banner}
                    alt="Banner Image"
                    className="w-full object-cover object-center rounded-sm"
                    width={1920}
                    height={680}
                  />
                </div>
              )}

              {isFeatured && !banner && (
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Banner Image</FormLabel>
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          className="bg-emerald-950 text-white py-3 px-4"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('banner', res[0].url);
                            toast.success('Banner uploaded successfully!');
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`Error uploading banner: ${error.message}`);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </div>
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
                <FormMessage className="text-red-500" />
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
