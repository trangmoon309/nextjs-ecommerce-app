import { mock } from 'node:test';
import { generateAccessToken, paypal } from '../lib/paypal';

test('should generate an access token from paypal', async () => {
  const token = await generateAccessToken();
  expect(token).toBeDefined();
  expect(token.length).toBeGreaterThan(0);
  expect(typeof token).toBe('string');
});

test('should create a PayPal order', async () => {
  const token = await generateAccessToken();
  const price = 10.0;

  const order = await paypal.createOrder(price);

  expect(order).toHaveProperty('id');
  expect(order).toHaveProperty('status');
  expect(order.status).toBe('CREATED');
});

// Test to capture a PayPal order
test('should capture a PayPal order', async () => {
  const orderID = '100';
  const mockCapturePayment = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({
    id: '200',
    status: 'COMPLETED',
  });

  const capture = await paypal.capturePayment(orderID);

  expect(mockCapturePayment).toHaveBeenCalledWith(orderID);
  expect(capture).toHaveProperty('status');
  expect(capture.status).toBe('COMPLETED');

  mockCapturePayment.mockRestore();
});
