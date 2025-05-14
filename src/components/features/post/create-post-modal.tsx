"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import getAccessToken from "@/lib/getAcessToken";

interface CreatePostModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  profile?: {
    name: string;
    username: string;
    profile_image?: string;
  };
  onPostCreated?: () => void;
}

export function CreatePostModal({
  isOpen,
  setIsOpen,
  profile,
  onPostCreated,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const token = getAccessToken();

      if (!token) {
        setError("You must be logged in to create a post");
        setIsLoading(false);
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      // Remove any trailing slashes from the backend URL
      const cleanBackendUrl = backendUrl.replace(/\/$/, "");

      const response = await fetch(`${cleanBackendUrl}/incidents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      // Clear form
      setContent("");
      // Close modal
      setIsOpen(false);
      // Callback to refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#15151F] border border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Create Post
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex items-start gap-3 mt-4">
          <Avatar className="h-10 w-10">
            {profile?.profile_image ? (
              <AvatarImage src={profile.profile_image} alt={profile.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : "A"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              className="bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500 resize-none min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#0A0A0F] border-gray-800 text-gray-400 hover:text-white"
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
                    className="mr-1"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  Media
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#0A0A0F] border-gray-800 text-gray-400 hover:text-white"
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
                    className="mr-1"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="m10 14 11-11" />
                  </svg>
                  Link
                </Button>
              </div>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
