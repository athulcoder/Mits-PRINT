import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';

/**
 * Idempotent database seeder.
 * Runs on server startup and manual seed commands to ensure default admin and configurations exist.
 */
export async function seedDatabase() {
  try {
    console.log('🌱 Starting automatic database seeding...');

    const defaultAdminEmail = 'admin@mitsprint.com';
    const defaultPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Seed Default Admin Account
    const admin = await prisma.admin.upsert({
      where: { email: defaultAdminEmail },
      update: {
        fullName: 'System Admin',
        hashedPassword: hashedPassword,
      },
      create: {
        email: defaultAdminEmail,
        fullName: 'System Admin',
        hashedPassword: hashedPassword,
      },
    });

    console.log(`✅ Default admin created/updated: ${admin.email}`);

    // Seed Default Razorpay Configuration
    const razorpayConfig = await prisma.paymentProviderConfiguration.upsert({
      where: { provider: 'RAZORPAY' },
      update: {},
      create: {
        provider: 'RAZORPAY',
        displayName: 'Razorpay',
        isActive: true,
        isLive: false,
        configuration: {
          keyId: '',
          keySecret: '',
          webhookSecret: '',
          apiBaseUrl: 'https://api.razorpay.com',
        },
      },
    });
    console.log(`✅ Payment provider verified: ${razorpayConfig.displayName}`);

    // Seed Default Paytm Configuration
    const paytmConfig = await prisma.paymentProviderConfiguration.upsert({
      where: { provider: 'PAYTM' },
      update: {},
      create: {
        provider: 'PAYTM',
        displayName: 'Paytm',
        isActive: false,
        isLive: false,
        configuration: {
          merchantId: '',
          merchantKey: '',
          website: 'WEBSTAGING',
          industryType: 'Retail',
          callbackUrl: '',
          webhookSecret: '',
        },
      },
    });
    console.log(`✅ Payment provider verified: ${paytmConfig.displayName}`);

    console.log('🚀 Automatic database seeding completed!');
  } catch (error) {
    console.error('⚠️ Database seeding status:', error?.message || error);
  }
}
