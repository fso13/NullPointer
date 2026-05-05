import { useEffect, useState } from 'react';

import type { IAlbum } from '../types/types';
import { getAudioMetadata } from '../utils/audioMetadata';

const useAlbumCover = (album: IAlbum | null | undefined): string => {
  const [cover, setCover] = useState<string>(album?.image || '');

  useEffect(() => {
    let isMounted = true;
    const firstTrack = album?.tracks?.[0];

    setCover(album?.image || '');

    // Keep explicit cover for "Без стенда" and do not override it from ID3.
    if (album?.id === 'bez-standa') {
      return () => {
        isMounted = false;
      };
    }

    if (!firstTrack?.mediaurl) {
      return () => {
        isMounted = false;
      };
    }

    getAudioMetadata(firstTrack.mediaurl)
      .then(({ coverUrl }) => {
        if (!isMounted || !coverUrl) {
          return;
        }

        setCover(coverUrl);
      })
      .catch(() => {
        // Keep fallback album image.
      });

    return () => {
      isMounted = false;
    };
  }, [album?.id, album?.image, album?.tracks]);

  return cover;
};

export default useAlbumCover;
