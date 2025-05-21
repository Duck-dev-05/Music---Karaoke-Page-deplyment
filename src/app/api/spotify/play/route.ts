import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { trackId, deviceId } = await req.json();
  const accessToken = req.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Build the Spotify play endpoint with optional device_id
  let spotifyUrl = 'https://api.spotify.com/v1/me/player/play';
  if (deviceId) {
    spotifyUrl += `?device_id=${encodeURIComponent(deviceId)}`;
  }

  const res = await fetch(spotifyUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to play track' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
} 