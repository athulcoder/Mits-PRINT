/**
 * Generic Payment Provider Registry
 * 
 * To add a new provider in the future (e.g. STRIPE, CASHFREE, PHONEPE), simply add a new definition
 * object to the PROVIDER_REGISTRY dictionary below without modifying any database tables!
 */

export const PROVIDER_REGISTRY = {
  RAZORPAY: {
    provider: 'RAZORPAY',
    displayName: 'Razorpay',
    description: 'Accept payments via UPI, Credit Cards, Debit Cards, Net Banking & Wallets via Razorpay.',
    logoUrl: '/providers/razorpay.svg',
    fields: [
      {
        name: 'keyId',
        label: 'Key ID',
        type: 'text',
        required: true,
        isSecret: false,
        placeholder: 'rzp_test_...',
        helpText: 'Your Razorpay Key ID generated from the Razorpay Dashboard.',
      },
      {
        name: 'keySecret',
        label: 'Key Secret',
        type: 'password',
        required: true,
        isSecret: true,
        placeholder: 'Enter Key Secret',
        helpText: 'Your Razorpay Key Secret (encrypted & masked in storage).',
      },
      {
        name: 'webhookSecret',
        label: 'Webhook Secret',
        type: 'password',
        required: false,
        isSecret: true,
        placeholder: 'Enter Webhook Secret',
        helpText: 'Secret key used to verify Razorpay webhook signatures.',
      },
      {
        name: 'apiBaseUrl',
        label: 'API Base URL',
        type: 'url',
        required: false,
        isSecret: false,
        defaultValue: 'https://api.razorpay.com',
        placeholder: 'https://api.razorpay.com',
        helpText: 'Base API endpoint for Razorpay REST APIs.',
      },
    ],
    /**
     * Validates configuration payload against Razorpay requirements.
     */
    validate(config = {}) {
      const errors = {};
      if (!config.keyId || !String(config.keyId).trim()) {
        errors.keyId = 'Key ID is required';
      }
      if (!config.keySecret || !String(config.keySecret).trim()) {
        errors.keySecret = 'Key Secret is required';
      }
      if (config.apiBaseUrl) {
        try {
          new URL(config.apiBaseUrl);
        } catch {
          errors.apiBaseUrl = 'API Base URL must be a valid URL';
        }
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    },
    /**
     * Connection test helper for Razorpay.
     */
    async testConnection(config = {}) {
      const { keyId, keySecret } = config;
      if (!keyId || !keySecret) {
        return { success: false, message: 'Key ID and Key Secret are required to test connection.' };
      }
      // Simple verification test: Key ID format check or basic validation
      if (!keyId.startsWith('rzp_')) {
        return { success: false, message: 'Invalid Key ID format. Razorpay Key ID usually starts with "rzp_".' };
      }
      return {
        success: true,
        message: 'Successfully validated Razorpay credentials format.',
      };
    },
  },

  PAYTM: {
    provider: 'PAYTM',
    displayName: 'Paytm',
    description: 'Accept payments through Paytm Wallet, Postpaid, NetBanking, and UPI.',
    logoUrl: '/providers/paytm.svg',
    fields: [
      {
        name: 'merchantId',
        label: 'Merchant ID (MID)',
        type: 'text',
        required: true,
        isSecret: false,
        placeholder: 'e.g. MITS9483019483',
        helpText: 'Unique Merchant ID provided by Paytm.',
      },
      {
        name: 'merchantKey',
        label: 'Merchant Key',
        type: 'password',
        required: true,
        isSecret: true,
        placeholder: 'Enter Merchant Key',
        helpText: 'Paytm production or staging Merchant Key (encrypted).',
      },
      {
        name: 'website',
        label: 'Website Name',
        type: 'text',
        required: true,
        isSecret: false,
        defaultValue: 'WEBSTAGING',
        placeholder: 'WEBSTAGING or DEFAULT',
        helpText: 'Paytm website parameter (e.g. WEBSTAGING for sandbox, DEFAULT for live).',
      },
      {
        name: 'industryType',
        label: 'Industry Type',
        type: 'text',
        required: true,
        isSecret: false,
        defaultValue: 'Retail',
        placeholder: 'Retail',
        helpText: 'Industry classification registered with Paytm.',
      },
      {
        name: 'callbackUrl',
        label: 'Callback URL',
        type: 'url',
        required: false,
        isSecret: false,
        placeholder: 'https://yourdomain.com/api/payment/paytm/callback',
        helpText: 'URL where Paytm redirects after transaction completion.',
      },
      {
        name: 'webhookSecret',
        label: 'Webhook Secret',
        type: 'password',
        required: false,
        isSecret: true,
        placeholder: 'Enter Webhook Secret',
        helpText: 'Optional secret for verifying Paytm event notifications.',
      },
    ],
    /**
     * Validates configuration payload against Paytm requirements.
     */
    validate(config = {}) {
      const errors = {};
      if (!config.merchantId || !String(config.merchantId).trim()) {
        errors.merchantId = 'Merchant ID (MID) is required';
      }
      if (!config.merchantKey || !String(config.merchantKey).trim()) {
        errors.merchantKey = 'Merchant Key is required';
      }
      if (!config.website || !String(config.website).trim()) {
        errors.website = 'Website Name is required';
      }
      if (!config.industryType || !String(config.industryType).trim()) {
        errors.industryType = 'Industry Type is required';
      }
      if (config.callbackUrl) {
        try {
          new URL(config.callbackUrl);
        } catch {
          errors.callbackUrl = 'Callback URL must be a valid URL';
        }
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    },
    /**
     * Connection test helper for Paytm.
     */
    async testConnection(config = {}) {
      const { merchantId, merchantKey } = config;
      if (!merchantId || !merchantKey) {
        return { success: false, message: 'Merchant ID and Merchant Key are required to test connection.' };
      }
      if (merchantId.length < 5) {
        return { success: false, message: 'Paytm Merchant ID appears to be invalid or too short.' };
      }
      return {
        success: true,
        message: 'Successfully validated Paytm Merchant credentials format.',
      };
    },
  },
};

/**
 * Gets a single provider definition by key (e.g. 'RAZORPAY' or 'PAYTM').
 * @param {string} providerKey
 * @returns {object|null}
 */
export function getProviderDefinition(providerKey) {
  if (!providerKey) return null;
  return PROVIDER_REGISTRY[providerKey.toUpperCase()] || null;
}

/**
 * Gets all supported provider definitions.
 * @returns {Array<object>}
 */
export function getAllProviderDefinitions() {
  return Object.values(PROVIDER_REGISTRY);
}

/**
 * Validates configuration payload for a specific provider.
 * @param {string} providerKey
 * @param {Record<string, any>} config
 * @returns {{isValid: boolean, errors: Record<string, string>}}
 */
export function validateProviderConfiguration(providerKey, config) {
  const definition = getProviderDefinition(providerKey);
  if (!definition) {
    return {
      isValid: false,
      errors: { provider: `Unsupported payment provider: ${providerKey}` },
    };
  }
  return definition.validate(config);
}
