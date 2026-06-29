"use client";

import React, { useMemo } from "react";
import Nav from "./components/Nav";
import AppItem from "./components/AppItem";
import { mockApps, type App } from "@/static/MockData";
import { useMediaQuery } from "@/hooks/media-query";

const MOBILE_COLS = 4;
const DESKTOP_COLS = 8;
const GRID_MIN_ROWS = 8;
const GRID_DESKTOP_MIN_ROWS = 4;

interface AppGridProps {
  apps: App[];
  cols: number;
  minRows: number;
  className: string;
}

function AppGrid({ apps, cols, minRows, className }: AppGridProps) {
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
        <div key={i} className="flex h-full w-full items-center justify-center">
          {app ? (
            <AppItem app={app} />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      );
    }
    return list;
  }, [apps, cols, minRows]);

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

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-neutral">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-100/30 to-base-300/10" />
      <Nav />
      <main className="flex flex-1 flex-col gap-6 overflow-hidden p-6 md:px-16 lg:px-24">
        <div className="flex flex-1 flex-col overflow-hidden px-2">
          {isDesktop ? (
            <AppGrid
              apps={mockApps}
              cols={DESKTOP_COLS}
              minRows={GRID_DESKTOP_MIN_ROWS}
              className="mx-auto grid w-full max-w-6xl content-center gap-4 md:gap-x-8 md:gap-y-6 lg:gap-x-12 lg:gap-y-8"
            />
          ) : (
            <AppGrid
              apps={mockApps}
              cols={MOBILE_COLS}
              minRows={GRID_MIN_ROWS}
              className="mx-auto grid w-full max-w-md content-center gap-2"
            />
          )}
        </div>
      </main>
    </div>
  );
}