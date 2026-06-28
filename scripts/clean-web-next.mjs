import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextDir = path.join(__dirname, '..', 'apps', 'web', '.next');

try {
  await fs.rm(nextDir, { recursive: true, force: true });
  console.log(`[clean-web-next] Removed ${nextDir}`);
} catch (error) {
  console.warn('[clean-web-next] Skipped cleanup:', error);
}
