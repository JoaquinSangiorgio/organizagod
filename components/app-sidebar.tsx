"use client";

import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  BookOpen,
  Settings,
  Flower2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, setActiveView, type AppState } from "@/lib/store";

const navItems: {
  id: AppState["activeView"];
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "dashboard", label: "inicio", icon: LayoutDashboard },
  { id: "tasks", label: "tareas", icon: CheckSquare },
  { id: "notes", label: "notas", icon: StickyNote },
  { id: "journal", label: "diario", icon: BookOpen },
  { id: "settings", label: "personalizar", icon: Settings },
];

export function AppSidebar() {
  const { activeView, tasks, notes, journal, userName } = useStore();

  const stats = {
    tasks: tasks.filter((t) => t.status !== "done").length,
    notes: notes.length,
    journal: journal.length,
  };

  return (
    <aside className="hidden md:flex md:w-60 flex-col border-r border-border bg-card/60 h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
          <Flower2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-serif font-semibold tracking-tight text-foreground italic">
            mi espacio
          </span>
          {userName && (
            <span className="text-[10px] text-muted-foreground leading-tight">
              {userName}
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const count =
              item.id === "tasks"
                ? stats.tasks
                : item.id === "notes"
                  ? stats.notes
                  : item.id === "journal"
                    ? stats.journal
                    : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
                {count !== null && count > 0 && (
                  <span
                    className={cn(
                      "ml-auto text-[10px] tabular-nums rounded-full px-2 py-0.5 font-medium",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="px-4 py-4">
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-3.5">
          <p className="text-[11px] text-muted-foreground leading-relaxed italic">
            {"\""}Cada dia es una pagina en blanco esperando ser escrita.{"\""}
          </p>
        </div>
      </div>
    </aside>
  );
}
