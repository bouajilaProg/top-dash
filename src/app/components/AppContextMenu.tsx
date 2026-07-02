"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

export interface MenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuItem {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  danger?: boolean;
}

interface AppContextMenuProps {
  position: MenuPosition;
  items: ContextMenuItem[];
  onClose: () => void;
}

export default function AppContextMenu({ position, items, onClose }: AppContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: position.x, y: position.y });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    let x = position.x;
    let y = position.y;
    if (x + rect.width + margin > window.innerWidth) x = window.innerWidth - rect.width - margin;
    if (y + rect.height + margin > window.innerHeight) y = window.innerHeight - rect.height - margin;
    if (x < margin) x = margin;
    if (y < margin) y = margin;
    setPos({ x, y });
  }, [position.x, position.y]);

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onScroll = () => onClose();

    window.addEventListener("mousedown", onDown);
    window.addEventListener("touchstart", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("touchstart", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-[60] min-w-[11rem] overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 shadow-2xl"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              item.onSelect();
              onClose();
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              item.danger ? "text-red-600 hover:bg-red-50" : "text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}