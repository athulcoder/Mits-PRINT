import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAllProviderDefinitions,
  getProviderDefinition,
  validateProviderConfiguration,
} from '@/lib/payment-providers/registry';
import {
  processConfigurationForClient,
  processConfigurationForStorage,
} from '@/lib/payment-providers/encryption';

/**
 * GET /api/admin/payment-providers
 * Returns all supported payment providers with their definitions and masked stored configurations.
 */
export async function GET() {
  try {
    const storedConfigs = await prisma.paymentProviderConfiguration.findMany();
    const storedMap = new Map(storedConfigs.map((c) => [c.provider, c]));

    const definitions = getAllProviderDefinitions();
    const result = definitions.map((def) => {
      const stored = storedMap.get(def.provider);
      const rawConfig = stored?.configuration || {};
      const maskedConfig = processConfigurationForClient(rawConfig, def.fields);

      return {
        provider: def.provider,
        displayName: def.displayName,
        description: def.description,
        logoUrl: def.logoUrl,
        fields: def.fields,
        id: stored?.id || null,
        isActive: stored ? stored.isActive : false,
        isLive: stored ? stored.isLive : false,
        configuration: maskedConfig,
        createdAt: stored?.createdAt || null,
        updatedAt: stored?.updatedAt || null,
        isConfigured: Boolean(stored),
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching payment provider configurations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment provider configurations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/payment-providers
 * Creates or updates a payment provider configuration securely.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { provider, isActive = true, isLive = false, configuration = {} } = body;

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

    // Validate fields according to provider definition
    const validation = validateProviderConfiguration(providerKey, configuration);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 422 }
      );
    }

    // Retrieve existing record if any to preserve existing secret values if masked
    const existing = await prisma.paymentProviderConfiguration.findUnique({
      where: { provider: providerKey },
    });

    const existingConfig = existing?.configuration || {};
    const configToStore = processConfigurationForStorage(
      configuration,
      existingConfig,
      def.fields
    );

    const shouldBeActive = Boolean(isActive);

    // Enforce Single Active Payment Gateway Rule: if activating this gateway, deactivate all others
    if (shouldBeActive) {
      await prisma.paymentProviderConfiguration.updateMany({
        where: {
          provider: { not: providerKey },
        },
        data: {
          isActive: false,
        },
      });
    }

    // Save/Upsert into Database
    const updatedRecord = await prisma.paymentProviderConfiguration.upsert({
      where: { provider: providerKey },
      update: {
        displayName: def.displayName,
        isActive: shouldBeActive,
        isLive: Boolean(isLive),
        configuration: configToStore,
      },
      create: {
        provider: providerKey,
        displayName: def.displayName,
        isActive: shouldBeActive,
        isLive: Boolean(isLive),
        configuration: configToStore,
      },
    });

    // Prepare response with masked secrets
    const maskedConfig = processConfigurationForClient(
      updatedRecord.configuration,
      def.fields
    );

    return NextResponse.json({
      success: true,
      data: {
        ...updatedRecord,
        configuration: maskedConfig,
      },
      message: `${def.displayName} configuration saved successfully!`,
    });
  } catch (error) {
    console.error('Error saving payment provider configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save payment provider configuration' },
      { status: 500 }
    );
  }
}
