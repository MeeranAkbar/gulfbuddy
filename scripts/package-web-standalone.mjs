import { cp, mkdir, rm, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const webRoot = path.join(projectRoot, 'apps', 'web');
const buildRoot = path.join(webRoot, '.next');
const standaloneRoot = path.join(buildRoot, 'standalone');
const staticRoot = path.join(buildRoot, 'static');
const publicRoot = path.join(webRoot, 'public');
const distRoot = path.join(projectRoot, 'dist', 'web-standalone');

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await rm(distRoot, { recursive: true, force: true });
  await mkdir(distRoot, { recursive: true });

  await cp(standaloneRoot, distRoot, { recursive: true });
  await cp(staticRoot, path.join(distRoot, 'apps', 'web', '.next', 'static'), { recursive: true });
  if (await pathExists(publicRoot)) {
    await cp(publicRoot, path.join(distRoot, 'apps', 'web', 'public'), { recursive: true, force: true });
  }

  const readme = [
    '# GulfHabibi Web Standalone Package',
    '',
    'This package is generated from the Next.js standalone build.',
    '',
    'Run from the package root:',
    '',
    '```bash',
    'cd apps/web',
    'PORT=3000 HOSTNAME=0.0.0.0 node server.js',
    '```',
    '',
    'Required runtime env:',
    '- NEXT_PUBLIC_SUPABASE_URL',
    '- NEXT_PUBLIC_SUPABASE_ANON_KEY',
    '- SUPABASE_SERVICE_ROLE_KEY',
    '- NEXT_PUBLIC_APP_ENV',
    '- NEXT_PUBLIC_APP_URL',
    '- NEXT_PUBLIC_APP_DOMAIN',
    '- NEXT_PUBLIC_DEFAULT_LOCALE',
    '',
    'Deploy this only to a Node-capable host. Plain FTP/static hosting is not enough.'
  ].join('\n');

  await writeFile(path.join(distRoot, 'README_DEPLOY.txt'), readme, 'utf8');

  console.log(`Standalone package created at ${distRoot}`);
}

await main();
