/*
 * Script: fix-seed-image-paths.ts
 * --------------------------------------------
 * Parcourt tous les fichiers .ts dans le dossier db/ (sauf ingredientImages.ts)
 * Cherche les chaînes littérales vers '../assets/images/seed/...'
 * Slugifie chaque segment de chemin pour correspondre aux renommages effectués
 * (minuscules ASCII, accents supprimés, espaces -> _ etc.).
 * Si une ligne est modifiée, le fichier est ré-écrit.
 * 
 * Usage : npx ts-node scripts/fix-seed-image-paths.ts
 */

import fs from 'fs';
import path from 'path';

const DB_DIR = path.resolve(__dirname, '../db');

function slugifyFilename(filename: string): string {
  const { name, ext } = path.parse(filename);
  const slugName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
  return `${slugName}${ext.toLowerCase()}`;
}

function slugifyPath(p: string): string {
  const parts = p.split('/');
  const slugged = parts.map((part) =>
    part === '..' || part === '.' ? part : slugifyFilename(part),
  );
  return slugged.join('/');
}

let totalChanges = 0;

for (const file of fs.readdirSync(DB_DIR)) {
  if (!file.endsWith('.ts') || file === 'ingredientImages.ts') continue;

  const filePath = path.join(DB_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const regex = /'[^']*assets\/images\/seed\/[^']+'/g;
  const matches = content.match(regex);
  if (!matches) continue;

  let changed = false;
  for (const match of matches) {
    const originalPath = match.slice(1, -1); // remove quotes

    // Ensure path starts with "../assets" instead of "/assets"
    const pathWithDots = originalPath.startsWith('/assets')
      ? `../${originalPath.slice(1)}`
      : originalPath;

    const fixedPath = slugifyPath(pathWithDots);
    if (originalPath !== fixedPath) {
      content = content.replace(match, `'${fixedPath}'`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✔︎ Updated ${file}`);
    totalChanges++;
  }
}

console.log(`\n✅ Seed files updated: ${totalChanges}`);
