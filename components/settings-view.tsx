"use client";

import React from "react";
import { useRef } from "react";
import { ImageIcon, X, Flower2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useStore,
  setUserName,
  setGreeting,
  setCoverImage,
  setThemeColor,
  setBgStyle,
  setSidebarQuote,
  toggleWidget,
  type ThemeColor,
  type BgStyle,
} from "@/lib/store";

const themes: { id: ThemeColor; label: string; color: string; preview: string }[] = [
  { id: "rose", label: "rosa", color: "bg-[hsl(340,45%,65%)]", preview: "border-[hsl(340,45%,65%)]" },
  { id: "lavender", label: "lavanda", color: "bg-[hsl(270,40%,65%)]", preview: "border-[hsl(270,40%,65%)]" },
  { id: "mint", label: "menta", color: "bg-[hsl(165,40%,50%)]", preview: "border-[hsl(165,40%,50%)]" },
  { id: "peach", label: "durazno", color: "bg-[hsl(15,65%,65%)]", preview: "border-[hsl(15,65%,65%)]" },
  { id: "sky", label: "cielo", color: "bg-[hsl(200,55%,55%)]", preview: "border-[hsl(200,55%,55%)]" },
];

const bgStyles: { id: BgStyle; label: string; desc: string; preview: string }[] = [
  { id: "clean", label: "limpio", desc: "fondo solido sin textura", preview: "bg-[hsl(30,30%,97%)]" },
  { id: "dots", label: "puntos", desc: "patron de puntos suaves", preview: "bg-[hsl(40,25%,96%)]" },
  { id: "grid", label: "cuadricula", desc: "lineas tipo notebook", preview: "bg-[hsl(220,15%,96%)]" },
  { id: "warm", label: "calido", desc: "tono beige acogedor", preview: "bg-[hsl(25,35%,95%)]" },
  { id: "cool", label: "fresco", desc: "tono azulado suave", preview: "bg-[hsl(210,20%,96%)]" },
  { id: "blush", label: "rosado", desc: "tono rosa delicado", preview: "bg-[hsl(340,20%,96%)]" },
];

const greetingSuggestions = [
  "hola, bonita",
  "bienvenida de vuelta",
  "un dia mas, un dia mejor",
  "hoy sera un gran dia",
  "tu puedes con todo",
  "brillando como siempre",
  "es hora de crear",
  "respira y empieza",
];

const widgetLabels: Record<string, string> = {
  progress: "barra de progreso",
  tasks: "tareas activas",
  notes: "notas recientes",
  journal: "diario reciente",
  quote: "frase inspiradora",
  calendar: "mini calendario",
};

