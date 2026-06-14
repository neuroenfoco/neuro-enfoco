"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getIntervencionesByApoyoId,
  linkApoyoToIntervencion,
  unlinkApoyoFromIntervencion,
} from "@/lib/apoyos/apoyo-intervencion-storage";
import { getApoyoIntervencionResumen } from "@/lib/apoyos/apoyo-intervencion-view";
import { getTipoIntervencionNombre } from "@/lib/intervenciones-catalog";
import { getIntervencionesByEstudianteId } from "@/lib/intervenciones-storage";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import { getSesionesByIntervencionId } from "@/lib/sessions-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const COPY = GLOSSARY.apoyosImplementados;

type ApoyoIntervencionesPanelProps = {
  apoyoId: string;
  estudianteId: string;
  onChanged?: () => void;
};

export function ApoyoIntervencionesPanel({
  apoyoId,
  estudianteId,
  onChanged,
}: ApoyoIntervencionesPanelProps) {
  const [showLinker, setShowLinker] = useState(false);
  const [selectedIntervencionId, setSelectedIntervencionId] = useState("");
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

  const resumen = useMemo(
    () => getApoyoIntervencionResumen(apoyoId),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- version triggers reload
    [apoyoId, version]
  );

  const vinculadas = useMemo(
    () => getIntervencionesByApoyoId(apoyoId),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- version triggers reload
    [apoyoId, version]
  );

  const disponibles = useMemo(() => {
    const linkedIds = new Set(vinculadas.map((item) => item.id));
    return getIntervencionesByEstudianteId(estudianteId).filter(
      (item) => !linkedIds.has(item.id)
    );
  }, [estudianteId, vinculadas]);

  function handleLink() {
    if (!selectedIntervencionId) return;
    const linked = linkApoyoToIntervencion(apoyoId, selectedIntervencionId);
    if (!linked) return;
    setSelectedIntervencionId("");
    setShowLinker(false);
    refresh();
  }

  function handleUnlink(intervencionId: string) {
    if (!window.confirm(COPY.confirmarDesvincularIntervencion)) return;
    unlinkApoyoFromIntervencion(apoyoId, intervencionId);
    refresh();
  }

  return (
    <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-800">
            {COPY.intervencionesVinculadas}
          </h4>
          <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            <div>
              <dt className="inline font-medium text-slate-500">
                {COPY.metricaIntervenciones}:{" "}
              </dt>
              <dd className="inline tabular-nums">{resumen.cantidadIntervenciones}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-slate-500">
                {COPY.metricaEvidencias}:{" "}
              </dt>
              <dd className="inline tabular-nums">{resumen.cantidadEvidencias}</dd>
            </div>
            {resumen.ultimaIntervencion ? (
              <div>
                <dt className="inline font-medium text-slate-500">
                  {COPY.ultimaIntervencion}:{" "}
                </dt>
                <dd className="inline">
                  {formatMarcoFechaDisplay(resumen.ultimaIntervencion)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
        {!showLinker && disponibles.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowLinker(true)}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800"
          >
            {COPY.vincularIntervencion}
          </button>
        ) : null}
      </div>

      {showLinker ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-xs font-medium text-slate-600">
              {COPY.seleccionarIntervencion}
            </span>
            <select
              value={selectedIntervencionId}
              onChange={(event) => setSelectedIntervencionId(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
            >
              <option value="">{COPY.seleccionarIntervencion}</option>
              {disponibles.map((intervencion) => (
                <option key={intervencion.id} value={intervencion.id}>
                  {formatMarcoFechaDisplay(intervencion.fecha)} ·{" "}
                  {getTipoIntervencionNombre(intervencion.tipoIntervencion)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleLink}
              disabled={!selectedIntervencionId}
              className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              {COPY.vincular}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinker(false);
                setSelectedIntervencionId("");
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {COPY.cancelar}
            </button>
          </div>
        </div>
      ) : null}

      {vinculadas.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">{COPY.sinIntervencionesVinculadas}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {vinculadas.map((intervencion) => {
            const evidencias = getSesionesByIntervencionId(intervencion.id).length;
            return (
              <li
                key={intervencion.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-slate-800">
                    {formatMarcoFechaDisplay(intervencion.fecha)} ·{" "}
                    {getTipoIntervencionNombre(intervencion.tipoIntervencion)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {COPY.metricaEvidencias}: {evidencias}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnlink(intervencion.id)}
                  className="text-xs font-medium text-rose-700 hover:text-rose-800"
                >
                  {COPY.desvincular}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
