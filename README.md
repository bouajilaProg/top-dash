# topDash

A sleek, macOS Launchpad-inspired personal dashboard for organizing and launching your web apps. Grouped containers, real-time search, and a polished dark UI — all running in a lightweight Docker container.

> ⚠️ **Early Alpha — Heavy Development in Progress**
>
> This project is in its very early stages. Core features are still being built, APIs may change, and things will break. Use at your own curiosity.

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)

## Overview

**topDash** is a self-hosted app launcher designed to replace your browser bookmarks bar. It presents your services in categorized glassmorphic containers with instant search, Lucide icons, and smooth interactions — just like Launchpad, but for your homelab or daily driver apps.

## Current Features

- **🗂️ Smart Containers** — Organize apps into color-coded, frosted-glass groups (e.g., Dev, Media, Monitoring)
- **🔍 Real-Time Search** — Filter apps instantly by name or URL across all containers
- **🎨 Native Aesthetic** — Dark backdrop, backdrop-blur cards, rounded-3xl tiles, Geist typography
- **⚡ Launchpad UX** — Hover lift + scale effects, responsive grid (3→8 columns), clear search button
- **🖼️ Flexible Icons** — Lucide icons, custom image URLs, or favicon auto-fetch support
- **🐳 Dockerized** — Single-command deployment via the included production Dockerfile

## Tech Stack

- **Framework:** Next.js 16.2.9 (App Router, Turbopack)
- **Runtime:** React 19, TypeScript 5
- **Styling:** Tailwind CSS v4 + daisyUI 5 (custom dark theme)
- **Icons:** Lucide React
- **Deploy:** Standalone Next.js output, Docker, Node.js 22 Alpine

## Getting Started

### Development

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Docker (Production)

```bash
docker build -t top-dash .
docker run -p 3000:3000 top-dash
```

The app runs on port `3000` using Next.js standalone mode for a minimal footprint.

## Data Model

Apps are structured in plain JSON (serializable for future persistence):

```ts
type AppIcon =
  | { type: "image"; url: string }
  | { type: "icon"; name: string }   // Lucide PascalCase name
  | { type: "favicon"; url: string }

interface App {
  id: string
  name: string
  icon: AppIcon
  url: string
}

interface Container {
  id: string
  name: string
  color: string   // daisyUI token: primary, secondary, accent, info...
  apps: App[]
}
```

## Roadmap

- [ ] **Health Check** — Live status indicators for each app (ping / HTTP check)
- [ ] **Containers** — Full CRUD for creating, editing, and reordering app groups
- [ ] **Export / Import** — Backup and restore your dashboard layout as JSON

## License

MIT
