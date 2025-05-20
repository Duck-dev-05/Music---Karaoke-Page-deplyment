"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      let warnings: string[] = [];
      let ytResults: any[] = [];
      let localResults: any[] = [];
      await Promise.all([
        (async () => {
          try {
            const ytRes = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`);
            if (ytRes.ok) {
              const ytData = await ytRes.json();
              ytResults = ytData.items?.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
                channelTitle: item.snippet.channelTitle,
                source: 'YouTube',
              })) || [];
            } else {
              warnings.push('Failed to fetch YouTube results');
            }
          } catch {
            warnings.push('Failed to fetch YouTube results');
          }
        })(),
        (async () => {
          try {
            const localRes = await fetch(`/api/local-music`);
            if (localRes.ok) {
              const localData = await localRes.json();
              localResults = localData.files
                .filter((file: any) => !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((file: any) => ({
                  id: file.path,
                  title: file.name,
                  thumbnail: file.thumbnail,
                  channelTitle: 'Local File',
                  source: 'Local',
                }));
            } else {
              warnings.push('Failed to fetch Local results');
            }
          } catch {
            warnings.push('Failed to fetch Local results');
          }
        })()
      ]);
      setResults([...ytResults, ...localResults]);
      setError(warnings.length ? warnings.join(' | ') : null);
      setIsLoading(false);
    };
    if (!searchQuery) {
      (async () => {
        setIsLoading(true);
        setError(null);
        try {
          const localRes = await fetch(`/api/local-music`);
          if (localRes.ok) {
            const localData = await localRes.json();
            const localResults = localData.files.map((file: any) => ({
              id: file.path,
              title: file.name,
              thumbnail: file.thumbnail,
              channelTitle: 'Local File',
              source: 'Local',
            }));
            setResults(localResults);
          } else {
            setError('Failed to fetch Local results');
            setResults([]);
          }
        } catch {
          setError('Failed to fetch Local results');
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      fetchResults();
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the URL with the new query
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="flex mb-8 gap-2">
          <Input
            placeholder="Search for songs, karaoke, playlists..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : <MagnifyingGlassIcon className="h-5 w-5" />}
          </Button>
        </form>
        {error && <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map(result => (
            <Link
              key={result.id}
              href={
                result.source === 'YouTube'
                  ? `/karaoke?videoId=${encodeURIComponent(result.id)}`
                  : `/karaoke?localPath=${encodeURIComponent(result.id)}`
              }
              className="block"
            >
              <Card className="flex items-center gap-4 p-4 cursor-pointer hover:bg-accent transition-colors">
                <img src={result.thumbnail} alt={result.title} className="w-24 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{result.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.channelTitle}</p>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600 ml-1">{result.source}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {!isLoading && results.length === 0 && (
          <div className="text-center text-muted-foreground mt-12">No results found.</div>
        )}
      </div>
    </div>
  );
} 