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

interface EditCoverModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentCover: string;
  onCoverUpdated?: () => void;
}

export function EditCoverModal({
  isOpen,
  setIsOpen,
  currentCover,
  onCoverUpdated,
}: EditCoverModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>(currentCover);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCoverFile(file);
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
    if (!coverFile) {
      setError("Please select an image to upload");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const token = await getAccessToken();
      const formData = new FormData();
      formData.append("cover_image", coverFile);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      const cleanBackendUrl = backendUrl.replace(/\/$/, "");

      const response = await fetch(`${cleanBackendUrl}/profile/cover`, {
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
            `Failed to update cover image: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Cover image updated successfully:", data);

      // Call the callback to refresh the profile
      if (onCoverUpdated) {
        onCoverUpdated();
      }

      // Close modal
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating cover image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update cover image. Please try again."
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
              Edit Cover Image
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div
            {...getRootProps()}
            className={`aspect-[3/1] relative overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
              isDragActive
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-[#0A0A0F] hover:border-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Cover preview"
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
                  Recommended size: 1500 x 500 pixels
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
              disabled={isLoading || !coverFile}
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
