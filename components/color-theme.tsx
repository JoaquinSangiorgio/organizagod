"use client";

import React from "react";
import { useEffect } from "react";
import { useStore, type ThemeColor, type BgStyle } from "@/lib/store";

const themeMap: Record<ThemeColor, Record<string, string>> = {
  rose: {
    "--primary": "340 45% 65%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "340 45% 65%",
    "--accent": "22 70% 70%",
    "--accent-foreground": "22 70% 20%",
    "--sidebar-primary": "340 45% 65%",
    "--sidebar-ring": "340 45% 65%",
  },
  lavender: {
    "--primary": "270 40% 65%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "270 40% 65%",
    "--accent": "300 35% 70%",
    "--accent-foreground": "300 35% 20%",
    "--sidebar-primary": "270 40% 65%",
    "--sidebar-ring": "270 40% 65%",
  },
  mint: {
    "--primary": "165 40% 50%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "165 40% 50%",
    "--accent": "140 35% 60%",
    "--accent-foreground": "140 35% 15%",
    "--sidebar-primary": "165 40% 50%",
    "--sidebar-ring": "165 40% 50%",
  },
  peach: {
    "--primary": "15 65% 65%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "15 65% 65%",
    "--accent": "30 60% 68%",
    "--accent-foreground": "30 60% 18%",
    "--sidebar-primary": "15 65% 65%",
    "--sidebar-ring": "15 65% 65%",
  },
  sky: {
    "--primary": "200 55% 55%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "200 55% 55%",
    "--accent": "185 45% 60%",
    "--accent-foreground": "185 45% 15%",
    "--sidebar-primary": "200 55% 55%",
    "--sidebar-ring": "200 55% 55%",
  },
};

const bgMap: Record<BgStyle, Record<string, string>> = {
  clean: {
    "--background": "30 30% 97%",
    "--card": "30 40% 99%",
    "--sidebar-background": "30 40% 99%",
  },
  dots: {
    "--background": "40 25% 96%",
    "--card": "40 30% 99%",
    "--sidebar-background": "40 30% 99%",
  },
  grid: {
    "--background": "220 15% 96%",
    "--card": "220 20% 99%",
    "--sidebar-background": "220 20% 99%",
  },
  warm: {
    "--background": "25 35% 95%",
    "--card": "25 40% 98%",
    "--sidebar-background": "25 40% 98%",
  },
  cool: {
    "--background": "210 20% 96%",
    "--card": "210 25% 99%",
    "--sidebar-background": "210 25% 99%",
  },
  blush: {
    "--background": "340 20% 96%",
    "--card": "340 25% 99%",
    "--sidebar-background": "340 25% 99%",
  },
};

const darkBgMap: Record<BgStyle, Record<string, string>> = {
  clean: {
    "--background": "340 12% 8%",
    "--card": "340 10% 11%",
    "--sidebar-background": "340 12% 9%",
  },
  dots: {
    "--background": "30 10% 7%",
    "--card": "30 8% 10%",
    "--sidebar-background": "30 10% 8%",
  },
  grid: {
    "--background": "220 15% 7%",
    "--card": "220 12% 10%",
    "--sidebar-background": "220 15% 8%",
  },
  warm: {
    "--background": "20 12% 7%",
    "--card": "20 10% 10%",
    "--sidebar-background": "20 12% 8%",
  },
  cool: {
    "--background": "210 15% 7%",
    "--card": "210 12% 10%",
    "--sidebar-background": "210 15% 8%",
  },
  blush: {
    "--background": "340 15% 7%",
    "--card": "340 12% 10%",
    "--sidebar-background": "340 15% 8%",
  },
};

export function ColorTheme({ children }: { children: React.ReactNode }) {
  const { themeColor, bgStyle } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    const vars = themeMap[themeColor] || themeMap.rose;
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
    const isDark = root.classList.contains("dark");
    const bgVars = isDark
      ? (darkBgMap[bgStyle] || darkBgMap.clean)
      : (bgMap[bgStyle] || bgMap.clean);
    for (const [key, value] of Object.entries(bgVars)) {
      root.style.setProperty(key, value);
    }
  }, [themeColor, bgStyle]);

  const patternStyle: React.CSSProperties =
    bgStyle === "dots"
      ? {
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }
      : bgStyle === "grid"
        ? {
            backgroundImage: `linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }
        : {};

  return <div style={patternStyle} className="min-h-screen">{children}</div>;
}
