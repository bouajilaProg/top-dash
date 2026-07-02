"use client";

import { useState, useCallback } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { icons, X } from "lucide-react";
import { addApp } from "../actions";

const PRESELECTED_ICONS = [
  "Briefcase", "FileText", "Layers", "CircleUser", "LayoutDashboard",
  "Shield", "Activity", "HardDrive", "Globe", "Github",
  "Mail", "Calendar", "BookOpen", "Code", "Terminal",
  "Database", "Cloud", "Wifi", "ShoppingCart", "PenTool",
];

const PRESET_COLORS = [
  "#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#ef4444", "#6366f1", "#14b8a6",
];

type Protocol = "https://" | "http://" | "";

const iconClasses = "h-5 w-5";

function IconPreview({ name }: { name: string }) {
  const Icon = (icons as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <div className={iconClasses} />;
  return <Icon className={iconClasses} />;
}

export default NiceModal.create(({ onAdded }: { onAdded: () => void }) => {
  const modal = useModal();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [protocol, setProtocol] = useState<Protocol>("https://");
  const [selectedIcon, setSelectedIcon] = useState("Globe");
  const [selectedColor, setSelectedColor] = useState("#0ea5e9");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fullUrl = protocol + domain;

  const handleClose = useCallback(() => {
    modal.remove();
  }, [modal]);

  const handleSubmit = useCallback(async () => {
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("url", fullUrl);
    formData.append("iconName", selectedIcon);
    formData.append("bgColor", selectedColor);

    try {
      const result = await addApp(formData);
      if (result.success) {
        onAdded();
        handleClose();
      } else {
        setError(result.error || "Failed to add app");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }, [name, fullUrl, selectedIcon, selectedColor, onAdded, handleClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-black/10 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Add App</h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My App"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary"
              />
            </div>

            {/* URL with protocol selector */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                URL
              </label>
              <div className="flex gap-2">
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value as Protocol)}
                  className="shrink-0 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none transition-colors focus:border-primary"
                >
                  <option value="https://">https://</option>
                  <option value="http://">http://</option>
                  <option value="">none</option>
                </select>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary"
                />
              </div>
            </div>

            {/* Icon picker — vertical scroll area */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Icon
              </label>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                {PRESELECTED_ICONS.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`flex h-10 items-center justify-center rounded-xl transition-all ${
                      selectedIcon === iconName
                        ? "bg-primary text-white ring-2 ring-primary"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                    title={iconName}
                  >
                    <IconPreview name={iconName} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Background Color
              </label>
              <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-9 w-9 rounded-full transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-neutral-900 scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-black/5 px-6 py-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !name.trim() || !domain.trim()}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add App"}
          </button>
        </div>
      </div>
    </div>
  );
});
