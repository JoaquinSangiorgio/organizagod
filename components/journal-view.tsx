"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  X,
  Sparkles,
  Heart,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useStore,
  addJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  type JournalEntry,
} from "@/lib/store";

// --- CONFIGURACIÓN DE MOODS ---
const moodConfig: Record<
  JournalEntry["mood"],
  { label: string; icon: React.ElementType; color: string; bg: string; emoji: string }
> = {
  great: { label: "increíble", icon: Heart, color: "text-[hsl(340,55%,60%)]", bg: "bg-[hsl(340,55%,60%)]/10", emoji: "🤩" },
  good: { label: "bien", icon: Sun, color: "text-emerald-500", bg: "bg-emerald-500/10", emoji: "😊" },
  neutral: { label: "normal", icon: Cloud, color: "text-orange-400", bg: "bg-orange-400/10", emoji: "😐" },
  bad: { label: "mal", icon: CloudRain, color: "text-blue-500", bg: "bg-blue-500/10", emoji: "😕" },
  terrible: { label: "pésimo", icon: CloudLightning, color: "text-destructive", bg: "bg-destructive/10", emoji: "😫" },
};

export function JournalView() {
  const { journal } = useStore();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  
  // Navegación de meses
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Estados para nueva entrada
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState<JournalEntry["mood"]>("good");
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [tagInput, setTagInput] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const monthStr = selectedMonth.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  // Filtrado y ordenado seguro
  const filteredEntries = journal
    .filter((e) => {
      const d = new Date(e.date);
      if (isNaN(d.getTime())) return false;
      return (
        d.getMonth() === selectedMonth.getMonth() &&
        d.getFullYear() === selectedMonth.getFullYear()
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // --- MANEJADORES ---
  const prevMonth = () => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  const nextMonth = () => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));

  async function handleAddEntry() {
    if (!newContent.trim()) return;
    
    // Forzamos mediodía para evitar saltos de fecha por zona horaria
    const entryDate = new Date(`${newDate}T12:00:00`).toISOString();

    await addJournalEntry({
      date: entryDate,
      content: newContent.trim(),
      mood: newMood,
      tags: newTags,
      image_url: newImageUrl,
    });
    resetForm();
  }

  function resetForm() {
    setNewContent("");
    setNewMood("good");
    setNewDate(new Date().toISOString().split("T")[0]);
    setNewTags([]);
    setTagInput("");
    setNewImageUrl(undefined);
    setShowNewEntry(false);
    setEditingEntry(null);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function formatEntryDate(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Fecha inválida";
    return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-serif italic tracking-tight text-foreground">mi diario</h1>
          <p className="text-sm text-muted-foreground mt-1">tu espacio para reflexionar y recordar</p>
        </div>
        <Button onClick={() => setShowNewEntry(true)} size="sm" className="gap-1.5 rounded-full shadow-sm hover:shadow-md">
          <Plus className="h-4 w-4" /> <span>nueva entrada</span>
        </Button>
      </div>

      {/* Navegador de Meses */}
      <div className="flex items-center gap-3 bg-muted/30 w-fit px-3 py-1.5 rounded-full border border-border/40">
        <button onClick={prevMonth} className="p-1 rounded-full hover:bg-background transition-colors"><ChevronLeft className="h-4 w-4" /></button>
        <div className="flex items-center gap-2 px-2">
          <CalendarDays className="h-4 w-4 text-primary/60" strokeWidth={1.5} />
          <span className="text-sm font-medium capitalize italic">{monthStr}</span>
        </div>
        <button onClick={nextMonth} className="p-1 rounded-full hover:bg-background transition-colors"><ChevronRight className="h-4 w-4" /></button>
      </div>

      {/* Lista de Entradas */}
      <div className="flex flex-col gap-4">
        {filteredEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/10 rounded-3xl border border-dashed">
            <Sparkles className="h-8 w-8 text-primary/20 mb-3" />
            <p className="text-sm font-medium text-foreground">sin entradas este mes</p>
          </div>
        )}

        {filteredEntries.map((entry) => {
          const moodConf = moodConfig[entry.mood];
          const MoodIcon = moodConf.icon;

          return (
            <article key={entry.id} className="group flex flex-col rounded-2xl border bg-card/50 p-5 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", moodConf.bg)}>
                  <MoodIcon className={cn("h-5 w-5", moodConf.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold capitalize">{formatEntryDate(entry.date)}</p>
                  <p className={cn("text-xs italic opacity-80", moodConf.color)}>me sentí {moodConf.label}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingEntry(entry.id)} className="p-2 hover:bg-muted rounded-full transition-colors"><Plus className="h-3.5 w-3.5 rotate-45" /></button>
                  <button onClick={() => deleteJournalEntry(entry.id)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              {entry.image_url && (
                <div className="rounded-xl overflow-hidden mb-4 shadow-sm">
                  <img src={entry.image_url} alt="" className="w-full h-56 object-cover" />
                </div>
              )}

              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{entry.content}</p>
              
              {entry.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] rounded-full bg-primary/5 text-primary border-none">#{tag}</Badge>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Dialog Nueva Entrada */}
      <Dialog open={showNewEntry} onOpenChange={setShowNewEntry}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader><DialogTitle className="font-serif italic text-2xl">¿cómo va tu día?</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-6 pt-4">
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-fit bg-muted/40 border-0 rounded-xl px-4 py-2 text-sm focus:ring-0" />
            
            <div className="flex gap-2">
              {Object.entries(moodConfig).map(([key, conf]) => (
                <button key={key} onClick={() => setNewMood(key as any)} className={cn("flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all", newMood === key ? `${conf.bg} border-primary/20 shadow-sm` : "bg-muted/20 border-transparent opacity-60")}>
                  <conf.icon className={cn("h-5 w-5", conf.color)} />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">{conf.label}</span>
                </button>
              ))}
            </div>

            <Textarea placeholder="Escribe aquí tus pensamientos..." value={newContent} onChange={(e) => setNewContent(e.target.value)} className="min-h-[200px] border-0 bg-muted/40 rounded-2xl p-6 focus-visible:ring-0" />

            <div className="flex items-center justify-between border-t pt-4">
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="rounded-full"><ImageIcon className="h-5 w-5" /></Button>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <Button onClick={handleAddEntry} disabled={!newContent.trim()} className="rounded-full px-8 shadow-lg">guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Edición */}
      {editingEntry && (
        <EditEntryDialog entry={journal.find(e => e.id === editingEntry)!} onClose={() => setEditingEntry(null)} />
      )}
    </div>
  );
}

function EditEntryDialog({ entry, onClose }: { entry: JournalEntry; onClose: () => void }) {
  const [content, setContent] = useState(entry.content);
  const [mood, setMood] = useState(entry.mood);

  const save = async () => {
    await updateJournalEntry(entry.id, { content, mood });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && save()}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-8 border-none shadow-2xl">
        <DialogHeader><DialogTitle className="font-serif italic text-2xl">editar pensamiento</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-6 pt-4">
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[300px] border-0 bg-muted/40 rounded-2xl p-6 focus-visible:ring-0" />
            <Button onClick={save} className="rounded-full py-6 text-base font-bold shadow-lg">Listo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}