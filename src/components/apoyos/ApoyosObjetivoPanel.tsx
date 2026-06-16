"use client";

import {
  ApoyoPIEForm,
  type ApoyoPIEFormValues,
} from "@/components/apoyos/ApoyoPIEForm";
import { ApoyoIntervencionesPanel } from "@/components/apoyos/ApoyoIntervencionesPanel";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  APOYO_ESTADO_OPERACIONAL_STYLES,
  getApoyoEfectividadView,
  getApoyoEstadoOperacional,
  getObjetivoApoyosEstadoOperacionalResumen,
} from "@/lib/apoyos/apoyo-efectividad-view";
import {
  createApoyoPIEAsync,
  deleteApoyoPIE,
  updateApoyoPIE,
} from "@/lib/apoyos/apoyos-storage";
import {
  getObjetivoApoyosView,
  type ApoyoPIEResumen,
  type ObjetivoApoyosView,
} from "@/lib/apoyos/apoyos-view";
import type { ApoyoPIETipo, ApoyoPIEEstado } from "@/lib/apoyos/apoyos-types";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.apoyosImplementados;

const APOYO_ESTADO_ORDER: Record<ApoyoPIEEstado, number> = {
  activo: 0,
  suspendido: 1,
  finalizado: 2,
};

function sortApoyosPorEstado(apoyos: ApoyoPIEResumen[]): ApoyoPIEResumen[] {
  return [...apoyos].sort(
    (left, right) =>
      APOYO_ESTADO_ORDER[left.estadoId] - APOYO_ESTADO_ORDER[right.estadoId] ||
      left.nombre.localeCompare(right.nombre, "es")
  );
}

type ApoyosObjetivoPanelProps = {
  objetivoId: string;
  estudianteId: string;
  prefilled?: { nombre: string; tipo: ApoyoPIETipo } | null;
  onPrefilledConsumed?: () => void;
  onVinculosChanged?: () => void;
  primary?: boolean;
};

