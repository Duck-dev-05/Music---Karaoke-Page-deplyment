import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const res = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      // If we get a 401, the token is likely expired
      if (res.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Failed to get playback state' }, { status: res.status });
    }

    // Check if there's any content to parse
    const text = await res.text();
    if (!text) {
      return NextResponse.json({ error: 'No playback state available' }, { status: 404 });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Error parsing Spotify response:', parseError);
      return NextResponse.json({ error: 'Invalid response from Spotify' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching Spotify state:', error);
    return NextResponse.json({ error: 'Failed to fetch playback state' }, { status: 500 });
  }
} 