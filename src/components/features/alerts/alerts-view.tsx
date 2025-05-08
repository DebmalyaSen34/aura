"use client";

import { useState } from "react";
import { Bell, UserPlus, Heart, MessageCircle, AtSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/features/shared/empty-state";

export function AlertsView() {
  const [activeTab, setActiveTab] = useState("all");

  const alerts = [
    {
      id: 1,
      type: "like",
      user: {
        name: "Sarah Johnson",
        username: "@sarahj",
        avatar: "/placeholder.svg?height=48&width=48",
      },
      content: "liked your post",
      postPreview: "This is my first incident!",
      time: "2h ago",
      read: false,
    },
    {
      id: 2,
      type: "follow",
      user: {
        name: "Michael Chen",
        username: "@mchen",
        avatar: "/placeholder.svg?height=48&width=48",
      },
      content: "started following you",
      time: "5h ago",
      read: false,
    },
    {
      id: 3,
      type: "comment",
      user: {
        name: "Jessica Lee",
        username: "@jlee",
        avatar: "/placeholder.svg?height=48&width=48",
      },
      content: "commented on your post",
      commentPreview: "This is really cool! Looking forward to more content.",
      time: "1d ago",
      read: true,
    },
    {
      id: 4,
      type: "mention",
      user: {
        name: "David Wilson",
        username: "@dwilson",
        avatar: "/placeholder.svg?height=48&width=48",
      },
      content: "mentioned you in a post",
      mentionPreview: "Hey @alexmorgan, check this out!",
      time: "2d ago",
      read: true,
    },
    {
      id: 5,
      type: "like",
      user: {
        name: "Emma Thompson",
        username: "@ethompson",
        avatar: "/placeholder.svg?height=48&width=48",
      },
      content: "liked your comment",
      commentPreview: "I completely agree with this perspective.",
      time: "3d ago",
      read: true,
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart size={16} className="text-pink-500" />;
      case "follow":
        return <UserPlus size={16} className="text-green-500" />;
      case "comment":
        return <MessageCircle size={16} className="text-blue-500" />;
      case "mention":
        return <AtSign size={16} className="text-yellow-500" />;
      default:
        return <Bell size={16} className="text-purple-500" />;
    }
  };

  const filteredAlerts =
    activeTab === "all" ? alerts : alerts.filter((alert) => !alert.read);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full bg-[#15151F] border border-gray-800 rounded-xl p-1 mb-6">
          <TabsTrigger
            value="all"
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
          >
            Unread
            <span className="ml-2 bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5">
              2
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-[#15151F] rounded-xl p-4 border ${
                    alert.read
                      ? "border-gray-800/50"
                      : "border-l-4 border-l-purple-500 border-gray-800/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage
                        src={alert.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
                        {alert.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {alert.user.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {alert.user.username}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-300 mt-0.5">
                            {getAlertIcon(alert.type)}
                            <span>{alert.content}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {alert.time}
                        </span>
                      </div>

                      {alert.postPreview && (
                        <div className="mt-2 text-sm text-gray-400 bg-[#0A0A0F] p-2 rounded-md">
                          "{alert.postPreview}"
                        </div>
                      )}

                      {alert.commentPreview && (
                        <div className="mt-2 text-sm text-gray-400 bg-[#0A0A0F] p-2 rounded-md">
                          "{alert.commentPreview}"
                        </div>
                      )}

                      {alert.mentionPreview && (
                        <div className="mt-2 text-sm text-gray-400 bg-[#0A0A0F] p-2 rounded-md">
                          "{alert.mentionPreview}"
                        </div>
                      )}

                      {alert.type === "follow" && (
                        <Button
                          size="sm"
                          className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                          Follow Back
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="space-y-3">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-[#15151F] rounded-xl p-4 border border-l-4 border-l-purple-500 border-gray-800/50"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border border-gray-700">
                        <AvatarImage
                          src={alert.user.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
                          {alert.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {alert.user.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {alert.user.username}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-300 mt-0.5">
                              {getAlertIcon(alert.type)}
                              <span>{alert.content}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {alert.time}
                          </span>
                        </div>

                        {alert.postPreview && (
                          <div className="mt-2 text-sm text-gray-400 bg-[#0A0A0F] p-2 rounded-md">
                            "{alert.postPreview}"
                          </div>
                        )}

                        {alert.type === "follow" && (
                          <Button
                            size="sm"
                            className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            Follow Back
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Bell size={40} />}
                  title="No Unread Alerts"
                  description="You're all caught up!"
                  actionLabel="View All Alerts"
                />
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
