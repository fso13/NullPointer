import { Link } from 'react-router-dom';

// hooks
import useAlbumCover from '../hooks/useAlbumCover';

// components
import Header from '../components/Artist/Header';

// data
import albumData from '../data/albumData.json';

const TOUR_DATES = [
  { date: '01.09.2026', city: 'Москва', venue: 'VK Play Live Arena (Virtual Stage)' },
  { date: '03.09.2026', city: 'Санкт-Петербург', venue: 'Neon Roof Club (VR Hall)' },
  { date: '05.09.2026', city: 'Екатеринбург', venue: 'Ural Code Dome (Metaverse)' },
  { date: '07.09.2026', city: 'Казань', venue: 'Volga Byte Stage (Online Arena)' },
  { date: '09.09.2026', city: 'Новосибирск', venue: 'Siberia Stream Hall (Virtual)' },
  { date: '11.09.2026', city: 'Нижний Новгород', venue: 'Oka Digital Club (VR)' },
  { date: '13.09.2026', city: 'Самара', venue: 'Zhiguli Cloud Scene' },
  { date: '15.09.2026', city: 'Ростов-на-Дону', venue: 'South Port Virtual Venue' },
  { date: '17.09.2026', city: 'Краснодар', venue: 'Black Sea Pixel Stage' },
  { date: '19.09.2026', city: 'Владивосток', venue: 'Pacific Signal Dome' },
  { date: '21.09.2026', city: 'Минск', venue: 'Binary Night Hall (Virtual)' },
  { date: '23.09.2026', city: 'Алматы', venue: 'Steppe Noise Arena (Online)' },
  { date: '25.09.2026', city: 'Ереван', venue: 'Ararat Stream Club' },
  { date: '27.09.2026', city: 'Тбилиси', venue: 'Tbilisi Electric VR Stage' },
  { date: '30.09.2026', city: 'Финал', venue: 'Worldwide Livestream — "Хуяк — и в продакшен LIVE"' },
];

const ConcertsPage: React.FC = () => {
  const artist = albumData[0]?.artist;
  const artistCover = useAlbumCover(albumData[0] || null);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className='artist flex flex-column flex-gap no-select'>
      <Header artist={artist} coverImage={artistCover} />
      <section className='container flex flex-column flex-gap'>
        <div className='flex flex-space-between flex-v-center'>
          <div className='flex flex-gap'>
            <Link to='/' className='active-opacity underline'>
              <h2>Songs</h2>
            </Link>
            <Link to={`/concerts/${artist.id}`} className='active-opacity underline'>
              <h2>Концерты</h2>
            </Link>
          </div>
        </div>

        <div className='concerts flex flex-column flex-gap'>
          <div className='concerts-headline flex flex-space-between flex-v-center'>
            <h3>Тур: «Без Стенда // Live 2026»</h3>
            <span className='concerts-count'>{TOUR_DATES.length} дат</span>
          </div>
          {TOUR_DATES.map((item) => (
            <div key={`${item.date}-${item.city}`} className='concert-item flex flex-v-center flex-space-between'>
              <div className='concert-date'>{item.date}</div>
              <div className='concert-details flex flex-column'>
                <strong>{item.city}</strong>
                <span>{item.venue}</span>
              </div>
              <span className='concert-status'>Tickets soon</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ConcertsPage;
