import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  encryptValue,
  decryptValue,
  maskSecretValue,
  isMaskedValue,
} from '@/lib/payment-providers/encryption';

/**
 * GET /api/admin/auth-config
 * Returns Google / Firebase Auth Configuration (with secrets masked)
 */
export async function GET() {
  try {
    const configRecord = await prisma.paymentProviderConfiguration.findFirst({
      where: { displayName: 'Google Auth' },
    });

    const storedConfig = configRecord?.configuration || {};
    const maskedSecret = storedConfig.clientSecret
      ? maskSecretValue(decryptValue(storedConfig.clientSecret))
      : '';

    return NextResponse.json({
      success: true,
      data: {
        clientId: storedConfig.clientId || process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: maskedSecret,
        allowedDomains: storedConfig.allowedDomains || '@mgits.ac.in',
        isActive: configRecord ? configRecord.isActive : true,
        updatedAt: configRecord?.updatedAt || null,
      },
    });
  } catch (error) {
    console.error('Error fetching auth configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch auth configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/auth-config
 * Saves or updates Google / Firebase Auth Configuration securely
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { clientId, clientSecret, allowedDomains = '@mgits.ac.in', isActive = true } = body;

    if (!clientId || !String(clientId).trim()) {
      return NextResponse.json(
        { success: false, error: 'Google Client ID is required' },
        { status: 400 }
      );
    }

    const existingRecord = await prisma.paymentProviderConfiguration.findFirst({
      where: { displayName: 'Google Auth' },
    });

    const existingConfig = existingRecord?.configuration || {};
    let finalSecret = existingConfig.clientSecret || '';

    if (clientSecret && !isMaskedValue(clientSecret)) {
      finalSecret = encryptValue(clientSecret);
    }

    const updatedRecord = await prisma.paymentProviderConfiguration.upsert({
      where: { id: existingRecord?.id || 'google-auth-config-id' },
      update: {
        displayName: 'Google Auth',
        isActive: Boolean(isActive),
        configuration: {
          clientId: String(clientId).trim(),
          clientSecret: finalSecret,
          allowedDomains: String(allowedDomains).trim(),
        },
      },
      create: {
        id: 'google-auth-config-id',
        provider: 'RAZORPAY', // Placeholder matching enum
        displayName: 'Google Auth',
        isActive: Boolean(isActive),
        configuration: {
          clientId: String(clientId).trim(),
          clientSecret: finalSecret,
          allowedDomains: String(allowedDomains).trim(),
        },
      },
    });

    const maskedSecret = maskSecretValue(decryptValue(finalSecret));

    return NextResponse.json({
      success: true,
      data: {
        clientId: String(clientId).trim(),
        clientSecret: maskedSecret,
        allowedDomains: String(allowedDomains).trim(),
        isActive: updatedRecord.isActive,
        updatedAt: updatedRecord.updatedAt,
      },
      message: 'Google Auth configuration saved successfully!',
    });
  } catch (error) {
    console.error('Error saving auth configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save auth configuration' },
      { status: 500 }
    );
  }
}
