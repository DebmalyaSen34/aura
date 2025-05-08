"use client";

import type React from "react";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "./bottom-nav";
import { SideNav } from "@/components/layout/side-nav";
import { CreatePostModal } from "@/components/features/post/create-post-modal";
import type { ViewType } from "@/types/app-types";

interface MainLayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export function MainLayout({
  children,
  activeView,
  setActiveView,
}: MainLayoutProps) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen);

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-white">
      {/* Side Navigation */}
      <SideNav
        isOpen={isSideNavOpen}
        setIsOpen={setIsSideNavOpen}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          toggleSideNav={toggleSideNav}
          openPostModal={() => setIsPostModalOpen(true)}
        />

        <main className="flex-1 pb-16">{children}</main>

        <BottomNav activeView={activeView} setActiveView={setActiveView} />

        <CreatePostModal
          isOpen={isPostModalOpen}
          setIsOpen={setIsPostModalOpen}
        />
      </div>
    </div>
  );
}
