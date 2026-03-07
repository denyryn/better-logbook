import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { config } from "./config";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: config.auth.google.clientId,
      clientSecret: config.auth.google.clientSecret,
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});

export async function authRequest(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthenticated = session?.user ? true : false;
  return isAuthenticated;
}
