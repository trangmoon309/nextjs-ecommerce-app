import { Button } from './ui/button';
import Link from 'next/link';

const ViewAppProductsButton = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <Button
        asChild
        className="px-8 py-4 text-lg font-semibold bg-black text-white hover:bg-gray-800"
      >
        <Link href="/search">View All Products</Link>
      </Button>
    </div>
  );
};

export default ViewAppProductsButton;
