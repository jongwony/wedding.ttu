"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload } from "lucide-react";
import GalleryItem, { MediaItem } from "./GalleryItem";
import GalleryModal from "./GalleryModal";
import UploadModal from "./UploadModal";

const ITEMS_PER_PAGE = 30;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.jongwony.com";

interface ApiResponseItem {
  id: string;
  type: string;
  original_url: string;
  optimized_url: string;
  thumbnail_url?: string;
  likes: number;
  uploaded_at: string;
}

function convertToMediaItem(apiItem: ApiResponseItem): MediaItem {
  return {
    id: apiItem.id,
    type: apiItem.type as "image" | "video",
    originalUrl: apiItem.original_url,
    optimizedUrl: apiItem.optimized_url,
    thumbnailUrl: apiItem.thumbnail_url,
    likes: apiItem.likes,
    uploadedAt: apiItem.uploaded_at,
  };
}

function validateApiItem(item: unknown): item is ApiResponseItem {
  const candidate = item as ApiResponseItem;
  return (
    typeof candidate.id === 'string' &&
    (candidate.type === 'image' || candidate.type === 'video') &&
    (typeof candidate.original_url === 'string' || typeof candidate.optimized_url === 'string') &&
    typeof candidate.likes === 'number' &&
    typeof candidate.uploaded_at === 'string'
  );
}

export default function ExploreGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const observerTarget = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // Load initial items
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/iac/gallery/v1/items?page=${page}&limit=${ITEMS_PER_PAGE}`
      );

      if (!response.ok) throw new Error("Failed to fetch items");

      const data = await response.json();
      const rawItems: unknown[] = data.items || [];
      const validApiItems = rawItems.filter(validateApiItem);

      if (validApiItems.length !== rawItems.length) {
        console.warn('Some items failed validation');
      }

      const newItems: MediaItem[] = validApiItems.map(convertToMediaItem);

      if (newItems.length === 0 || newItems.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load gallery items:", error);
      setError("사진을 불러오는데 실패했습니다. 다시 시도해주세요.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [hasMore, page]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, isLoading, hasMore]);

  const handleLike = async (id: string) => {
    // Optimistic UI update: toggle liked state only
    const isCurrentlyLiked = likedItems.has(id);

    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    try {
      const response = await fetch(`${API_BASE_URL}/iac/gallery/v1/items/${id}/like`, {
        method: "POST",
      });

      if (!response.ok) throw new Error('Like failed');

      // Note: Server doesn't return updated count, so we keep the optimistic state
      // Count will be updated on next page load from server
    } catch (error) {
      console.error("Failed to like item:", error);

      // Rollback on error
      setLikedItems((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    }
  };

  const handleUploadSuccess = (newItems: MediaItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Wedding Gallery
          </h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="container mx-auto px-1 py-4 md:px-4">
        {/* Error message */}
        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-red-600">
            <p>{error}</p>
            <button
              onClick={() => { setError(null); setHasMore(true); loadMore(); }}
              className="mt-2 rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              다시 시도
            </button>
          </div>
        )}

        {items.length === 0 && !isLoading && !error ? (
          <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg">아직 업로드된 사진이 없습니다</p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4 rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
              >
                첫 번째 사진을 업로드하세요
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {items.map((item) => (
              <GalleryItem
                key={item.id}
                item={item}
                isLiked={likedItems.has(item.id)}
                onLike={handleLike}
                onClick={setSelectedItem}
              />
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="h-10" />

        {/* No more items */}
        {!hasMore && items.length > 0 && !error && (
          <div className="flex justify-center py-8 text-gray-500">
            <p>모든 사진을 불러왔습니다</p>
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {selectedItem && (
        <GalleryModal
          item={selectedItem}
          items={items}
          likedItems={likedItems}
          onClose={() => setSelectedItem(null)}
          onLike={handleLike}
        />
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
