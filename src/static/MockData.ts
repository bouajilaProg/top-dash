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
  },
  {
    id: "cms",
    name: "CMS",
    icon: { type: "icon", name: "FileText" },
    url: "https://cms.bouajila.top",
    position: 1,
  },
  {
    id: "cms-portfolio",
    name: "CMS Portfolio",
    icon: { type: "icon", name: "Layers" },
    url: "https://cms.portfolio.bouajila.top",
    position: 2,
  },
  {
    id: "auto-resume",
    name: "Auto Resume",
    icon: { type: "icon", name: "CircleUser" },
    url: "https://auto-resume.bouajila.com",
    position: 3,
  },
  {
    id: "dashboard",
    name: "Dashboard",
    icon: { type: "icon", name: "LayoutDashboard" },
    url: "https://bouajila.top",
    position: 4,
  },
  {
    id: "admin",
    name: "Admin",
    icon: { type: "icon", name: "Shield" },
    url: "https://dokploy.bouajila.top",
    position: 5,
  },
  {
    id: "uptime",
    name: "Uptime",
    icon: { type: "icon", name: "Activity" },
    url: "https://uptime.bouajila.top",
    position: 6,
  },
  {
    id: "storage",
    name: "Storage",
    icon: { type: "icon", name: "HardDrive" },
    url: "https://cms.storage.bouajila.top",
    position: 7,
  },
];
