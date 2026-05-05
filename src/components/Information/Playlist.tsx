import { useEffect, useState } from 'react';

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
}

const Playlist: React.FC<IProps> = ({ album }) => {
  const { currentState, currentTrack, handlePlayPause } = useTrack();
  const [durationByTrackId, setDurationByTrackId] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    const tracks = album.tracks || [];

    Promise.all(
      tracks.map(async (track) => {
        const metadata = await getAudioMetadata(track.mediaurl);
        return [track.id, formatDuration(metadata.durationSec)] as const;
      })
    )
      .then((entries) => {
        if (!isMounted) {
          return;
        }

        setDurationByTrackId(Object.fromEntries(entries));
      })
      .catch(() => {
        // Keep static JSON duration fallback.
      });

    return () => {
      isMounted = false;
    };
  }, [album.tracks]);

  return (
    <section className='playlist'>
      {album.tracks?.map((item: ITrack) => (
        <TrackLine
          track={item}
          key={item.id}
          duration={durationByTrackId[item.id]}
          selected={currentTrack?.id === item.id}
          handlePlayPause={() => handlePlayPause(item, album)}
          playing={currentTrack?.id === item.id && currentState === 'playing'}
        />
      ))}
    </section>
  );
};

export default Playlist;
