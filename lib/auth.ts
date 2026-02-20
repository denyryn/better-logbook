import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
    maxPasswordLength: 128,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
    revokeSessionsOnEmailChange: true,
  },
});
