import { parseBlob } from 'music-metadata-browser';

export interface IAudioMetadata {
  coverUrl: string | null;
  durationSec: number | null;
}

const metadataPromiseCache = new Map<string, Promise<IAudioMetadata>>();

const readSyncSafeInt = (bytes: Uint8Array, offset: number): number =>
  ((bytes[offset] & 0x7f) << 21)
  | ((bytes[offset + 1] & 0x7f) << 14)
  | ((bytes[offset + 2] & 0x7f) << 7)
  | (bytes[offset + 3] & 0x7f);

const readLatin1String = (bytes: Uint8Array, start: number, end: number): string => {
  let result = '';
  for (let i = start; i < end; i += 1) {
    const char = bytes[i];
    if (char === 0) {
      break;
    }
    result += String.fromCharCode(char);
  }
  return result;
};

const findTerminator = (bytes: Uint8Array, start: number, encoding: number): number => {
  if (encoding === 1 || encoding === 2) {
    for (let i = start; i + 1 < bytes.length; i += 2) {
      if (bytes[i] === 0 && bytes[i + 1] === 0) {
        return i + 2;
      }
    }
    return bytes.length;
  }

  for (let i = start; i < bytes.length; i += 1) {
    if (bytes[i] === 0) {
      return i + 1;
    }
  }
  return bytes.length;
};

const extractCoverFromId3 = (bytes: Uint8Array): string | null => {
  if (bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) {
    return null;
  }

  const version = bytes[3];
  const tagSize = readSyncSafeInt(bytes, 6);
  let offset = 10;
  const tagEnd = Math.min(bytes.length, offset + tagSize);

  while (offset + 10 <= tagEnd) {
    const frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
    const frameSize = version === 4
      ? readSyncSafeInt(bytes, offset + 4)
      : ((bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | (bytes[offset + 6] << 8) | bytes[offset + 7]);

    if (!frameId.trim() || frameSize <= 0 || offset + 10 + frameSize > tagEnd) {
      break;
    }

    const frameStart = offset + 10;
    const frameEnd = frameStart + frameSize;

    if (frameId === 'APIC' || frameId === 'PIC') {
      const encoding = bytes[frameStart];
      let cursor = frameStart + 1;
      let mime = 'image/jpeg';

      if (frameId === 'APIC') {
        const mimeEnd = findTerminator(bytes, cursor, 0);
        mime = readLatin1String(bytes, cursor, mimeEnd - 1) || mime;
        cursor = mimeEnd;
      } else {
        const format = readLatin1String(bytes, cursor, cursor + 3).toUpperCase();
        mime = format === 'PNG' ? 'image/png' : 'image/jpeg';
        cursor += 3;
      }

      cursor += 1; // picture type
      cursor = findTerminator(bytes, cursor, encoding); // skip description

      if (cursor < frameEnd) {
        const imageBytes = bytes.slice(cursor, frameEnd);
        return URL.createObjectURL(new Blob([imageBytes], { type: mime }));
      }
    }

    offset = frameEnd;
  }

  return null;
};

const getDurationFromAudioElement = (src: string): Promise<number | null> =>
  new Promise((resolve) => {
    const audio = new Audio();

    const cleanup = () => {
      audio.removeAttribute('src');
      audio.load();
    };

    audio.preload = 'metadata';
    audio.src = src;

    audio.onloadedmetadata = () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : null;
      cleanup();
      resolve(duration);
    };

    audio.onerror = () => {
      cleanup();
      resolve(null);
    };
  });

export const formatDuration = (durationSec: number | null): string => {
  if (!durationSec || !Number.isFinite(durationSec)) {
    return '0:00';
  }

  const minutes = Math.floor(durationSec / 60);
  const seconds = Math.floor(durationSec % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getAudioMetadata = (src: string): Promise<IAudioMetadata> => {
  const cachedPromise = metadataPromiseCache.get(src);
  if (cachedPromise) {
    return cachedPromise;
  }

  const metadataPromise = fetch(src)
    .then((response) => response.blob())
    .then(async (blob) => {
      let coverUrl: string | null = null;
      let durationSec: number | null = null;
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      try {
        const metadata = await parseBlob(blob);
        const cover = metadata.common.picture?.[0];

        if (cover?.data?.length) {
          coverUrl = URL.createObjectURL(new Blob([new Uint8Array(cover.data)], { type: cover.format }));
        }

        durationSec = metadata.format.duration ?? null;
      } catch {
        // Keep fallbacks below.
      }

      if (!coverUrl) {
        coverUrl = extractCoverFromId3(bytes);
      }

      if (!durationSec) {
        durationSec = await getDurationFromAudioElement(src);
      }

      return { coverUrl, durationSec };
    })
    .catch(async () => ({
      coverUrl: null,
      durationSec: await getDurationFromAudioElement(src),
    }));

  metadataPromiseCache.set(src, metadataPromise);
  return metadataPromise;
};
