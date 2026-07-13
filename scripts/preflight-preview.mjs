import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "docs/APPLY_SUPABASE_MIGRATIONS.md",
  "docs/SUPABASE_MIGRATION_ORDER.md",
  "docs/SUPABASE_POST_APPLY_VALIDATION.sql",
  "docs/SUPABASE_TEST_PROFILES.md",
  "docs/PREVIEW_READINESS.md",
  "docs/VERCEL_DEPLOYMENT.md",
  "vercel.json",
];

const validationNeedles = [
  "marketplace_opportunities",
  "citizen_documents",
  "lawyer_profiles",
  "lawyer_credit_purchase_requests",
  "account_deletion_requests",
  "decide_lawyer_oab_verification",
  "decide_account_deletion_request",
  "approve_credit_purchase_request",
  "reject_credit_purchase_request",
  "decided_by",
  "decided_at",
  "verified_by",
  "verified_at",
  "citizen-documents",
];

const previewNeedles = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "ui-v6-premium",
  "verified_by",
  "decided_by",
];

const errors = [];

async function readRequiredFile(relativePath) {
  try {
    return await readFile(join(root, relativePath), "utf8");
  } catch {
    errors.push(`Arquivo obrigatório ausente: ${relativePath}`);
    return "";
  }
}

const migrationFiles = (await readdir(join(root, "supabase", "migrations")))
  .filter((fileName) => fileName.endsWith(".sql"))
  .sort();

const migrationOrder = await readRequiredFile("docs/SUPABASE_MIGRATION_ORDER.md");
const applyGuide = await readRequiredFile("docs/APPLY_SUPABASE_MIGRATIONS.md");
const validationSql = await readRequiredFile("docs/SUPABASE_POST_APPLY_VALIDATION.sql");
const previewReadiness = await readRequiredFile("docs/PREVIEW_READINESS.md");
const vercelConfig = await readRequiredFile("vercel.json");

await Promise.all(requiredFiles.map((relativePath) => readRequiredFile(relativePath)));

for (const fileName of migrationFiles) {
  if (!migrationOrder.includes(fileName)) {
    errors.push(`Migration não listada em docs/SUPABASE_MIGRATION_ORDER.md: ${fileName}`);
  }
}

const documentedMigrations = [...migrationOrder.matchAll(/`(20\d{12}_[^`]+\.sql)`/g)].map((match) => match[1]);
for (const fileName of documentedMigrations) {
  if (!migrationFiles.includes(fileName)) {
    errors.push(`Migration documentada não existe em supabase/migrations: ${fileName}`);
  }
}

const latestMigration = migrationFiles.at(-1);
if (latestMigration && !applyGuide.includes(latestMigration)) {
  errors.push(`docs/APPLY_SUPABASE_MIGRATIONS.md não menciona a migration mais recente: ${latestMigration}`);
}

for (const needle of validationNeedles) {
  if (!validationSql.includes(needle)) {
    errors.push(`Validação Supabase não cobre item crítico: ${needle}`);
  }
}

for (const needle of previewNeedles) {
  if (!previewReadiness.includes(needle)) {
    errors.push(`Preview readiness não menciona item crítico: ${needle}`);
  }
}

if (!vercelConfig.includes('"framework": "nextjs"')) {
  errors.push('vercel.json não declara "framework": "nextjs"');
}

if (!vercelConfig.includes('"buildCommand": "npm run validate"')) {
  errors.push('vercel.json não declara "buildCommand": "npm run validate"');
}

if (errors.length > 0) {
  console.error("Preflight de preview encontrou pendências:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Preflight de preview aprovado.");
console.log(`Migrations conferidas: ${migrationFiles.length}`);
console.log(`Migration mais recente: ${latestMigration ?? "nenhuma"}`);
