import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.action';
import { object } from 'zod';

export async function POST(req: NextRequest) {
  // Build the webhook event
  const event = await Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  // Check for successful payment
  if (event.type === 'charge.succeeded') {
    const charge = event.data.object;

    // Update the order status to paid
    await updateOrderToPaid({
      orderId: charge.metadata.orderId,
      paymentResult: {
        id: charge.id,
        status: 'COMPLETED',
        email_address: charge.billing_details.email!,
        pricePaid: (charge.amount / 100).toFixed(2),
      },
    });

    return NextResponse.json({
      message: 'updateOrderToPaid was successfully',
    });
  }

  return NextResponse.json({
    message: 'event is not charge.succeeded',
  });
}
