import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { getAudioMetadata } from '../../utils/audioMetadata';

// hooks
import useTrack from '../../hooks/useTrack';
import useAlbumCover from '../../hooks/useAlbumCover';

// types
import type { IAlbum, ITrack } from '../../types/types';

// interfaces
interface IProps {
  album: IAlbum;
  track: ITrack;
  playing: boolean;
}

const SongThumbnail: React.FC<{ track: ITrack; albumCover: string }> = ({ track, albumCover }) => {
  const [blobCover, setBlobCover] = useState<string | null>(null);

  useEffect(() => {
    if (track.staticCoverUrl || !track.mediaurl) {
      return;
    }

    let isMounted = true;

    getAudioMetadata(track.mediaurl)
      .then(({ coverUrl }) => {
        if (!isMounted || !coverUrl) {
          return;
        }

        setBlobCover(coverUrl);
      })
      .catch(() => {
        // Keep album cover as fallback.
      });

    return () => {
      isMounted = false;
    };
  }, [track.mediaurl, track.staticCoverUrl]);

  const url = track.staticCoverUrl ?? blobCover ?? albumCover;

  return (
    <div
      className='image'
      style={{
        backgroundImage: `url(${url})`,
      }}
    />
  );
};

const Song: React.FC<IProps> = ({ album, track, playing }) => {
  const { handlePlayPause } = useTrack();
  const albumCover = useAlbumCover(album);

  return (
    <Link
      to={`/album/${album.id}`}
      onClick={(e) => {
        e.preventDefault();

        handlePlayPause(track, album);
      }}
      className='song flex flex-gap flex-v-center active-opacity'
    >
      <SongThumbnail key={track.id} track={track} albumCover={albumCover} />
      <div className='flex flex-1 flex-gap-small flex-v-center name'>
        <div className='flex flex-1 flex-gap-small flex-v-center'>
          <strong>{track.name}</strong>
          {track.explicit && <span className='material-symbols-outlined'>explicit</span>}
        </div>
        <div className='flex flex-2 flex-gap-small flex-v-center'>
          <div className='artist-name flex flex-1'>
            <span>{album.artist.name}</span>
          </div>
          <div className='play-count flex flex-1'>
            <span>{track.playcount} plays</span>
          </div>
          <div className='album-name flex flex-2 flex-h-end'>
            <span>{album.name}</span>
          </div>
        </div>
      </div>
      <div className='song-actions flex flex-h-center'>
        <div className='song-arrow flex flex-h-center flex-v-center'>
          <span className='material-symbols-outlined'>{playing ? 'pause' : 'play_arrow'}</span>
        </div>
      </div>
    </Link>
  );
};

export default Song;
