import { useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

// hooks
import useAlbumCover from '../hooks/useAlbumCover';

// components
import Cover from '../components/Cover/Cover';
import Search from '../components/Search/Search';
import Information from '../components/Information/Information';

// types
// data
import albumData from '../data/albumData';

const AlbumPage: React.FC = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const currentAlbumData = useMemo(() => albumData.find((album) => album.id === id) ?? null, [id]);

  const albumCover = useAlbumCover(currentAlbumData);

  if (!currentAlbumData) {
    return <div>Album not found</div>;
  }

  return (
    <Cover image={albumCover}>
      <Search value={searchQuery} onChange={setSearchQuery} />
      <Information album={currentAlbumData} searchQuery={searchQuery} />
    </Cover>
  );
};

export default AlbumPage;
