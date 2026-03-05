import { decryptSecret, encryptSecret } from './secret.util';

describe('secret util', () => {
  const previous = process.env.APP_ENCRYPTION_KEY;

  afterAll(() => {
    process.env.APP_ENCRYPTION_KEY = previous;
  });

  it('encrypts and decrypts value', () => {
    process.env.APP_ENCRYPTION_KEY = '12345678901234567890123456789012';
    const value = 'smtp-password';
    const encrypted = encryptSecret(value);
    expect(encrypted.startsWith('enc:')).toBe(true);
    expect(decryptSecret(encrypted)).toBe(value);
  });

  it('throws when key is missing or weak', () => {
    process.env.APP_ENCRYPTION_KEY = 'weak-key';
    expect(() => encryptSecret('x')).toThrow('APP_ENCRYPTION_KEY must be set with at least 32 characters');
  });
});
