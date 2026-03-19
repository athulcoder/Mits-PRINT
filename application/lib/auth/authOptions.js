import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { providers } from "./providers";
import { callbacks } from "./callbacks";

const TWO_WEEKS = 60 * 60 * 24 * 14;

export const authOptions = {
  adapter: PrismaAdapter(prisma, {
    modelMapping: {
      User: "Student",
    },
  }),

  providers,

  session: {
    strategy: "jwt",
    maxAge: TWO_WEEKS,
  },

  callbacks,

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};