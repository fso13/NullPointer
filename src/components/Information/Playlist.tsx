import { useEffect, useMemo, useState } from 'react';

// hooks
import useTrack from '../../hooks/useTrack';

// components
import TrackLine from './TrackLine';

// types
import type { IAlbum, ITrack } from '../../types/types';
import { formatDuration, getAudioMetadata } from '../../utils/audioMetadata';

// interfaces
interface IProps {
  album: IAlbum;
  searchQuery?: string;
}

const Playlist: React.FC<IProps> = ({ album, searchQuery = '' }) => {
  const { currentState, currentTrack, handlePlayPause } = useTrack();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const staticDurationById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of album.tracks || []) {
      if (t.staticDurationSec != null && Number.isFinite(t.staticDurationSec)) {
        map[t.id] = formatDuration(t.staticDurationSec);
      }
    }
    return map;
  }, [album.tracks]);
  const filteredTracks = useMemo(
    () =>
      (album.tracks || []).filter((track) => {
        if (!normalizedQuery) {
          return true;
        }

        return [track.name, album.name, album.artist.name].some((field) =>
          field.toLowerCase().includes(normalizedQuery)
        );
      }),
    [album.artist.name, album.name, album.tracks, normalizedQuery]
  );

  const [fetchedDurationById, setFetchedDurationById] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    const tracks = album.tracks || [];
    const missing = tracks.filter(
      (t) => t.staticDurationSec == null || !Number.isFinite(t.staticDurationSec)
    );

    if (!missing.length) {
      return () => {
        isMounted = false;
      };
    }

    Promise.all(
      missing.map(async (track) => {
        const metadata = await getAudioMetadata(track.mediaurl);
        return [track.id, formatDuration(metadata.durationSec)] as const;
      })
    )
      .then((entries) => {
        if (!isMounted) {
          return;
        }

        setFetchedDurationById(Object.fromEntries(entries));
      })
      .catch(() => {
        // Keep album JSON duration fallback via TrackLine.
      });

    return () => {
      isMounted = false;
    };
  }, [album.tracks]);

  return (
    <section className='playlist'>
      {filteredTracks.map((item: ITrack) => (
        <TrackLine
          track={item}
          key={item.id}
          duration={staticDurationById[item.id] ?? fetchedDurationById[item.id]}
          selected={currentTrack?.id === item.id}
          handlePlayPause={() => handlePlayPause(item, album)}
          playing={currentTrack?.id === item.id && currentState === 'playing'}
        />
      ))}
    </section>
  );
};

export default Playlist;
