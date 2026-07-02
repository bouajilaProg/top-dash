"use server";

import { promises as fs } from "fs";
import { join } from "path";
import type { App } from "@/static/MockData";

const DATA_PATH = join(process.cwd(), "src", "app", "data", "apps.json");

const PRESELECTED_ICONS = [
  "Briefcase", "FileText", "Layers", "CircleUser", "LayoutDashboard",
  "Shield", "Activity", "HardDrive", "Globe", "Github",
  "Mail", "Calendar", "BookOpen", "Code", "Terminal",
  "Database", "Cloud", "Wifi", "ShoppingCart", "PenTool"
];

const PRESET_COLORS = [
  "#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#ef4444", "#6366f1", "#14b8a6"
];

async function readApps(): Promise<App[]> {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data) as App[];
}

async function writeApps(apps: App[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(apps, null, 2), "utf-8");
}

export async function getApps(): Promise<App[]> {
  return readApps();
}

export async function addApp(formData: FormData): Promise<{ success: boolean; error?: string; app?: App }> {
  const name = formData.get("name")?.toString().trim();
  const url = formData.get("url")?.toString().trim();
  const iconName = formData.get("iconName")?.toString();
  const bgColor = formData.get("bgColor")?.toString();

  if (!name || name.length < 1) {
    return { success: false, error: "Name is required" };
  }

  if (!url || !/^https?:\/\/.+/.test(url)) {
    return { success: false, error: "Valid URL starting with http:// or https:// is required" };
  }

  if (!iconName || !PRESELECTED_ICONS.includes(iconName)) {
    return { success: false, error: "Invalid icon selection" };
  }

  if (!bgColor || !PRESET_COLORS.includes(bgColor)) {
    return { success: false, error: "Invalid color selection" };
  }

  const apps = await readApps();
  const maxPosition = apps.length > 0 ? Math.max(...apps.map(a => a.position)) : -1;
  
  const newApp: App = {
    id: crypto.randomUUID(),
    name,
    icon: { type: "icon", name: iconName },
    url,
    position: maxPosition + 1,
    bgColor,
  };

  apps.push(newApp);
  await writeApps(apps);

  return { success: true, app: newApp };
}

export async function updateApp(formData: FormData): Promise<{ success: boolean; error?: string; app?: App }> {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const url = formData.get("url")?.toString().trim();
  const iconName = formData.get("iconName")?.toString();
  const bgColor = formData.get("bgColor")?.toString();

  if (!id) return { success: false, error: "ID is required" };
  if (!name || name.length < 1) return { success: false, error: "Name is required" };
  if (!url || !/^https?:\/\/.+/.test(url)) {
    return { success: false, error: "Valid URL starting with http:// or https:// is required" };
  }
  if (!iconName || !PRESELECTED_ICONS.includes(iconName)) {
    return { success: false, error: "Invalid icon selection" };
  }
  if (!bgColor || !PRESET_COLORS.includes(bgColor)) {
    return { success: false, error: "Invalid color selection" };
  }

  const apps = await readApps();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) return { success: false, error: "App not found" };

  apps[idx] = { ...apps[idx], name, url, icon: { type: "icon", name: iconName }, bgColor };
  await writeApps(apps);
  return { success: true, app: apps[idx] };
}

export async function compactApps(): Promise<{ success: boolean }> {
  const apps = await readApps();
  apps
    .slice()
    .sort((a, b) => a.position - b.position)
    .forEach((app, i) => {
      app.position = i;
    });
  await writeApps(apps);
  return { success: true };
}

export async function deleteApp(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const id = formData.get("id")?.toString();

  if (!id) {
    return { success: false, error: "ID is required" };
  }

  const apps = await readApps();
  const filtered = apps.filter(a => a.id !== id);

  if (filtered.length === apps.length) {
    return { success: false, error: "App not found" };
  }

  await writeApps(filtered);
  return { success: true };
}
