#!/usr/bin/env node
/**
 * Regenerate public/robots.txt from scripts/robots.config.mjs.
 *
 * Usage:
 *   node scripts/sync-robots.mjs               # uses NODE_ENV or "prod"
 *   node scripts/sync-robots.mjs --env=dev
 *   node scripts/sync-robots.mjs --env=staging
 *   node scripts/sync-robots.mjs --env=prod
 *   node scripts/sync-robots.mjs --check       # exit 1 if file is out of sync
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { buildRobotsTxt } from "./robots.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TARGET = resolve(__dirname, "..", "public", "robots.txt");

const args = process.argv.slice(2);
const envArg = args.find((a) => a.startsWith("--env="))?.split("=")[1];
const checkOnly = args.includes("--check");

const env = envArg || process.env.NODE_ENV || "prod";
if (!["dev", "staging", "prod"].includes(env)) {
  console.error(`Unknown env "${env}". Use dev | staging | prod.`);
  process.exit(2);
}

const expected = buildRobotsTxt(env);

if (checkOnly) {
  const current = existsSync(TARGET) ? readFileSync(TARGET, "utf8") : "";
  if (current.trim() !== expected.trim()) {
    console.error(`✗ public/robots.txt is out of sync for env="${env}".`);
    console.error(`  Run: node scripts/sync-robots.mjs --env=${env}`);
    process.exit(1);
  }
  console.log(`✓ public/robots.txt matches env="${env}".`);
  process.exit(0);
}

writeFileSync(TARGET, expected, "utf8");
console.log(`✓ Wrote public/robots.txt (env=${env}, ${expected.length} bytes).`);
