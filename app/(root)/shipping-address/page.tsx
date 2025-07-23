import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.action';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import { getUserById } from '@/lib/actions/user.action';
import ShippingAddressForm from './shipping-address-form';
import CheckoutSteps from '@/components/shared/checkout-steps';

const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('User Id not found');
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
