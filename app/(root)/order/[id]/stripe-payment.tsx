import { useEffect } from 'react';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SERVER_URL } from '@/lib/constants';

const StripePayment = ({
  priceInCents,
  orderId,
  stripeClientSecret,
}: {
  priceInCents: number;
  orderId: string;
  stripeClientSecret: string;
}) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  const { theme, systemTheme } = useTheme();

  // Stripe form componenet
  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!stripe || !elements || email == null) return;

      setIsLoading(true);
      const result = await stripe
        .confirmPayment({
          elements,
          confirmParams: {
            return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
            receipt_email: email,
          },
        })
        .then(({ error }) => {
          if (error?.type === 'card_error' || error?.type === 'validation_error') {
            setErrorMessage(error?.message ?? 'An unknown error occurred.');
          } else if (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-xl">Stripe Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />
        <div>
          <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
        </div>
        <Button
          className="w-full bg-black text-white"
          size="lg"
          type="submit"
          disabled={!stripe || !elements || isLoading}
        >
          {isLoading ? 'Purchasing...' : `Purchase ${priceInCents / 100}`}
        </Button>
      </form>
    );
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: stripeClientSecret,
        appearance: { theme: theme === 'dark' ? 'night' : 'stripe' },
      }}
    >
      <StripeForm />
    </Elements>
  );
};

export default StripePayment;
