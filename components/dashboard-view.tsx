"use client";

import React from "react";
import { useRef } from "react";
import {
  CheckSquare,
  StickyNote,
  BookOpen,
  Circle,
  CheckCircle2,
  ArrowRight,
  ImageIcon,
  X,
  Flower2,
  Sparkles,
  CalendarDays,
  Beaker,
  Calculator,
  Palette,
  Globe,
  Music,
  Pencil,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore, setActiveView, setCoverImage } from "@/lib/store";

const subjectIcons: Record<string, React.ElementType> = {
  calculator: Calculator, flask: Beaker, book: BookOpen, palette: Palette,
  globe: Globe, music: Music, pencil: Pencil, folder: FolderOpen,
};
const subjectDots: Record<string, string> = {
  rose: "bg-[hsl(340,50%,65%)]", lavender: "bg-[hsl(270,40%,65%)]",
  mint: "bg-[hsl(165,40%,50%)]", peach: "bg-[hsl(22,60%,65%)]",
  sky: "bg-[hsl(200,50%,55%)]", cream: "bg-[hsl(40,40%,60%)]",
};

export function DashboardView() {
  const { tasks, notes, journal, subjects, coverImage, greeting, userName, dashboardWidgets, sidebarQuote } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const recentNotes = notes.slice(0, 3);
  const recentJournal = journal.slice(0, 3);
  const recentTasks = tasks.filter((t) => t.status !== "done").slice(0, 5);

  const today = new Date();
  const dateStr = today.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  const hour = today.getHours();
  const timeGreeting = hour < 12 ? "buenos dias" : hour < 19 ? "buenas tardes" : "buenas noches";

  function isWidgetVisible(type: string) {
    const w = dashboardWidgets.find((w) => w.type === type);
    return w ? w.visible : true;
  }

  function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCoverImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  // Calendar mini
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const journalDates = new Set(journal.map((e) => e.date));
  const taskDates = new Set(
    tasks.filter((t) => t.status !== "done").map((t) => t.created_at.split("T")[0])
  );

  // Subject overview
  const subjectsWithTasks = subjects.map((sub) => ({
    ...sub,
    pendingTasks: tasks.filter((t) => t.subject_id === sub.id && t.status !== "done").length,
    noteCount: notes.filter((n) => n.subject_id === sub.id).length,
  })).filter((s) => s.pendingTasks > 0 || s.noteCount > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Cover / Hero */}
      <div className="relative rounded-2xl overflow-hidden group">
        {coverImage ? (
          <div className="relative h-44 md:h-52">
            <img src={coverImage || "/placeholder.svg"} alt="Tu portada personalizada" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/40 to-transparent" />
            <button type="button" onClick={() => setCoverImage(null)} className="absolute top-3 right-3 p-1.5 rounded-full bg-card/60 backdrop-blur-sm hover:bg-card/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remover portada"><X className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm hover:bg-card/80 text-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"><ImageIcon className="h-3 w-3" />cambiar foto</button>
            <div className="absolute bottom-5 left-6 right-6">
              <p className="text-xs text-muted-foreground capitalize mb-1">{timeGreeting} ~ {dateStr}</p>
              <h1 className="text-2xl md:text-3xl font-serif italic text-foreground tracking-tight text-balance">{greeting}{userName ? `, ${userName}` : ""}</h1>
            </div>
          </div>
        ) : (
          <div className="relative h-44 md:h-52 bg-primary/[0.04] border border-dashed border-primary/20 rounded-2xl flex items-end">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card hover:bg-muted text-muted-foreground text-xs font-medium border border-border opacity-0 group-hover:opacity-100 transition-all hover:text-foreground"><ImageIcon className="h-3 w-3" />agregar tu foto</button>
            <div className="p-6 pb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Flower2 className="h-5 w-5 text-primary/60" />
                <Sparkles className="h-3.5 w-3.5 text-primary/40" />
              </div>
              <p className="text-xs text-muted-foreground capitalize mb-1">{timeGreeting} ~ {dateStr}</p>
              <h1 className="text-2xl md:text-3xl font-serif italic text-foreground tracking-tight text-balance">{greeting}{userName ? `, ${userName}` : ""}</h1>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="pendientes" value={todoCount + inProgressCount} icon={Circle} onClick={() => setActiveView("tasks")} variant="warm" />
        <StatCard label="completadas" value={doneCount} icon={CheckCircle2} onClick={() => setActiveView("tasks")} variant="success" />
        <StatCard label="notas" value={notes.length} icon={StickyNote} onClick={() => setActiveView("notes")} variant="primary" />
        <StatCard label="entradas" value={journal.length} icon={BookOpen} onClick={() => setActiveView("journal")} variant="accent" />
      </div>

      {/* Subjects Overview */}
      {subjectsWithTasks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {subjectsWithTasks.map((sub) => {
            const Icon = subjectIcons[sub.icon] || BookOpen;
            const dot = subjectDots[sub.color] || subjectDots.rose;
            return (
              <button key={sub.id} type="button" onClick={() => setActiveView("notes")} className="flex items-center gap-2.5 rounded-2xl border border-border bg-card/80 px-3.5 py-3 hover:shadow-sm hover:border-primary/20 transition-all text-left">
                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", dot, "bg-opacity-20")}>
                  <Icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{sub.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {sub.pendingTasks > 0 && <span>{sub.pendingTasks} tarea{sub.pendingTasks > 1 ? "s" : ""}</span>}
                    {sub.pendingTasks > 0 && sub.noteCount > 0 && " ~ "}
                    {sub.noteCount > 0 && <span>{sub.noteCount} nota{sub.noteCount > 1 ? "s" : ""}</span>}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Progress */}
      {isWidgetVisible("progress") && totalTasks > 0 && (
        <div className="rounded-2xl border border-border bg-card/80 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">tu progreso</span>
            <span className="text-sm font-serif italic text-primary tabular-nums">{completionRate}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary/80 transition-all duration-700 ease-out" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/30" /> {todoCount} por hacer</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[hsl(var(--warning))]/60" /> {inProgressCount} en progreso</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary/60" /> {doneCount} listas</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Tasks */}
        {isWidgetVisible("tasks") && (
          <div className="rounded-2xl border border-border bg-card/80">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary/70" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground">tareas activas</span>
              </div>
              <button type="button" onClick={() => setActiveView("tasks")} className="flex items-center gap-1 text-xs text-primary hover:text-primary/70 font-medium transition-colors">ver todas <ArrowRight className="h-3 w-3" /></button>
            </div>
            <div className="p-3">
              {recentTasks.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Sparkles className="h-5 w-5 text-primary/30 mb-2" />
                  <p className="text-xs text-muted-foreground italic">sin tareas pendientes</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {recentTasks.map((task) => {
                    const sub = subjects.find((s) => s.id === task.subject_id);
                    return (
                      <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors">
                        <div className={cn("h-2 w-2 rounded-full shrink-0", task.status === "in-progress" ? "bg-[hsl(var(--warning))]" : "bg-border")} />
                        <span className="text-sm text-foreground truncate flex-1">{task.title}</span>
                        {sub && (
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium", subjectDots[sub.color] || "bg-muted", "bg-opacity-20 text-muted-foreground")}>{sub.name}</span>
                        )}
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", task.priority === "high" ? "bg-destructive/10 text-destructive" : task.priority === "medium" ? "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]" : "bg-muted text-muted-foreground")}>
                          {task.priority === "high" ? "alta" : task.priority === "medium" ? "media" : "baja"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Notes */}
        {isWidgetVisible("notes") && (
          <div className="rounded-2xl border border-border bg-card/80">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-primary/70" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground">notas recientes</span>
              </div>
              <button type="button" onClick={() => setActiveView("notes")} className="flex items-center gap-1 text-xs text-primary hover:text-primary/70 font-medium transition-colors">ver todas <ArrowRight className="h-3 w-3" /></button>
            </div>
            <div className="p-3">
              {recentNotes.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <StickyNote className="h-5 w-5 text-primary/30 mb-2" />
                  <p className="text-xs text-muted-foreground italic">aun no has creado notas</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {recentNotes.map((note) => {
                    const sub = subjects.find((s) => s.id === note.subject_id);
                    return (
                      <div key={note.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setActiveView("notes")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveView("notes")}>
                        <div className="h-7 w-1 rounded-full bg-primary/25 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-foreground truncate">{note.title || "sin titulo"}</p>
                            {sub && <span className="text-[9px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 shrink-0">{sub.name}</span>}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">{note.content.substring(0, 50)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mini Calendar */}
      {isWidgetVisible("calendar") && (
        <div className="rounded-2xl border border-border bg-card/80 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-primary/70" strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground capitalize">
              {today.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
              <span key={d} className="text-[10px] text-muted-foreground font-medium py-1">{d}</span>
            ))}
            {Array.from({ length: (firstDayOfWeek + 6) % 7 }, (_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = day === today.getDate();
              const hasJournal = journalDates.has(dateKey);
              const hasTask = taskDates.has(dateKey);
              return (
                <div key={day} className={cn("relative flex items-center justify-center h-8 w-8 mx-auto rounded-full text-xs tabular-nums transition-all", isToday ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted/60")}>
                  {day}
                  {(hasJournal || hasTask) && !isToday && (
                    <span className={cn("absolute bottom-0.5 h-1 w-1 rounded-full", hasJournal ? "bg-primary/60" : "bg-[hsl(var(--warning))]/60")} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary/60" /> entrada de diario</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--warning))]/60" /> tarea pendiente</span>
          </div>
        </div>
      )}

      {/* Quote */}
      {isWidgetVisible("quote") && sidebarQuote && (
        <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
          <Flower2 className="h-4 w-4 text-primary/40 mb-2" strokeWidth={1.5} />
          <p className="text-sm text-foreground/70 leading-relaxed italic font-serif">
            {'"'}{sidebarQuote}{'"'}
          </p>
        </div>
      )}

      {/* Recent Journal */}
      {isWidgetVisible("journal") && recentJournal.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/80">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary/70" strokeWidth={1.5} />
              <span className="text-sm font-medium text-foreground">diario reciente</span>
            </div>
            <button type="button" onClick={() => setActiveView("journal")} className="flex items-center gap-1 text-xs text-primary hover:text-primary/70 font-medium transition-colors">ver todo <ArrowRight className="h-3 w-3" /></button>
          </div>
          <div className="p-3">
            <div className="flex flex-col gap-1">
              {recentJournal.map((entry) => {
                const date = new Date(entry.date + "T12:00:00");
                return (
                  <div key={entry.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setActiveView("journal")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveView("journal")}>
                    <div className="text-center shrink-0 min-w-[2.5rem] bg-primary/[0.06] rounded-xl py-1.5 px-1">
                      <p className="text-base font-serif italic font-semibold text-foreground leading-none tabular-nums">{date.getDate()}</p>
                      <p className="text-[9px] text-muted-foreground uppercase mt-0.5">{date.toLocaleDateString("es-ES", { month: "short" })}</p>
                    </div>
                    <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed pt-0.5">{entry.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, onClick, variant }: {
  label: string; value: number; icon: React.ElementType; onClick: () => void;
  variant: "warm" | "success" | "primary" | "accent";
}) {
  const variantStyles = {
    warm: "bg-[hsl(var(--warning))]/8 text-[hsl(var(--warning))]",
    success: "bg-[hsl(var(--success))]/8 text-[hsl(var(--success))]",
    primary: "bg-primary/8 text-primary",
    accent: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]",
  };
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-4 hover:shadow-sm hover:border-primary/20 transition-all text-left group">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shrink-0", variantStyles[variant])}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-xl font-serif italic font-semibold text-foreground tabular-nums leading-none">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
      </div>
    </button>
  );
}
