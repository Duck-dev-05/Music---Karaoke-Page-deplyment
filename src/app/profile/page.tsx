"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHeart, FaList, FaCog, FaHistory } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [playlistsCount, setPlaylistsCount] = useState(0); // Replace with real API call if available

  useEffect(() => {
    // Fetch favorites count
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) return;
        const data = await res.json();
        setFavoritesCount(data.favorites.length);
      } catch {}
    };
    fetchFavorites();
    // TODO: Replace with real API call for playlists count
    setPlaylistsCount(3); // Example static value
  }, []);

  const getInitials = (name: string = ""): string => {
    return name
      ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
      : '';
  };

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? undefined} />
                  <AvatarFallback>{getInitials(session.user.name ?? "")}</AvatarFallback>
                </Avatar>
              </div>
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-gray-600 mt-2">This is your public profile information</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="font-semibold">Full Name</div>
                <div className="mt-1 text-gray-800">{session.user.name}</div>
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div className="mt-1 text-gray-800">{session.user.email}</div>
              </div>
            </div>
            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex flex-col items-center">
                <FaHeart className="text-pink-500 mb-1" />
                <span className="font-bold text-lg">{favoritesCount}</span>
                <span className="text-xs text-gray-500">Favorites</span>
              </div>
              <div className="flex flex-col items-center">
                <FaList className="text-purple-500 mb-1" />
                <span className="font-bold text-lg">{playlistsCount}</span>
                <span className="text-xs text-gray-500">Playlists</span>
              </div>
            </div>
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/settings" className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition">
                <FaCog /> Settings
              </Link>
              <Link href="/favorites" className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition">
                <FaHeart /> Favorites
              </Link>
              <Link href="/playlists" className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition">
                <FaList /> Playlists
              </Link>
              <Link href="/history" className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition">
                <FaHistory /> History
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
