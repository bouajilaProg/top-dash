"use client";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between p-6">
      <div className="text-xl font-bold tracking-tighter text-base-content">
        TopDash
      </div>
      <div className="flex items-center gap-4">
        <div className="avatar placeholder">
          <div className="w-8 rounded-full bg-neutral text-neutral-content">
            <span className="text-xs">TD</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
