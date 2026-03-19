import { upsertStudent } from "./service";

export const callbacks = {
  async signIn({ user }) {
    if (!user.email?.endsWith("@mgits.ac.in")) {
      return false;
    }
    return true;
  },

  async session({ session }) {
    return session;
  },
};