"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/features/post/post-card";
import { PostSkeleton } from "@/components/features/post/post-skeleton";
import { EmptyState } from "@/components/features/shared/empty-state";
import { usePosts } from "@/hooks/use-posts";

export function FeedView() {
  const [activeTab, setActiveTab] = useState("for-you");
  const { posts, isLoading, likedPosts, toggleLike } = usePosts();

  return (
    <div>
      {/* Tabs */}
      <Tabs
        defaultValue="for-you"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full bg-[#15151F] border border-gray-800 rounded-xl p-1">
            <TabsTrigger
              value="for-you"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Sparkles size={16} className="mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <TrendingUp size={16} className="mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Bookmark size={16} className="mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="for-you" className="mt-4">
          <AnimatePresence>
            {isLoading ? (
              <div className="flex flex-col gap-4 px-4">
                {[1, 2].map((i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 px-4">
                {Array.isArray(posts) ? (
                  posts.map((post) => (
                    <PostCard
                      key={post.incident_id}
                      post={post}
                      isLiked={post.is_upvoted || false}
                      onLike={() => toggleLike(post.incident_id, true, false)}
                      onDislike={() =>
                        toggleLike(post.incident_id, false, true)
                      }
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    No posts available
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>

          {!isLoading && (
            <div className="text-center text-gray-400 text-sm py-6">
              <p>No more posts to load</p>
              <Button variant="link" className="text-indigo-400 mt-1">
                Refresh
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="mt-0 px-4 py-8 text-center">
          <EmptyState
            icon={<TrendingUp size={40} />}
            title="Discover Trending Topics"
            description="See what's popular in your network right now"
            actionLabel="Explore Trends"
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-0 px-4 py-8 text-center">
          <EmptyState
            icon={<Bookmark size={40} />}
            title="Your Saved Posts"
            description="You haven't saved any posts yet"
            actionLabel="Browse Feed"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
