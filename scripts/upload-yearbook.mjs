/**
 * Bulk yearbook photo uploader
 *
 * Usage:
 *   1. Put all photos in yearbook-photos/ named "Firstname Lastname.jpg"
 *   2. Run: node scripts/upload-yearbook.mjs
 */

import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join, extname, basename } from 'path';

const PHOTOS_DIR = './yearbook-photos';
const BUCKET = 'reunion-photos';
const R2_PUBLIC_BASE = 'https://pub-615a7ab081634ff89d67092401b432b0.r2.dev';
const DB_NAME = 'reunion-db';

const files = readdirSync(PHOTOS_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

if (files.length === 0) {
  console.error(`No image files found in ${PHOTOS_DIR}`);
  process.exit(1);
}

console.log(`Found ${files.length} photos. Starting upload...\n`);

const uploaded = [];

for (const file of files) {
  const name = basename(file, extname(file));
  const ext = extname(file).toLowerCase().replace('.', '');
  const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  const key = `yearbook/${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.${ext}`;
  const filePath = join(PHOTOS_DIR, file).replace(/\\/g, '/');

  console.log(`[${uploaded.length + 1}/${files.length}] Uploading: ${name}`);

  try {
    execSync(
      `npx wrangler r2 object put "${BUCKET}/${key}" --file "${filePath}" --content-type "${contentType}"`,
      { stdio: 'pipe' }
    );
    uploaded.push({ name, photoUrl: `${R2_PUBLIC_BASE}/${key}` });
    console.log(`  ✓ R2: ${key}`);
  } catch (err) {
    console.error(`  ✗ Failed to upload ${file}:`, err.stderr?.toString() || err.message);
  }
}

console.log(`\nUploaded ${uploaded.length}/${files.length} photos to R2.`);
console.log('Inserting into D1...\n');

let dbOk = 0;
for (const { name, photoUrl } of uploaded) {
  const safeName = name.replace(/'/g, "''");
  const sql = `INSERT INTO yearbook_photos (name, photo_url) VALUES ('${safeName}', '${photoUrl}') ON CONFLICT(name) DO UPDATE SET photo_url = excluded.photo_url`;

  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command "${sql}"`,
      { stdio: 'pipe' }
    );
    console.log(`  ✓ D1: ${name}`);
    dbOk++;
  } catch (err) {
    console.error(`  ✗ D1 failed for ${name}:`, err.stderr?.toString() || err.message);
  }
}

console.log(`\nDone! ${dbOk}/${uploaded.length} records saved to database.`);
