'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  PlayIcon,
  PauseIcon,
  PlusIcon,
  UserCircleIcon,
  ForwardIcon,
  BackwardIcon,
  StopIcon,
  MusicalNoteIcon as MusicIcon
} from '@heroicons/react/24/solid';
import { MusicPlayer } from '@/components/MusicPlayer';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useDebounce } from '@/hooks/useDebounce';
import { youtubeMusicService } from '@/services/youtube-music';
import { MusicTrack } from '@/services/music-sources';
import React from 'react';
import { Search as SearchIcon, X as ClearIcon } from 'lucide-react';
import YouTube from 'react-youtube';
import { Listbox } from '@headlessui/react';

interface MusicFile extends MusicTrack {
  type: keyof typeof defaultCoverImages;
  dateAdded: Date;
}

interface Collection {
  title: string;
  count: number;
  description: string;
  category: string;
  gradient: string;
  songs: MusicFile[];
}

const defaultCoverImages = {
  pop: '/Music/covers/default-pop.jpg',
  rock: '/Music/covers/default-rock.jpg',
  jazz: '/Music/covers/default-jazz.jpg',
  classical: '/Music/covers/default-classical.jpg',
  electronic: '/Music/covers/default-electronic.jpg',
  other: '/Music/covers/default-music.jpg',
};

const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Artist', value: 'artist' },
  { label: 'Date Added', value: 'dateAdded' },
];