export function SettingsView() {
  const { userName, greeting, coverImage, themeColor, bgStyle, dashboardWidgets, sidebarQuote } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCoverImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <h1 className="text-2xl font-serif italic tracking-tight text-foreground">personalizar</h1>
        <p className="text-sm text-muted-foreground mt-1">haz que este espacio sea completamente tuyo</p>
      </div>

      {/* Name */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">tu nombre</h2>
          <p className="text-xs text-muted-foreground mt-0.5">asi te saludaremos cada dia</p>
        </div>
        <Input placeholder="escribe tu nombre..." value={userName} onChange={(e) => setUserName(e.target.value)} className="rounded-xl max-w-xs" />
      </section>

      {/* Greeting */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">saludo personalizado</h2>
          <p className="text-xs text-muted-foreground mt-0.5">el mensaje que veras en tu inicio</p>
        </div>
        <Input placeholder="escribe tu saludo..." value={greeting} onChange={(e) => setGreeting(e.target.value)} className="rounded-xl max-w-xs" />
        <div className="flex flex-wrap gap-1.5">
          {greetingSuggestions.map((g) => (
            <button key={g} type="button" onClick={() => setGreeting(g)} className={cn("text-[11px] px-3 py-1.5 rounded-full border transition-all", greeting === g ? "border-primary/50 bg-primary/8 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground")}>
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* Theme Color */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">color del tema</h2>
          <p className="text-xs text-muted-foreground mt-0.5">cambia el color principal de toda la app</p>
        </div>
        <div className="flex gap-3">
          {themes.map((theme) => (
            <button key={theme.id} type="button" onClick={() => setThemeColor(theme.id)} className={cn("flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all", themeColor === theme.id ? `${theme.preview} shadow-sm` : "border-border hover:border-muted-foreground/30")}>
              <div className={cn("h-8 w-8 rounded-full transition-transform", theme.color, themeColor === theme.id && "scale-110")} />
              <span className="text-[10px] text-muted-foreground font-medium">{theme.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Background Style */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">fondo de la app</h2>
          <p className="text-xs text-muted-foreground mt-0.5">cambia el color y textura del fondo en todas las secciones</p>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {bgStyles.map((bg) => (
            <button key={bg.id} type="button" onClick={() => setBgStyle(bg.id)} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all", bgStyle === bg.id ? "border-primary shadow-sm" : "border-border hover:border-muted-foreground/30")}>
              <div className={cn("h-10 w-full rounded-xl border border-border/50 relative overflow-hidden", bg.preview)}>
                {bg.id === "dots" && (
                  <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, hsl(0 0% 60% / 0.3) 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
                )}
                {bg.id === "grid" && (
                  <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(hsl(0 0% 60% / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 60% / 0.15) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
                )}
              </div>
              <span className="text-[10px] text-foreground font-medium">{bg.label}</span>
              <span className="text-[9px] text-muted-foreground leading-tight text-center">{bg.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Cover Image */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">imagen de portada</h2>
          <p className="text-xs text-muted-foreground mt-0.5">sube una foto para personalizar tu inicio</p>
        </div>
        {coverImage ? (
          <div className="relative rounded-2xl overflow-hidden group max-w-sm">
            <img src={coverImage || "/placeholder.svg"} alt="Tu portada" className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium hover:bg-card transition-colors">cambiar</button>
              <button type="button" onClick={() => setCoverImage(null)} className="p-1.5 rounded-full bg-card/90 backdrop-blur-sm text-foreground hover:bg-card transition-colors" aria-label="Remover"><X className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 py-10 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 transition-colors max-w-sm bg-primary/[0.02]">
            <div className="h-10 w-10 rounded-full bg-primary/8 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary/50" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-muted-foreground">click para subir una imagen</span>
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
      </section>

      {/* Dashboard widgets */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">widgets del inicio</h2>
          <p className="text-xs text-muted-foreground mt-0.5">elige que secciones quieres ver en tu pagina principal</p>
        </div>
        <div className="flex flex-col gap-1.5">
          {dashboardWidgets.map((widget) => (
            <button key={widget.id} type="button" onClick={() => toggleWidget(widget.id)} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left", widget.visible ? "border-primary/30 bg-primary/5" : "border-border hover:border-muted-foreground/30")}>
              {widget.visible ? <Eye className="h-4 w-4 text-primary shrink-0" /> : <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />}
              <span className={cn("text-sm", widget.visible ? "text-foreground font-medium" : "text-muted-foreground")}>{widgetLabels[widget.type] || widget.type}</span>
              <span className={cn("ml-auto text-[10px] rounded-full px-2 py-0.5", widget.visible ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>{widget.visible ? "visible" : "oculto"}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Sidebar Quote */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">frase del sidebar</h2>
          <p className="text-xs text-muted-foreground mt-0.5">una frase que te inspire en la barra lateral</p>
        </div>
        <Input placeholder="escribe tu frase..." value={sidebarQuote} onChange={(e) => setSidebarQuote(e.target.value)} className="rounded-xl" />
      </section>

      {/* Preview */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">vista previa</h2>
          <p className="text-xs text-muted-foreground mt-0.5">asi se vera tu saludo</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Flower2 className="h-4 w-4 text-primary/50" strokeWidth={1.5} />
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            {new Date().getHours() < 12 ? "buenos dias" : new Date().getHours() < 19 ? "buenas tardes" : "buenas noches"}{" "}~{" "}
            {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <p className="text-xl font-serif italic text-foreground">
            {greeting}{userName ? `, ${userName}` : ""}
          </p>
        </div>
      </section>
    </div>
  );
}
