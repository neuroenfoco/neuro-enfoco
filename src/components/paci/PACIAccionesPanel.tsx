"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { canDeclararPACIVigente } from "@/lib/paci/paci-validacion";
import {
  cerrarPACI,
  declararPACIVigente,
  deletePACI,
} from "@/lib/paci/paci-storage";
import type { PACI } from "@/lib/paci/paci-types";
import { useMemo, useState } from "react";

const COPY = GLOSSARY.paci;

type PACIAccionesPanelProps = {
  paci: PACI;
  /** Incrementar tras syncPACIObjetivos, updatePACIBorrador o cambio de evaluación. */
  validationRevision: number;
  onActionComplete: () => void;
};

function getEstadoLabel(estado: PACI["estado"]): string {
  switch (estado) {
    case "borrador":
      return COPY.estadoBorrador;
    case "vigente":
      return COPY.estadoVigente;
    case "cerrado":
      return COPY.estadoCerrado;
    default:
      return estado;
  }
}

export function PACIAccionesPanel({
  paci,
  validationRevision,
  onActionComplete,
}: PACIAccionesPanelProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const declaracion = useMemo(
    () => (paci.estado === "borrador" ? canDeclararPACIVigente(paci.id) : null),
    [
      paci.id,
      paci.estado,
      paci.actualizadoEn,
      paci.evaluacionReferenciaId,
      validationRevision,
    ]
  );

  function handleDeclararVigente() {
    if (isProcessing || paci.estado !== "borrador") return;
    setIsProcessing(true);
    setMessage(null);

    const validation = canDeclararPACIVigente(paci.id);
    if (!validation.ok) {
      setIsProcessing(false);
      return;
    }

    const result = declararPACIVigente(paci.id);
    setIsProcessing(false);

    if (!result) {
      setMessage("No se pudo declarar el PACI vigente.");
      return;
    }

    setMessage(COPY.declaracionExitosa);
    onActionComplete();
  }

  function handleCerrar() {
    if (isProcessing || paci.estado !== "vigente") return;
    setIsProcessing(true);
    setMessage(null);

    const result = cerrarPACI(paci.id);
    setIsProcessing(false);

    if (!result) {
      setMessage("No se pudo cerrar el PACI.");
      return;
    }

    setMessage(COPY.cierreExitoso);
    onActionComplete();
  }

  function handleEliminar() {
    if (isProcessing || paci.estado !== "borrador") return;
    if (!window.confirm(COPY.confirmarEliminar)) return;

    setIsProcessing(true);
    const ok = deletePACI(paci.id);
    setIsProcessing(false);

    if (!ok) {
      setMessage("No se pudo eliminar el borrador.");
      return;
    }

    onActionComplete();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
          {getEstadoLabel(paci.estado)}
        </span>
        {paci.declaradoVigenteEn ? (
          <span className="text-xs text-slate-500">
            {COPY.declaradoVigenteEn}:{" "}
            {new Date(paci.declaradoVigenteEn).toLocaleDateString("es-CL")}
          </span>
        ) : null}
        {paci.cerradoEn ? (
          <span className="text-xs text-slate-500">
            {COPY.cerradoEn}: {new Date(paci.cerradoEn).toLocaleDateString("es-CL")}
          </span>
        ) : null}
      </div>

      {message ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {message}
        </p>
      ) : null}

      {paci.estado === "borrador" && declaracion ? (
        <div className="mt-4 space-y-3">
          {!declaracion.ok ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-900">
                {COPY.erroresDeclaracion}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-800">
                {declaracion.errores.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {declaracion.advertencias.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm font-semibold text-amber-900">
                {COPY.advertenciasDeclaracion}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800">
                {declaracion.advertencias.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDeclararVigente}
              disabled={isProcessing || !declaracion.ok}
              className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {COPY.declararVigente}
            </button>
            <button
              type="button"
              onClick={handleEliminar}
              disabled={isProcessing}
              className="inline-flex items-center rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {COPY.eliminarBorrador}
            </button>
          </div>
        </div>
      ) : null}

      {paci.estado === "vigente" ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleCerrar}
            disabled={isProcessing}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
          >
            {COPY.cerrarPaci}
          </button>
        </div>
      ) : null}
    </section>
  );
}
