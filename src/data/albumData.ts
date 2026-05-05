import rawAlbumData from './albumData.json';
import trackMediaStatic from './trackMediaStatic.json';

import type { IAlbum, ITrack } from '../types/types';

type TrackMediaStaticEntry = {
  durationSec: number | null;
  coverUrl: string | null;
};

const trackStaticById = trackMediaStatic as Record<string, TrackMediaStaticEntry>;

const withPublicUrl = (value: string): string => {
  if (!value.startsWith('/')) {
    return value;
  }

  const publicUrl = process.env.PUBLIC_URL || '';
  return `${publicUrl}${value}`;
};

const enrichTrack = (track: Omit<ITrack, 'staticCoverUrl' | 'staticDurationSec'>): ITrack => {
  const stat = trackStaticById[track.id];

  return {
    ...track,
    mediaurl: withPublicUrl(track.mediaurl),
    ...(stat?.coverUrl ? { staticCoverUrl: withPublicUrl(stat.coverUrl) } : {}),
    ...(stat?.durationSec != null && Number.isFinite(stat.durationSec)
      ? { staticDurationSec: stat.durationSec }
      : {}),
  };
};

const albumData: IAlbum[] = rawAlbumData.map((album) => ({
  ...album,
  image: withPublicUrl(album.image),
  artist: {
    ...album.artist,
    image: withPublicUrl(album.artist.image),
  },
  tracks: album.tracks?.map((track) => enrichTrack(track)),
}));

export default albumData;
