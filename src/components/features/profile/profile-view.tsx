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
  Camera,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostCard } from "@/components/features/post/post-card";
import { CreatePostModal } from "@/components/features/post/create-post-modal";
import { EditProfileModal } from "@/components/features/profile/edit-profile-modal";
import { EditCoverModal } from "@/components/features/profile/edit-cover-modal";
import { EditAvatarModal } from "@/components/features/profile/edit-avatar-modal";
import { usePosts } from "@/hooks/use-posts";
import getAccessToken from "@/lib/getAcessToken";
import { Profile } from "@/types/profile-types";
import { getCleanDate } from "@/lib/utils";
import { ProfileSkeleton } from "@/components/features/profile/profile-skeleton";

interface LikedPost {
  incident_id: number;
  created_at: string;
  content: string;
  incident_user_id: string;
  username: string;
  name: string;
  profile_image: string;
  total_upvotes: number;
  total_downvotes: number;
  total_comments: number;
  is_upvoted: boolean;
}

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("posts");
  const { posts, toggleLike } = usePosts();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditCoverModalOpen, setIsEditCoverModalOpen] = useState(false);
  const [isEditAvatarModalOpen, setIsEditAvatarModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [likedPostsData, setLikedPostsData] = useState<LikedPost[]>([]);

  const token = getAccessToken();

  // Transform profile data for the UI
  const profileData = profile?.user
    ? {
        name: profile.user.name,
        username: profile.user.username || "",
        bio: profile.user.bio || "No bio provided",
        avatar: profile.user.profile_image,
        cover_image:
          profile.user.cover_image || "/placeholder.svg?height=144&width=600",
        location: "San Francisco, CA",
        website: "aura.io/alex",
        user_id: profile.user.id,
        created_at: profile.user.created_at,
      }
    : null;

  const profileStats = [
    { label: "Posts", value: profile?.user?.incidents || 0 },
    { label: "Following", value: "843" },
    { label: "Followers", value: "2.4K" },
  ];

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
      // Check if profile data is in localStorage and not expired
      const cachedData = localStorage.getItem("profile");
      const cacheTimestamp = localStorage.getItem("profile_timestamp");

      if (cachedData && cacheTimestamp) {
        const currentTime = new Date().getTime();
        const cachedTime = parseInt(cacheTimestamp);
        const oneMinute = 60 * 1000; // 1 minute in milliseconds

        if (currentTime - cachedTime < oneMinute) {
          console.log("Using cached profile data");
          setProfile(JSON.parse(cachedData));
          setIsRefreshing(false);
          return;
        } else {
          // Clear expired cache
          localStorage.removeItem("profile");
          localStorage.removeItem("profile_timestamp");
        }
      }

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
        credentials: "include",
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

      // Update the profile state
      setProfile(data);

      // Update localStorage with new data and timestamp
      localStorage.setItem("profile", JSON.stringify(data));
      localStorage.setItem(
        "profile_timestamp",
        new Date().getTime().toString()
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchLikedPosts = async () => {
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      const cleanBackendUrl = backendUrl.replace(/\/$/, "");

      const response = await fetch(
        `${cleanBackendUrl}/profile/user-liked-incidents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch liked posts");
      }

      const data: LikedPost[] = await response.json();
      console.log("Liked posts data:", data);

      // Store the full liked posts data
      setLikedPostsData(data);

      // Transform the array into a Record<number, boolean>
      const likedPostsMap = data.reduce((acc, post) => {
        acc[post.incident_id] = post.is_upvoted;
        return acc;
      }, {} as Record<number, boolean>);

      setLikedPosts(likedPostsMap);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect running, token:", token);

    if (token) {
      fetchUserProfile();
      fetchLikedPosts();
    }
  }, [token]);

  // Handler for cover image update
  const handleCoverUpdated = () => {
    fetchUserProfile();
  };

  // If we're refreshing or don't have profile data yet, show the skeleton loader
  if (isRefreshing || !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="pb-6">
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        setIsOpen={setIsCreatePostOpen}
        profile={
          profileData
            ? {
                name: profileData.name,
                username: profileData.username,
                profile_image: profileData.avatar,
                user_id: profileData.user_id,
              }
            : undefined
        }
        onPostCreated={fetchUserProfile}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        setIsOpen={setIsEditProfileModalOpen}
        profile={profileData}
      />

      {/* Edit Cover Modal */}
      <EditCoverModal
        isOpen={isEditCoverModalOpen}
        setIsOpen={setIsEditCoverModalOpen}
        currentCover={
          profileData?.cover_image || "/placeholder.svg?height=144&width=600"
        }
        onCoverUpdated={handleCoverUpdated}
      />

      {/* Edit Avatar Modal */}
      <EditAvatarModal
        isOpen={isEditAvatarModalOpen}
        setIsOpen={setIsEditAvatarModalOpen}
        currentAvatar={profileData?.avatar || "/placeholder.svg"}
        onAvatarUpdated={handleCoverUpdated}
      />

      {/* Cover Image */}
      <div className="relative h-36 sm:h-48 md:h-56 bg-gradient-to-r from-indigo-900 to-purple-900 overflow-hidden">
        <Image
          src={
            profileData?.cover_image || "/placeholder.svg?height=144&width=600"
          }
          alt="Cover"
          fill
          className="object-cover opacity-50 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent opacity-40"></div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 right-4 flex gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-black/30 border-gray-600 backdrop-blur-sm hover:bg-black/50 hover:border-gray-500 transition-all duration-200"
            onClick={() => setIsEditCoverModalOpen(true)}
          >
            <Camera size={14} className="mr-1.5" />
            Edit Cover
          </Button>
        </motion.div>
      </div>

      {/* Profile Info */}
      <div className="px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end -mt-12 sm:-mt-16 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-[#0A0A0F] ring-2 ring-purple-500/20">
              <AvatarImage
                src={profileData?.avatar || "/placeholder.svg"}
                alt={profileData?.name || "Profile"}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-2xl">
                {profileData?.name
                  ? profileData.name.charAt(0).toUpperCase()
                  : "A"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-black/50 border-gray-600 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 hover:border-gray-500"
              onClick={() => setIsEditAvatarModalOpen(true)}
            >
              <Camera size={14} />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 sm:mt-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-[#15151F] border-gray-800 text-white hover:bg-[#1A1A25] hover:border-purple-500/50 transition-all duration-200"
              onClick={() => setIsEditProfileModalOpen(true)}
            >
              <Settings size={14} className="mr-1.5" />
              Edit Profile
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 sm:mt-6"
        >
          <h1 className="text-xl sm:text-2xl font-bold">
            {profileData?.name || "User"}
          </h1>
          <p className="text-gray-400">
            @{profileData?.username || "username"}
          </p>

          <p className="text-gray-200 mt-3 sm:mt-4 sm:text-base">
            {profileData?.bio || "No bio provided"}
          </p>

          <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 sm:mt-4 text-sm text-gray-400">
            {profileData?.location && (
              <div className="flex items-center">
                <MapPin size={14} className="mr-1.5 text-gray-500" />
                {profileData.location}
              </div>
            )}
            {profileData?.website && (
              <div className="flex items-center">
                <LinkIcon size={14} className="mr-1.5 text-gray-500" />
                <a
                  href={`https://${profileData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                >
                  {profileData.website}
                </a>
              </div>
            )}
            <div className="flex items-center">
              <Calendar size={14} className="mr-1.5 text-gray-500" />
              {getCleanDate(profileData?.created_at || "")}
            </div>
          </div>

          <div className="flex gap-6 mt-4 sm:mt-6">
            {profileStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col"
              >
                <span className="font-bold text-lg">{stat.value}</span>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Separator className="my-6 bg-gray-800/50" />

      {/* Tabs */}
      <Tabs
        defaultValue="posts"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="px-4 sticky top-0 z-10 bg-[#0A0A0F]/80 backdrop-blur-md py-2 transition-all duration-300">
          <TabsList className="w-full bg-[#15151F] border border-gray-800 rounded-xl p-1">
            <TabsTrigger
              value="posts"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
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
          <AnimatePresence mode="wait">
            <motion.div
              key="posts-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="flex flex-col gap-4 px-4">
                  {profile?.incidents && profile.incidents.length > 0 ? (
                    profile.incidents.map((post, index) => (
                      <motion.div
                        key={post.incident_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <PostCard
                          post={post}
                          isLiked={likedPosts[post.incident_id]}
                          onLike={() => toggleLike(post.incident_id)}
                          onDislike={() => toggleLike(post.incident_id)}
                          isOwnPost={true}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      key="empty-posts"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <EmptyProfileTab
                        icon={<Grid size={40} />}
                        title="No Posts Yet"
                        description="Share your thoughts with the world"
                        actionLabel="Create Post"
                        onAction={() => setIsCreatePostOpen(true)}
                      />
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="media" className="mt-4 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="media-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="likes" className="mt-4 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="likes-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="flex flex-col gap-4">
                  {likedPostsData.length > 0 ? (
                    likedPostsData.map((post, index) => (
                      <motion.div
                        key={post.incident_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <PostCard
                          post={post}
                          isLiked={likedPosts[post.incident_id]}
                          onLike={() => toggleLike(post.incident_id)}
                          onDislike={() => toggleLike(post.incident_id)}
                          isOwnPost={
                            post.incident_user_id === profile?.user?.id
                          }
                        />
                      </motion.div>
                    ))
                  ) : (
                    <EmptyProfileTab
                      icon={<Heart size={40} />}
                      title="No Likes Yet"
                      description="Posts you like will appear here"
                      actionLabel="Explore Posts"
                    />
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="saved" className="mt-4 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="saved-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyProfileTab
                icon={<Bookmark size={40} />}
                title="No Saved Posts"
                description="Bookmark posts to save them for later"
                actionLabel="Explore Posts"
              />
            </motion.div>
          </AnimatePresence>
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
