"use client";

import { AvisoInclusivoParticipacion } from "@/components/perfil/AvisoInclusivoParticipacion";
import { HallazgoHistorialTrigger } from "@/components/perfil/HallazgoHistorialTrigger";
import { PerfilMarcoTerritorio } from "@/components/perfil/PerfilMarcoTerritorio";
import {
  formatAprendizajeConfirmaciones,
  getAprendizajeEstudiante,
  type AprendizajeEstudiante,
  type AprendizajeItem,
  type AprendizajeUso,
} from "@/lib/aprendizaje-estudiante";
import { GLOSSARY } from "@/lib/copy/glossary";
import { useCallback, useEffect, useState } from "react";

type EstudianteAprendizajesTabProps = {
  estudianteId: string;
  estudiantePrimerNombre: string;
};

export function EstudianteAprendizajesTab({
  estudianteId,
  estudiantePrimerNombre,
}: EstudianteAprendizajesTabProps) {
  const [aprendizaje, setAprendizaje] = useState<AprendizajeEstudiante>(() =>
    typeof window === "undefined"
      ? emptyAprendizaje()
      : getAprendizajeEstudiante(estudianteId)
  );

  const refresh = useCallback(() => {
    setAprendizaje(getAprendizajeEstudiante(estudianteId));
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
    <div className="space-y-8">
      <section className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {GLOSSARY.aprendizajes.etiqueta}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          {GLOSSARY.aprendizajes.tituloDe(estudiantePrimerNombre)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {GLOSSARY.aprendizajes.subtitulo}
        </p>
        <p className="mt-4 rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-xs leading-relaxed text-slate-600">
          {GLOSSARY.aprendizajes.aviso}
        </p>
      </section>

      {!aprendizaje.tieneEvidenciasConsolidadas ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-600">
            {GLOSSARY.aprendizajes.vacioConsolidado}
          </p>
        </section>
      ) : (
        <>
          <PerfilMarcoTerritorio dimension="perfil_estudiante">
            <p className="mb-1 text-sm font-medium text-slate-700">
              {GLOSSARY.marco.perfilEstudiante.titulo}
            </p>
            <p className="mb-5 text-sm text-slate-600">
              {GLOSSARY.aprendizajes.seccionPerfilEstudianteSubtitulo}
            </p>
            <div className="space-y-8">
              <AprendizajeHallazgoSeccion
                titulo={GLOSSARY.aprendizajes.fortalezasConfirmadas}
                items={aprendizaje.fortalezasFrecuentes}
              />
              <AprendizajeHallazgoSeccion
                titulo={GLOSSARY.aprendizajes.interesesPredominantes}
                items={aprendizaje.interesesPredominantes}
              />
            </div>
          </PerfilMarcoTerritorio>

          <PerfilMarcoTerritorio
            dimension="perfil_participacion"
            showAviso
            avisoVariant="general"
          >
            <p className="mb-1 text-sm font-medium text-slate-700">
              {GLOSSARY.marco.perfilParticipacion.titulo}
            </p>
            <p className="mb-5 text-sm text-slate-600">
              {GLOSSARY.aprendizajes.seccionParticipacionSubtitulo}
            </p>
            <div className="space-y-8">
              <AprendizajeHallazgoSeccion
                titulo={GLOSSARY.aprendizajes.contextosFavorables}
                items={aprendizaje.contextosFavorables}
              />
              <AprendizajeHallazgoSeccion
                titulo={GLOSSARY.aprendizajes.condicionesFrecuentes}
                items={aprendizaje.condicionesFrecuentes}
                mostrarAvisoCondicion
              />
              <AprendizajeUsoSeccion
                titulo={GLOSSARY.aprendizajes.apoyosMasUtilizados}
                items={aprendizaje.apoyosMasUtilizados}
              />
              <AprendizajeUsoSeccion
                titulo={GLOSSARY.aprendizajes.espaciosMasUtilizados}
                items={aprendizaje.espaciosMasUtilizados}
              />
            </div>
          </PerfilMarcoTerritorio>

          <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
            <h3 className="text-sm font-semibold text-slate-900">
              {GLOSSARY.aprendizajes.trabajoPedagogico}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {GLOSSARY.aprendizajes.trabajoPedagogicoSubtitulo}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ResumenParticipacionItem
                label={GLOSSARY.intervencion.kpiRegistradas}
                value={String(aprendizaje.resumenParticipacion.totalIntervenciones)}
              />
              <ResumenParticipacionItem
                label={GLOSSARY.aprendizajes.tiempoAcumulado}
                value={aprendizaje.resumenParticipacion.horasAcumuladas}
              />
              <ResumenParticipacionItem
                label={GLOSSARY.objetivo.activos}
                value={String(aprendizaje.resumenParticipacion.objetivosActivos)}
              />
              <ResumenParticipacionItem
                label={GLOSSARY.aprendizajes.apoyosDistintos}
                value={String(aprendizaje.resumenParticipacion.apoyosDistintos)}
              />
              <ResumenParticipacionItem
                label={GLOSSARY.aprendizajes.espaciosDistintos}
                value={String(aprendizaje.resumenParticipacion.espaciosDistintos)}
              />
            </dl>

            <div className="mt-8">
              <AprendizajeUsoSeccion
                titulo={GLOSSARY.aprendizajes.objetivosMasTrabajados}
                items={aprendizaje.objetivosMasTrabajados}
                inline
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function emptyAprendizaje(): AprendizajeEstudiante {
  return {
    fortalezasFrecuentes: [],
    interesesPredominantes: [],
    contextosFavorables: [],
    condicionesFrecuentes: [],
    apoyosMasUtilizados: [],
    espaciosMasUtilizados: [],
    objetivosMasTrabajados: [],
    resumenParticipacion: {
      totalIntervenciones: 0,
      horasAcumuladas: "0 h",
      objetivosActivos: 0,
      apoyosDistintos: 0,
      espaciosDistintos: 0,
    },
    tieneEvidenciasConsolidadas: false,
  };
}

function AprendizajeHallazgoSeccion({
  titulo,
  items,
  mostrarAvisoCondicion = false,
}: {
  titulo: string;
  items: AprendizajeItem[];
  mostrarAvisoCondicion?: boolean;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900">{titulo}</h3>
      {mostrarAvisoCondicion && items.length > 0 && (
        <div className="mt-3">
          <AvisoInclusivoParticipacion variant="condicionHallazgo" />
        </div>
      )}
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          {GLOSSARY.aprendizajes.vacioPatrones}
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <AprendizajeHallazgoCard key={item.hallazgoId} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

function AprendizajeHallazgoCard({ item }: { item: AprendizajeItem }) {
  return (
    <li className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-slate-900">{item.nombre}</h4>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <AprendizajeDetalle
              label={GLOSSARY.perfilEvolutivo.labelOrigen}
              value={item.origenLabel}
            />
            <AprendizajeDetalle
              label={GLOSSARY.perfilEvolutivo.labelConfirmaciones}
              value={String(item.confirmaciones)}
            />
            <AprendizajeDetalle
              label={GLOSSARY.perfilEvolutivo.labelUltimaObservacion}
              value={
                item.ultimaObservacion ??
                GLOSSARY.perfilEvolutivo.sinObservaciones
              }
            />
            <AprendizajeDetalle
              label={GLOSSARY.aprendizajes.confirmacionIntervenciones}
              value={formatAprendizajeConfirmaciones(item.intervencionesCount)}
            />
          </dl>
        </div>
        <div className="shrink-0">
          <HallazgoHistorialTrigger hallazgoId={item.hallazgoId} />
        </div>
      </div>
    </li>
  );
}

function AprendizajeUsoSeccion({
  titulo,
  items,
  inline = false,
}: {
  titulo: string;
  items: AprendizajeUso[];
  inline?: boolean;
}) {
  return (
    <section className={inline ? undefined : "mt-2"}>
      <h3 className="text-sm font-semibold text-slate-900">{titulo}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          {GLOSSARY.aprendizajes.vacioPatrones}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm"
            >
              <span className="font-medium text-slate-800">{item.nombre}</span>
              <span className="shrink-0 text-slate-600">
                {GLOSSARY.aprendizajes.usoEnIntervenciones(item.cantidad)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ResumenParticipacionItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function AprendizajeDetalle({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}
