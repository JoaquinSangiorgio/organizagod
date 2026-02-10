import { 
  Calculator, 
  Beaker, 
  BookOpen, 
  Palette, 
  Globe, 
  Music, 
  Pencil, 
  FolderOpen 
} from "lucide-react";

export const subjectIcons: Record<string, React.ElementType> = {
  calculator: Calculator,
  flask: Beaker,
  book: BookOpen,
  palette: Palette,
  globe: Globe,
  music: Music,
  pencil: Pencil,
  folder: FolderOpen,
};

export const subjectColorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  rose: { bg: "bg-[hsl(340,50%,97%)]", text: "text-[hsl(340,45%,55%)]", border: "border-[hsl(340,40%,90%)]", dot: "bg-[hsl(340,50%,65%)]" },
  lavender: { bg: "bg-[hsl(270,40%,96%)]", text: "text-[hsl(270,40%,55%)]", border: "border-[hsl(270,30%,89%)]", dot: "bg-[hsl(270,40%,65%)]" },
  mint: { bg: "bg-[hsl(165,35%,95%)]", text: "text-[hsl(165,40%,40%)]", border: "border-[hsl(165,30%,87%)]", dot: "bg-[hsl(165,40%,50%)]" },
  peach: { bg: "bg-[hsl(22,60%,96%)]", text: "text-[hsl(22,55%,50%)]", border: "border-[hsl(22,45%,88%)]", dot: "bg-[hsl(22,60%,65%)]" },
  sky: { bg: "bg-[hsl(200,50%,96%)]", text: "text-[hsl(200,50%,45%)]", border: "border-[hsl(200,40%,88%)]", dot: "bg-[hsl(200,50%,55%)]" },
  cream: { bg: "bg-[hsl(40,40%,96%)]", text: "text-[hsl(40,40%,40%)]", border: "border-[hsl(40,30%,88%)]", dot: "bg-[hsl(40,40%,60%)]" },
};

export const noteColorClasses: Record<string, string> = {
  default: "bg-card border-border",
  rose: "bg-[hsl(340,50%,97%)] border-[hsl(340,40%,90%)]",
  lavender: "bg-[hsl(270,40%,96%)] border-[hsl(270,30%,89%)]",
  mint: "bg-[hsl(165,35%,95%)] border-[hsl(165,30%,87%)]",
  peach: "bg-[hsl(22,60%,96%)] border-[hsl(22,45%,88%)]",
  sky: "bg-[hsl(200,50%,96%)] border-[hsl(200,40%,88%)]",
  cream: "bg-[hsl(40,40%,96%)] border-[hsl(40,30%,88%)]",
};

export const noteColors = [
  { id: "default", label: "neutro", dot: "bg-card border-border" },
  { id: "rose", label: "rosa", dot: "bg-[hsl(340,50%,85%)]" },
  { id: "lavender", label: "lavanda", dot: "bg-[hsl(270,40%,82%)]" },
  { id: "mint", label: "menta", dot: "bg-[hsl(165,35%,78%)]" },
  { id: "peach", label: "durazno", dot: "bg-[hsl(22,55%,80%)]" },
  { id: "sky", label: "cielo", dot: "bg-[hsl(200,45%,80%)]" },
  { id: "cream", label: "crema", dot: "bg-[hsl(40,40%,80%)]" },
];