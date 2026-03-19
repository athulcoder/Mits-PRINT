import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { providers } from "./providers";
import { callbacks } from "./callbacks";
import { parseStudentEmail } from "./utils";

const TWO_WEEKS = 60 * 60 * 24 * 14;
import { upsertStudent } from "./service";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers,
    callbacks,

    events: {
        async signIn({ user }) {
            await upsertStudent(user);
        },
    },

    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};