"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import {
  Settings,
  MapPin,
  Calendar,
  LinkIcon,
  Edit,
  Grid,
  Bookmark,
  Heart,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostCard } from "@/components/features/post/post-card";
import { usePosts } from "@/hooks/use-posts";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("posts");
  const { posts, likedPosts, toggleLike } = usePosts();

  const userPosts = posts.filter(
    (post) => post.user.username === "@alexmorgan"
  );

  const profileStats = [
    { label: "Posts", value: "128" },
    { label: "Following", value: "843" },
    { label: "Followers", value: "2.4K" },
  ];

  return (
    <div className="pb-6">
      {/* Cover Image */}
      <div className="relative h-36 bg-gradient-to-r from-indigo-900 to-purple-900">
        <Image
          src="/placeholder.svg?height=144&width=600"
          alt="Cover"
          fill
          className="object-cover opacity-50"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50"
        >
          <Edit size={16} />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-4">
        <div className="flex justify-between items-end -mt-12">
          <Avatar className="h-24 w-24 border-4 border-[#0A0A0F]">
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-2xl">
              A
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#15151F] border-gray-800 text-white hover:bg-[#1A1A25]"
          >
            <Settings size={14} className="mr-1" />
            Edit Profile
          </Button>
        </div>

        <div className="mt-3">
          <h1 className="text-xl font-bold">Alex Morgan</h1>
          <p className="text-gray-400">@alexmorgan</p>

          <p className="text-gray-200 mt-3">
            UI/UX Designer & Frontend Developer. Creating digital experiences
            that matter.
          </p>

          <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-sm text-gray-400">
            <div className="flex items-center">
              <MapPin size={14} className="mr-1" />
              San Francisco, CA
            </div>
            <div className="flex items-center">
              <LinkIcon size={14} className="mr-1" />
              aura.io/alex
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              Joined May 2023
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            {profileStats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="font-bold">{stat.value}</span>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="my-4 bg-gray-800" />

      {/* Tabs */}
      <Tabs
        defaultValue="posts"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="px-4">
          <TabsList className="w-full bg-[#15151F] border border-gray-800 rounded-xl p-1">
            <TabsTrigger
              value="posts"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Grid size={16} className="mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Media
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Heart size={16} className="mr-2" />
              Likes
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

        <TabsContent value="posts" className="mt-4">
          <ScrollArea className="h-[calc(100vh-420px)]">
            <div className="flex flex-col gap-4 px-4">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isLiked={likedPosts[post.id]}
                    onLike={() => toggleLike(post.id)}
                  />
                ))
              ) : (
                <EmptyProfileTab
                  icon={<Grid size={40} />}
                  title="No Posts Yet"
                  description="Share your thoughts with the world"
                  actionLabel="Create Post"
                />
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="media" className="mt-4 px-4">
          <EmptyProfileTab
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            }
            title="No Media Yet"
            description="Photos and videos you share will appear here"
            actionLabel="Share Media"
          />
        </TabsContent>

        <TabsContent value="likes" className="mt-4 px-4">
          <EmptyProfileTab
            icon={<Heart size={40} />}
            title="No Likes Yet"
            description="Posts you like will appear here"
            actionLabel="Explore Posts"
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-4 px-4">
          <EmptyProfileTab
            icon={<Bookmark size={40} />}
            title="No Saved Posts"
            description="Bookmark posts to save them for later"
            actionLabel="Explore Posts"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyProfileTab({
  icon,
  title,
  description,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-500 mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
        {actionLabel}
      </Button>
    </div>
  );
}
