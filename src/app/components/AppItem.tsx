"use client";

import { useCallback, useRef, useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { icons, LucideProps, Pencil, Trash2 } from "lucide-react";
import type { App } from "@/static/MockData";
import { deleteApp } from "../actions";
import AppContextMenu, { type MenuPosition } from "./AppContextMenu";

const FallbackIcon = (props: LucideProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

function AppIconView({ icon }: { icon: App["icon"] }) {
  const iconClasses = "h-7 w-7 md:h-10 md:w-10 lg:h-12 lg:w-12";
  if (icon.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon.url}
        alt=""
        className={`${iconClasses} object-contain`}
        draggable={false}
      />
    );
  }
  if (icon.type === "icon") {
    const LucideIcon = (icons as Record<string, (props: LucideProps) => React.ReactElement>)[icon.name] ?? FallbackIcon;
    return <LucideIcon className={iconClasses} strokeWidth={1.5} />;
  }
  return <FallbackIcon className={iconClasses} />;
}

interface AppItemProps {
  app: App;
  onDeleted: () => void;
  onEdited: () => void;
}

const LONG_PRESS_MS = 450;

export default function AppItem({ app, onDeleted, onEdited }: AppItemProps) {
  const [menu, setMenu] = useState<MenuPosition | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleClick = useCallback(() => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    window.open(app.url, "_blank", "noopener,noreferrer");
  }, [app.url]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const t = e.touches[0];
    touchStartPos.current = { x: t.clientX, y: t.clientY };
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      const start = touchStartPos.current;
      if (start) {
        longPressTriggered.current = true;
        setMenu({ x: start.x, y: start.y });
        if (navigator.vibrate) navigator.vibrate(15);
      }
    }, LONG_PRESS_MS);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const start = touchStartPos.current;
    if (start && Math.abs(t.clientX - start.x) > 10 && Math.abs(t.clientY - start.y) > 10) {
      cancelLongPress();
    }
  }, [cancelLongPress]);

  const handleTouchEnd = useCallback(() => {
    cancelLongPress();
  }, [cancelLongPress]);

  const handleEdit = useCallback(() => {
    NiceModal.show("edit-app-modal", { app, onEdited });
  }, [app, onEdited]);

  const handleDelete = useCallback(async () => {
    const formData = new FormData();
    formData.append("id", app.id);
    const result = await deleteApp(formData);
    if (result.success) onDeleted();
  }, [app.id, onDeleted]);

  return (
    <>
      <div
        className="group relative flex select-none flex-col items-center justify-start gap-2 md:gap-2.5"
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={cancelLongPress}
      >
        <button
          type="button"
          onClick={handleClick}
          className="flex flex-col items-center justify-start gap-2 md:gap-2.5 focus-visible:outline-none"
        >
          <div
            className="flex h-14 w-14 md:h-20 md:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary"
            style={{ backgroundColor: app.bgColor || undefined }}
            data-bg={app.bgColor ? "custom" : "default"}
          >
            <AppIconView icon={app.icon} />
          </div>
          <span className="w-16 md:w-[5.5rem] lg:w-[7rem] text-center text-[9px] md:text-[11px] lg:text-sm font-medium leading-tight text-base-content/80 line-clamp-2">
            {app.name}
          </span>
        </button>
      </div>
      {menu && (
        <AppContextMenu
          position={menu}
          items={[
            { label: "Edit", icon: Pencil, onSelect: handleEdit },
            { label: "Delete", icon: Trash2, onSelect: handleDelete, danger: true },
          ]}
          onClose={() => setMenu(null)}
        />
      )}
    </>
  );
}