export default function SongsPage() {
  const { data: session } = useSession();
  const [songs, setSongs] = useState<MusicFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('local');
  const [currentSong, setCurrentSong] = useState<MusicFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<MusicTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [youtubePlayer, setYouTubePlayer] = useState<any>(null);
  const [sortBy, setSortBy] = useState('title');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Handle YouTube Music search
  const searchYouTubeMusic = useCallback(async (query: string) => {
    if (!session?.accessToken || !query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await youtubeMusicService.searchTracks(query);
      setSearchResults(response.tracks);
      
      // Convert YouTube Music tracks to MusicFile format
      const youtubeSongs: MusicFile[] = response.tracks.map(track => ({
        ...track,
        id: track.youtubeData?.videoId || track.id,
        type: (['pop','rock','jazz','classical','electronic','other'].includes((track as any).type) ? (track as any).type : 'other') as keyof typeof defaultCoverImages,
        dateAdded: new Date()
      }));
      
      setSongs(youtubeSongs);
    } catch (error) {
      console.error('Error searching YouTube Music:', error);
      setError('Error searching YouTube Music tracks');
    } finally {
      setIsSearching(false);
    }
  }, [session?.accessToken]);

  // Effect for handling search and recommendations
  useEffect(() => {
    const fetchYouTubeMusic = async () => {
      if (!session) {
        setSongs([]);
        setError(null);
        return;
      }
      if (!session.accessToken) {
        setSongs([]);
        setError('No YouTube Music access token. Please reconnect your YouTube Music account.');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        if (debouncedSearchQuery.trim()) {
          await searchYouTubeMusic(debouncedSearchQuery);
        } else {
          // Fetch recommendations if no search query
          const recommended = await youtubeMusicService.getRecommendations();
          // Convert to MusicFile format if needed
          const youtubeSongs = recommended.map(track => ({
            ...track,
            id: track.youtubeData?.videoId || track.id,
            type: (['pop','rock','jazz','classical','electronic','other'].includes((track as any).type) ? (track as any).type : 'other') as keyof typeof defaultCoverImages,
            dateAdded: new Date()
          }));
          setSongs(youtubeSongs);
        }
      } catch (error) {
        setError('Error loading YouTube Music tracks');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'youtube') {
      fetchYouTubeMusic();
    }
  }, [debouncedSearchQuery, activeTab, searchYouTubeMusic, session]);

  // Handle tab change
  useEffect(() => {
    if (activeTab === 'youtube' && !session) {
      setSongs([]);
      setError(null);
    } else if (activeTab === 'local') {
      fetchLocalMusic();
    }
  }, [activeTab, session]);

  // Fetch local music
  const fetchLocalMusic = async () => {
    try {
      const response = await fetch('/api/music');
      const data = await response.json();
      if (data.success) {
        const allSongs = data.collections.reduce((acc: MusicFile[], collection: Collection) => {
          return [...acc, ...collection.songs];
        }, []);
        setSongs(allSongs);
      } else {
        setError('Failed to load music data.');
      }
    } catch (error) {
      console.error('Error fetching music data:', error);
      setError('Error fetching music data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle YouTube Music playback
  const handleYouTubeMusicPlayback = async (song: MusicFile) => {
    if (!song.youtubeData?.videoId) return;

    try {
      const streamUrl = await youtubeMusicService.getStreamUrl(song.youtubeData.videoId);
      if (audioRef.current) {
        audioRef.current.src = streamUrl;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing YouTube Music track:', error);
      setError('Error playing YouTube Music track');
    }
  };

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle song changes and playback
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    if (currentSong.source === 'youtube-music') {
      handleYouTubeMusicPlayback(currentSong);
    } else {
      audio.src = currentSong.sourceUrl || '';
      audio.load();

      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      } else {
        audio.pause();
      }
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [currentSong, isPlaying]);

  const handlePlayPause = async (song: MusicFile) => {
    if (!audioRef.current) return;

    if (song.source === 'youtube-music') {
      setCurrentSong(song);
      setShowYouTubePlayer(true);
      setIsPlaying(true);
      return;
    }

    setShowYouTubePlayer(false);
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          setError('Error playing audio');
        }
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (!songs.length) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const previousIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    setCurrentSong(songs[previousIndex]);
  };

  const handleNext = () => {
    if (!songs.length) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const nextIndex = currentIndex >= songs.length - 1 ? 0 : currentIndex + 1;
    setCurrentSong(songs[nextIndex]);
  };

  const handleTimeUpdate = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleSongEnd = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else {
      handleNext();
    }
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  // Improved search bar handlers
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'youtube') {
      // For YouTube Music, trigger search immediately
      searchYouTubeMusic(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (activeTab === 'youtube') {
      // Show recommendations when cleared
      setIsLoading(true);
      youtubeMusicService.getRecommendations().then(recommended => {
        const youtubeSongs = recommended.map(track => ({
          ...track,
          id: track.youtubeData?.videoId || track.id,
          type: (['pop','rock','jazz','classical','electronic','other'].includes((track as any).type) ? (track as any).type : 'other') as keyof typeof defaultCoverImages,
          dateAdded: new Date()
        }));
        setSongs(youtubeSongs);
        setIsLoading(false);
      });
    }
    inputRef.current?.focus();
  };

  // Next/Previous for YouTube Music
  const playNextYouTubeSong = () => {
    if (!songs.length || !currentSong) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = currentIndex >= songs.length - 1 ? 0 : currentIndex + 1;
    setCurrentSong(songs[nextIndex]);
  };
  const playPrevYouTubeSong = () => {
    if (!songs.length || !currentSong) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    setCurrentSong(songs[prevIndex]);
  };

  // YouTube player options
  const youtubeOpts = {
    height: '315',
    width: '560',
    playerVars: {
      autoplay: 1,
    },
  };

  // YouTube event handlers
  const onYouTubeReady = (event: any) => {
    setYouTubePlayer(event.target);
    event.target.playVideo();
  };
  const onYouTubeEnd = () => {
    playNextYouTubeSong();
  };

  // Sorting logic
  const sortedSongs = React.useMemo(() => {
    return [...songs].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
      if (sortBy === 'dateAdded') return (b.dateAdded?.getTime?.() || 0) - (a.dateAdded?.getTime?.() || 0);
      return 0;
    });
  }, [songs, sortBy]);

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    return (
      <div className="space-y-6">
        {/* Improved Search Bar and Sorting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full max-w-4xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex items-center flex-1 bg-white/80 rounded-full shadow px-4 py-2">
            <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="flex-1 border-none bg-transparent focus:ring-0 focus:outline-none"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="ml-2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                aria-label="Clear search"
              >
                <ClearIcon className="w-5 h-5" />
              </button>
            )}
            {isSearching && (
              <span className="ml-2">
                <span className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin inline-block" />
              </span>
            )}
          </form>
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Listbox value={sortBy} onChange={setSortBy}>
              <div className="relative">
                <Listbox.Button className="bg-white/80 rounded-md px-3 py-1 text-sm shadow border border-gray-200">
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10">
                  {sortOptions.map(option => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 text-sm ${active ? 'bg-pink-100 text-pink-700' : 'text-gray-700'}`
                      }
                    >
                      {option.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="local">Local Music</TabsTrigger>
            <TabsTrigger value="youtube">YouTube Music</TabsTrigger>
          </TabsList>

          <TabsContent value="local">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Local Music</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedSongs.map((song, index) => (
                <Card
                  key={index}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-white to-gray-50",
                    currentSong?.id === song.id && "ring-2 ring-pink-500"
                  )}
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={song.thumbnail || defaultCoverImages[song.type]}
                      alt={song.title}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handlePlayPause(song)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <PauseIcon className="h-10 w-10 text-white" />
                      ) : (
                        <PlayIcon className="h-10 w-10 text-white" />
                      )}
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg truncate">{song.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">{song.duration}</span>
                      <span className="text-xs text-gray-400">{song.dateAdded?.toLocaleDateString?.()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="youtube">
            <h2 className="text-xl font-bold mb-2 text-gray-800">YouTube Music</h2>
            {!session ? (
              <div className="text-center py-8">
                <p className="mb-4">Sign in with YouTube Music to access your music</p>
                <Button onClick={() => signIn('youtube')}>
                  Sign in with YouTube Music
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSongs.map((song, index) => (
                  <Card
                    key={index}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-white to-gray-50",
                      currentSong?.id === song.id && "ring-2 ring-pink-500"
                    )}
                  >
                    <div className="relative w-full h-40">
                      <Image
                        src={song.thumbnail || defaultCoverImages[song.type]}
                        alt={song.title}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => handlePlayPause(song)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {currentSong?.id === song.id && isPlaying ? (
                          <PauseIcon className="h-10 w-10 text-white" />
                        ) : (
                          <PlayIcon className="h-10 w-10 text-white" />
                        )}
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg truncate">{song.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{song.duration}</span>
                        <span className="text-xs text-gray-400">{song.dateAdded?.toLocaleDateString?.()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Songs</h1>
      {renderContent()}
      {/* Show YouTube player with next/prev controls if a YouTube Music song is selected */}
      {showYouTubePlayer && currentSong && currentSong.source === 'youtube-music' && (
        <div className="flex flex-col items-center mt-8">
          <YouTube
            videoId={currentSong.youtubeData?.videoId || currentSong.id}
            opts={youtubeOpts}
            onReady={onYouTubeReady}
            onEnd={onYouTubeEnd}
          />
          <div className="flex gap-4 mt-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={playPrevYouTubeSong}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={playNextYouTubeSong}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* Show audio player for local songs */}
      {currentSong && currentSong.source !== 'youtube-music' && (
        <MusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isRepeat={isRepeat}
          isShuffle={isShuffle}
          onPlayPause={() => handlePlayPause(currentSong)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onTimeUpdate={handleTimeUpdate}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleRepeat={toggleRepeat}
          onToggleShuffle={toggleShuffle}
          onDurationChange={(d) => handleDurationChange(Number(d))}
          onEnded={handleSongEnd}
        />
      )}
    </div>
  );
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
