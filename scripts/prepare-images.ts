/*
 * Script: prepare-images.ts
 * --------------------------------------------
 * Parcourt le dossier assets/images/seed, renomme récursivement tous les fichiers
 * (et dossiers) d'images en respectant la convention compatible Android
 *   - minuscules ASCII uniquement, accents supprimés, espaces -> _ , autres -> _
 * Génère ensuite automatiquement le mapping `db/ingredientImages.ts` utilisé
 * par resolveStaticImage.
 * 
 * Usage : npx ts-node scripts/prepare-images.ts
 */

import fs from 'fs';
import path from 'path';

// Racine des images seed
const SEED_DIR = path.resolve(__dirname, '../assets/images/seed');
// Fichier de sortie pour le mapping
const OUTPUT = path.resolve(__dirname, '../db/ingredientImages.ts');

interface MappingEntry {
  key: string;
  requirePath: string;
}

// Slugifie uniquement le nom (sans extension) et conserve l'extension d'origine
function slugifyFilename(filename: string): string {
  const { name, ext } = path.parse(filename);
  const slugName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9]/g, '_') // other chars -> _
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
  return `${slugName}${ext.toLowerCase()}`;
}

function slugifySegment(segment: string): string {
  return slugifyFilename(segment);
}

function renameIfNeeded(currentPath: string): string {
  const dir = path.dirname(currentPath);
  const base = path.basename(currentPath);
  const slug = slugifyFilename(base);
  if (base === slug) return currentPath; // rien à faire

  const newPath = path.join(dir, slug);
  fs.renameSync(currentPath, newPath);
  return newPath;
}

const mapping: MappingEntry[] = [];

function processDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    let currentPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Descendre d'abord puis renommer le dossier
      processDirectory(currentPath);
      const newDirPath = renameIfNeeded(currentPath);
      // Si renommé, on ne fait rien de plus (les sous-chemins ont déjà été traités)
      if (newDirPath !== currentPath) {
        // log
        console.log(`Renamed directory: ${entry.name} -> ${path.basename(newDirPath)}`);
      }
    } else if (entry.isFile()) {
      // Identifier extension
      let filename = entry.name;
      let assumedExt = '';
      if (!/\.(jpe?g|png)$/i.test(filename)) {
        // Pas d'extension : tenter de détecter suffixe _jpg/_png
        const m = filename.match(/_(jpe?g|png)$/i);
        if (m) {
          assumedExt = `.${m[1].toLowerCase().replace('jpeg', 'jpg')}`;
          filename = filename.replace(/_(jpe?g|png)$/i, assumedExt);
        } else {
          // Par défaut .jpg
          assumedExt = '.jpg';
          filename = `${filename}${assumedExt}`;
        }
        // Renommer fichier pour ajouter l'extension
        const newPathWithExt = path.join(dir, filename);
        fs.renameSync(currentPath, newPathWithExt);
        // Mettre à jour le path courant pour la suite
        currentPath = newPathWithExt;
      }

      // Filtrer à nouveau maintenant que l'extension est présente
      if (!/\.(jpe?g|png)$/i.test(filename)) continue;

      const oldRelative = path.relative(path.resolve(__dirname, '..'), currentPath).replace(/\\/g, '/');
      const newFilePath = renameIfNeeded(currentPath);
      const newRelative = path.relative(path.resolve(__dirname, '..'), newFilePath).replace(/\\/g, '/');

      if (newFilePath !== currentPath) {
        console.log(`Renamed file: ${entry.name} -> ${path.basename(newFilePath)}`);
      }

      // Mapping: nouveau chemin slugifié
      mapping.push({
        key: `../${newRelative}`,
        requirePath: `require('../${newRelative}')`,
      });

      // Mapping: ancien chemin (accentué) pointant vers le même require
      if (oldRelative !== newRelative) {
        mapping.push({
          key: `../${oldRelative}`,
          requirePath: `require('../${newRelative}')`,
        });
      }
    }
  }
}

processDirectory(SEED_DIR);

// Générer le fichier de mapping
const sorted = mapping.sort((a, b) => a.key.localeCompare(b.key));
const lines = sorted.map((m) => `  '${m.key}': ${m.requirePath},`);

const fileContent = `// ⚠️ Fichier généré automatiquement par scripts/prepare-images.ts
// Ne pas éditer manuellement
import { ImageSourcePropType } from 'react-native';

export const ingredientImages: { [key: string]: ImageSourcePropType } = {
${lines.join('\n')}
};
`;

fs.writeFileSync(OUTPUT, fileContent, 'utf8');
console.log(`\n✅ Mapping written to ${path.relative(process.cwd(), OUTPUT)} (entries: ${lines.length})`);
