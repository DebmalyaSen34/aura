"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, Plus, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConversationList } from "@/components/features/messages/conversation-list";
import { ConversationView } from "@/components/features/messages/conversation-view";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

export function MessagesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Reset active conversation when switching to mobile view
  useEffect(() => {
    if (isMobile && activeConversation) {
      // Don't reset on initial load
      if (
        typeof window !== "undefined" &&
        window.history.state?.activeConversation
      ) {
        setActiveConversation(null);
      }
    }
  }, [isMobile]);

  // Handle back button on mobile
  const handleBack = () => {
    setActiveConversation(null);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row">
      <AnimatePresence mode="wait">
        {/* Conversation List - Hidden on mobile when a conversation is active */}
        {(!isMobile || !activeConversation) && (
          <motion.div
            key="conversation-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full md:w-80 md:min-w-80 border-r border-gray-800 flex flex-col"
          >
            <div className="p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold mb-4">Messages</h1>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10 bg-[#15151F] border-gray-800 focus-visible:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <ConversationList
                searchQuery={searchQuery}
                activeConversationId={activeConversation}
                onSelectConversation={setActiveConversation}
              />
            </div>

            <div className="p-3 border-t border-gray-800">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Plus size={18} className="mr-2" />
                New Message
              </Button>
            </div>
          </motion.div>
        )}

        {/* Conversation View */}
        {activeConversation && (
          <motion.div
            key="conversation-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col h-full"
          >
            {isMobile && (
              <div className="p-3 border-b border-gray-800 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="mr-2"
                >
                  <ArrowLeft size={20} />
                </Button>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
                    S
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium text-sm">Sarah Johnson</h2>
                  <p className="text-xs text-gray-400">@sarahj</p>
                </div>
              </div>
            )}
            <ConversationView conversationId={activeConversation} />
          </motion.div>
        )}

        {/* Empty state when no conversation is selected on desktop */}
        {!activeConversation && !isMobile && (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center mb-4">
              <MessageIcon className="text-purple-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-gray-400 max-w-xs">
              Select a conversation or start a new message to begin chatting
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  );
}
