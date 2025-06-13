// scripts/createCjsExport.ts

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Mimic __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output path
const distPath = path.resolve(__dirname, "./dist");
const outputDir = path.join(distPath, "cjs");
const outputFile = path.join(outputDir, "index.cjs");

// Create folder if not exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Template for default-export CJS fallback
const fileContent = `
// This file is auto-generated to support require() default imports
module.exports = require('../index.cjs').default;
`;

// Write to file
writeFileSync(outputFile, fileContent.trim() + "\n", "utf8");

console.log(`✅ Created CommonJS wrapper: ${outputFile}`);
