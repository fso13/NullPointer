// components
import Search from '../Search/Search';

// types
import { IArtist } from '../../types/types';

// interfaces
interface IProps {
  artist: IArtist;
}

const Header: React.FC<IProps> = ({ artist }) => (
    <section
      style={{ backgroundImage: `url(${artist.image})` }}
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

export default Header;
