"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import getAccessToken from "@/lib/getAcessToken";

interface EditProfileModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  profile: {
    name: string;
    username: string;
    bio: string;
    avatar?: string;
    location?: string;
    website?: string;
  } | null;
}

export function EditProfileModal({
  isOpen,
  setIsOpen,
  profile,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Update form data when profile changes or modal opens
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
      });
    }
  }, [profile, isOpen]);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      // TODO: Implement profile update logic
      console.log("Updating profile with:", formData);

      const accessToken = await getAccessToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      console.log("Profile updated successfully:", data);

      // Close modal
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
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
              Edit Profile
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Username
            </label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500 resize-none min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Location
            </label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Website
            </label>
            <Input
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="bg-[#0A0A0F] border-gray-800 focus-visible:ring-purple-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="bg-[#0A0A0F] border-gray-800 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
