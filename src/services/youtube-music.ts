import { MusicTrack, SearchResult } from './music-sources';

const YOUTUBE_MUSIC_API_BASE = 'https://music.youtube.com/youtubei/v1';

export interface YouTubeMusicTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
  streamUrl?: string;
}

export interface YouTubeMusicSearchResponse {
  tracks: {
    items: YouTubeMusicTrack[];
    total: number;
  };
}

class YouTubeMusicService {
  private baseUrl = '/api/youtube-music';

  async searchTracks(query: string, pageToken?: string): Promise<SearchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}${pageToken ? `&pageToken=${pageToken}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to search YouTube Music');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching YouTube Music:', error);
      throw error;
    }
  }

  async getStreamUrl(videoId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/stream/${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to get stream URL');
      }
      const data = await response.json();
      return data.streamUrl;
    } catch (error) {
      console.error('Error getting stream URL:', error);
      throw error;
    }
  }

  convertToMusicTrack(track: YouTubeMusicTrack): MusicTrack {
    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      thumbnail: track.thumbnail,
      duration: track.duration,
      source: 'youtube-music',
      sourceUrl: `https://music.youtube.com/watch?v=${track.videoId}`,
      youtubeData: {
        videoId: track.videoId,
        streamUrl: track.streamUrl
      }
    };
  }

  async getRecommendations(): Promise<MusicTrack[]> {
    try {
      const response = await fetch(`${this.baseUrl}/recommend`);
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube Music recommendations');
      }
      const data = await response.json();
      // Assume the API returns an array of tracks
      return data.tracks || [];
    } catch (error) {
      console.error('Error fetching YouTube Music recommendations:', error);
      throw error;
    }
  }
}

export const youtubeMusicService = new YouTubeMusicService(); 