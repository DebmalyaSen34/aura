"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { FeedView } from "@/components/features/feed/feed-view";
import { ExploreView } from "@/components/features/explore/explore-view";
import { AlertsView } from "@/components/features/alerts/alerts-view";
import { ProfileView } from "@/components/features/profile/profile-view";
import { MessagesView } from "@/components/features/messages/messages-view";

export default function AuraApp() {
  const [activeView, setActiveView] = useState<
    "home" | "explore" | "alerts" | "profile" | "messages"
  >("home");

  return (
    <MainLayout activeView={activeView} setActiveView={setActiveView}>
      {activeView === "home" && <FeedView />}
      {activeView === "explore" && <ExploreView />}
      {activeView === "alerts" && <AlertsView />}
      {activeView === "profile" && <ProfileView />}
      {activeView === "messages" && <MessagesView />}
    </MainLayout>
  );
}
