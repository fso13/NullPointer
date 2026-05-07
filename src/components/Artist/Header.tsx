import { useEffect, useState } from 'react';

// components
import Search from '../Search/Search';

// types
import { IArtist } from '../../types/types';

// interfaces
interface IProps {
  artist: IArtist;
}

const MOBILE_COVER_BREAKPOINT = 750;
const MOBILE_COVER_IMAGE = `${process.env.PUBLIC_URL || ''}/data/YI5mY.jpg`;

const Header: React.FC<IProps> = ({ artist }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_COVER_BREAKPOINT}px)`);
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const coverImage = isMobile ? MOBILE_COVER_IMAGE : artist.image;

  return (
    <section
      style={{ backgroundImage: `url(${coverImage})` }}
      className='artist-cover flex flex-column flex-h-end'
    >
      <div className='artist-gradient'>
        <Search />
        <div className='container'>
          <div className='buttons flex flex-gap-small flex-h-center flex-v-center'>
            <span className='flex flex-1 flex-h-start text-shadow'>
              {artist.monthlyListeners} monthly listeners
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
