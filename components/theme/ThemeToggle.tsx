"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const subscribeTheme = (callback: () => void) => {
  if (typeof window === "undefined" || typeof MutationObserver === "undefined") {
    return () => {};
  }
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "data-theme") {
        callback();
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true });
  return () => observer.disconnect();
};

const getThemeSnapshot = (): "dark" | "light" => {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
};

const getServerSnapshot = (): "dark" | "light" => "dark";

export function ThemeToggle() {
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);

  const isLight = theme === "light";
  const label = isLight ? "Alternar para tema escuro" : "Alternar para tema claro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="p-2 rounded-full border border-linha bg-superficie/60 text-texto hover:text-destaque hover:border-destaque transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destaque cursor-pointer"
    >
      {isLight ? (
        <Moon className="w-4 h-4 text-destaque" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4 text-destaque" aria-hidden="true" />
      )}
    </button>
  );
}
