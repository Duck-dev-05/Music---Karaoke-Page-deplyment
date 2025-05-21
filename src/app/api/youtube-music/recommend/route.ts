import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    // Fetch trending music videos from YouTube
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&videoCategoryId=10&maxResults=10&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const tracks = (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      duration: '', // Optionally parse item.contentDetails.duration
      videoId: item.id,
      streamUrl: '' // Not available from YouTube Data API
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error in YouTube Music recommend:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 