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
}

export const mockApps: App[] = [
  {
    id: "github",
    name: "GitHub",
    icon: { type: "icon", name: "Github" },
    url: "https://github.com",
    position: 0,
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: { type: "icon", name: "Triangle" },
    url: "https://vercel.com",
    position: 1,
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: { type: "icon", name: "Gitlab" },
    url: "https://gitlab.com",
    position: 2,
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    icon: { type: "icon", name: "MessageSquare" },
    url: "https://stackoverflow.com",
    position: 3,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: { type: "icon", name: "Youtube" },
    url: "https://youtube.com",
    position: 5,
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: { type: "icon", name: "Music" },
    url: "https://open.spotify.com",
    position: 7,
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: { type: "icon", name: "Tv" },
    url: "https://twitch.tv",
    position: 8,
  },
  {
    id: "x",
    name: "X",
    icon: { type: "icon", name: "Twitter" },
    url: "https://x.com",
    position: 9,
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: { type: "icon", name: "Newspaper" },
    url: "https://reddit.com",
    position: 10,
  },
  {
    id: "discord",
    name: "Discord",
    icon: { type: "icon", name: "MessagesSquare" },
    url: "https://discord.com",
    position: 11,
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: { type: "icon", name: "Mail" },
    url: "https://mail.google.com",
    position: 16,
  },
  {
    id: "drive",
    name: "Drive",
    icon: { type: "icon", name: "HardDrive" },
    url: "https://drive.google.com",
    position: 18,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: { type: "icon", name: "Calendar" },
    url: "https://calendar.google.com",
    position: 19,
  },
  {
    id: "maps",
    name: "Maps",
    icon: { type: "icon", name: "Map" },
    url: "https://maps.google.com",
    position: 24,
  },
];