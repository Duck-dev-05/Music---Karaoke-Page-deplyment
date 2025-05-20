"use client";

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const validCategories = ["recent", "vietnamese", "remix", "all"];

// Sample playlist data - replace with actual data from API
const samplePlaylist = {
  id: 1,
  name: 'Rock Classics',
  songs: [
    {
      id: 1,
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      duration: '5:55',
    },
    {
      id: 2,
      title: 'Sweet Caroline',
      artist: 'Neil Diamond',
      duration: '3:23',
    },
    {
      id: 3,
      title: 'Don\'t Stop Believin\'',
      artist: 'Journey',
      duration: '4:09',
    },
  ],
  createdAt: '2024-03-20',
};

export default function PlaylistPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { slug } = params;
  const [isEditing, setIsEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState(samplePlaylist.name);

  useEffect(() => {
    // Validate category
    if (validCategories.includes(slug)) {
      // Handle authentication for category page
      if (!session?.user) {
        router.push('/login');
      }
    } else {
      // Handle authentication for playlist ID page
      if (!session) {
        router.push('/login');
      }
    }
  }, [slug, router, session]);

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-semibold">Sign in to view playlists</h1>
        <p className="text-muted-foreground">
          Create an account or sign in to access your playlists
        </p>
        <div className="flex gap-4">
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-outline">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  // If slug is a valid category, render the category page
  if (validCategories.includes(slug)) {
    const isPremium = session.user.email === "premium@test.com";
    const maxSongs = isPremium ? 10 : 2;

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">
          {slug === "recent" ? "Recent Additions" :
           slug === "vietnamese" ? "Vietnamese Songs" :
           slug === "remix" ? "Remixes" :
           "All Songs"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Playlist items will be rendered here */}
        </div>
      </div>
    );
  }

  // Otherwise, treat slug as a playlist ID and render the playlist details page
  const handleUpdatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace with actual API call
      console.log('Updating playlist:', playlistName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleRemoveSong = async (songId: number) => {
    try {
      // Replace with actual API call
      console.log('Removing song:', songId);
    } catch (error) {
      console.error('Error removing song:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {isEditing ? (
          <form onSubmit={handleUpdatePlaylist} className="flex-1">
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="text-3xl font-bold bg-transparent border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-700"
            />
          </form>
        ) : (
          <h1 className="text-3xl font-bold">{playlistName}</h1>
        )}
        <div className="flex space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Cancel' : 'Edit Name'}
          </button>
          <Link
            href="/songs"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Songs
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {samplePlaylist.songs.map((song) => (
              <tr key={song.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{song.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{song.artist}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{song.duration}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-4">
                    <Link
                      href={`/songs/${song.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Sing Now
                    </Link>
                    <button
                      onClick={() => handleRemoveSong(song.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500">
        Created on {new Date(samplePlaylist.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
} 