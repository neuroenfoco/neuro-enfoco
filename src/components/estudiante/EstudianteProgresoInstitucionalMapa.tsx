"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { getEstudianteAccionesSugeridas } from "@/lib/estudiante/estudiante-acciones-sugeridas";
import {
  getEstudianteProgresoInstitucionalMapa,
  type ProgresoInstitucionalEstado,
  type ProgresoInstitucionalNodo,
} from "@/lib/estudiante/estudiante-progreso-institucional-mapa";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.estudiante.progresoInstitucional;

const ESTADO_INDICADOR: Record<ProgresoInstitucionalEstado, string> = {
  verde: "🟢",
  amarillo: "🟡",
  rojo: "🔴",
};

type EstudianteProgresoInstitucionalMapaProps = {
  estudianteId: string;
  onIrTab?: (tabId: string) => void;
};

function NodoProgreso({
  nodo,
  onIrTab,
}: {
  nodo: ProgresoInstitucionalNodo;
  onIrTab?: (tabId: string) => void;
}) {
  const contenido = (
    <>
      <p className="text-sm font-semibold text-slate-900">
        {ESTADO_INDICADOR[nodo.estado]} {nodo.titulo}
      </p>
      <p className="mt-1 text-sm text-slate-600">{nodo.resumen}</p>
    </>
  );

  if (nodo.tabDestino && onIrTab) {
    return (
      <button
        type="button"
        onClick={() => onIrTab(nodo.tabDestino!)}
        className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-left transition hover:border-teal-200 hover:bg-teal-50/30"
      >
        {contenido}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3">
      {contenido}
    </div>
  );
}

export function EstudianteProgresoInstitucionalMapa({
  estudianteId,
  onIrTab,
}: EstudianteProgresoInstitucionalMapaProps) {
  const [mapa, setMapa] = useState(() =>
    getEstudianteProgresoInstitucionalMapa(estudianteId)
  );
  const [accionPrioritaria, setAccionPrioritaria] = useState(
    () => getEstudianteAccionesSugeridas(estudianteId)[0] ?? null
  );

  const refresh = useCallback(() => {
    setMapa(getEstudianteProgresoInstitucionalMapa(estudianteId));
    setAccionPrioritaria(getEstudianteAccionesSugeridas(estudianteId)[0] ?? null);
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

  return (
    <section className="rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/40 via-white to-slate-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{COPY.titulo}</h2>
        <p className="mt-0.5 text-xs text-slate-500">{COPY.subtitulo}</p>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {mapa.nodos.map((nodo) => (
          <li key={nodo.id}>
            <NodoProgreso nodo={nodo} onIrTab={onIrTab} />
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-slate-100 bg-white/80 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {COPY.siguientePasoTitulo}
        </p>
        {accionPrioritaria ? (
          <>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {accionPrioritaria.titulo}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {accionPrioritaria.descripcion}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-600">{COPY.sinAccionPrioritaria}</p>
        )}
      </div>
    </section>
  );
}
