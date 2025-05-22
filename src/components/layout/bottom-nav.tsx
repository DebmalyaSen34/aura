"use client";

import type React from "react";

import { Home, Search, Bell, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewType } from "@/types/app-types";

interface BottomNavProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export function BottomNav({ activeView, setActiveView }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0F]/90 backdrop-blur-lg border-t border-gray-800 flex justify-around py-3 px-2 z-10">
      <NavButton
        icon={<Home size={20} />}
        label="Home"
        isActive={activeView === "home"}
        onClick={() => setActiveView("home")}
      />
      <NavButton
        icon={<Search size={20} />}
        label="Explore"
        isActive={activeView === "explore"}
        onClick={() => setActiveView("explore")}
      />
      <NavButton
        icon={<Bell size={20} />}
        label="Alerts"
        isActive={activeView === "alerts"}
        onClick={() => setActiveView("alerts")}
        hasNotification
      />
      <NavButton
        icon={<MessageSquare size={20} />}
        label="Messages"
        isActive={activeView === "messages"}
        onClick={() => setActiveView("messages")}
        hasNotification
      />
      <NavButton
        icon={<User size={20} />}
        label="Profile"
        isActive={activeView === "profile"}
        onClick={() => setActiveView("profile")}
      />
    </nav>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  hasNotification?: boolean;
}

function NavButton({
  icon,
  label,
  isActive,
  onClick,
  hasNotification,
}: NavButtonProps) {
  return (
    <Button
      variant="ghost"
      className={`flex flex-col items-center rounded-lg px-5 py-7 ${
        isActive ? "bg-[#15151F] text-white" : "text-gray-400"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {hasNotification && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
        )}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </Button>
  );
}
