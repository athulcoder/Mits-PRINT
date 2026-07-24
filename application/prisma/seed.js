import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

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

  // Seed Default Razorpay Configuration shell if not existing
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
  console.log(`✅ Default payment provider seeded: ${razorpayConfig.displayName}`);

  // Seed Default Paytm Configuration shell if not existing
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
  console.log(`✅ Default payment provider seeded: ${paytmConfig.displayName}`);

  console.log('🚀 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
