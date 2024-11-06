import createJiti from "jiti";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./env");

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
