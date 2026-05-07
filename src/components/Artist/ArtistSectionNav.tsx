import { NavLink } from 'react-router-dom';

type Props = {
  artistId: string;
};

const ArtistSectionNav: React.FC<Props> = ({ artistId }) => (
  <div className='artist-section-nav flex flex-gap'>
    <NavLink
      to='/'
      end
      className={({ isActive }) =>
        `active-opacity underline${isActive ? ' artist-nav-active' : ''}`
      }
    >
      <h2>Songs</h2>
    </NavLink>
    <NavLink
      to={`/concerts/${artistId}`}
      className={({ isActive }) =>
        `active-opacity underline${isActive ? ' artist-nav-active' : ''}`
      }
    >
      <h2>Концерты</h2>
    </NavLink>
    <NavLink
      to={`/about/${artistId}`}
      className={({ isActive }) =>
        `active-opacity underline${isActive ? ' artist-nav-active' : ''}`
      }
    >
      <h2>О группе</h2>
    </NavLink>
  </div>
);

export default ArtistSectionNav;
