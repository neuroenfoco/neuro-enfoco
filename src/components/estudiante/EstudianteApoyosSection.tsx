"use client";

import {
  ApoyoPIEForm,
  type ApoyoPIEFormValues,
} from "@/components/apoyos/ApoyoPIEForm";
import { ApoyoIntervencionesPanel } from "@/components/apoyos/ApoyoIntervencionesPanel";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  APOYO_EFECTIVIDAD_ESTADO_STYLES,
  getEstudianteEfectividadApoyos,
  type ApoyoEfectividadView,
  type EstudianteEfectividadApoyosView,
} from "@/lib/apoyos/apoyo-efectividad-view";
import { createApoyoPIE, deleteApoyoPIE } from "@/lib/apoyos/apoyos-storage";
import {
  getEstudianteApoyosView,
  type ApoyoPIEResumen,
  type EstudianteApoyosView,
} from "@/lib/apoyos/apoyos-view";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.apoyosImplementados;
const EF_COPY = COPY.efectividadOperacional;

type EstudianteApoyosSectionProps = {
  estudianteId: string;
};

export function EstudianteApoyosSection({
  estudianteId,
}: EstudianteApoyosSectionProps) {
  const [view, setView] = useState<EstudianteApoyosView | null>(null);
  const [efectividad, setEfectividad] =
    useState<EstudianteEfectividadApoyosView | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = useCallback(() => {
    setView(getEstudianteApoyosView(estudianteId));
    setEfectividad(getEstudianteEfectividadApoyos(estudianteId));
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

  if (!view || !efectividad) return null;

  const efectividadPorApoyo = new Map(
    efectividad.apoyos.map((item) => [item.apoyoId, item] as const)
  );

  function handleCreate(values: ApoyoPIEFormValues) {
    setIsSubmitting(true);
    const created = createApoyoPIE({
      estudianteId,
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

  function handleDelete(apoyoId: string) {
    if (!window.confirm(COPY.confirmarEliminar)) return;
    deleteApoyoPIE(apoyoId);
    refresh();
  }

  const activos = view.apoyos.filter((item) => item.estadoId === "activo");
  const suspendidos = view.apoyos.filter((item) => item.estadoId === "suspendido");
  const finalizados = view.apoyos.filter((item) => item.estadoId === "finalizado");

  return (
    <section className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/30 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800/90">
            {COPY.titulo}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{COPY.subtituloEstudiante}</p>
        </div>
        {!showForm ? (
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
        <Kpi label={COPY.estadoActivo} value={view.apoyosActivos} />
        <Kpi label={COPY.estadoSuspendido} value={view.apoyosSuspendidos} />
        <Kpi label={COPY.estadoFinalizado} value={view.apoyosFinalizados} />
      </dl>

      {view.apoyos.length > 0 ? (
        <div className="mt-5 rounded-xl border border-slate-100 bg-white/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {EF_COPY.titulo}
          </p>
          <p className="mt-1 text-xs text-slate-500">{EF_COPY.subtitulo}</p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-4">
            <Kpi label={EF_COPY.sinActividad} value={efectividad.cantidadSinActividad} />
            <Kpi
              label={EF_COPY.actividadInicial}
              value={efectividad.cantidadActividadInicial}
            />
            <Kpi label={EF_COPY.enDesarrollo} value={efectividad.cantidadEnDesarrollo} />
            <Kpi label={EF_COPY.conEvidencia} value={efectividad.cantidadConEvidencia} />
          </dl>
        </div>
      ) : null}

      {showForm ? (
        <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-5">
          <ApoyoPIEForm
            submitLabel={COPY.guardar}
            isSubmitting={isSubmitting}
            onCancel={() => setShowForm(false)}
            onSubmit={handleCreate}
          />
        </div>
      ) : null}

      {view.apoyos.length === 0 ? (
        <p className="mt-6 text-sm text-slate-600">{COPY.sinApoyos}</p>
      ) : (
        <div className="mt-6 space-y-6">
          <ApoyoGroup
            titulo={COPY.grupoActivos}
            items={activos}
            estudianteId={estudianteId}
            efectividadPorApoyo={efectividadPorApoyo}
            onDelete={handleDelete}
            onVinculosChanged={refresh}
          />
          <ApoyoGroup
            titulo={COPY.grupoSuspendidos}
            items={suspendidos}
            estudianteId={estudianteId}
            efectividadPorApoyo={efectividadPorApoyo}
            onDelete={handleDelete}
            onVinculosChanged={refresh}
          />
          <ApoyoGroup
            titulo={COPY.grupoFinalizados}
            items={finalizados}
            estudianteId={estudianteId}
            efectividadPorApoyo={efectividadPorApoyo}
            onDelete={handleDelete}
            onVinculosChanged={refresh}
          />
        </div>
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

function ApoyoGroup({
  titulo,
  items,
  estudianteId,
  efectividadPorApoyo,
  onDelete,
  onVinculosChanged,
}: {
  titulo: string;
  items: ApoyoPIEResumen[];
  estudianteId: string;
  efectividadPorApoyo: Map<string, ApoyoEfectividadView>;
  onDelete: (id: string) => void;
  onVinculosChanged: () => void;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {titulo}
      </h3>
      <ul className="mt-3 space-y-3">
        {items.map((apoyo) => (
          <ApoyoListItem
            key={apoyo.id}
            apoyo={apoyo}
            estudianteId={estudianteId}
            efectividad={efectividadPorApoyo.get(apoyo.id)}
            onDelete={onDelete}
            onVinculosChanged={onVinculosChanged}
          />
        ))}
      </ul>
    </div>
  );
}

function ApoyoListItem({
  apoyo,
  estudianteId,
  efectividad,
  onDelete,
  onVinculosChanged,
}: {
  apoyo: ApoyoPIEResumen;
  estudianteId: string;
  efectividad?: ApoyoEfectividadView;
  onDelete: (id: string) => void;
  onVinculosChanged: () => void;
}) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{apoyo.nombre}</p>
          <p className="mt-1 text-xs text-slate-500">{apoyo.tipoLabel}</p>
          {apoyo.objetivoPieId ? (
            <Link
              href={`/objetivos/${apoyo.objetivoPieId}`}
              className="mt-2 inline-flex text-xs font-medium text-teal-700 hover:text-teal-800"
            >
              {GLOSSARY.apoyosImplementados.verObjetivo}
            </Link>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {efectividad ? (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${APOYO_EFECTIVIDAD_ESTADO_STYLES[efectividad.estado]}`}
            >
              {efectividad.estadoLabel}
            </span>
          ) : null}
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-100">
            {apoyo.estado}
          </span>
        </div>
      </div>
      <dl className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
        <div>
          <dt className="font-medium text-slate-500">
            {GLOSSARY.apoyosImplementados.metricaIntervenciones}
          </dt>
          <dd className="tabular-nums">
            {efectividad?.cantidadIntervenciones ?? 0}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">
            {GLOSSARY.apoyosImplementados.metricaEvidencias}
          </dt>
          <dd className="tabular-nums">{efectividad?.cantidadEvidencias ?? 0}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">
            {GLOSSARY.apoyosImplementados.ultimaActividad}
          </dt>
          <dd>
            {efectividad?.ultimaActividad
              ? formatMarcoFechaDisplay(efectividad.ultimaActividad)
              : GLOSSARY.apoyosImplementados.sinActividad}
          </dd>
        </div>
      </dl>
      {(apoyo.responsable || apoyo.frecuencia) && (
        <p className="mt-2 text-xs text-slate-600">
          {apoyo.responsable
            ? `${GLOSSARY.apoyosImplementados.responsable}: ${apoyo.responsable}`
            : ""}
          {apoyo.responsable && apoyo.frecuencia ? " · " : ""}
          {apoyo.frecuencia
            ? `${GLOSSARY.apoyosImplementados.frecuencia}: ${apoyo.frecuencia}`
            : ""}
        </p>
      )}
      <ApoyoIntervencionesPanel
        apoyoId={apoyo.id}
        estudianteId={estudianteId}
        onChanged={onVinculosChanged}
      />
      <button
        type="button"
        onClick={() => onDelete(apoyo.id)}
        className="mt-3 text-sm font-medium text-rose-700 hover:text-rose-800"
      >
        {GLOSSARY.apoyosImplementados.eliminar}
      </button>
    </li>
  );
}
