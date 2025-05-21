export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  source: 'youtube' | 'youtube-music' | 'local';
  sourceUrl?: string;
  youtubeData?: {
    videoId: string;
    streamUrl?: string;
  };
}

export interface MusicSource {
  name: string;
  icon: string;
  color: string;
}

export interface SearchResult {
  tracks: MusicTrack[];
  nextPageToken?: string;
}

export const musicSources: MusicSource[] = [
  {
    name: 'Local',
    icon: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
    color: 'bg-blue-500'
  },
  {
    name: 'YouTube Music',
    icon: 'M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z',
    color: 'bg-red-500'
  }
]; 