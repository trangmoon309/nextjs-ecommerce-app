import { Metadata } from 'next';
import { getProductById } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/product-form';

const metadata: Metadata = {
  title: 'Update Product',
  description: 'Update product details in the admin panel.',
};

const AdminProductUpdatePage = async ({ params }: { params: { id: string } }) => {
  const product = await getProductById(params.id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Update Product</h1>
      <p className="text-gray-600">Update the details of the product below.</p>
      <ProductForm product={product} productId={params.id} type="Update" />
    </div>
  );
};

export default AdminProductUpdatePage;
