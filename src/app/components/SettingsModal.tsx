"use client";

import { useCallback } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { X } from "lucide-react";

export default NiceModal.create(() => {
  const modal = useModal();
  const handleClose = useCallback(() => modal.remove(), [modal]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative flex w-full max-w-md flex-col rounded-2xl border border-black/10 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Settings</h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-8">
          <p className="text-sm text-neutral-600">Nothing to configure yet.</p>
        </div>
      </div>
    </div>
  );
});