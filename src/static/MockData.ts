export type AppIcon =
  | { type: "image"; url: string }
  | { type: "icon"; name: string }
  | { type: "favicon"; url: string };

export interface App {
  id: string;
  name: string;
  icon: AppIcon;
  url: string;
  position: number;
  bgColor?: string;
}

export const domainApps: App[] = [
  {
    id: "portfolio",
    name: "Portfolio",
    icon: { type: "icon", name: "Briefcase" },
    url: "https://bouajila.com",
    position: 0,
    bgColor: "#0ea5e9",
  },
  {
    id: "cms",
    name: "CMS",
    icon: { type: "icon", name: "FileText" },
    url: "https://cms.bouajila.top",
    position: 1,
    bgColor: "#8b5cf6",
  },
  {
    id: "cms-portfolio",
    name: "CMS Portfolio",
    icon: { type: "icon", name: "Layers" },
    url: "https://cms.portfolio.bouajila.top",
    position: 2,
    bgColor: "#ec4899",
  },
  {
    id: "auto-resume",
    name: "Auto Resume",
    icon: { type: "icon", name: "CircleUser" },
    url: "https://auto-resume.bouajila.com",
    position: 3,
    bgColor: "#f59e0b",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    icon: { type: "icon", name: "LayoutDashboard" },
    url: "https://bouajila.top",
    position: 4,
    bgColor: "#10b981",
  },
  {
    id: "admin",
    name: "Admin",
    icon: { type: "icon", name: "Shield" },
    url: "https://dokploy.bouajila.top",
    position: 5,
    bgColor: "#ef4444",
  },
  {
    id: "uptime",
    name: "Uptime",
    icon: { type: "icon", name: "Activity" },
    url: "https://uptime.bouajila.top",
    position: 6,
    bgColor: "#6366f1",
  },
  {
    id: "storage",
    name: "Storage",
    icon: { type: "icon", name: "HardDrive" },
    url: "https://cms.storage.bouajila.top",
    position: 7,
    bgColor: "#14b8a6",
  },
];
