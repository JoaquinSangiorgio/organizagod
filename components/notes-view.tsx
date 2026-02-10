"use client";

import React, { useState, useRef } from "react";
// IMPORTANTE: Asegúrate de que el archivo se llame exactamente así
import { NoteViewIndividual } from "./note-view-individual"; 
import {
  Plus,
  Trash2,
  Pin,
  PinOff,
  Search,
  ImageIcon,
  X,
  StickyNote,
  CheckSquare,
  BookOpen,
  Beaker,
  Calculator,
  Palette,
  Globe,
  Music,
  Pencil,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  addNote,
  updateNote,
  deleteNote,
  addTask,
  addSubject,
  deleteSubject,
  type Note,
  type Subject
} from "@/lib/store";

// --- CONFIGURACIONES ---
const subjectIcons: Record<string, React.ElementType> = {
  calculator: Calculator, flask: Beaker, book: BookOpen, palette: Palette,
  globe: Globe, music: Music, pencil: Pencil, folder: FolderOpen,
};

const subjectColorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  rose: { bg: "bg-[hsl(340,50%,97%)]", text: "text-[hsl(340,45%,55%)]", border: "border-[hsl(340,40%,90%)]", dot: "bg-[hsl(340,50%,65%)]" },
  lavender: { bg: "bg-[hsl(270,40%,96%)]", text: "text-[hsl(270,40%,55%)]", border: "border-[hsl(270,30%,89%)]", dot: "bg-[hsl(270,40%,65%)]" },
  mint: { bg: "bg-[hsl(165,35%,95%)]", text: "text-[hsl(165,40%,40%)]", border: "border-[hsl(165,30%,87%)]", dot: "bg-[hsl(165,40%,50%)]" },
  peach: { bg: "bg-[hsl(22,60%,96%)]", text: "text-[hsl(22,55%,50%)]", border: "border-[hsl(22,45%,88%)]", dot: "bg-[hsl(22,60%,65%)]" },
  sky: { bg: "bg-[hsl(200,50%,96%)]", text: "text-[hsl(200,50%,45%)]", border: "border-[hsl(200,40%,88%)]", dot: "bg-[hsl(200,50%,55%)]" },
  cream: { bg: "bg-[hsl(40,40%,96%)]", text: "text-[hsl(40,40%,40%)]", border: "borderKey(40,30%,88%)]", dot: "bg-[hsl(40,40%,60%)]" },
};

const noteColorClasses: Record<string, string> = {
  default: "bg-card border-border",
  rose: "bg-[hsl(340,50%,97%)] border-[hsl(340,40%,90%)]",
  lavender: "bg-[hsl(270,40%,96%)] border-[hsl(270,30%,89%)]",
  mint: "bg-[hsl(165,35%,95%)] border-[hsl(165,30%,87%)]",
  peach: "bg-[hsl(22,60%,96%)] border-[hsl(22,45%,88%)]",
  sky: "bg-[hsl(200,50%,96%)] border-[hsl(200,40%,88%)]",
  cream: "bg-[hsl(40,40%,96%)] border-[hsl(40,30%,88%)]",
};

const noteColors = [
  { id: "default", label: "neutro", dot: "bg-card border-border" },
  { id: "rose", label: "rosa", dot: "bg-[hsl(340,50%,85%)]" },
  { id: "lavender", label: "lavanda", dot: "bg-[hsl(270,40%,82%)]" },
  { id: "mint", label: "menta", dot: "bg-[hsl(165,35%,78%)]" },
  { id: "peach", label: "durazno", dot: "bg-[hsl(22,55%,80%)]" },
  { id: "sky", label: "cielo", dot: "bg-[hsl(200,45%,80%)]" },
  { id: "cream", label: "crema", dot: "bg-[hsl(40,40%,80%)]" },
];

