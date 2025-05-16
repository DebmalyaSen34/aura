"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  ThumbsDown,
  ArrowBigUpDash,
  ArrowBigDownDash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { BasicPost, Post } from "@/types/post-types";

interface PostCardProps {
  post: Post | BasicPost;
  isLiked: boolean;
  onLike: () => void;
  onDislike: () => void;
  isOwnPost?: boolean;
}

export function PostCard({
  post,
  isLiked,
  onLike,
  onDislike,
  isOwnPost = false,
}: PostCardProps) {
  // Check if post is the full Post type (has additional fields)
  const isFullPost = (post: Post | BasicPost): post is Post => {
    return (
      "is_upvoted" in post || "is_downvoted" in post || "profile_image" in post
    );
  };

  // Default display values
  const displayName = post.display_name || post.name || "User";
  const username = post.username || displayName;
  const profileImage =
    isFullPost(post) && post.profile_image
      ? post.profile_image
      : "/placeholder.svg";
  const isUpvoted = isFullPost(post) && post.is_upvoted;
  const isDownvoted = isFullPost(post) && post.is_downvoted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#15151F] rounded-xl overflow-hidden border border-gray-800/50"
    >
      <div className="p-4">
        <div className="flex items-start">
          <Avatar className="h-10 w-10 mr-3 border border-gray-700">
            <AvatarImage src={profileImage} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{displayName}</h3>
                <p className="text-xs text-gray-400">@{username}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {formatDate(post.created_at)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400"
                >
                  {/* <MoreHorizontal size={16} /> */}
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-200 mt-2">{post.content}</p>

            {/* {post.media && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <Image
                  src={post.media || "/placeholder.svg"}
                  alt="Post media"
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            )} */}

            {/* {post.trending && (
              <div className="mt-3 flex items-center">
                <span className="text-xs bg-gradient-to-r from-indigo-900/40 to-purple-900/40 text-indigo-300 px-2 py-1 rounded-full flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  Trending in Tech
                </span>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex justify-between px-6 py-3 border-t border-gray-800/50">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`text-gray-400 ${
              isOwnPost
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-pink-500 hover:bg-pink-500/10"
            }`}
            onClick={isOwnPost ? undefined : onLike}
            disabled={isOwnPost}
            title={isOwnPost ? "You cannot vote on your own post" : "Upvote"}
          >
            <ArrowBigUpDash
              size={20}
              className={`mr-1.5 ${
                isUpvoted ? "fill-pink-500 text-pink-500" : ""
              }`}
            />
            <span className={isUpvoted ? "text-pink-500" : ""}>
              {post.total_upvotes}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-gray-400 ${
              isOwnPost
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-500 hover:bg-blue-500/10"
            }`}
            onClick={isOwnPost ? undefined : onDislike}
            disabled={isOwnPost}
            title={isOwnPost ? "You cannot vote on your own post" : "Downvote"}
          >
            <ArrowBigDownDash
              size={20}
              className={`mr-1.5 ${
                isDownvoted ? "fill-blue-500 text-blue-500" : ""
              }`}
            />
            <span className={isDownvoted ? "text-blue-500" : ""}>
              {post.total_downvotes}
            </span>
          </Button>
        </div>
        {/* <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-green-500 hover:bg-green-500/10"
        >
          <MessageCircle size={18} className="mr-1.5" />
          <span>{post.total_comments}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-green-500 hover:bg-green-500/10"
        >
          <Share2 size={18} className="mr-1.5" />
          <span>12</span>
        </Button> */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-purple-500 hover:bg-purple-500/10"
        >
          <Bookmark size={18} />
        </Button>
      </div>
    </motion.div>
  );
}
