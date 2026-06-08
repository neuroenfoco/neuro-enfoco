"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  deleteApoyoImplementado,
  formatApoyoFechaDisplay,
  inputValueToApoyoFecha,
  saveApoyoImplementado,
  type ApoyoImplementado,
} from "@/lib/pie-apoyos-storage";
import {
  formatImpactoPromedio,
  getBarreraDetectadaDisplay,
  getFechaLineaBaseDisplay,
  getLineaBaseDisplay,
  getObjetivoPIEDetalle,
  type ObjetivoPIEDetalle,
} from "@/lib/pie-objectives-storage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ObjetivoPIEDetallePage() {
  const params = useParams<{ id: string }>();
  const objetivoId = params.id;
  const [detalle, setDetalle] = useState<ObjetivoPIEDetalle | null>(() =>
    typeof window === "undefined" ? null : getObjetivoPIEDetalle(objetivoId)
  );
  const [apoyoNombre, setApoyoNombre] = useState("");
  const [apoyoDescripcion, setApoyoDescripcion] = useState("");
  const [apoyoFechaInicio, setApoyoFechaInicio] = useState("");
  const [apoyoFechaTermino, setApoyoFechaTermino] = useState("");
  const [isSavingApoyo, setIsSavingApoyo] = useState(false);
  const [pendingDeleteApoyoId, setPendingDeleteApoyoId] = useState<string | null>(
    null
  );

  function refreshDetalle() {
    setDetalle(getObjetivoPIEDetalle(objetivoId));
  }

  useEffect(() => {
    refreshDetalle();
    window.addEventListener("focus", refreshDetalle);
    window.addEventListener("storage", refreshDetalle);

    return () => {
      window.removeEventListener("focus", refreshDetalle);
      window.removeEventListener("storage", refreshDetalle);
    };
  }, [objetivoId]);

  function handleAddApoyo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      isSavingApoyo ||
      !apoyoNombre.trim() ||
      !apoyoDescripcion.trim() ||
      !apoyoFechaInicio.trim()
    ) {
      return;
    }

    setIsSavingApoyo(true);
    saveApoyoImplementado({
      objetivoId,
      nombre: apoyoNombre,
      descripcion: apoyoDescripcion,
      fechaInicio: inputValueToApoyoFecha(apoyoFechaInicio),
      fechaTermino: apoyoFechaTermino.trim()
        ? inputValueToApoyoFecha(apoyoFechaTermino)
        : undefined,
    });
    setApoyoNombre("");
    setApoyoDescripcion("");
    setApoyoFechaInicio("");
    setApoyoFechaTermino("");
    setIsSavingApoyo(false);
    refreshDetalle();
  }

  function handleConfirmDeleteApoyo() {
    if (!pendingDeleteApoyoId) return;

    deleteApoyoImplementado(pendingDeleteApoyoId);
    setPendingDeleteApoyoId(null);
    refreshDetalle();
  }

  if (!detalle) {
    return (
      <AppShell activeNav="objetivos">
        <main className="flex flex-1 items-center justify-center px-8 py-10 text-slate-600">
          <div className="max-w-md rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm">
            <p className="text-sm">Objetivo PIE no encontrado.</p>
            <Link
              href={ROUTES.objetivos}
              className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              Volver a objetivos
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  const {
    resumen,
    estudianteNombre,
    metaLogroSeguimiento,
    apoyos,
    fortalezasMasObservadas,
    evidenciasTimeline,
  } = detalle;
  const { objetivo, estado, cantidadEvidencias, impactoPromedio, ultimaEvidencia } =
    resumen;

  return (
    <AppShell activeNav="objetivos">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={ROUTES.objetivos}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Volver a objetivos
          </Link>
          <Link
            href={`/objetivos/${objetivoId}/editar`}
            className="inline-flex items-center justify-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:bg-violet-100"
          >
            Editar objetivo
          </Link>
        </div>

        <section className="mt-6 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80">
            {GLOSSARY.barreras.detectada}
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-800">
            {getBarreraDetectadaDisplay(objetivo)}
          </p>
        </section>

        <header className="mt-8 rounded-2xl border border-violet-200/50 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            Objetivo
          </p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {objetivo.nombre}
            </h1>
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3 lg:max-w-md lg:shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800/80">
                Meta esperada
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-950">
                {metaLogroSeguimiento.metaLogro}
              </p>
            </div>
          </div>
          {objetivo.descripcion && (
            <p className="mt-4 text-sm text-slate-600">{objetivo.descripcion}</p>
          )}

          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <HeaderMetric label="Estudiante" value={estudianteNombre} />
            <HeaderMetric
              label="Dimensión relacionada"
              value={objetivo.dimensionRelacionada}
            />
            <HeaderMetric label="Estado" value={estado} />
            <HeaderMetric
              label="Impacto promedio"
              value={`${formatImpactoPromedio(impactoPromedio)} niveles`}
            />
            <HeaderMetric
              label="Cantidad de evidencias"
              value={String(cantidadEvidencias)}
            />
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">
            Meta Esperada
          </p>
          <p className="mt-3 text-base leading-relaxed font-medium text-slate-800">
            {metaLogroSeguimiento.metaLogro}
          </p>
          {metaLogroSeguimiento.porcentajeAvance === null && (
            <p className="mt-3 text-xs text-slate-500">
              Avance respecto de la meta: pendiente de cálculo automático (
              {metaLogroSeguimiento.evidenciasAsociadas} evidencias asociadas).
            </p>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/40 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-800/80">
            Situación Inicial
          </p>
          <p className="mt-4 text-xs font-medium text-slate-500">Línea base</p>
          <p className="mt-1 text-base leading-relaxed text-slate-800">
            {getLineaBaseDisplay(objetivo)}
          </p>
          <p className="mt-4 text-xs font-medium text-slate-500">
            Fecha de línea base
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {getFechaLineaBaseDisplay(objetivo)}
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-teal-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Apoyos implementados
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Registro de apoyos vinculados al objetivo para seguimiento y
                análisis futuro.
              </p>
            </div>
            <span className="inline-flex rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">
              {apoyos.activos.length} activos · {apoyos.historico.length}{" "}
              históricos
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">
              Apoyos activos
            </h3>
            {apoyos.activos.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No hay apoyos activos registrados.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {apoyos.activos.map((apoyo) => (
                  <ApoyoCard
                    key={apoyo.id}
                    apoyo={apoyo}
                    activo
                    onDelete={() => setPendingDeleteApoyoId(apoyo.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Histórico de apoyos
            </h3>
            {apoyos.historico.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                Aún no hay apoyos finalizados.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {apoyos.historico.map((apoyo) => (
                  <ApoyoCard
                    key={apoyo.id}
                    apoyo={apoyo}
                    onDelete={() => setPendingDeleteApoyoId(apoyo.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={handleAddApoyo}
            className="mt-8 rounded-xl border border-teal-100 bg-teal-50/30 p-4"
          >
            <p className="text-sm font-medium text-slate-800">
              Agregar apoyo implementado
            </p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-700">
                  Nombre del apoyo
                </span>
                <input
                  type="text"
                  value={apoyoNombre}
                  onChange={(event) => setApoyoNombre(event.target.value)}
                  required
                  list="apoyo-sugerencias"
                  className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Ej: Agenda visual"
                />
                <datalist id="apoyo-sugerencias">
                  <option value="Agenda visual" />
                  <option value="Pictogramas" />
                  <option value="Temporizador visual" />
                  <option value="Espacio de regulación" />
                  <option value="Compañero tutor" />
                  <option value="Historias sociales" />
                </datalist>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-700">
                  Descripción
                </span>
                <textarea
                  value={apoyoDescripcion}
                  onChange={(event) => setApoyoDescripcion(event.target.value)}
                  required
                  rows={2}
                  className="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Cómo se implementa el apoyo en el contexto del objetivo"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-700">
                    Fecha de inicio
                  </span>
                  <input
                    type="date"
                    value={apoyoFechaInicio}
                    onChange={(event) => setApoyoFechaInicio(event.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-700">
                    Fecha de término{" "}
                    <span className="font-normal text-slate-400">(opcional)</span>
                  </span>
                  <input
                    type="date"
                    value={apoyoFechaTermino}
                    onChange={(event) =>
                      setApoyoFechaTermino(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={
                  isSavingApoyo ||
                  !apoyoNombre.trim() ||
                  !apoyoDescripcion.trim() ||
                  !apoyoFechaInicio.trim()
                }
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Agregar apoyo
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <h2 className="text-sm font-semibold text-slate-900">
            Evidencias de avance
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {GLOSSARY.intervencion.sintesisEvidencias}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Impacto promedio"
              value={`${formatImpactoPromedio(impactoPromedio)} niveles`}
            />
            <SummaryCard label="Última evidencia" value={ultimaEvidencia} />
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-xs text-slate-500">
                Fortalezas más observadas en las evidencias
              </p>
              {fortalezasMasObservadas.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">Sin fortalezas registradas</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {fortalezasMasObservadas.map((item) => (
                    <li
                      key={item.name}
                      className="text-sm font-medium text-slate-800"
                    >
                      {item.name} ({item.count})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
          <h3 className="text-sm font-semibold text-slate-900">
            Línea de tiempo de evidencias
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {GLOSSARY.intervencion.historiaProgreso}
          </p>

          {evidenciasTimeline.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              {GLOSSARY.intervencion.sinAsociadasObjetivo}
            </p>
          ) : (
            <ol className="relative mt-8 space-y-0">
              {evidenciasTimeline.map((evidencia, index) => (
                <li
                  key={evidencia.id}
                  className="relative flex gap-4 pb-10 last:pb-0"
                >
                  {index < evidenciasTimeline.length - 1 && (
                    <span
                      className="absolute left-[15px] top-10 h-[calc(100%-1.5rem)] w-px bg-violet-100"
                      aria-hidden
                    />
                  )}
                  <span className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 ring-4 ring-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                  </span>
                  <article className="min-w-0 flex-1 rounded-xl border border-violet-100/80 bg-gradient-to-br from-violet-50/30 to-white px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-violet-700/80">
                      {evidencia.fecha}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <EmotionPill
                        label="Estado inicial"
                        emoji={evidencia.estadoInicialEmoji}
                        value={evidencia.estadoInicial}
                      />
                      <span className="self-center text-slate-300" aria-hidden>
                        →
                      </span>
                      <EmotionPill
                        label="Estado final"
                        emoji={evidencia.estadoFinalEmoji}
                        value={evidencia.estadoFinal}
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-medium text-slate-800">Impacto:</span>{" "}
                      {evidencia.impactoLabel}
                    </p>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-slate-500">
                        Fortalezas observadas
                      </p>
                      {evidencia.fortalezas.length === 0 ? (
                        <p className="mt-1 text-sm text-slate-500">Ninguna</p>
                      ) : (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {evidencia.fortalezas.map((fortaleza) => (
                            <span
                              key={fortaleza}
                              className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800"
                            >
                              {fortaleza}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      <span className="font-medium text-slate-800">
                        Logro observado:
                      </span>{" "}
                      {evidencia.logro}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          )}
          </div>
        </section>
        </div>
      </main>

      {pendingDeleteApoyoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-apoyo-dialog-title"
          >
            <h2
              id="delete-apoyo-dialog-title"
              className="text-base font-semibold text-slate-900"
            >
              ¿Eliminar este apoyo?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {GLOSSARY.intervencion.apoyosNoModifican}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingDeleteApoyoId(null)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteApoyo}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function ApoyoCard({
  apoyo,
  activo = false,
  onDelete,
}: {
  apoyo: ApoyoImplementado;
  activo?: boolean;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{apoyo.nombre}</p>
            {activo && (
              <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800">
                Activo
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {apoyo.descripcion}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Inicio: {formatApoyoFechaDisplay(apoyo.fechaInicio)}
            {apoyo.fechaTermino
              ? ` · Término: ${formatApoyoFechaDisplay(apoyo.fechaTermino)}`
              : " · Sin fecha de término"}
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <span aria-hidden>🗑</span>
          Eliminar
        </button>
      </div>
    </li>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function EmotionPill({
  label,
  emoji,
  value,
}: {
  label: string;
  emoji: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <span aria-hidden>{emoji}</span>
        {value}
      </p>
    </div>
  );
}
