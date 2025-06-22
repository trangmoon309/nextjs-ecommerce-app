'use client';

import { Button } from '@/components/ui/button';
import { Cart, CartItem } from '@/types';
import { toast } from 'react-toastify';
import { Plus, Minus, Loader } from 'lucide-react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }: { cart: Cart; item: CartItem }) => {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(`${item.name} added to cart!`);
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(`${item.name} removed from cart!`);
    });
  };

  // Check if the item already exists in the cart
  const existingItem = (cart.items as CartItem[]).find((i) => i.productId === item.productId);

  return existingItem ? (
    <div>
      <Button type="button" variant="outline" onClick={() => handleRemoveFromCart()}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4"></Minus>
        )}
      </Button>
      <span className="px-2">{existingItem.qty}</span>
      <Button type="button" variant="outline" onClick={() => handleAddToCart()}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4"></Plus>
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full bg-black text-white" type="button" onClick={handleAddToCart}>
      {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4"></Plus>}
    </Button>
  );
};

export default AddToCart;
