import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProviderDefinition } from '@/lib/payment-providers/registry';
import { processConfigurationForExecution } from '@/lib/payment-providers/encryption';

/**
 * POST /api/admin/payment-providers/test
 * Tests connection/credentials for a given provider configuration.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { provider, configuration = {} } = body;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provider is required' },
        { status: 400 }
      );
    }

    const providerKey = provider.toUpperCase();
    const def = getProviderDefinition(providerKey);

    if (!def) {
      return NextResponse.json(
        { success: false, error: `Unsupported payment provider: ${provider}` },
        { status: 400 }
      );
    }

    // Retrieve existing config from DB if present to decrypt existing secret values if masked
    const existing = await prisma.paymentProviderConfiguration.findUnique({
      where: { provider: providerKey },
    });

    const existingConfig = existing?.configuration || {};

    // Combine incoming input with stored values for masked fields
    const mergedConfig = { ...configuration };
    def.fields.forEach((field) => {
      if (
        field.isSecret &&
        typeof mergedConfig[field.name] === 'string' &&
        mergedConfig[field.name].includes('••••')
      ) {
        mergedConfig[field.name] = existingConfig[field.name];
      }
    });

    // Decrypt all secret values for execution
    const executionConfig = processConfigurationForExecution(mergedConfig, def.fields);

    // Run connection test routine defined on provider definition
    const testResult = await def.testConnection(executionConfig);

    if (testResult.success) {
      return NextResponse.json({
        success: true,
        message: testResult.message || 'Connection test successful!',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: testResult.message || 'Connection test failed',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error testing payment provider connection:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while testing connection' },
      { status: 500 }
    );
  }
}