export function ApoyosObjetivoPanel({
  objetivoId,
  estudianteId,
  prefilled,
  onPrefilledConsumed,
  onVinculosChanged,
  primary = false,
}: ApoyosObjetivoPanelProps) {
  const [view, setView] = useState<ObjetivoApoyosView | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = useCallback(() => {
    setView(getObjetivoApoyosView(objetivoId));
  }, [objetivoId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  useEffect(() => {
    if (!prefilled) return;
    setShowForm(true);
    setEditingId(null);
    onPrefilledConsumed?.();
  }, [prefilled, onPrefilledConsumed]);

  if (!view) return null;

  const editingApoyo = editingId
    ? view.apoyos.find((item) => item.id === editingId)
    : null;
  const apoyosOrdenados = sortApoyosPorEstado(view.apoyos);
  const resumenOperacional = getObjetivoApoyosEstadoOperacionalResumen(objetivoId);
  const RESUMEN_COPY = COPY.resumenOperacionalObjetivo;

  async function handleCreate(values: ApoyoPIEFormValues) {
    setIsSubmitting(true);
    const created = await createApoyoPIEAsync({
      estudianteId,
      objetivoPieId: objetivoId,
      nombre: values.nombre,
      tipo: values.tipo,
      descripcion: values.descripcion || undefined,
      responsableProfesionalId: values.responsableProfesionalId || undefined,
      frecuencia: values.frecuencia || undefined,
      estado: values.estado,
    });
    setIsSubmitting(false);
    if (!created) return;
    setShowForm(false);
    refresh();
  }

  function handleUpdate(values: ApoyoPIEFormValues) {
    if (!editingId) return;
    setIsSubmitting(true);
    const updated = updateApoyoPIE(editingId, {
      nombre: values.nombre,
      tipo: values.tipo,
      descripcion: values.descripcion || undefined,
      responsableProfesionalId: values.responsableProfesionalId || undefined,
      frecuencia: values.frecuencia || undefined,
      estado: values.estado,
    });
    setIsSubmitting(false);
    if (!updated) return;
    setEditingId(null);
    refresh();
  }

  function handleDelete(apoyoId: string) {
    if (!window.confirm(COPY.confirmarEliminar)) return;
    deleteApoyoPIE(apoyoId);
    refresh();
  }

  function handleVinculosChanged() {
    refresh();
    onVinculosChanged?.();
  }

  return (
    <section
      className={`mt-8 rounded-2xl border p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8 ${
        primary
          ? "border-emerald-300/70 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/20 ring-1 ring-emerald-100/80"
          : "border-emerald-200/60 bg-gradient-to-br from-emerald-50/30 to-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className={
              primary
                ? "text-base font-bold uppercase tracking-wide text-emerald-900"
                : "text-sm font-semibold uppercase tracking-wide text-emerald-800/90"
            }
          >
            {COPY.titulo}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{COPY.subtituloObjetivo}</p>
        </div>
        {!showForm && !editingId ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {COPY.nuevoApoyo}
          </button>
        ) : null}
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <Kpi label={COPY.estadoActivo} value={view.cantidadActivos} />
        <Kpi label={COPY.estadoSuspendido} value={view.cantidadSuspendidos} />
        <Kpi label={COPY.estadoFinalizado} value={view.cantidadFinalizados} />
      </dl>

      {showForm ? (
        <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-slate-900">
            {COPY.nuevoApoyo}
          </p>
          <ApoyoPIEForm
            key={prefilled ? `${prefilled.nombre}-${prefilled.tipo}` : "nuevo"}
            initialValues={prefilled ?? undefined}
            submitLabel={COPY.guardar}
            isSubmitting={isSubmitting}
            onCancel={() => setShowForm(false)}
            onSubmit={(values) => void handleCreate(values)}
          />
        </div>
      ) : null}

      {editingApoyo ? (
        <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-slate-900">
            {COPY.editarApoyo}
          </p>
          <ApoyoPIEForm
            key={editingApoyo.id}
            initialValues={{
              nombre: editingApoyo.nombre,
              tipo: editingApoyo.tipo,
              descripcion: editingApoyo.descripcion ?? "",
              responsableProfesionalId:
                editingApoyo.responsableProfesionalId ?? "",
              frecuencia: editingApoyo.frecuencia ?? "",
              estado: editingApoyo.estadoId,
            }}
            submitLabel={COPY.guardarCambios}
            isSubmitting={isSubmitting}
            onCancel={() => setEditingId(null)}
            onSubmit={handleUpdate}
          />
        </div>
      ) : null}

      {view.apoyos.length === 0 ? (
        <p className="mt-6 text-sm text-slate-600">{COPY.sinApoyos}</p>
      ) : (
        <>
          <div className="mt-6 rounded-xl border border-slate-200 bg-white/90 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              {RESUMEN_COPY.titulo}
            </h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ResumenOperacionalKpi
                label={RESUMEN_COPY.usoFrecuente}
                value={resumenOperacional.usoFrecuente}
              />
              <ResumenOperacionalKpi
                label={RESUMEN_COPY.usoDocumentado}
                value={resumenOperacional.usoDocumentado}
              />
              <ResumenOperacionalKpi
                label={RESUMEN_COPY.sinUsoDocumentado}
                value={resumenOperacional.sinUsoDocumentado}
              />
              <ResumenOperacionalKpi
                label={RESUMEN_COPY.sinTrazabilidad}
                value={resumenOperacional.sinTrazabilidad}
              />
            </dl>
            {resumenOperacional.sinTrazabilidad > 0 ? (
              <p className="mt-3 text-xs text-amber-800">
                {RESUMEN_COPY.alertaSinTrazabilidad}
              </p>
            ) : null}
            {resumenOperacional.sinUsoDocumentado > 0 ? (
              <p className="mt-2 text-xs text-amber-800">
                {RESUMEN_COPY.alertaSinUsoDocumentado}
              </p>
            ) : null}
          </div>
          <ul className="mt-6 space-y-3">
            {apoyosOrdenados.map((apoyo) => (
              <ApoyoItem
                key={apoyo.id}
                apoyo={apoyo}
                estudianteId={estudianteId}
                onEdit={() => {
                  setShowForm(false);
                  setEditingId(apoyo.id);
                }}
                onDelete={() => handleDelete(apoyo.id)}
                onVinculosChanged={handleVinculosChanged}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/80 p-4">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
        {value}
      </dd>
    </div>
  );
}

function ResumenOperacionalKpi({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">
        {value}
      </dd>
    </div>
  );
}

function ApoyoItem({
  apoyo,
  estudianteId,
  onEdit,
  onDelete,
  onVinculosChanged,
}: {
  apoyo: ApoyoPIEResumen;
  estudianteId: string;
  onEdit: () => void;
  onDelete: () => void;
  onVinculosChanged: () => void;
}) {
  const COPY = GLOSSARY.apoyosImplementados;
  const OP_COPY = COPY.estadoOperacionalApoyo;
  const efectividad = getApoyoEfectividadView(apoyo.id);
  const estadoOperacional = getApoyoEstadoOperacional(apoyo.id);

  if (!efectividad || !estadoOperacional) return null;

  return (
    <li className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{apoyo.nombre}</p>
          <p className="mt-1 text-xs text-slate-500">{apoyo.tipoLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${APOYO_ESTADO_OPERACIONAL_STYLES[estadoOperacional.estado]}`}
          >
            {estadoOperacional.label}
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-100">
            {apoyo.estado}
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">{estadoOperacional.observacion}</p>
      <p className="mt-1 text-xs text-slate-400">{OP_COPY.aclaracion}</p>
      <dl className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-4">
        <div>
          <dt className="font-medium text-slate-500">{OP_COPY.titulo}</dt>
          <dd>{estadoOperacional.label}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">{COPY.metricaIntervenciones}</dt>
          <dd className="tabular-nums">{efectividad.cantidadIntervenciones}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">{COPY.metricaEvidencias}</dt>
          <dd className="tabular-nums">{efectividad.cantidadEvidencias}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">{COPY.ultimaActividad}</dt>
          <dd>
            {efectividad.ultimaActividad
              ? formatMarcoFechaDisplay(efectividad.ultimaActividad)
              : COPY.sinActividad}
          </dd>
        </div>
      </dl>
      {(apoyo.responsable || apoyo.frecuencia) && (
        <dl className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
          {apoyo.responsable ? (
            <div>
              <dt className="font-medium text-slate-500">{COPY.responsable}</dt>
              <dd>{apoyo.responsable}</dd>
            </div>
          ) : null}
          {apoyo.frecuencia ? (
            <div>
              <dt className="font-medium text-slate-500">{COPY.frecuencia}</dt>
              <dd>{apoyo.frecuencia}</dd>
            </div>
          ) : null}
        </dl>
      )}
      <div className="mt-3 flex gap-3 text-sm">
        <button
          type="button"
          onClick={onEdit}
          className="font-medium text-teal-700 hover:text-teal-800"
        >
          {COPY.editar}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="font-medium text-rose-700 hover:text-rose-800"
        >
          {COPY.eliminar}
        </button>
      </div>
      <ApoyoIntervencionesPanel
        apoyoId={apoyo.id}
        estudianteId={estudianteId}
        onChanged={onVinculosChanged}
      />
    </li>
  );
}
