import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const projectRef = process.env.SUPABASE_PROJECT_REF || "chfkssclmdshdcijfzdr";
const personalAccessToken = process.env.SUPABASE_ACCESS_TOKEN;
const projectRoot = process.cwd();
const migrationsDir = path.join(projectRoot, "supabase", "migrations");
const seedDir = path.join(projectRoot, "supabase", "seed");
const maxChunkLength = Number(process.env.SUPABASE_QUERY_CHUNK_MAX || 6500);
const startFromMigration = process.env.SUPABASE_START_FROM_MIGRATION || null;
const skipSeed = process.env.SUPABASE_SKIP_SEED === "1";

if (!personalAccessToken) {
  throw new Error("SUPABASE_ACCESS_TOKEN is required.");
}

function splitSqlStatements(sql) {
  const statements = [];
  let current = "";
  let singleQuote = false;
  let doubleQuote = false;
  let lineComment = false;
  let blockComment = false;
  let dollarTag = null;

  for (let index = 0; index < sql.length; index += 1) {
    const char = sql[index];
    const next = sql[index + 1];

    current += char;

    if (lineComment) {
      if (char === "\n") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        current += next;
        index += 1;
        blockComment = false;
      }
      continue;
    }

    if (singleQuote) {
      if (char === "'" && next === "'") {
        current += next;
        index += 1;
        continue;
      }
      if (char === "'") {
        singleQuote = false;
      }
      continue;
    }

    if (doubleQuote) {
      if (char === '"') {
        doubleQuote = false;
      }
      continue;
    }

    if (dollarTag) {
      if (sql.startsWith(dollarTag, index)) {
        for (let offset = 1; offset < dollarTag.length; offset += 1) {
          current += sql[index + offset];
        }
        index += dollarTag.length - 1;
        dollarTag = null;
      }
      continue;
    }

    if (char === "-" && next === "-") {
      current += next;
      index += 1;
      lineComment = true;
      continue;
    }

    if (char === "/" && next === "*") {
      current += next;
      index += 1;
      blockComment = true;
      continue;
    }

    if (char === "'") {
      singleQuote = true;
      continue;
    }

    if (char === '"') {
      doubleQuote = true;
      continue;
    }

    if (char === "$") {
      const rest = sql.slice(index);
      const match = rest.match(/^\$[A-Za-z0-9_]*\$/);
      if (match) {
        const tag = match[0];
        if (tag.length > 1) {
          for (let offset = 1; offset < tag.length; offset += 1) {
            current += sql[index + offset];
          }
          index += tag.length - 1;
          dollarTag = tag;
          continue;
        }
      }
    }

    if (char === ";") {
      const trimmed = current.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      current = "";
    }
  }

  const trailing = current.trim();
  if (trailing) {
    statements.push(trailing);
  }

  return statements;
}

function chunkStatements(statements, maxLength) {
  const chunks = [];
  let current = "";

  for (const statement of statements) {
    const normalized = statement.endsWith(";") ? statement : `${statement};`;
    if (normalized.length > maxLength) {
      throw new Error(`Single SQL statement exceeds chunk limit (${normalized.length} > ${maxLength}).`);
    }
    if (!current) {
      current = normalized;
      continue;
    }
    if (`${current}\n${normalized}`.length > maxLength) {
      chunks.push(current);
      current = normalized;
      continue;
    }
    current = `${current}\n${normalized}`;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

async function postQuery(query) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${personalAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status}: ${body}`);
  }

  return response.json().catch(() => null);
}

async function applyFile(filePath) {
  const sql = await readFile(filePath, "utf8");
  const statements = splitSqlStatements(sql);
  const chunks = chunkStatements(statements, maxChunkLength);

  console.log(`Applying ${path.basename(filePath)} in ${chunks.length} chunk(s)...`);
  for (let index = 0; index < chunks.length; index += 1) {
    await postQuery(chunks[index]);
    console.log(`  chunk ${index + 1}/${chunks.length} ok`);
  }
}

async function getSqlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => path.basename(left).localeCompare(path.basename(right)));
}

async function main() {
  let migrationFiles = await getSqlFiles(migrationsDir);
  const seedFiles = await getSqlFiles(seedDir);

  if (startFromMigration) {
    const startIndex = migrationFiles.findIndex(
      (filePath) => path.basename(filePath) === startFromMigration,
    );
    if (startIndex === -1) {
      throw new Error(`Could not find migration ${startFromMigration}.`);
    }
    migrationFiles = migrationFiles.slice(startIndex);
  }

  for (const filePath of migrationFiles) {
    await applyFile(filePath);
  }

  if (!skipSeed) {
    for (const filePath of seedFiles) {
      await applyFile(filePath);
    }
  }

  console.log("Staging apply completed.");
}

await main();
