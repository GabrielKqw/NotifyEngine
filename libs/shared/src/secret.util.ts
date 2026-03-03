import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

function getKey(): Buffer {
  const material = process.env.APP_ENCRYPTION_KEY;
  if (!material || material.length < 32) {
    throw new Error('APP_ENCRYPTION_KEY must be set with at least 32 characters');
  }
  return createHash('sha256').update(material).digest();
}

export function encryptSecret(plainText: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

export function decryptSecret(value: string): string {
  if (!value.startsWith('enc:')) {
    return value;
  }

  const [, ivB64, tagB64, dataB64] = value.split(':');
  const decipher = createDecipheriv('aes-256-gcm', getKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  const plain = Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]);
  return plain.toString('utf8');
}
