import { Link } from 'react-router-dom';

// hooks
import useTrack from '../hooks/useTrack';
import useAlbumCover from '../hooks/useAlbumCover';

// components
import Song from '../components/Song/Song';
import Albums from '../components/Artist/Albums';
import Header from '../components/Artist/Header';

// data
import albumData from '../data/albumData';

const ArtistPage: React.FC = () => {
  const { currentState, currentTrack } = useTrack();
  const artist = albumData[0]?.artist;
  const artistCover = useAlbumCover(albumData[0] || null);

  const albumTracks = albumData
    .filter((album) => album.songs > 1)
    .flatMap((album) => (album.tracks || []).map((track) => ({ album, track })))
    .slice(0, 8);

  const singleTracks = albumData
    .filter((album) => album.songs === 1)
    .flatMap((album) => (album.tracks || []).map((track) => ({ album, track })));

  const featuredSongs = [...albumTracks, ...singleTracks];

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className='artist flex flex-column flex-gap no-select'>
      <Header artist={artist} coverImage={artistCover} />
      <section className='container flex flex-column flex-gap'>
        <div className='flex flex-space-between flex-v-center'>
          <div className='flex flex-gap'>
            <Link to='/' className='active-opacity underline'>
              <h2>Songs</h2>
            </Link>
            <Link to={`/concerts/${artist.id}`} className='active-opacity underline'>
              <h2>Концерты</h2>
            </Link>
          </div>
        </div>
        <div className='flex flex-column'>
          {featuredSongs.map(({ album, track }) => (
            <Song
              key={track.id}
              album={album}
              track={track}
              playing={currentState === 'playing' && currentTrack?.id === track.id}
            />
          ))}
        </div>
      </section>
      <Albums url={`/albums/${artist.id}`} title='Albums' albums={albumData} />
      <Albums url={`/albums/${artist.id}`} title='Featured on' albums={albumData} />
    </div>
  );
};

export default ArtistPage;
