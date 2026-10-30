import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dryRunOutput = execSync('git add -A --dry-run', { cwd: rootDir, encoding: 'utf8' });
const files = dryRunOutput
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith("add '"))
  .map((line) => line.slice(5, -1));

console.log(`[scan-secrets] Scanning ${files.length} files to be committed...`);

const issues = [];
// Standard JWT structure: header.payload.signature, starting with eyJ
const jwtRegex = /(?:['"`\s=:]|^)(eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]+)/;
const secretKeyRegex = /(service_role|sb_secret|private_key|secret_key)/i;
const passwordRegex = /(password\s*[:=]\s*['"][^'"]+['"])/i;

for (const relFile of files) {
  const fullPath = path.join(rootDir, relFile);
  if (!fs.existsSync(fullPath)) continue;

  const stats = fs.statSync(fullPath);
  if (stats.size > 25 * 1024 * 1024) {
    issues.push({ file: relFile, issue: `File size exceeds 25 MB (${(stats.size / (1024 * 1024)).toFixed(2)} MB)` });
  }

  // Skip images/binaries from regex string search
  const ext = path.extname(relFile).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.webp', '.ico', '.svg'].includes(ext)) {
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Exclude this scanner script itself and DEPLOY.md instructions from matching the regex patterns
    if (relFile === 'scripts/scan-secrets.mjs' || relFile === 'DEPLOY.md') return;

    if (jwtRegex.test(line)) {
      issues.push({ file: relFile, line: idx + 1, issue: 'JWT token match', snippet: line.trim() });
    }
    if (secretKeyRegex.test(line)) {
      issues.push({ file: relFile, line: idx + 1, issue: 'Secret key match', snippet: line.trim() });
    }
  });
}

if (issues.length > 0) {
  console.error(`[scan-secrets] FAIL: Found ${issues.length} potential secrets:`);
  console.error(JSON.stringify(issues, null, 2));
  process.exit(1);
} else {
  console.log('[scan-secrets] PASS: All files scanned cleanly. No secrets, no files > 25 MB.');
}
