import { defineConfig } from "drizzle-kit";
import { env } from "./env";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schema: "./server/schema/index.ts",
  strict: true,
  verbose: true,
});
