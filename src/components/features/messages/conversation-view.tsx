"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Send,
  ImageIcon,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
} from "lucide-react";

interface ConversationViewProps {
  conversationId: string;
}

export function ConversationView({ conversationId }: ConversationViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call to fetch messages
    const timer = setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Simulate typing indicator
  useEffect(() => {
    if (conversationId === "1") {
      const timer = setTimeout(() => {
        setIsTyping(true);

        // Stop typing after 3 seconds
        const stopTimer = setTimeout(() => {
          setIsTyping(false);
        }, 3000);

        return () => clearTimeout(stopTimer);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [conversationId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg: Message = {
      id: `new-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
      status: "sending",
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    // Simulate message being sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMsg.id ? { ...msg, status: "sent" } : msg
        )
      );

      // Simulate message being delivered
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg
          )
        );

        // Simulate message being read
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newMsg.id ? { ...msg, status: "read" } : msg
            )
          );
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-400">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Conversation Header - Hidden on mobile */}
      <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
              S
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">Sarah Johnson</h2>
            <p className="text-xs text-gray-400">
              {isTyping ? (
                <span className="text-green-500 flex items-center">
                  <span className="typing-indicator mr-1">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  Typing...
                </span>
              ) : (
                "Last active 5m ago"
              )}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical size={20} />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400">
                  {format(new Date(date), "MMMM d, yyyy")}
                </div>
              </div>

              {dateMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className={`flex ${
                    message.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  {!message.isOwn && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
                        S
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] flex flex-col ${
                      message.isOwn ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.isOwn
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                          : "bg-[#15151F] text-white rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <span>
                        {format(new Date(message.timestamp), "h:mm a")}
                      </span>
                      {message.isOwn && (
                        <span className="ml-1">
                          {message.status === "sending" && <Clock size={12} />}
                          {message.status === "sent" && <Check size={12} />}
                          {message.status === "delivered" && (
                            <CheckCheck size={12} />
                          )}
                          {message.status === "read" && (
                            <CheckCheck size={12} className="text-blue-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start"
              >
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
                    S
                  </AvatarFallback>
                </Avatar>
                <div className="px-4 py-3 rounded-2xl bg-[#15151F] text-white rounded-bl-none">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-[#15151F] rounded-lg border border-gray-800 focus-within:border-purple-500 transition-colors">
            <Textarea
              placeholder="Type a message..."
              className="min-h-[80px] max-h-[160px] bg-transparent border-0 focus-visible:ring-0 resize-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-800">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                >
                  <Paperclip size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                >
                  <ImageIcon size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                >
                  <Smile size={18} />
                </Button>
              </div>
            </div>
          </div>
          <Button
            className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 p-0 flex items-center justify-center"
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ""}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Types and mock data
interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: "sending" | "sent" | "delivered" | "read";
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hey Alex! How's your day going?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isOwn: false,
  },
  {
    id: "2",
    text: "Hi Sarah! It's going well, thanks for asking. Just working on some new designs for the project.",
    timestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 5
    ).toISOString(), // 1 day ago + 5 minutes
    isOwn: true,
    status: "read",
  },
  {
    id: "3",
    text: "That sounds interesting! Can you share some of your progress?",
    timestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 10
    ).toISOString(), // 1 day ago + 10 minutes
    isOwn: false,
  },
  {
    id: "4",
    text: "Sure thing! I'll send you some mockups later today.",
    timestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 15
    ).toISOString(), // 1 day ago + 15 minutes
    isOwn: true,
    status: "read",
  },
  {
    id: "5",
    text: "Perfect! Looking forward to seeing them.",
    timestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 20
    ).toISOString(), // 1 day ago + 20 minutes
    isOwn: false,
  },
  {
    id: "6",
    text: "By the way, are you going to the team meetup next week?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isOwn: false,
  },
  {
    id: "7",
    text: "Yes, I'm planning to attend! It'll be great to see everyone in person again.",
    timestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5
    ).toISOString(), // 2 hours ago + 5 minutes
    isOwn: true,
    status: "read",
  },
  {
    id: "8",
    text: "Awesome! I'm excited too. It's been a while since we all got together.",
    timestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 10
    ).toISOString(), // 2 hours ago + 10 minutes
    isOwn: false,
  },
  {
    id: "9",
    text: "Definitely! Do you know if there's any specific agenda for the meetup?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isOwn: true,
    status: "read",
  },
  {
    id: "10",
    text: "I heard we'll be discussing the roadmap for the next quarter and maybe doing some team-building activities.",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    isOwn: false,
  },
  {
    id: "11",
    text: "That sounds great! I have some ideas I'd like to share about the new features we've been discussing.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    isOwn: true,
    status: "read",
  },
  {
    id: "12",
    text: "Perfect timing then! The team will definitely appreciate your input.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isOwn: false,
  },
  {
    id: "13",
    text: "Thanks! I'm looking forward to it. By the way, I just finished the mockups we discussed earlier. Would you like me to send them now?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    isOwn: true,
    status: "read",
  },
  {
    id: "14",
    text: "Yes, please! That would be great.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isOwn: false,
  },
];
