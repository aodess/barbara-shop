// Конвертирует все jpg/jpeg/png/gif из public/images/originals/ → WebP в public/images/
// Запуск: npm run webp
// После конвертации прописать новые пути в src/data/content.json

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT  = join(__dirname, '../public/images/originals');
const OUTPUT = join(__dirname, '../public/images');

const QUALITY   = 85;
const MAX_HERO  = 1920;   // для hero-фотографий (широкие)
const MAX_CARD  = 1200;   // для галереи и карточек мастеров
const MAX_THUMB = 600;    // для миниатюр

async function convert() {
  await mkdir(OUTPUT, { recursive: true });

  let files;
  try {
    files = await readdir(INPUT);
  } catch {
    console.log(`Папка ${INPUT} не найдена или пуста. Создайте её и положите исходники.`);
    return;
  }

  const supported = ['.jpg', '.jpeg', '.png', '.gif', '.tif', '.tiff'];
  const images = files.filter(f => supported.includes(extname(f).toLowerCase()));

  if (!images.length) {
    console.log('Нет изображений для конвертации.');
    return;
  }

  for (const file of images) {
    const name  = basename(file, extname(file));
    const input  = join(INPUT, file);
    const output = join(OUTPUT, `${name}.webp`);

    // Определяем maxWidth по имени файла
    const maxW = file.startsWith('hero') ? MAX_HERO
               : file.startsWith('thumb') ? MAX_THUMB
               : MAX_CARD;

    try {
      const info = await sharp(input)
        .resize({ width: maxW, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(output);

      console.log(`✓ ${file} → ${name}.webp (${Math.round(info.size / 1024)} КБ)`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }
  console.log('\nГотово. Пропишите пути *.webp в src/data/content.json');
}

convert();
