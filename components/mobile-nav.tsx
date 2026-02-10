"use client";

import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  BookOpen,
  Settings,
  Flower2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, setActiveView, type AppState } from "@/lib/store";
import { useState } from "react";

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

export function MobileNav() {
  const { activeView } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
            <Flower2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-base font-serif font-semibold tracking-tight text-foreground italic">
            mi espacio
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="p-2 rounded-xl hover:bg-muted/60 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </header>

      {open && (
        <nav className="border-b border-border bg-card/95 backdrop-blur-sm px-3 py-2">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveView(item.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2 : 1.5} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
