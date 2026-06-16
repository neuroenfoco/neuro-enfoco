"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { formatProfesionalNombreCompleto } from "@/lib/institucional/profesionales-storage";
import { getProfesionalesRepository } from "@/lib/repositories/repository-factory";
import type { Profesional } from "@/lib/repositories/profesionales-repository";
import { useEffect, useId, useState } from "react";

type EliminarProfesionalDialogProps = {
  open: boolean;
  profesional: Profesional;
  onClose: () => void;
  onDeleted: () => void;
};

export function EliminarProfesionalDialog({
  open,
  profesional,
  onClose,
  onDeleted,
}: EliminarProfesionalDialogProps) {
  const copy = GLOSSARY.profesional;
  const titleId = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setIsDeleting(false);
  }, [open, profesional.id]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isDeleting, onClose]);

  if (!open) return null;

  function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);

    const result = getProfesionalesRepository().delete(profesional.id);
    if (!result.ok) {
      setError(result.error);
      setIsDeleting(false);
      return;
    }

    onDeleted();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="text-base font-semibold text-slate-900">
          {copy.eliminarTitulo}
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {formatProfesionalNombreCompleto(profesional)}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {copy.eliminarMensaje}
        </p>

        {error && (
          <p className="mt-3 text-sm text-rose-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copy.eliminarBotonCancelar}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copy.eliminarBotonConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
