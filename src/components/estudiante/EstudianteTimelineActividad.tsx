"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getEstudianteTimelineActividad,
  type EstudianteTimelineItem,
  type EstudianteTimelineTipo,
} from "@/lib/estudiante/estudiante-timeline";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.estudiante;

type EstudianteTimelineActividadProps = {
  estudianteId: string;
  maxItems?: number;
};

const TIPO_STYLES: Record<
  EstudianteTimelineTipo,
  { dot: string; badge: string }
> = {
  evaluacion: {
    dot: "bg-violet-600",
    badge: "bg-violet-50 text-violet-800 ring-violet-100",
  },
  intervencion: {
    dot: "bg-sky-600",
    badge: "bg-sky-50 text-sky-800 ring-sky-100",
  },
  paci: {
    dot: "bg-indigo-600",
    badge: "bg-indigo-50 text-indigo-800 ring-indigo-100",
  },
};

export function EstudianteTimelineActividad({
  estudianteId,
  maxItems = 12,
}: EstudianteTimelineActividadProps) {
  const [items, setItems] = useState<EstudianteTimelineItem[]>([]);

  const refresh = useCallback(() => {
    setItems(getEstudianteTimelineActividad(estudianteId));
  }, [estudianteId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const visibleItems = items.slice(0, maxItems);

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">
          {COPY.timelineTitulo}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">{COPY.timelineSubtitulo}</p>
      </div>

      {visibleItems.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">{COPY.timelineVacio}</p>
      ) : (
        <ol className="relative mt-6 space-y-0">
          {visibleItems.map((item, index) => {
            const styles = TIPO_STYLES[item.tipo];
            return (
              <li
                key={item.id}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {index < visibleItems.length - 1 && (
                  <span
                    className="absolute left-[11px] top-8 h-full w-px bg-slate-100"
                    aria-hidden
                  />
                )}
                <span className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-white">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${styles.dot}`}
                  />
                </span>
                <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-slate-400">{item.fechaDisplay}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${styles.badge}`}
                    >
                      {item.tipoLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {item.resumen}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
