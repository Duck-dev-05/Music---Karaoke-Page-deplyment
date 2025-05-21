'use client';

import { useState } from 'react';
import { MusicTrack } from '@/services/music-sources';
import { youtubeMusicService } from '@/services/youtube-music';
import { YouTubeMusicPlayer } from '@/components/YouTubeMusicPlayer';
import { usePlayerControls } from '@/hooks/usePlayerControls';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

export default function YouTubeMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleTimeUpdate,
    handleDurationChange,
    handleVolumeChange,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    handleSongEnd,
    setIsPlaying,
  } = usePlayerControls(tracks);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const results = await youtubeMusicService.searchTracks(searchQuery);
      const formattedTracks: MusicTrack[] = results.tracks.items.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artists.map(artist => artist.name).join(', '),
        thumbnail: track.album.thumbnails[0]?.url || '',
        duration: track.duration,
        source: 'youtube-music',
        sourceUrl: `https://music.youtube.com/watch?v=${track.videoId}`,
        youtubeData: {
          videoId: track.videoId,
        }
      }));
      setTracks(formattedTracks);
    } catch (error) {
      console.error('Error searching YouTube Music:', error);
      setError('Error searching YouTube Music tracks');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">YouTube Music</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Track List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-card rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
            onClick={() => handlePlayPause(track)}
          >
            <div className="aspect-square relative mb-4">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="rounded-md object-cover w-full h-full"
              />
            </div>
            <h3 className="font-semibold truncate">{track.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>
        ))}
      </div>

      {/* Music Player */}
      <YouTubeMusicPlayer
        song={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isRepeat={isRepeat}
        isShuffle={isShuffle}
        onPlayPause={() => handlePlayPause(currentTrack)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onToggleRepeat={toggleRepeat}
        onToggleShuffle={toggleShuffle}
        onEnded={handleSongEnd}
      />
    </div>
  );
} 