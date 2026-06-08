"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  deleteSession,
  getStoredTableRows,
  isStoredSessionId,
  type SesionTableRow,
} from "@/lib/sessions-storage";
import Link from "next/link";
import { useEffect, useState } from "react";

const DELETE_CONFIRMATION_TEXT = "ELIMINAR";

export default function IntervencionesPage() {
  const [sessions, setSessions] = useState<SesionTableRow[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const canConfirmDelete =
    deleteConfirmText === DELETE_CONFIRMATION_TEXT && !isDeleting;

  function refreshSessions() {
    setSessions(getStoredTableRows());
  }

  useEffect(() => {
    refreshSessions();
  }, []);

  function openDeleteDialog(sessionId: string) {
    setDeleteConfirmText("");
    setPendingDeleteId(sessionId);
  }

  function closeDeleteDialog() {
    if (isDeleting) return;
    setPendingDeleteId(null);
    setDeleteConfirmText("");
  }

  function handleConfirmDelete() {
    if (!pendingDeleteId || !canConfirmDelete) return;

    setIsDeleting(true);
    const deleted = deleteSession(pendingDeleteId);
    setPendingDeleteId(null);
    setDeleteConfirmText("");
    setIsDeleting(false);

    if (deleted) {
      refreshSessions();
      setDeleteMessage(GLOSSARY.intervencion.eliminadaOk);
      window.setTimeout(() => setDeleteMessage(null), 4000);
    }
  }

  return (
    <AppShell activeNav="intervenciones">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {GLOSSARY.intervencion.historial}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {GLOSSARY.intervencion.historialSubtitulo}
            </p>
          </div>
          <Link
            href={ROUTES.intervencionesNueva}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
          >
            <PlusIcon className="h-4 w-4" />
            {GLOSSARY.intervencion.nueva}
          </Link>
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        {deleteMessage && (
          <p
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
            role="status"
          >
            {deleteMessage}
          </p>
        )}

        <section className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Filtros
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <FilterField label="Estudiante">
              <select
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                defaultValue=""
                aria-label="Filtrar por estudiante"
              >
                <option value="">Todos los estudiantes</option>
                <option>Martina Ramírez</option>
                <option>Tomás Villanueva</option>
                <option>Sofía Morales</option>
                <option>Diego López</option>
              </select>
            </FilterField>
            <FilterField label="Espacio">
              <select
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                defaultValue=""
                aria-label="Filtrar por espacio"
              >
                <option value="">Todos los espacios</option>
                <option>Sala Multisensorial</option>
                <option>Espacio de Calma</option>
                <option>Aula</option>
                <option>Patio</option>
                <option>Otro</option>
              </select>
            </FilterField>
            <FilterField label="Fecha">
              <input
                type="date"
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                aria-label="Filtrar por fecha"
              />
            </FilterField>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
          {sessions.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              {GLOSSARY.intervencion.vacioListado}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Fecha
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Estudiante
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Espacio
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Estado Inicial
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Estado Final
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Fortalezas Observadas
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Evidencias
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="transition hover:bg-teal-50/20"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {session.date}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {session.student}
                        </p>
                        <p className="text-xs text-slate-500">{session.course}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {session.space}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <EmotionBadge {...session.initialState} />
                      </td>
                      <td className="px-5 py-4">
                        <EmotionBadge {...session.finalState} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex max-w-[220px] flex-wrap gap-1.5">
                          {session.strengths.map((strength) => (
                            <span
                              key={strength}
                              className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <EvidenceBadge
                            label="PIE"
                            active={session.pie}
                            activeClass="bg-violet-50 text-violet-700 ring-violet-100"
                          />
                          <EvidenceBadge
                            label="Ley TEA"
                            active={session.leyTea}
                            activeClass="bg-teal-50 text-teal-700 ring-teal-100"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {isStoredSessionId(session.id) ? (
                          <button
                            type="button"
                            onClick={() => openDeleteDialog(session.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <span aria-hidden>🗑</span>
                            Eliminar
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            {GLOSSARY.intervencion.contador(sessions.length)}
          </p>
        </section>
      </main>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-session-dialog-title"
          >
            <h2
              id="delete-session-dialog-title"
              className="text-base font-semibold text-slate-900"
            >
              {GLOSSARY.intervencion.eliminar}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {GLOSSARY.intervencion.confirmarEliminar}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {GLOSSARY.intervencion.eliminarAdvertencia}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Esta acción no puede deshacerse.
            </p>
            <label className="mt-5 block">
              <span className="text-xs font-medium text-slate-600">
                Para continuar escribe:
              </span>
              <span className="mt-1 block text-sm font-semibold text-slate-900">
                {DELETE_CONFIRMATION_TEXT}
              </span>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(event) => setDeleteConfirmText(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={!canConfirmDelete}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function EmotionBadge({
  emoji,
  label,
}: {
  emoji: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700">
      <span aria-hidden>{emoji}</span>
      {label}
    </span>
  );
}

function EvidenceBadge({
  label,
  active,
  activeClass,
}: {
  label: string;
  active: boolean;
  activeClass: string;
}) {
  if (!active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50/50 px-2 py-0.5 text-xs font-medium text-slate-400">
        {label}
        <span className="text-slate-300">—</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${activeClass}`}
    >
      {label}
      <span aria-hidden>✓</span>
    </span>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
