"use client";

import { useState, useCallback } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import getAccessToken from "@/lib/getAcessToken";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface EditAvatarModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentAvatar: string;
  onAvatarUpdated?: () => void;
}

export function EditAvatarModal({
  isOpen,
  setIsOpen,
  currentAvatar,
  onAvatarUpdated,
}: EditAvatarModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!avatarFile) {
      setError("Please select an image to upload");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const token = await getAccessToken();
      const formData = new FormData();
      formData.append("profile_image", avatarFile);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      const cleanBackendUrl = backendUrl.replace(/\/$/, "");

      const response = await fetch(`${cleanBackendUrl}/profile/avatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to update profile image: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Profile image updated successfully:", data);

      if (onAvatarUpdated) {
        onAvatarUpdated();
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile image. Please try again."
      );
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
              Edit Profile Picture
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div
            {...getRootProps()}
            className={`aspect-square w-48 mx-auto relative overflow-hidden rounded-full border-2 border-dashed transition-colors ${
              isDragActive
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-[#0A0A0F] hover:border-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Avatar preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Upload size={24} className="mb-2" />
                <p className="text-sm">
                  {isDragActive
                    ? "Drop the image here"
                    : "Click or drag image to upload"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 400 x 400 pixels
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="bg-[#0A0A0F] border-gray-800 text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !avatarFile}
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
