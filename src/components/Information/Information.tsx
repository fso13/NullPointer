// components
import Image from './Image';
import Details from './Details';
import Buttons from './Buttons';
import Playlist from './Playlist';

// types
import type { IAlbum } from '../../types/types';

// interfaces
interface IProps {
  album: IAlbum;
  searchQuery?: string;
}

const Information: React.FC<IProps> = ({ album, searchQuery = '' }) => (
  <div className='information flex flex-column flex-gap no-select'>
    <Image album={album} />
    <Details album={album} />
    <Buttons album={album} />
    <Playlist album={album} searchQuery={searchQuery} />
  </div>
);

export default Information;
