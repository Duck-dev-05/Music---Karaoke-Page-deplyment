"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { spotifyService, SpotifyTrack } from "@/services/spotify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SpotifySearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim() || !session?.accessToken) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    spotifyService
      .searchTracks(query)
      .then((res) => setResults(res.tracks.items))
      .catch((err) => {
        setError("Error searching Spotify tracks");
        setResults([]);
      })
      .finally(() => setIsLoading(false));
  }, [query, session?.accessToken]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="mb-4 text-lg text-muted-foreground">Sign in with Spotify to search songs</p>
        <Button onClick={() => signIn("spotify")}>Connect Spotify</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Spotify Song Search</h1>
      <div className="mb-6 max-w-lg">
        <Input
          placeholder="Search for songs on Spotify..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {isLoading && <p className="mb-4">Searching...</p>}
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((track) => (
          <div key={track.id} className="border rounded-lg p-4 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-3">
              <Image
                src={track.album.images[0]?.url || "/Music/covers/default-music.jpg"}
                alt={track.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <h3 className="font-semibold text-center truncate w-full">{track.name}</h3>
            <p className="text-sm text-muted-foreground text-center truncate w-full">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDuration(track.duration_ms)}
            </p>
            {track.preview_url ? (
              <audio controls src={track.preview_url} className="mt-2 w-full" />
            ) : (
              <>
                <p className="text-xs text-red-500 mt-2">No preview available</p>
                <a
                  href={`https://open.spotify.com/track/${track.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs text-blue-600 underline hover:text-blue-800"
                >
                  Play full song on Spotify
                </a>
              </>
            )}
          </div>
        ))}
      </div>
      {query && !isLoading && results.length === 0 && !error && (
        <p className="mt-8 text-center text-muted-foreground">No results found.</p>
      )}
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
} 