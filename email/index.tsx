import { Resend } from 'resend';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import { Order } from '@/types';
import PurchaseReceiptEmail from './purchase-receipt';

require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async (order: Order) => {
  try {
    const email = {
      to: order.user.email,
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      subject: `Order Confirmation - ${order.id}`,
      react: <PurchaseReceiptEmail order={order} />,
    };
    const response = await resend.emails.send(email);
    console.log('Resend response:', response);
    return response;
  } catch (error) {
    console.error('Resend error:', error);
    throw error;
  }
};
