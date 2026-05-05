import { Routes, Route } from 'react-router-dom';

// pages
import AlbumPage from '../pages/AlbumPage';
import ArtistPage from '../pages/ArtistPage';
import AlbumsPage from '../pages/AlbumsPage';
import ConcertsPage from '../pages/ConcertsPage';

const Navigation: React.FC = () => (
  <Routes>
    <Route path='/' element={<ArtistPage />} />
    <Route path='/album/:id' element={<AlbumPage />} />
    <Route path='/artist/:id' element={<ArtistPage />} />
    <Route path='/albums/:id' element={<AlbumsPage />} />
    <Route path='/concerts/:id' element={<ConcertsPage />} />
  </Routes>
);

export default Navigation;
