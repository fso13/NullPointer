// components
import Search from '../Search/Search';

// types
import { IArtist } from '../../types/types';

// interfaces
interface IProps {
  artist: IArtist;
  coverImage?: string;
}

const Header: React.FC<IProps> = ({ artist, coverImage }) => (
    <section
      style={{ backgroundImage: `url(${coverImage || artist.image})` }}
      className='artist-cover flex flex-column flex-h-end'
    >
      <div className='artist-gradient'>
        <Search />
        <div className='container'>
          <p className='text-shadow'>{artist.description}</p>
          <div className='buttons flex flex-gap-small flex-h-center flex-v-center'>
            <span className='flex flex-1 flex-h-start text-shadow'>
              {artist.monthlyListeners} monthly listeners
            </span>
          </div>
        </div>
      </div>
    </section>
);

export default Header;
