#!/usr/bin/env node
/**
 * sync-i18n-keys.js
 *
 * Synchronise deux fichiers de traduction JSON afin qu'ils aient exactement la même
 * arborescence de clés. Les clés manquantes sont copiées d'un fichier à l'autre en
 * utilisant la valeur source comme placeholder.
 *
 * Usage:
 *   node scripts/sync-i18n-keys.js <fileA> <fileB>
 *
 * Exemple:
 *   node scripts/sync-i18n-keys.js i18n/locales/en-US/translation.json i18n/locales/fr-FR/translation.json
 */
const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('❌  Usage: node scripts/sync-i18n-keys.js <fileA> <fileB>');
  process.exit(1);
}

const [fileAPath, fileBPath] = process.argv.slice(2);

function readJson(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(`❌  File not found: ${abs}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch (e) {
    console.error(`❌  Invalid JSON in ${abs}`);
    console.error(e.message);
    process.exit(1);
  }
}

function writeJson(filePath, obj) {
  fs.writeFileSync(
    path.resolve(filePath),
    JSON.stringify(obj, null, 2) + '\n',
    'utf8',
  );
}

// Flatten nested object into Map<keyPath, value>
function flattenKeys(obj, prefix = '', map = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const pathKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flattenKeys(v, pathKey, map);
    } else {
      map.set(pathKey, v);
    }
  }
  return map;
}

// Ensure nested objects exist and set value at path
function setNested(obj, pathArr, value) {
  let current = obj;
  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i];
    if (i === pathArr.length - 1) {
      current[key] = value;
    } else {
      if (
        typeof current[key] !== 'object' ||
        Array.isArray(current[key]) ||
        current[key] === null
      ) {
        current[key] = {};
      }
      current = current[key];
    }
  }
}

const jsonA = readJson(fileAPath);
const jsonB = readJson(fileBPath);

const mapA = flattenKeys(jsonA);
const mapB = flattenKeys(jsonB);

const missingInB = [...mapA.keys()].filter((k) => !mapB.has(k));
const missingInA = [...mapB.keys()].filter((k) => !mapA.has(k));

missingInB.forEach((key) => {
  const val = mapA.get(key);
  setNested(jsonB, key.split('.'), val);
});
missingInA.forEach((key) => {
  const val = mapB.get(key);
  setNested(jsonA, key.split('.'), val);
});

if (missingInA.length === 0 && missingInB.length === 0) {
  console.log('✅  No missing keys, files already in sync.');
} else {
  console.log(`➕  Added ${missingInB.length} keys to ${fileBPath}`);
  console.log(`➕  Added ${missingInA.length} keys to ${fileAPath}`);
  writeJson(fileAPath, jsonA);
  writeJson(fileBPath, jsonB);
  console.log('💾  Files updated.');
}
