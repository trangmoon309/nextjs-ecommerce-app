import { generateAccessToken } from '../lib/paypal';

test('should generate an access token', async () => {
  const token = await generateAccessToken();
  expect(token).toBeDefined();
  expect(token.length).toBeGreaterThan(0);
  expect(typeof token).toBe('string');
});
