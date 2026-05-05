import { useEffect, useState } from 'react';

import type { ITrack } from '../types/types';
import { getAudioMetadata } from '../utils/audioMetadata';

/**
 * Prefer `track.staticCoverUrl`, then embedded artwork fetched from audio, then `fallbackCover`.
 * Parent should remount the consumer with `key={track.id}` so fetched artwork resets per track.
 */
const useTrackCover = (track: ITrack | null, fallbackCover: string): string => {
  const [fetchedCover, setFetchedCover] = useState<string | null>(null);

  useEffect(() => {
    if (!track?.mediaurl || track.staticCoverUrl) {
      return;
    }

    let isMounted = true;

    getAudioMetadata(track.mediaurl)
      .then(({ coverUrl }) => {
        if (!isMounted || !coverUrl) {
          return;
        }

        setFetchedCover(coverUrl);
      })
      .catch(() => {
        // Keep fallback cover.
      });

    return () => {
      isMounted = false;
    };
  }, [track?.id, track?.mediaurl, track?.staticCoverUrl]);

  return track?.staticCoverUrl ?? fetchedCover ?? fallbackCover;
};

export default useTrackCover;
