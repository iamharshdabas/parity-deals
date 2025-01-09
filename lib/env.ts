import { loadEnvConfig } from "@next/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

loadEnvConfig(process.cwd());

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_BASIC_PRICE: z.string().min(1),
    STRIPE_STANDARD_PRICE: z.string().min(1),
    STRIPE_PREMIUM_PRICE: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
