"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  X, Save, Trash2, Image as ImageIcon,
  List, Heading1, Heading2, Bold, Sparkles, Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateNote, deleteNote, useStore } from "@/lib/store";

export function NoteViewIndividual({ noteId, onBack }: { noteId: string; onBack: () => void }) {
  const { notes, subjects } = useStore();
  const note = notes.find((n) => n.id === noteId);
  const subject = subjects.find(s => s.id === note?.subject_id);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: { 
          class: "rounded-3xl shadow-2xl my-12 border-4 border-white max-w-full h-auto" 
        },
      }),
      Placeholder.configure({ placeholder: "Escribe algo épico..." }),
    ],
    content: note?.content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-indigo max-w-none focus:outline-none text-slate-700 leading-relaxed text-xl min-h-[70vh]",
      },
    },
  });

  if (!note) return null;

  const handleSave = () => {
    if (editor) updateNote(note.id, { content: editor.getHTML() });
  };

  return (
    // FIX: "h-screen overflow-y-auto" fuerza a que este componente maneje su propio scroll
    <div className="fixed inset-0 z-[100] h-screen overflow-y-auto bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
      
      {/* NAVEGACIÓN - Ahora "sticky" para que te siga pero no tape */}
      <nav className="sticky top-0 z-50 flex justify-between items-center p-6 pointer-events-none">
        <Button 
          variant="secondary" 
          onClick={onBack} 
          className="rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl pointer-events-auto hover:scale-105 transition-all"
        >
          <X className="h-5 w-5 mr-2" /> <span className="text-xs font-bold uppercase tracking-tighter">Cerrar</span>
        </Button>

        <div className="flex gap-2 pointer-events-auto">
          <Button 
            variant="ghost" 
            onClick={() => { if(confirm('¿Borrar nota?')) { deleteNote(note.id); onBack(); } }}
            className="rounded-2xl bg-white/50 backdrop-blur-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSave}
            className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 px-6 transition-all active:scale-95 border border-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" /> <span className="font-bold">Guardar</span>
          </Button>
        </div>
      </nav>

      {/* CUERPO DEL DOCUMENTO */}
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 p-6 lg:p-20 pt-10">
        
        {/* ASIDE - TÍTULO */}
        <aside className="lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-6">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 justify-start">
              <div className="h-1 w-8 bg-indigo-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                {subject?.name || "General"}
              </span>
            </div>
            <textarea
              defaultValue={note.title}
              onChange={(e) => updateNote(note.id, { title: e.target.value })}
              placeholder="Título..."
              className="w-full text-5xl lg:text-7xl font-bold tracking-tighter bg-transparent border-none outline-none resize-none leading-[1.1] text-slate-900 placeholder:text-slate-200 text-left"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>
        </aside>

        {/* EDITOR - LA HOJA */}
        <section className="flex-1 relative text-left">
          {/* TOOLBAR STICKY */}
          <div className="sticky top-6 z-40 flex items-center gap-1 p-2 mb-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 w-fit mx-auto lg:ml-0">
            <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={cn("rounded-xl", editor?.isActive('heading', { level: 1 }) && 'bg-indigo-50 text-indigo-600')}>
              <Heading1 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().toggleBold().run()} className={cn("rounded-xl", editor?.isActive('bold') && 'bg-indigo-50 text-indigo-600')}>
              <Bold className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={cn("rounded-xl", editor?.isActive('bulletList') && 'bg-indigo-50 text-indigo-600')}>
              <List className="h-5 w-5" />
            </Button>
          </div>

          {/* LA HOJA BLANCA */}
          <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 lg:p-16 min-h-[1000px]">
            <EditorContent editor={editor} className="tiptap-editor text-left" />
          </div>
        </section>
      </main>

      <footer className="p-12 text-center text-[10px] text-slate-300 uppercase tracking-widest font-bold">
        <span>Mendoza, Argentina — {new Date().getFullYear()}</span>
      </footer>

      <style jsx global>{`
        /* Ocultar scrollbar pero mantener funcionalidad (opcional) */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .ProseMirror { 
          outline: none !important; 
          text-align: left !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #cbd5e1;
          pointer-events: none;
          height: 0;
          float: left;
        }
        .ProseMirror h1 { font-size: 3rem; font-weight: 800; color: #1e293b; margin-bottom: 2rem; text-align: left; }
        .ProseMirror p { font-size: 1.25rem; line-height: 1.8; color: #475569; text-align: left; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}