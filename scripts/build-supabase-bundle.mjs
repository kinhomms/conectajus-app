import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const migrationsDir = join(root, "supabase", "migrations");
const outputPath = join(root, "supabase", "APPLY_ALL_MIGRATIONS.sql");

const migrationFiles = (await readdir(migrationsDir))
  .filter((fileName) => fileName.endsWith(".sql"))
  .sort();

if (migrationFiles.length === 0) {
  console.error("Nenhuma migration encontrada em supabase/migrations.");
  process.exit(1);
}

const header = [
  "-- ConectaJus — bundle manual de migrations Supabase",
  "-- Gerado por: npm run supabase:bundle",
  "-- Uso recomendado:",
  "-- 1. Abra o Supabase Dashboard do projeto correto.",
  "-- 2. Acesse SQL Editor.",
  "-- 3. Execute este arquivo em um banco de teste ou preview antes de produção.",
  "-- 4. Depois execute docs/SUPABASE_POST_APPLY_VALIDATION.sql.",
  "--",
  "-- Observação: as migrations originais continuam sendo a fonte de verdade.",
  "-- Este bundle existe apenas para reduzir erro manual de ordem no SQL Editor.",
  "",
].join("\n");

const chunks = [header];

for (const [index, fileName] of migrationFiles.entries()) {
  const sql = await readFile(join(migrationsDir, fileName), "utf8");
  chunks.push([
    "",
    "-- =========================================================",
    `-- ${String(index + 1).padStart(2, "0")}/${migrationFiles.length} — ${fileName}`,
    "-- =========================================================",
    "",
    sql.trim(),
    "",
  ].join("\n"));
}

chunks.push([
  "",
  "-- =========================================================",
  "-- Fim do bundle",
  "-- Próximo passo: executar docs/SUPABASE_POST_APPLY_VALIDATION.sql",
  "-- =========================================================",
  "",
].join("\n"));

await mkdir(join(root, "supabase"), { recursive: true });
await writeFile(outputPath, chunks.join("\n"), "utf8");

console.log("Bundle Supabase gerado com sucesso.");
console.log(`Migrations incluídas: ${migrationFiles.length}`);
console.log("Arquivo: supabase/APPLY_ALL_MIGRATIONS.sql");
