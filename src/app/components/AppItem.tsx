"use client";

import { useCallback } from "react";
import { icons, LucideProps } from "lucide-react";
import type { App } from "@/static/MockData";

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
  const iconClasses = "h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12";
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
  // favicon — future
  return <FallbackIcon className={iconClasses} />;
}

export default function AppItem({ app }: { app: App }) {
  const handleClick = useCallback(() => {
    window.open(app.url, "_blank", "noopener,noreferrer");
  }, [app.url]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex flex-col items-center justify-start gap-2 md:gap-2.5 focus-visible:outline-none"
    >
      <div className="flex h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-[1.25rem] md:rounded-2xl lg:rounded-3xl bg-base-200 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:bg-base-300 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-primary">
        <AppIconView icon={app.icon} />
      </div>
      <span className="w-[4.5rem] md:w-[5.5rem] lg:w-[7rem] text-center text-[10px] md:text-[11px] lg:text-sm font-medium leading-tight text-base-content/80 line-clamp-2">
        {app.name}
      </span>
    </button>
  );
}
