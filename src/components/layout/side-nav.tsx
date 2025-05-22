"use client";

import type React from "react";

import { useEffect } from "react";
import {
  Home,
  Bell,
  User,
  Bookmark,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Sparkles,
  Compass,
  Users,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { ViewType } from "@/types/app-types";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export function SideNav({
  isOpen,
  setIsOpen,
  activeView,
  setActiveView,
}: SideNavProps) {
  // Close side nav when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest('[data-side-nav="true"]') &&
        window.innerWidth < 768
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Prevent scrolling when side nav is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavItemClick = (view: ViewType) => {
    setActiveView(view);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <div
        data-side-nav="true"
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#0F0F17] border-r border-gray-800 z-30 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-[240px] md:z-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Aura.io
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-gray-700">
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700">
                A
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Alex Morgan</h3>
              <p className="text-xs text-gray-400">@alexmorgan</p>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* Navigation Items */}
          <div className="p-2 flex-1 overflow-auto">
            <div className="mb-4">
              <h4 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main
              </h4>
              <NavItem
                icon={<Home size={20} />}
                label="Home"
                isActive={activeView === "home"}
                onClick={() => handleNavItemClick("home")}
              />
              <NavItem
                icon={<Compass size={20} />}
                label="Explore"
                isActive={activeView === "explore"}
                onClick={() => handleNavItemClick("explore")}
              />
              <NavItem
                icon={<MessageSquare size={20} />}
                label="Messages"
                isActive={activeView === "messages"}
                onClick={() => handleNavItemClick("messages")}
                badge={5}
              />
              <NavItem
                icon={<Bell size={20} />}
                label="Alerts"
                isActive={activeView === "alerts"}
                onClick={() => handleNavItemClick("alerts")}
                badge={3}
              />
            </div>

            <div className="mb-4">
              <h4 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Discover
              </h4>
              <NavItem icon={<TrendingUp size={20} />} label="Trending" />
              <NavItem icon={<Sparkles size={20} />} label="Popular" />
              <NavItem icon={<Users size={20} />} label="Communities" />
            </div>

            <div className="mb-4">
              <h4 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Personal
              </h4>
              <NavItem
                icon={<User size={20} />}
                label="Profile"
                isActive={activeView === "profile"}
                onClick={() => handleNavItemClick("profile")}
              />
              <NavItem icon={<Bookmark size={20} />} label="Saved" />
            </div>
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-800">
            <NavItem icon={<Settings size={20} />} label="Settings" />
            <NavItem icon={<HelpCircle size={20} />} label="Help Center" />
            <NavItem icon={<LogOut size={20} />} label="Log Out" />
          </div>
        </div>
      </div>
    </>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: number;
}

function NavItem({ icon, label, isActive, onClick, badge }: NavItemProps) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors ${
        isActive
          ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white"
          : "text-gray-400 hover:bg-[#1A1A25] hover:text-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-medium bg-purple-600 text-white rounded-full px-1">
            {badge}
          </span>
        )}
      </div>
      <span>{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
      )}
    </button>
  );
}
