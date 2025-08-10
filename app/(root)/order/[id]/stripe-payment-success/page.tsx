import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/actions/order.action';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

const StripeSuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  const order = await getOrderById(id);

  if (!order) notFound();

  // Retrieve the payment intent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Check if payment intent is valid
  if (!paymentIntent || paymentIntent.metadata.orderId !== order.id.toString()) {
    notFound();
  }

  // Check if payment is successful
  const isSuccess = paymentIntent.status === 'succeeded';

  if (!isSuccess) {
    return redirect(`/order/${id}`);
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="font-bold text-3xl lg:text-4xl">Thanks for your purchase</h1>
        <div>We are processing your order.</div>
        <Button variant="default" asChild className="bg-black text-white">
          <Link href={`/order/${id}`}>View orders</Link>
        </Button>
      </div>
    </div>
  );
};

export default StripeSuccessPage;
