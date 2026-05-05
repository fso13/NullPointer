import rawAlbumData from './albumData.json';

import type { IAlbum } from '../types/types';

const withPublicUrl = (value: string): string => {
  if (!value.startsWith('/')) {
    return value;
  }

  const publicUrl = process.env.PUBLIC_URL || '';
  return `${publicUrl}${value}`;
};

const albumData: IAlbum[] = rawAlbumData.map((album) => ({
  ...album,
  image: withPublicUrl(album.image),
  artist: {
    ...album.artist,
    image: withPublicUrl(album.artist.image),
  },
  tracks: album.tracks?.map((track) => ({
    ...track,
    mediaurl: withPublicUrl(track.mediaurl),
  })),
}));

export default albumData;
