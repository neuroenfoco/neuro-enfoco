"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { AvisoInclusivoParticipacion } from "@/components/perfil/AvisoInclusivoParticipacion";
import {
  getHallazgoDimension,
  getHallazgoDimensionLabel,
  getHallazgoTipoLabel,
} from "@/lib/hallazgo-labels";
import { formatHallazgoConfirmaciones } from "@/lib/perfil-hallazgos-storage";
import {
  getHallazgoHistorial,
  type HallazgoHistorial,
  type HallazgoHistorialItem,
} from "@/lib/hallazgo-historial";
import Link from "next/link";
import { useEffect, useState } from "react";

type HallazgoHistorialModalProps = {
  hallazgoId: string;
  onClose: () => void;
};

export function HallazgoHistorialModal({
  hallazgoId,
  onClose,
}: HallazgoHistorialModalProps) {
  const [historial, setHistorial] = useState<HallazgoHistorial | null>(() =>
    typeof window === "undefined" ? null : getHallazgoHistorial(hallazgoId)
  );

  useEffect(() => {
    function refresh() {
      setHistorial(getHallazgoHistorial(hallazgoId));
    }

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [hallazgoId]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!historial) return null;

  const { hallazgo } = historial;
  const dimension = getHallazgoDimension(hallazgo.tipo);
  const esCondicionParticipacion = hallazgo.tipo === "barrera";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div
        className="flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col rounded-t-2xl border border-slate-200/80 bg-white shadow-xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hallazgo-historial-title"
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
                {getHallazgoDimensionLabel(dimension)}
              </p>
              <p className="mt-1 text-xs font-medium text-indigo-700">
                {getHallazgoTipoLabel(hallazgo.tipo)}
              </p>
              <h2
                id="hallazgo-historial-title"
                className="mt-1 text-xl font-semibold text-slate-900"
              >
                {hallazgo.nombre}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Origen: {historial.origenLabel}
              </p>
              {esCondicionParticipacion && (
                <div className="mt-3">
                  <AvisoInclusivoParticipacion variant="condicionHallazgo" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>

          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <HistorialIndicador
              label="Confirmaciones"
              value={formatHallazgoConfirmaciones(historial.confirmaciones)}
            />
            <HistorialIndicador
              label="Primera observación"
              value={historial.primeraObservacionDisplay ?? "Sin registros"}
            />
            <HistorialIndicador
              label="Última observación"
              value={historial.ultimaObservacionDisplay ?? "Sin registros"}
            />
          </dl>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <h3 className="text-sm font-semibold text-slate-900">
            {GLOSSARY.perfilBase.historialIntervenciones}
          </h3>

          {historial.items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              {GLOSSARY.perfilBase.historialVacio}
            </p>
          ) : (
            <ol className="mt-4 space-y-4">
              {historial.items.map((item) => (
                <HistorialObservacionCard key={item.observacionId} item={item} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function HistorialIndicador({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function HistorialObservacionCard({ item }: { item: HallazgoHistorialItem }) {
  return (
    <li className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm font-semibold text-slate-900">{item.fechaDisplay}</p>
        <Link
          href={`/estudiantes/${item.estudianteId}?tab=sesiones`}
          className="text-xs font-semibold text-indigo-700 transition hover:text-indigo-800"
        >
          {GLOSSARY.perfilBase.verIntervencion}
        </Link>
      </div>

      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <HistorialDetalle label="Tipo" value={item.tipoIntervencionNombre} />
        <HistorialDetalle label="Espacio" value={item.espacioNombre} />
        <HistorialDetalle label="Profesional" value={item.profesionalNombre} />
        <HistorialDetalle
          label="Objetivos trabajados"
          value={
            item.objetivosNombres.length > 0
              ? item.objetivosNombres.join(", ")
              : "Sin objetivos vinculados"
          }
        />
      </dl>

      {item.logro && (
        <div className="mt-3 rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-800">
            Logro observado
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.logro}</p>
        </div>
      )}

      {!item.evidenciaDisponible && (
        <p className="mt-2 text-xs text-amber-700">
          La evidencia pedagógica original ya no está disponible.
        </p>
      )}
    </li>
  );
}

function HistorialDetalle({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-800">{value}</dd>
    </div>
  );
}
