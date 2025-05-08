"use client";

import { Bell, Menu, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleSideNav: () => void;
  openPostModal: () => void;
}

export function Header({ toggleSideNav, openPostModal }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg bg-[#0A0A0F]/80 border-b border-gray-800 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400"
            onClick={toggleSideNav}
          >
            <Menu size={22} />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Aura.io
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 relative"
            onClick={openPostModal}
          >
            <Plus size={22} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 relative"
          >
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
          </Button>
          <Avatar className="h-9 w-9 border border-gray-700">
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
              A
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
