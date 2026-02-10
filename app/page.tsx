"use client";

import React, { useEffect } from "react"; 
import { useStore } from "@/lib/store";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { DashboardView } from "@/components/dashboard-view";
import { TasksView } from "@/components/tasks-view";
import { NotesView } from "@/components/notes-view";
import { JournalView } from "@/components/journal-view";
import { SettingsView } from "@/components/settings-view";
import { ColorTheme } from "@/components/color-theme";
import { fetchInitialData } from "@/lib/store";

export default function Page() {
  const { activeView } = useStore(); 

  useEffect(() => {
    
    fetchInitialData();
  }, []);

  return (
    <ColorTheme>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <MobileNav />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-5xl w-full mx-auto">
            {/* Ahora activeView ya está definido y funcionará el condicional */}
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "tasks" && <TasksView />}
            {activeView === "notes" && <NotesView />}
            {activeView === "journal" && <JournalView />}
            {activeView === "settings" && <SettingsView />}
          </main>
        </div>
      </div>
    </ColorTheme>
  );
}