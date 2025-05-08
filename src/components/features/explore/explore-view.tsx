"use client";

import { useState } from "react";
import { Search, TrendingUp, Compass, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ExploreView() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingTopics = [
    { id: 1, name: "AI Development", count: "12.5K posts" },
    { id: 2, name: "Web3", count: "8.3K posts" },
    { id: 3, name: "React 19", count: "6.7K posts" },
    { id: 4, name: "NextJS", count: "5.2K posts" },
    { id: 5, name: "UX Design", count: "4.9K posts" },
  ];

  const categories = [
    { id: 1, name: "Technology", icon: <Compass size={24} /> },
    { id: 2, name: "Design", icon: <Compass size={24} /> },
    { id: 3, name: "Business", icon: <Compass size={24} /> },
    { id: 4, name: "Science", icon: <Compass size={24} /> },
    { id: 5, name: "Health", icon: <Compass size={24} /> },
    { id: 6, name: "Sports", icon: <Compass size={24} /> },
    { id: 7, name: "Entertainment", icon: <Compass size={24} /> },
    { id: 8, name: "Education", icon: <Compass size={24} /> },
  ];

  return (
    <div className="p-4">
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search topics, users, or posts..."
          className="pl-10 bg-[#15151F] border-gray-800 focus-visible:ring-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="w-full bg-[#15151F] border border-gray-800 rounded-xl p-1 mb-6">
          <TabsTrigger
            value="trending"
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
          >
            <TrendingUp size={16} className="mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
          >
            <Hash size={16} className="mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-0">
          <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-3">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-[#15151F] rounded-xl p-4 border border-gray-800/50 hover:border-purple-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{topic.name}</h3>
                      <p className="text-sm text-gray-400">{topic.count}</p>
                    </div>
                    <TrendingUp className="text-purple-500" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <h2 className="text-xl font-semibold mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="h-auto py-4 bg-[#15151F] border-gray-800 hover:border-purple-500 hover:bg-[#1A1A25] flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center text-purple-400">
                  {category.icon}
                </div>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
