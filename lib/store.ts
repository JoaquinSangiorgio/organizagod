"use client";

import { useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

// --- TYPES ---
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  completed_at?: string;
  tags: string[];
  subject_id?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  color: string;
  pinned: boolean;
  image_url?: string;
  subject_id?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: "great" | "good" | "neutral" | "bad" | "terrible";
  tags: string[];
  image_url?: string;
}

export type ThemeColor = "rose" | "lavender" | "mint" | "peach" | "sky";
export type BgStyle = "clean" | "dots" | "grid" | "warm" | "cool" | "blush";

export interface DashboardWidget {
  id: string;
  type: "tasks" | "notes" | "journal" | "progress" | "quote" | "calendar";
  visible: boolean;
}

export interface AppState {
  tasks: Task[];
  notes: Note[];
  journal: JournalEntry[];
  subjects: Subject[];
  activeView: "dashboard" | "tasks" | "notes" | "journal" | "settings";
  coverImage: string | null;
  userName: string;
  greeting: string;
  themeColor: ThemeColor;
  bgStyle: BgStyle;
  dashboardWidgets: DashboardWidget[];
  sidebarQuote: string;
}

// --- DEFAULTS ---
const defaultWidgets: DashboardWidget[] = [
  { id: "progress", type: "progress", visible: true },
  { id: "tasks", type: "tasks", visible: true },
  { id: "notes", type: "notes", visible: true },
  { id: "journal", type: "journal", visible: true },
  { id: "quote", type: "quote", visible: true },
  { id: "calendar", type: "calendar", visible: true },
];

const defaultSubjects: Subject[] = [
  { id: "math", name: "Matemáticas", color: "rose", icon: "calculator" },
  { id: "science", name: "Ciencias", color: "mint", icon: "flask" },
  { id: "lang", name: "Lenguaje", color: "lavender", icon: "book" },
];

// --- STATE MANAGEMENT ---
let state: AppState = {
  tasks: [],
  notes: [],
  journal: [],
  subjects: defaultSubjects,
  activeView: "dashboard",
  coverImage: null,
  userName: "",
  greeting: "hola, bonita",
  themeColor: "rose",
  bgStyle: "clean",
  dashboardWidgets: defaultWidgets,
  sidebarQuote: "Cada día es una página en blanco esperando ser escrita.",
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStore(): AppState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

// --- INITIAL FETCH ---
export async function fetchInitialData() {
  try {
    const [tasksRes, notesRes, subjectsRes, journalRes] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('notes').select('*').order('updated_at', { ascending: false }),
      supabase.from('subjects').select('*'),
      supabase.from('journal').select('*').order('date', { ascending: false })
    ]);

    // Actualizamos el estado con lo que viene de la base de datos
    state = {
      ...state,
      tasks: tasksRes.data || [],
      notes: notesRes.data || [],
      // Si no hay materias en la DB, mantenemos las default
      subjects: subjectsRes.data && subjectsRes.data.length > 0 ? subjectsRes.data : defaultSubjects,
      journal: journalRes.data || [],
    };
    
    emitChange();
  } catch (error) {
    console.error("Error cargando datos iniciales:", error);
  }
}

// --- ACTIONS ---

// View & Personalization
export function setActiveView(view: AppState["activeView"]) { state = { ...state, activeView: view }; emitChange(); }
export function setUserName(name: string) { state = { ...state, userName: name }; emitChange(); }
export function setThemeColor(color: ThemeColor) { state = { ...state, themeColor: color }; emitChange(); }
export function setBgStyle(bg: BgStyle) { state = { ...state, bgStyle: bg }; emitChange(); }

// Subjects
export async function addSubject(subject: Omit<Subject, "id">) {
  // Eliminamos .single() para evitar errores de red y usamos el array retornado
  const { data, error } = await supabase
    .from('subjects')
    .insert([subject])
    .select();

  if (error) {
    console.error("Error en Supabase subjects:", error.message);
    return;
  }

  if (data && data.length > 0) {
    state = { ...state, subjects: [...state.subjects, data[0]] };
    emitChange();
  }
}

export async function deleteSubject(id: string) {
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (!error) {
    state = { ...state, subjects: state.subjects.filter(s => s.id !== id) };
    emitChange();
  }
}

// Tasks
export async function addTask(task: Omit<Task, "id" | "created_at">) {
  const { data, error } = await supabase.from('tasks').insert([task]).select().single();
  if (!error && data) {
    state = { ...state, tasks: [data, ...state.tasks] };
    emitChange();
  }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { error } = await supabase.from('tasks').update(updates).eq('id', id);
  if (!error) {
    state = {
      ...state,
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    };
    emitChange();
  }
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (!error) {
    state = { ...state, tasks: state.tasks.filter(t => t.id !== id) };
    emitChange();
  }
}

// Notes
export async function addNote(note: Omit<Note, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from('notes')
    .insert([note])
    .select();

  if (error) {
    console.error("Error en Supabase notes:", error.message);
    return;
  }

  if (data && data.length > 0) {
    state = { ...state, notes: [data[0], ...state.notes] };
    emitChange();
  }
}

export async function updateNote(id: string, updates: Partial<Note>) {
  const { error } = await supabase.from('notes').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  if (!error) {
    state = {
      ...state,
      notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n)
    };
    emitChange();
  }
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (!error) {
    state = { ...state, notes: state.notes.filter(n => n.id !== id) };
    emitChange();
  }
}

// Journal
export async function addJournalEntry(entry: Omit<JournalEntry, "id">) {
  const { data, error } = await supabase.from('journal').insert([entry]).select().single();
  if (!error && data) {
    state = { ...state, journal: [data, ...state.journal] };
    emitChange();
  }
}

export async function updateJournalEntry(id: string, updates: Partial<JournalEntry>) {
  const { error } = await supabase.from('journal').update(updates).eq('id', id);
  if (!error) {
    state = {
      ...state,
      journal: state.journal.map(e => e.id === id ? { ...e, ...updates } : e)
    };
    emitChange();
  }
}

export async function deleteJournalEntry(id: string) {
  const { error } = await supabase.from('journal').delete().eq('id', id);
  if (!error) {
    state = { ...state, journal: state.journal.filter(e => e.id !== id) };
    emitChange();
  }
}

// --- PERSONALIZATION ACTIONS ---

export function setCoverImage(url: string | null) { 
  state = { ...state, coverImage: url }; 
  emitChange(); 
}

export function setGreeting(greeting: string) { 
  state = { ...state, greeting }; 
  emitChange(); 
}

export function setSidebarQuote(quote: string) { 
  state = { ...state, sidebarQuote: quote }; 
  emitChange(); 
}

export function toggleWidget(widgetId: string) {
  state = {
    ...state,
    dashboardWidgets: state.dashboardWidgets.map(w =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ),
  };
  emitChange();
}