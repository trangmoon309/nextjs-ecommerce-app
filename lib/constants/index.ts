export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DES =
  process.env.NEXT_PUBLIC_APP_DES || 'A modern ecommerce platform built with NextJS';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const signInDefaultValue = {
  email: '',
  password: '',
};
export const signUpDefaultValue = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const shippingAddressDefaultValue = {
  fullName: 'Trang Huynh',
  address: '304 Tan Ky Tan Quy',
  city: 'Ho Chi Minh City',
  postalCode: '700000',
  country: 'Vietnam',
  lat: 10.762622,
  lng: 106.660172,
};

export const PAYMENT_METHODS = ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;
export const productDefaultValues = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = ['admin', 'user'];
export const reviewFormDefaultValues = {
  title: '',
  description: '',
  rating: 0,
  isVerifiedPurchase: true,
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
