import { useEffect, useState } from 'react';

import type { IAlbum } from '../types/types';
import { getAudioMetadata } from '../utils/audioMetadata';

const useAlbumCover = (album: IAlbum | null | undefined): string => {
  const baseImage = album?.image || '';
  const albumId = album?.id;
  const firstTrack = album?.tracks?.[0];
  const firstTrackStaticCover = firstTrack?.staticCoverUrl;

  const [fetchedByAlbumId, setFetchedByAlbumId] = useState<Record<string, string>>({});

  useEffect(() => {
    if (
      !albumId ||
      albumId === 'bez-standa' ||
      albumId === 'na-moej-mashine-rabotaet' ||
      firstTrackStaticCover ||
      !firstTrack?.mediaurl
    ) {
      return;
    }

    let isMounted = true;

    getAudioMetadata(firstTrack.mediaurl)
      .then(({ coverUrl }) => {
        if (!isMounted || !coverUrl) {
          return;
        }

        setFetchedByAlbumId((prev) => ({ ...prev, [albumId]: coverUrl }));
      })
      .catch(() => {
        // Keep fallback album image.
      });

    return () => {
      isMounted = false;
    };
  }, [albumId, firstTrack?.mediaurl, firstTrackStaticCover]);

  if (!album) {
    return '';
  }

  if (album.id === 'bez-standa' || album.id === 'na-moej-mashine-rabotaet') {
    return baseImage;
  }

  if (firstTrack?.staticCoverUrl) {
    return firstTrack.staticCoverUrl;
  }

  return (albumId && fetchedByAlbumId[albumId]) || baseImage;
};

export default useAlbumCover;
