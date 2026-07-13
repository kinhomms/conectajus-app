import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Keep lint focused on the active Next.js app, not legacy exports or nested copies.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "conectajus-core/**",
    "public/**",
    "server.js",
    "**/*.backup.*",
  ]),
]);

export default eslintConfig;
