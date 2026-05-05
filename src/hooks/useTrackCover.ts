import { useEffect, useState } from 'react';

import type { ITrack } from '../types/types';
import { getAudioMetadata } from '../utils/audioMetadata';

const useTrackCover = (track: ITrack | null, fallbackCover: string): string => {
  const [cover, setCover] = useState<string>(fallbackCover);

  useEffect(() => {
    let isMounted = true;
    setCover(fallbackCover);

    if (!track?.mediaurl) {
      return () => {
        isMounted = false;
      };
    }

    getAudioMetadata(track.mediaurl)
      .then(({ coverUrl }) => {
        if (!isMounted || !coverUrl) {
          return;
        }

        setCover(coverUrl);
      })
      .catch(() => {
        // Keep fallback cover.
      });

    return () => {
      isMounted = false;
    };
  }, [track, fallbackCover]);

  return cover;
};

export default useTrackCover;
