"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getApoyosByIntervencionId,
  linkApoyoToIntervencion,
  unlinkApoyoFromIntervencion,
} from "@/lib/apoyos/apoyo-intervencion-storage";
import { getApoyoPIETipoLabel } from "@/lib/apoyos/apoyos-view";
import { getApoyosByEstudianteId } from "@/lib/apoyos/apoyos-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const COPY = GLOSSARY.apoyosImplementados;

type IntervencionApoyosRelacionadosPanelProps = {
  intervencionId: string;
  estudianteId: string;
  onChanged?: () => void;
};

export function IntervencionApoyosRelacionadosPanel({
  intervencionId,
  estudianteId,
  onChanged,
}: IntervencionApoyosRelacionadosPanelProps) {
  const [showLinker, setShowLinker] = useState(false);
  const [selectedApoyoId, setSelectedApoyoId] = useState("");
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((current) => current + 1);
    onChanged?.();
  }, [onChanged]);

  useEffect(() => {
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const relacionados = useMemo(
    () => getApoyosByIntervencionId(intervencionId),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- version triggers reload
    [intervencionId, version]
  );

  const disponibles = useMemo(() => {
    const linkedIds = new Set(relacionados.map((item) => item.id));
    return getApoyosByEstudianteId(estudianteId).filter(
      (item) => !linkedIds.has(item.id)
    );
  }, [estudianteId, relacionados]);

  function handleLink() {
    if (!selectedApoyoId) return;
    const linked = linkApoyoToIntervencion(selectedApoyoId, intervencionId);
    if (!linked) return;
    setSelectedApoyoId("");
    setShowLinker(false);
    refresh();
  }

  function handleUnlink(apoyoId: string) {
    if (!window.confirm(COPY.confirmarDesvincularApoyo)) return;
    unlinkApoyoFromIntervencion(apoyoId, intervencionId);
    refresh();
  }

  return (
    <section className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-slate-900">
          {COPY.apoyosRelacionados}
        </h4>
        {!showLinker && disponibles.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowLinker(true)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            {COPY.vincularApoyo}
          </button>
        ) : null}
      </div>

      {showLinker ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-xs font-medium text-slate-600">
              {COPY.seleccionarApoyo}
            </span>
            <select
              value={selectedApoyoId}
              onChange={(event) => setSelectedApoyoId(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
            >
              <option value="">{COPY.seleccionarApoyo}</option>
              {disponibles.map((apoyo) => (
                <option key={apoyo.id} value={apoyo.id}>
                  {apoyo.nombre} · {getApoyoPIETipoLabel(apoyo.tipo)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleLink}
              disabled={!selectedApoyoId}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {COPY.vincular}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinker(false);
                setSelectedApoyoId("");
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {COPY.cancelar}
            </button>
          </div>
        </div>
      ) : null}

      {relacionados.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">{COPY.sinApoyosRelacionados}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {relacionados.map((apoyo) => (
            <li
              key={apoyo.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <div className="min-w-0 text-sm">
                <p className="font-medium text-slate-800">{apoyo.nombre}</p>
                <p className="text-xs text-slate-500">
                  {getApoyoPIETipoLabel(apoyo.tipo)} · {apoyo.estado}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleUnlink(apoyo.id)}
                className="text-xs font-medium text-rose-700 hover:text-rose-800"
              >
                {COPY.desvincular}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
