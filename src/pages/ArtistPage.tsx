import { useMemo, useState } from 'react';

// hooks
import useTrack from '../hooks/useTrack';

// components
import Song from '../components/Song/Song';
import Albums from '../components/Artist/Albums';
import Header from '../components/Artist/Header';
import ArtistSectionNav from '../components/Artist/ArtistSectionNav';

// data
import albumData from '../data/albumData';

const ArtistPage: React.FC = () => {
  const { currentState, currentTrack } = useTrack();
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const artist = albumData[0]?.artist;

  const albumTracks = albumData
    .filter((album) => album.songs > 1)
    .flatMap((album) => (album.tracks || []).map((track) => ({ album, track })))
    .slice(0, 8);

  const singleTracks = albumData
    .filter((album) => album.songs === 1)
    .flatMap((album) => (album.tracks || []).map((track) => ({ album, track })));

  const featuredSongs = useMemo(
    () =>
      [...albumTracks, ...singleTracks].filter(({ album, track }) => {
        if (!normalizedQuery) {
          return true;
        }

        return [track.name, album.name, album.artist.name].some((field) =>
          field.toLowerCase().includes(normalizedQuery)
        );
      }),
    [albumTracks, normalizedQuery, singleTracks]
  );
  const filteredAlbums = useMemo(
    () =>
      albumData.filter((album) => {
        if (!normalizedQuery) {
          return true;
        }

        return [album.name, album.artist.name].some((field) =>
          field.toLowerCase().includes(normalizedQuery)
        );
      }),
    [normalizedQuery]
  );

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className='artist flex flex-column flex-gap no-select'>
      <Header artist={artist} searchValue={searchQuery} onSearchChange={setSearchQuery} />
      <section className='container flex flex-column flex-gap'>
        <div className='flex flex-space-between flex-v-center'>
          <ArtistSectionNav artistId={artist.id} />
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
      <Albums url={`/albums/${artist.id}`} title='Albums' albums={filteredAlbums} />
    </div>
  );
};

export default ArtistPage;
