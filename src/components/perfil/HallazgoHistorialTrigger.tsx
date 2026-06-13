"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { useState } from "react";
import { HallazgoHistorialModal } from "./HallazgoHistorialModal";

type HallazgoHistorialTriggerProps = {
  hallazgoId: string;
  className?: string;
};

export function HallazgoHistorialTrigger({
  hallazgoId,
  className = "text-xs font-semibold text-indigo-700 transition hover:text-indigo-800",
}: HallazgoHistorialTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {GLOSSARY.perfilBase.verHistorial}
      </button>
      {isOpen && (
        <HallazgoHistorialModal
          hallazgoId={hallazgoId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
