import { useParams } from 'react-router-dom';

// hooks
import useAlbumCover from '../hooks/useAlbumCover';

// components
import Header from '../components/Artist/Header';
import ArtistSectionNav from '../components/Artist/ArtistSectionNav';
import ArtistBio from '../components/Artist/ArtistBio';

// data
import albumData from '../data/albumData';

const AboutPage: React.FC = () => {
  const { id } = useParams();
  const artistFromRoute = albumData.find((album) => album.artist.id === id)?.artist;
  const artist = artistFromRoute ?? albumData[0]?.artist;
  const artistCover = useAlbumCover(albumData[0] || null);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className='artist flex flex-column flex-gap no-select'>
      <Header artist={artist} coverImage={artistCover} />
      <section className='container flex flex-column flex-gap'>
        <div className='flex flex-space-between flex-v-center'>
          <ArtistSectionNav artistId={artist.id} />
        </div>
        <ArtistBio />
      </section>
    </div>
  );
};

export default AboutPage;
