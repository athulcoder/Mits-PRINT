import crypto from 'crypto';

const MASK_PREFIX = '••••••••';

/**
 * Gets a 32-byte key from environment variables or fallback secret.
 */
function getEncryptionKey() {
  const secret = process.env.PAYMENT_CONFIG_ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || 'mits-print-default-secret-key-32bytes!';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a plain text string using AES-256-GCM.
 * @param {string} plainText
 * @returns {string} Encrypted string format: enc:<iv_hex>:<authTag_hex>:<ciphertext_hex>
 */
export function encryptValue(plainText) {
  if (!plainText || typeof plainText !== 'string') return plainText;
  if (plainText.startsWith('enc:')) return plainText; // Already encrypted

  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `enc:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an encrypted string created by encryptValue.
 * @param {string} cipherTextString
 * @returns {string} Decrypted plain text string
 */
export function decryptValue(cipherTextString) {
  if (!cipherTextString || typeof cipherTextString !== 'string') return cipherTextString;
  if (!cipherTextString.startsWith('enc:')) return cipherTextString; // Plain text or unencrypted

  try {
    const parts = cipherTextString.split(':');
    if (parts.length !== 4) return cipherTextString;

    const [, ivHex, authTagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt payment configuration field:', error);
    return cipherTextString;
  }
}

/**
 * Checks if a value is a masked secret string.
 * @param {any} val
 * @returns {boolean}
 */
export function isMaskedValue(val) {
  return typeof val === 'string' && val.includes('••••');
}

/**
 * Masks a secret string (e.g. "secret12345" -> "••••••••2345").
 * @param {string} val
 * @returns {string}
 */
export function maskSecretValue(val) {
  if (!val || typeof val !== 'string') return '';
  if (isMaskedValue(val)) return val;
  const len = val.length;
  if (len <= 4) return `${MASK_PREFIX}`;
  return `${MASK_PREFIX}${val.slice(-4)}`;
}

/**
 * Prepares configuration object for database storage by encrypting secret fields.
 * If incoming field value is masked, preserves the existing encrypted value from DB.
 *
 * @param {Record<string, any>} newConfig
 * @param {Record<string, any>|null} existingConfig
 * @param {Array<{name: string, isSecret?: boolean}>} fieldDefs
 * @returns {Record<string, any>}
 */
export function processConfigurationForStorage(newConfig = {}, existingConfig = {}, fieldDefs = []) {
  const result = { ...newConfig };

  fieldDefs.forEach((field) => {
    const fieldName = field.name;
    const incomingValue = newConfig[fieldName];
    const existingValue = existingConfig ? existingConfig[fieldName] : undefined;

    if (field.isSecret) {
      if (incomingValue && isMaskedValue(incomingValue)) {
        // Retain existing encrypted value if user didn't change secret
        result[fieldName] = existingValue || '';
      } else if (incomingValue && typeof incomingValue === 'string') {
        // Encrypt new plain secret value
        result[fieldName] = encryptValue(incomingValue);
      } else {
        result[fieldName] = incomingValue || '';
      }
    }
  });

  return result;
}

/**
 * Prepares configuration object for frontend by decrypting and masking secret fields.
 *
 * @param {Record<string, any>} storedConfig
 * @param {Array<{name: string, isSecret?: boolean}>} fieldDefs
 * @returns {Record<string, any>}
 */
export function processConfigurationForClient(storedConfig = {}, fieldDefs = []) {
  if (!storedConfig) return {};
  const result = { ...storedConfig };

  fieldDefs.forEach((field) => {
    const fieldName = field.name;
    const storedValue = storedConfig[fieldName];

    if (field.isSecret && storedValue) {
      const decrypted = decryptValue(storedValue);
      result[fieldName] = maskSecretValue(decrypted);
    }
  });

  return result;
}

/**
 * Decrypts all secret fields in a configuration object for backend execution (e.g. payment processing or connection testing).
 *
 * @param {Record<string, any>} storedConfig
 * @param {Array<{name: string, isSecret?: boolean}>} fieldDefs
 * @returns {Record<string, any>}
 */
export function processConfigurationForExecution(storedConfig = {}, fieldDefs = []) {
  if (!storedConfig) return {};
  const result = { ...storedConfig };

  fieldDefs.forEach((field) => {
    const fieldName = field.name;
    const storedValue = storedConfig[fieldName];

    if (field.isSecret && storedValue) {
      result[fieldName] = decryptValue(storedValue);
    }
  });

  return result;
}
