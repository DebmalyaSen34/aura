"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
  Plus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostCard } from "@/components/features/post/post-card";
import { CreatePostModal } from "@/components/features/post/create-post-modal";
import { usePosts } from "@/hooks/use-posts";
import getAccessToken from "@/lib/getAcessToken";
import { Profile } from "@/types/profile-types";
import { getCleanDate } from "@/lib/utils";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("posts");
  const { posts, likedPosts, toggleLike } = usePosts();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const token = getAccessToken();

  // Add this console log to debug the profile state
  console.log("Current profile state:", profile);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    setIsRefreshing(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      console.log("Backend URL:", backendUrl);

      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      // Remove any trailing slashes from the backend URL
      const cleanBackendUrl = backendUrl.replace(/\/$/, "");

      console.log("Fetching profile from:", `${cleanBackendUrl}/profile`);

      const response = await fetch(`${cleanBackendUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        credentials: "include", // Add this to ensure cookies are sent
      });

      console.log("Profile response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Token may be invalid or expired");
        }
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const data: Profile = await response.json();
      console.log("Profile data received:", data);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("useEffect running, token:", token);

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  return (
    <div className="pb-6">
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        setIsOpen={setIsCreatePostOpen}
        profile={
          profile?.user
            ? {
                name: profile.user.name,
                username: profile.user.username || "",
                profile_image: profile.user.profile_image,
              }
            : undefined
        }
        onPostCreated={fetchUserProfile}
      />

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
            {profile?.user?.profile_image ? (
              <AvatarImage
                src={profile.user.profile_image}
                alt={profile.user.name || "Profile"}
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-2xl">
                {profile?.user?.name
                  ? profile.user.name.charAt(0).toUpperCase()
                  : "A"}
              </AvatarFallback>
            )}
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
          <h1 className="text-xl font-bold">{profile?.user?.name || "User"}</h1>
          <p className="text-gray-400">
            @{profile?.user?.username || "username"}
          </p>

          <p className="text-gray-200 mt-3">
            {profile?.user?.bio || "No bio provided"}
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
              {getCleanDate(profile?.user?.created_at || "")}
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <div className="flex flex-col">
              <span className="font-bold">{profile?.user?.incidents || 0}</span>
              <span className="text-sm text-gray-400">Posts</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">843</span>
              <span className="text-sm text-gray-400">Following</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold">2.4K</span>
              <span className="text-sm text-gray-400">Followers</span>
            </div>
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
          {/* Create Post Button */}
          <div className="px-4 mb-4">
            <Button
              onClick={() => setIsCreatePostOpen(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus size={16} className="mr-2" />
              Create New Post
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-500px)]">
            <div className="flex flex-col gap-4 px-4">
              {isRefreshing ? (
                <div className="flex justify-center py-10">
                  <p className="text-gray-400">Loading posts...</p>
                </div>
              ) : profile?.incidents && profile.incidents.length > 0 ? (
                profile.incidents.map((post) => (
                  <PostCard
                    key={post.incident_id}
                    post={post}
                    isLiked={likedPosts[post.incident_id]}
                    onLike={() => toggleLike(post.incident_id)}
                    onDislike={() => toggleLike(post.incident_id)}
                    isOwnPost={true} // These are always the user's own posts in the profile view
                  />
                ))
              ) : (
                <EmptyProfileTab
                  icon={<Grid size={40} />}
                  title="No Posts Yet"
                  description="Share your thoughts with the world"
                  actionLabel="Create Post"
                  onAction={() => setIsCreatePostOpen(true)}
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
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-500 mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <Button
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
