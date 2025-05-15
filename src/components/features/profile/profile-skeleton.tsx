"use client";

import { motion } from "framer-motion";

export function ProfileSkeleton() {
  return (
    <div className="pb-6">
      {/* Cover Image Skeleton */}
      <div className="relative h-36 sm:h-48 md:h-56 bg-gradient-to-r from-[#1a1a2e] to-[#2d2b42] animate-gradient overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent opacity-40" />
      </div>

      {/* Profile Info Skeleton */}
      <div className="px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end -mt-12 sm:-mt-16 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Avatar Skeleton */}
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#2d2b42] animate-pulse border-4 border-[#0A0A0F] ring-2 ring-purple-500/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 sm:mt-0"
          >
            {/* Edit Profile Button Skeleton */}
            <div className="h-9 w-28 bg-[#15151F] rounded-md animate-pulse" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 sm:mt-6 space-y-4"
        >
          {/* Name Skeleton */}
          <div className="h-7 w-48 bg-[#15151F] rounded-md animate-pulse" />

          {/* Username Skeleton */}
          <div className="h-5 w-32 bg-[#15151F] rounded-md animate-pulse opacity-70" />

          {/* Bio Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full max-w-[600px] bg-[#15151F] rounded-md animate-pulse opacity-60" />
            <div className="h-4 w-full max-w-[500px] bg-[#15151F] rounded-md animate-pulse opacity-60" />
          </div>

          {/* Profile Meta Skeleton */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="h-5 w-24 bg-[#15151F] rounded-md animate-pulse opacity-50" />
            <div className="h-5 w-28 bg-[#15151F] rounded-md animate-pulse opacity-50" />
            <div className="h-5 w-32 bg-[#15151F] rounded-md animate-pulse opacity-50" />
          </div>

          {/* Stats Skeleton */}
          <div className="flex gap-6 mt-4">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col gap-2"
              >
                <div className="h-6 w-12 bg-[#15151F] rounded-md animate-pulse" />
                <div className="h-4 w-16 bg-[#15151F] rounded-md animate-pulse opacity-70" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-6 border-t border-gray-800/50">
        <div className="px-4 mt-6">
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="h-10 w-24 bg-[#15151F] rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Posts Skeleton */}
        <div className="mt-6 px-4 space-y-4">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-[#15151F] rounded-xl p-4 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#2d2b42] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-[#1a1a2e] rounded-md animate-pulse" />
                  <div className="h-4 w-24 bg-[#1a1a2e] rounded-md animate-pulse opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#1a1a2e] rounded-md animate-pulse opacity-60" />
                <div className="h-4 w-3/4 bg-[#1a1a2e] rounded-md animate-pulse opacity-60" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Add gradient animation
const styles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
  }
`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
