"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Circle,
  Clock,
  CheckCircle2,
  Flag,
  Sparkles,
  X,
  BookOpen,
  Beaker,
  Calculator,
  Palette,
  Globe,
  Music,
  Pencil,
  FolderOpen,
  GripVertical,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  addTask,
  updateTask,
  deleteTask,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/store";

// --- CONFIGURACIONES Y CONSTANTES ---
const subjectIcons: Record<string, React.ElementType> = {
  calculator: Calculator, flask: Beaker, book: BookOpen, palette: Palette,
  globe: Globe, music: Music, pencil: Pencil, folder: FolderOpen,
};

const subjectDots: Record<string, string> = {
  rose: "bg-[hsl(340,50%,65%)]", lavender: "bg-[hsl(270,40%,65%)]",
  mint: "bg-[hsl(165,40%,50%)]", peach: "bg-[hsl(22,60%,65%)]",
  sky: "bg-[hsl(200,50%,55%)]", cream: "bg-[hsl(40,40%,60%)]",
};

const statusConfig: Record<TaskStatus, { label: string; icon: React.ElementType; color: string }> = {
  todo: { label: "pendiente", icon: Circle, color: "text-muted-foreground" },
  "in-progress": { label: "haciendolo", icon: Clock, color: "text-orange-400" },
  done: { label: "listas", icon: CheckCircle2, color: "text-emerald-500" },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: "baja", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  medium: { label: "media", color: "text-orange-600", bgColor: "bg-orange-50" },
  high: { label: "alta", color: "text-destructive", bgColor: "bg-destructive/10" },
};

export function TasksView() {
  const { tasks, subjects } = useStore();
  const columns: TaskStatus[] = ["todo", "in-progress", "done"];

  // --- ESTADOS ---
  const [showNewTask, setShowNewTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  
  // Form states (compartidos para simplicidad o separados)
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);

  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterSubject, setFilterSubject] = useState<string | "all">("all");

  // --- LÓGICA DE ARRASTRE ---
  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    updateTask(draggableId, { status: destination.droppableId as TaskStatus });
  };

  // --- ACCIONES ---
  const resetForm = () => {
    setTitle(""); setDesc(""); setPriority("medium"); setStatus("todo");
    setTags([]); setTagInput(""); setSubjectId(undefined);
    setShowNewTask(false); setEditingTask(null);
  };

  const handleOpenEdit = (task: any) => {
    setEditingTask(task.id);
    setTitle(task.title);
    setDesc(task.description || "");
    setPriority(task.priority);
    setStatus(task.status);
    setTags(task.tags || []);
    setSubjectId(task.subject_id);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const data = { title, description: desc, status, priority, tags, subject_id: subjectId };
    
    if (editingTask) {
      updateTask(editingTask, data);
    } else {
      addTask(data);
    }
    resetForm();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif italic tracking-tight">mis tareas</h1>
          <p className="text-sm text-muted-foreground mt-1">organiza tu flujo de trabajo arrastrando las tareas</p>
        </div>
        <Button onClick={() => setShowNewTask(true)} size="sm" className="rounded-full gap-2 px-4 shadow-sm transition-all hover:shadow-md">
          <Plus className="h-4 w-4" /> nueva
        </Button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
          {columns.map((colId) => {
            const config = statusConfig[colId];
            const colTasks = tasks.filter(t => t.status === colId);

            return (
              <div key={colId} className="flex flex-col bg-muted/30 rounded-3xl border border-border/50">
                <div className="flex items-center gap-2 px-5 py-4">
                  <config.icon className={cn("h-4 w-4", config.color)} />
                  <span className="text-sm font-semibold">{config.label}</span>
                  <Badge variant="secondary" className="ml-auto rounded-full px-2 py-0 text-[10px] bg-white/50">{colTasks.length}</Badge>
                </div>

                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex-1 p-3 flex flex-col gap-3 transition-colors duration-200 min-h-[150px]",
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      )}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleOpenEdit(task)}
                              className={cn(
                                "bg-card border border-border/60 p-4 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing transition-all hover:border-primary/20",
                                snapshot.isDragging ? "shadow-xl ring-1 ring-primary/10 rotate-1 scale-[1.02]" : ""
                              )}
                            >
                              <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                  <p className={cn("text-sm font-medium leading-tight", task.status === 'done' && "line-through text-muted-foreground")}>{task.title}</p>
                                  <GripVertical className="h-4 w-4 text-muted-foreground/20 shrink-0 ml-2" />
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5">
                                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter", priorityConfig[task.priority].bgColor, priorityConfig[task.priority].color)}>
                                    {priorityConfig[task.priority].label}
                                  </span>
                                  {task.subject_id && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/5 text-primary uppercase border border-primary/10">
                                      {subjects.find(s => s.id === task.subject_id)?.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Common Dialog para Nueva y Edición */}
      <Dialog open={showNewTask || !!editingTask} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-2xl">{editingTask ? "editar tarea" : "nueva tarea"}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-6 pt-4">
            <Input 
              placeholder="¿Qué tienes que hacer?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="text-lg border-0 bg-muted/40 focus-visible:ring-0 rounded-2xl p-6"
            />
            
            <Textarea 
              placeholder="Añade una descripción..." 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              className="resize-none border-0 bg-muted/40 focus-visible:ring-0 rounded-2xl p-6 min-h-[100px]"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground ml-1">prioridad</label>
                <div className="flex gap-1 bg-muted/40 p-1 rounded-xl">
                  {(["low", "medium", "high"] as TaskPriority[]).map(p => (
                    <button key={p} onClick={() => setPriority(p)} className={cn("flex-1 text-[10px] py-2 rounded-lg transition-all", priority === p ? "bg-white shadow-sm font-bold" : "text-muted-foreground")}>{priorityConfig[p].label}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground ml-1">Estado</label>
                <div className="flex gap-1 bg-muted/40 p-1 rounded-xl">
                  {columns.map(s => (
                    <button key={s} onClick={() => setStatus(s)} className={cn("flex-1 text-[10px] py-2 rounded-lg transition-all", status === s ? "bg-white shadow-sm font-bold" : "text-muted-foreground")}>{statusConfig[s].label.split(' ')[0]}</button>
                  ))}
                </div>
              </div>
            </div>

            {editingTask && (
              <Button variant="ghost" onClick={() => { deleteTask(editingTask); resetForm(); }} className="text-destructive hover:bg-destructive/5 hover:text-destructive self-start h-8 px-2 text-xs">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> eliminar tarea
              </Button>
            )}

            <Button onClick={handleSave} className="rounded-full py-7 text-base font-bold shadow-lg bg-primary hover:scale-[1.02] transition-transform">
              {editingTask ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}