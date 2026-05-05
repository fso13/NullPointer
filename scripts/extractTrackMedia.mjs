import { mkdir, readdir, readFile, writeFile, unlink } from 'fs/promises';
import { basename, join } from 'path';
import { fileURLToPath } from 'url';

import { parseFile } from 'music-metadata';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const albumDataPath = join(root, 'src', 'data', 'albumData.json');
const outJsonPath = join(root, 'src', 'data', 'trackMediaStatic.json');
const coversDir = join(publicDir, 'static', 'track-covers');

const extFromMime = (mime) => {
  if (!mime) {
    return '.jpg';
  }
  if (mime.includes('png')) {
    return '.png';
  }
  if (mime.includes('webp')) {
    return '.webp';
  }
  return '.jpg';
};

const main = async () => {
  const raw = await readFile(albumDataPath, 'utf8');
  const albums = JSON.parse(raw);
  await mkdir(coversDir, { recursive: true });

  const previousFiles = new Set();
  try {
    for (const name of await readdir(coversDir)) {
      if (name !== '.gitkeep') {
        previousFiles.add(name);
      }
    }
  } catch {
    // Directory was just created.
  }

  const generated = new Set();
  /** @type {Record<string, { durationSec: number | null; coverUrl: string | null }>} */
  const manifest = {};

  for (const album of albums) {
    for (const track of album.tracks || []) {
      const { id, mediaurl } = track;
      if (!id || !mediaurl || !mediaurl.startsWith('/')) {
        console.warn(`Skip track without id or mediaurl: ${JSON.stringify(track)}`);
        continue;
      }

      const audioPath = join(publicDir, mediaurl.slice(1));
      let durationSec = null;
      let coverUrl = null;

      try {
        const metadata = await parseFile(audioPath);
        durationSec =
          metadata.format.duration != null && Number.isFinite(metadata.format.duration)
            ? metadata.format.duration
            : null;

        const picture = metadata.common.picture?.[0];
        if (picture?.data?.length) {
          const ext = extFromMime(picture.format);
          const fileName = `${id}${ext}`;
          const outPath = join(coversDir, fileName);
          await writeFile(outPath, picture.data);
          generated.add(fileName);
          coverUrl = `/static/track-covers/${fileName}`;
        }
      } catch (err) {
        console.warn(`metadata: ${audioPath}`, err);
      }

      manifest[id] = { durationSec, coverUrl };
    }
  }

  for (const name of previousFiles) {
    if (!generated.has(name)) {
      await unlink(join(coversDir, name)).catch(() => {});
    }
  }

  await writeFile(outJsonPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log('Wrote', basename(outJsonPath));
  console.log('Covers in', coversDir, 'files:', generated.size);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
