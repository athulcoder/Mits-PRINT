import { seedDatabase } from '../lib/db/seed.js';
import { prisma } from '../lib/prisma.js';

async function main() {
  await seedDatabase();
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
