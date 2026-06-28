<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# topDash — Dashboard for launching apps

## Stack
- Next.js 16.2.9, React 19, TypeScript
- Tailwind CSS 4 + daisyUI 5 (custom `dark` theme defined inline in globals.css)
- Icons: `lucide-react` (resolved via the `icons` dictionary by PascalCase name)

## Project structure
```
src/
  app/
    components/
      Nav.tsx        — sticky top bar: "topdash" logo left, plus/modify/settings + profile right (stubs)
      AppItem.tsx    — app card: icon + name, click opens url in new tab; "use client"
      Container.tsx  — background grouper with name + colored tint, grid of AppItems (server-safe)
      SearchBar.tsx  — controlled input for filtering apps; "use client"
    layout.tsx       — Geist fonts, daisyUI dark theme (data-theme="dark")
    page.tsx         — stateful client root: search query + filtered containers grid
    globals.css      — @import tailwindcss + @plugin daisyui/theme (custom dark theme)
  static/
    MockData.ts      — AppIcon/App/Container types + mockContainers export
```

## Data model (`src/static/MockData.ts`)
```ts
type AppIcon =
  | { type: "image"; url: string }
  | { type: "icon"; name: string }      // Lucide icon name (PascalCase), e.g. "Github"
  | { type: "favicon"; url: string }    // future — auto-fetch (not implemented)

interface App {
  id: string
  name: string
  icon: AppIcon
  url: string
}

interface Container {
  id: string
  name: string
  color: string   // daisyUI color token: "primary" | "secondary" | "accent" | "info" | ...
  apps: App[]
}
```

## Features (implemented)
- Navbar: "topdash" wordmark, plus/modify/settings stub buttons, profile avatar button
- Search bar: controlled input that filters apps by name/url across all containers; clears button; empty state
- Container cards: colored frosted background (tint via daisyUI color var + color-mix), name header with dot + count, responsive app grid (3→8 cols)
- App cards: Launchpad-style — rounded icon tile, hover lift + scale, name label; click opens url in a new tab (`noopener,noreferrer`)
- Mac Launchpad aesthetic: dark backdrop, glassmorphic containers, rounded-3xl + backdrop-blur

## Dev architecture choices
- **Hooks-first:** `page.tsx` owns `query` state via `useState`; `useMemo` filters containers; `useCallback` memoizes handlers passed to children. `AppItem`, `Nav`, `SearchBar` are `"use client"` and also use `useCallback`/`useId`.
- **State lifted to page root:** search query lives in `page.tsx` so filtering stays centralized; `SearchBar` is a controlled, presentational component.
- **Server/client split:** `Container` and `MockData` are importable server-side (no client-only APIs); only interactive components opt into `"use client"`.
- **No dynamic Tailwind classes:** container colors use inline `style` with daisyUI CSS vars (`var(--color-<token>)`) + `color-mix()` so Tailwind's JIT scanner isn't bypassed by interpolated class names.
- **Icon resolution:** `AppItem` looks up Lucide components from the `icons` dictionary by `icon.name`, falling back to a generic icon when missing.
- **Types over enums:** `AppIcon` is a discriminated union (not TS enums) so data stays plain JSON-serializable for future API/localStorage persistence.
- **daisyUI tokens for theming:** components use semantic classes (`btn btn-ghost`, `input`, `bg-base-200`, `text-base-content/70`) so re-skinning the theme requires only `globals.css` changes.
- **No shadcn:** intentionally removed; daisyUI + Tailwind v4 only. `@/lib/utils` `cn()` helper does not exist — use plain template strings/daisyUI classes.

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — production build (Turbopack)
- `pnpm lint` — eslint
