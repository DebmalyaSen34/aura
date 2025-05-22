"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  searchQuery: string;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({
  searchQuery,
  activeConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch conversations
    const timer = setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.user.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.text
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-800"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-40"></div>
            </div>
            <div className="h-3 bg-gray-800 rounded w-10"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-gray-400">No conversations found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {filteredConversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <ConversationItem
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
            />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20"
          : "hover:bg-[#1A1A25]"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12 border border-gray-700">
          <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
            {conversation.user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {conversation.user.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0F0F17] rounded-full"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium truncate">{conversation.user.name}</h3>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="flex items-center mt-1">
          {conversation.lastMessage.isOwn && (
            <span className="text-xs text-gray-400 mr-1">You:</span>
          )}
          <p className="text-sm text-gray-400 truncate">
            {conversation.lastMessage.text}
          </p>
        </div>
      </div>
      {conversation.unreadCount > 0 && (
        <div className="flex-shrink-0 flex items-center justify-center min-w-[20px] h-5 bg-purple-600 rounded-full text-xs font-medium">
          {conversation.unreadCount}
        </div>
      )}
    </div>
  );
}

// Types and mock data
interface Conversation {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isOwn: boolean;
  };
  unreadCount: number;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      username: "@sarahj",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: true,
    },
    lastMessage: {
      text: "That sounds great! Let's meet up tomorrow.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      isOwn: false,
    },
    unreadCount: 2,
  },
  {
    id: "2",
    user: {
      name: "Michael Chen",
      username: "@mchen",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: false,
    },
    lastMessage: {
      text: "I just sent you the design files. Let me know what you think!",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      isOwn: true,
    },
    unreadCount: 0,
  },
  {
    id: "3",
    user: {
      name: "Jessica Lee",
      username: "@jlee",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: true,
    },
    lastMessage: {
      text: "Did you see the latest update to the project?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      isOwn: false,
    },
    unreadCount: 1,
  },
  {
    id: "4",
    user: {
      name: "David Wilson",
      username: "@dwilson",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: false,
    },
    lastMessage: {
      text: "Thanks for your help with the presentation yesterday!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: "5",
    user: {
      name: "Emma Thompson",
      username: "@ethompson",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: true,
    },
    lastMessage: {
      text: "Are we still on for the meeting at 3pm?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      isOwn: true,
    },
    unreadCount: 0,
  },
  {
    id: "6",
    user: {
      name: "James Rodriguez",
      username: "@jrodriguez",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: false,
    },
    lastMessage: {
      text: "I've shared the document with you. Please review it when you have time.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: "7",
    user: {
      name: "Sophia Garcia",
      username: "@sgarcia",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: true,
    },
    lastMessage: {
      text: "Happy birthday! 🎉🎂",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
      isOwn: false,
    },
    unreadCount: 0,
  },
];
