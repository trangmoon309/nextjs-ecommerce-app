'use client';

import { Button } from '@/components/ui/button';
import { addItemToCart } from '@/lib/actions/cart.action';
import { CartItem } from '@/types';
import { toast } from 'react-toastify';

const AddToCart = ({ item }: { item: CartItem }) => {
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(`${item.name} added to cart!`);
  };

  return (
    <Button className="w-full bg-black text-white" type="button" onClick={handleAddToCart}>
      Add To Cart
    </Button>
  );
};

export default AddToCart;