export function NotesView() {
  const { notes, subjects, tasks } = useStore();
  const [showNewNote, setShowNewNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState<string | "all">("all");
  const [showNewSubject, setShowNewSubject] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newColor, setNewColor] = useState("default");
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined);
  const [newSubjectId, setNewSubjectId] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subjectName, setSubjectName] = useState("");
  const [subjectColor, setSubjectColor] = useState("rose");
  const [subjectIcon, setSubjectIcon] = useState("book");

  // Filtrado
  const filtered = notes.filter((n) => {
    const matchesSearch = !search || 
      n.title.toLowerCase().includes(search.toLowerCase()) || 
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === "all" || n.subject_id === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const pinnedNotes = filtered.filter((n) => n.pinned);
  const unpinnedNotes = filtered.filter((n) => !n.pinned);

  // Acciones
  function handleAddNote() {
    if (!newTitle.trim() && !newContent.trim()) return;
    addNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      color: newColor,
      pinned: false,
      image_url: newImageUrl,
      subject_id: newSubjectId,
    });
    resetForm();
  }

  function resetForm() {
    setNewTitle(""); setNewContent(""); setNewColor("default");
    setNewImageUrl(undefined); setNewSubjectId(undefined);
    setShowNewNote(false); setEditingNote(null);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleAddSubject() {
    if (!subjectName.trim()) return;
    await addSubject({ name: subjectName.trim(), color: subjectColor, icon: subjectIcon });
    setSubjectName(""); setSubjectColor("rose"); setSubjectIcon("book");
    setShowNewSubject(false); 
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* CAPA DE EDICIÓN PRO (Solo aparece si editingNote tiene un ID) */}
      {editingNote && (
        <div className="fixed inset-0 z-[100] bg-background animate-in slide-in-from-bottom duration-500">
          <NoteViewIndividual 
            noteId={editingNote} 
            onBack={() => setEditingNote(null)} 
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-serif italic tracking-tight text-foreground">mis apuntes</h1>
          <p className="text-sm text-muted-foreground mt-1">organiza tus notas por materia</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowNewSubject(true)} size="sm" variant="outline" className="gap-1.5 rounded-full bg-transparent">
            <FolderOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">materia</span>
          </Button>
          <Button onClick={() => setShowNewNote(true)} size="sm" className="gap-1.5 rounded-full">
            <Plus className="h-4 w-4" />
            <span>nueva nota</span>
          </Button>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex flex-col gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Buscar en mis apuntes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/20 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setFilterSubject("all")}
            className={cn(
              "whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-medium transition-all border",
              filterSubject === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"
            )}
          >
            todos
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setFilterSubject(sub.id)}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-medium transition-all border",
                filterSubject === sub.id ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"
              )}
            >
              {sub.name.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Listado de Notas */}
      <div className="space-y-8">
        {pinnedNotes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pinnedNotes.map(note => (
                    <NoteCard key={note.id} note={note} subject={subjects.find(s => s.id === note.subject_id)} onEdit={() => setEditingNote(note.id)} formatDate={formatDate} />
                ))}
            </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unpinnedNotes.map((note) => (
            <NoteCard key={note.id} note={note} subject={subjects.find(s => s.id === note.subject_id)} onEdit={() => setEditingNote(note.id)} formatDate={formatDate} />
          ))}
        </div>
      </div>

      {/* Modales de creación (Materia y Nota) */}
      <Dialog open={showNewNote} onOpenChange={setShowNewNote}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-serif italic text-lg">nueva nota</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {subjects.map(sub => (
                  <button key={sub.id} onClick={() => setNewSubjectId(sub.id)} className={cn("text-[10px] px-3 py-1 rounded-full border transition-all", newSubjectId === sub.id ? "bg-primary text-white" : "text-muted-foreground")}>
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
            <Input placeholder="título..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="text-lg font-medium border-0 px-0 focus-visible:ring-0" />
            <Textarea placeholder="empieza a escribir..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={5} className="resize-none border-0 px-0 focus-visible:ring-0" />
            <Button onClick={handleAddNote} className="rounded-full px-6">guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewSubject} onOpenChange={setShowNewSubject}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader><DialogTitle className="font-serif italic text-lg">nueva materia</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <Input placeholder="nombre..." value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
            <div className="flex gap-2">
              {Object.keys(subjectColorMap).map(c => (
                <button key={c} onClick={() => setSubjectColor(c)} className={cn("h-6 w-6 rounded-full border", subjectColorMap[c].bg, subjectColor === c && "ring-2 ring-primary ring-offset-2")} />
              ))}
            </div>
            <Button onClick={handleAddSubject} className="rounded-full">crear</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Subcomponente de tarjeta
function NoteCard({ note, subject, onEdit, formatDate }: any) {
  const colorClass = noteColorClasses[note.color] || noteColorClasses.default;
  const SubjectIcon = subject ? (subjectIcons[subject.icon] || BookOpen) : null;
  const sc = subject ? (subjectColorMap[subject.color] || subjectColorMap.rose) : null;

  return (
    <div className={cn("group flex flex-col rounded-2xl border p-4 cursor-pointer hover:shadow-md transition-all", colorClass)} onClick={onEdit}>
      {subject && SubjectIcon && sc && (
        <div className={cn("inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full mb-2 border", sc.bg, sc.text, sc.border)}>
          <SubjectIcon className="h-2.5 w-2.5" />{subject.name}
        </div>
      )}
      <h3 className="text-sm font-medium mb-1 line-clamp-1">{note.title || "Sin título"}</h3>
      <div className="text-[12px] text-muted-foreground line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: note.content }} />
      <div className="flex items-center justify-between mt-4 text-[10px] text-muted-foreground italic border-t pt-2">
        {formatDate(note.updated_at)}
        <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="p-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}