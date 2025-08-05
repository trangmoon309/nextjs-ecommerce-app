import { Metadata } from 'next';
import ProductForm from '@/components/admin/product-form';

export const metadata: Metadata = {
  title: 'Create Product',
  description: 'Create a new product in the admin panel',
};

const CreateProductPage = () => {
  return (
    <>
      <h2 className="font-bold text-2xl lg:text-3xl">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  );
};

export default CreateProductPage;
