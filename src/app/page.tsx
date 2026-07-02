"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { Plus, Shrink, Settings } from "lucide-react";
import Nav from "./components/Nav";
import AppItem from "./components/AppItem";
import AddAppModal from "./components/AddAppModal";
import EditAppModal from "./components/EditAppModal";
import SettingsModal from "./components/SettingsModal";
import AppContextMenu, { type ContextMenuItem, type MenuPosition } from "./components/AppContextMenu";
import { getApps, compactApps } from "./actions";
import type { App } from "@/static/MockData";
import { useMediaQuery } from "@/hooks/media-query";

const MOBILE_COLS = 4;
const DESKTOP_COLS = 8;
const GRID_MIN_ROWS = 8;
const GRID_DESKTOP_MIN_ROWS = 4;
const GRID_LONG_PRESS_MS = 450;

NiceModal.register("add-app-modal", AddAppModal);
NiceModal.register("edit-app-modal", EditAppModal);
NiceModal.register("settings-modal", SettingsModal);

interface AppGridProps {
  apps: App[];
  cols: number;
  minRows: number;
  className: string;
  onDeleted: () => void;
  onEdited: () => void;
}

function AppGrid({ apps, cols, minRows, className, onDeleted, onEdited }: AppGridProps) {
  const cells = useMemo(() => {
    const byPosition = new Map<number, App>();
    let maxPos = -1;
    for (const app of apps) {
      byPosition.set(app.position, app);
      if (app.position > maxPos) maxPos = app.position;
    }

    const minCells = cols * minRows;
    const totalCells = Math.max(maxPos + 1, minCells);
    const rows = Math.ceil(totalCells / cols);
    const cellCount = rows * cols;

    const list: React.ReactNode[] = [];
    for (let i = 0; i < cellCount; i++) {
      const app = byPosition.get(i);
      list.push(
        <div key={app ? app.id : `empty-${i}`} className="flex h-full w-full items-center justify-center">
          {app ? (
            <AppItem app={app} onDeleted={onDeleted} onEdited={onEdited} />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      );
    }
    return list;
  }, [apps, cols, minRows, onDeleted, onEdited]);

  return (
    <div
      className={`grid h-full ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: "minmax(0, 1fr)",
      }}
    >
      {cells}
    </div>
  );
}

export default function Home() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [gridMenu, setGridMenu] = useState<MenuPosition | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getApps()
      .then((data) => {
        if (!cancelled) setApps(data);
      })
      .catch(() => {
        // Silently fail
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleAdd = useCallback(() => {
    NiceModal.show("add-app-modal", { onAdded: handleRefresh });
  }, [handleRefresh]);

  const handleCompact = useCallback(async () => {
    await compactApps();
    handleRefresh();
  }, [handleRefresh]);

  const handleSettings = useCallback(() => {
    NiceModal.show("settings-modal");
  }, []);

  const gridMenuItems: ContextMenuItem[] = useMemo(
    () => [
      { label: "Add app", icon: Plus, onSelect: handleAdd },
      { label: "Fill voids", icon: Shrink, onSelect: handleCompact },
      { label: "Settings", icon: Settings, onSelect: handleSettings },
    ],
    [handleAdd, handleCompact, handleSettings]
  );

  const handleGridContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setGridMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleGridTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartPos.current = { x: t.clientX, y: t.clientY };
    longPressTimer.current = setTimeout(() => {
      const start = touchStartPos.current;
      if (start) {
        setGridMenu({ x: start.x, y: start.y });
        if (navigator.vibrate) navigator.vibrate(15);
      }
    }, GRID_LONG_PRESS_MS);
  }, []);

  const handleGridTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const start = touchStartPos.current;
    if (start && Math.abs(t.clientX - start.x) > 10 && Math.abs(t.clientY - start.y) > 10) {
      cancelLongPress();
    }
  }, [cancelLongPress]);

  return (
    <NiceModal.Provider>
      <div className="relative flex h-svh flex-col overflow-hidden bg-neutral">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-100/30 to-base-300/10" />
        <Nav />
        <main className="flex flex-1 flex-col gap-6 overflow-hidden p-6 md:px-16 lg:px-24">
          <div
            className="flex flex-1 select-none flex-col overflow-hidden px-2"
            onContextMenu={handleGridContextMenu}
            onTouchStart={handleGridTouchStart}
            onTouchMove={handleGridTouchMove}
            onTouchEnd={cancelLongPress}
            onTouchCancel={cancelLongPress}
          >
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="loading loading-spinner loading-md text-primary" />
              </div>
            ) : isDesktop ? (
              <AppGrid
                apps={apps}
                cols={DESKTOP_COLS}
                minRows={GRID_DESKTOP_MIN_ROWS}
                className="mx-auto grid w-full max-w-6xl content-center gap-4 md:gap-x-8 md:gap-y-6 lg:gap-x-12 lg:gap-y-8"
                onDeleted={handleRefresh}
                onEdited={handleRefresh}
              />
            ) : (
              <AppGrid
                apps={apps}
                cols={MOBILE_COLS}
                minRows={GRID_MIN_ROWS}
                className="mx-auto grid w-full max-w-md content-center gap-2"
                onDeleted={handleRefresh}
                onEdited={handleRefresh}
              />
            )}
          </div>
        </main>
        {gridMenu && (
          <AppContextMenu
            position={gridMenu}
            items={gridMenuItems}
            onClose={() => setGridMenu(null)}
          />
        )}
      </div>
    </NiceModal.Provider>
  );
}