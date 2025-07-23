import { Metadata } from 'next';
import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user.action';
import PaymentMethodForm from './payment-method-form';
import CheckoutSteps from '@/components/shared/checkout-steps';

export const metadata: Metadata = {
  title: 'Select Payment Method',
  description: 'Select your preferred payment method for the order.',
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user?.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
