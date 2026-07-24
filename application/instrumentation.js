/**
 * Next.js Instrumentation Hook
 * Executes on server startup to automatically run database migrations/seeding.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { seedDatabase } = await import('./lib/db/seed.js');
      await seedDatabase();
    } catch (error) {
      console.error('Failed to run startup database seeding:', error);
    }
  }
}
