import { useMemo, useState } from 'react';

// components
import Card from '../components/Album/Card';
import Search from '../components/Search/Search';

// types
import type { IAlbum } from '../types/types';

// data
import albumData from '../data/albumData';

const AlbumsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredAlbums = useMemo(
    () =>
      albumData.filter((item) => {
        if (!normalizedQuery) {
          return true;
        }

        return [item.name, item.artist.name].some((field) =>
          field.toLowerCase().includes(normalizedQuery)
        );
      }),
    [normalizedQuery]
  );

  return (
    <div className='albums flex flex-column flex-gap no-select'>
      <div className='container flex flex-column'>
        <Search value={searchQuery} onChange={setSearchQuery} />
        <section className='flex flex-column flex-gap'>
          <div className='flex flex-space-between flex-v-center'>
            <h3>Albums</h3>
          </div>
          <div className='grid flex-gap'>
            {filteredAlbums.map((item: IAlbum) => (
              <Card key={item.id} album={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AlbumsPage;
