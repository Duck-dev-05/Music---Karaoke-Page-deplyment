import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import redis from '@/lib/redis';

interface SearchResult {
  title: string;
  type: string;
  path: string;
  artist?: string;
  youtubeId?: string;
}

function cleanTitle(filename: string): { title: string; artist?: string } {
  let name = filename.replace('.mp3', '');
  name = name.replace('y2mate.com - ', '');
  
  let artist: string | undefined;
  let title: string = name;
  
  if (name.includes(' - ')) {
    [artist, title] = name.split(' - ').map(s => s.trim());
  } else if (name.includes('  ')) {
    [artist, title] = name.split('  ').map(s => s.trim());
  }
  
  return { title, artist };
}

function getSongType(title: string): string {
  const types = {
    pop: ['pop', 'dance', 'disco'],
    rock: ['rock', 'metal', 'punk', 'guitar'],
    remix: ['remix', 'edm', 'techno', 'house'],
    traditional: ['arirang', 'dân ca', 'quê hương'],
    karaoke: ['karaoke'],
    sentai: ['sentai', 'gokaiger'],
    other: []
  };

  const lowerTitle = title.toLowerCase();
  
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return type;
    }
  }

  return 'other';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    if (!query) {
      return NextResponse.json({ success: true, results: [] });
    }

    // Try to get from cache first
    const cacheKey = `search:${query}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // --- Local search ---
    const musicDir = path.join(process.cwd(), 'public', 'Music');
    let files: string[] = [];
    try {
      files = await fs.readdir(musicDir);
    } catch (e) {
      files = [];
    }
    
    const results: SearchResult[] = files
      .filter(file => file.toLowerCase().endsWith('.mp3'))
      .map(file => {
        const { title, artist } = cleanTitle(file);
        return {
          title,
          artist,
          type: getSongType(title),
          path: `/Music/${file}`
        };
      })
      .filter(result => 
        result.title.toLowerCase().includes(query) ||
        result.artist?.toLowerCase().includes(query) ||
        result.type.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit to 10 results

    // --- YouTube search ---
    let youtubeResults: SearchResult[] = [];
    try {
      const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
      if (YOUTUBE_API_KEY) {
        // Search for karaoke
        const karaokeUrl = `${YOUTUBE_API_URL}?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query + ' karaoke')}&key=${YOUTUBE_API_KEY}`;
        const karaokeRes = await fetch(karaokeUrl);
        const karaokeData = await karaokeRes.json();
        console.log('karaokeUrl:', karaokeUrl);
        console.log('karaokeData:', JSON.stringify(karaokeData));

        // Search for regular songs
        const songUrl = `${YOUTUBE_API_URL}?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
        const songRes = await fetch(songUrl);
        const songData = await songRes.json();
        console.log('songUrl:', songUrl);
        console.log('songData:', JSON.stringify(songData));

        // Combine and deduplicate by videoId
        const allItems = [
          ...(karaokeData.items || []),
          ...(songData.items || [])
        ];
        const seen = new Set();
        youtubeResults = allItems
          .filter((item: any) => {
            if (!item.id?.videoId || seen.has(item.id.videoId)) return false;
            seen.add(item.id.videoId);
            return true;
          })
          .map((item: any) => ({
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            type: 'youtube',
            path: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            youtubeId: item.id.videoId
          }));
      }
    } catch (e) {
      console.error('YouTube fetch error:', e);
      // Ignore YouTube errors, just don't return YouTube results
    }

    // Combine results: local first, then YouTube
    const combinedResults = [...results, ...youtubeResults];
    const response = {
      success: true,
      results: combinedResults
    };

    // Cache the results for 5 minutes
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 300);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    );
  }
} 