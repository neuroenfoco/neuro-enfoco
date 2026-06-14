"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { deleteEstudianteCompleto } from "@/lib/delete-estudiante-completo";
import { useEffect, useId, useState } from "react";

const CONFIRMATION_TEXT = GLOSSARY.estudiante.eliminarConfirmacionTexto;

type EliminarEstudianteDialogProps = {
  open: boolean;
  estudianteId: string;
  estudianteNombre?: string;
  onClose: () => void;
  onDeleted: () => void;
};

export function EliminarEstudianteDialog({
  open,
  estudianteId,
  estudianteNombre,
  onClose,
  onDeleted,
}: EliminarEstudianteDialogProps) {
  const titleId = useId();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canConfirm = confirmText === CONFIRMATION_TEXT;

  useEffect(() => {
    if (!open) return;
    setConfirmText("");
    setError(null);
    setIsDeleting(false);
  }, [open, estudianteId]);

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
    if (!canConfirm || isDeleting) return;

    setIsDeleting(true);
    setError(null);

    const result = deleteEstudianteCompleto(estudianteId);
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
          {GLOSSARY.estudiante.eliminarTitulo}
        </h2>

        {estudianteNombre && (
          <p className="mt-1 text-sm font-medium text-slate-700">
            {estudianteNombre}
          </p>
        )}

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {GLOSSARY.estudiante.eliminarMensajeIntro}
        </p>
        <p className="mt-3 text-sm font-medium text-slate-700">
          {GLOSSARY.estudiante.eliminarMensajeListaIntro}
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
          {GLOSSARY.estudiante.eliminarMensajeItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm font-medium text-slate-700">
          {GLOSSARY.estudiante.eliminarMensajeCierre}
        </p>
        <label className="mt-5 block">
          <span className="text-xs font-medium text-slate-600">
            {GLOSSARY.estudiante.eliminarConfirmacionLabel}
          </span>
          <span className="mt-1 block text-sm font-semibold text-slate-900">
            {CONFIRMATION_TEXT}
          </span>
          <input
            type="text"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            autoComplete="off"
            spellCheck={false}
            disabled={isDeleting}
          />
        </label>
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
            {GLOSSARY.estudiante.eliminarBotonCancelar}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!canConfirm || isDeleting}
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {GLOSSARY.estudiante.eliminarBotonConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
