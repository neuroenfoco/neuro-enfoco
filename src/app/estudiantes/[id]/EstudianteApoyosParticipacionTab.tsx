"use client";

import { AvisoInclusivoParticipacion } from "@/components/perfil/AvisoInclusivoParticipacion";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getApoyosParticipacionFicha,
  getParticipacionDistribucionLabels,
  type ApoyoDocumentadoItem,
  type ApoyosParticipacionFicha,
  type FrecuenciaDocumentadaItem,
} from "@/lib/apoyos-participacion-ficha";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type EstudianteApoyosParticipacionTabProps = {
  estudianteId: string;
  estudiantePrimerNombre: string;
};

const COPY = GLOSSARY.apoyos.participacionFicha;

function emptyFicha(estudianteId: string): ApoyosParticipacionFicha {
  return {
    estudianteId,
    generadoEn: new Date().toISOString(),
    totalIntervenciones: 0,
    intervencionesConApoyosDocumentados: 0,
    datosInsuficientes: true,
    apoyosDocumentados: [],
    contextosExitoDocumentados: [],
    fortalezasObservadas: [],
    necesidadesApoyoDocumentadas: [],
    apoyosPlanificadosSinUso: [],
  };
}

export function EstudianteApoyosParticipacionTab({
  estudianteId,
  estudiantePrimerNombre,
}: EstudianteApoyosParticipacionTabProps) {
  const [ficha, setFicha] = useState<ApoyosParticipacionFicha>(() =>
    typeof window === "undefined"
      ? emptyFicha(estudianteId)
      : getApoyosParticipacionFicha(estudianteId)
  );

  const refresh = useCallback(() => {
    setFicha(getApoyosParticipacionFicha(estudianteId));
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

  const participacionLabels = getParticipacionDistribucionLabels();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50/50 via-white to-emerald-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
            {COPY.etiquetaExperimental}
          </p>
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {COPY.titulo}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {COPY.subtitulo(estudiantePrimerNombre)}
        </p>
        <p className="mt-4 rounded-xl border border-teal-100 bg-white/80 px-4 py-3 text-xs leading-relaxed text-slate-600">
          {COPY.ayuda}
        </p>
      </section>

      {ficha.datosInsuficientes ? (
        <EstadoVacio estudianteId={estudianteId} />
      ) : (
        <>
          <ResumenConteos ficha={ficha} />

          <SeccionApoyosDocumentados
            apoyos={ficha.apoyosDocumentados}
            participacionLabels={participacionLabels}
          />

          <SeccionFrecuencias
            titulo={COPY.seccionContextos}
            descripcion={COPY.seccionContextosDescripcion}
            items={ficha.contextosExitoDocumentados}
            vacio={COPY.sinContextos}
          />

          <SeccionFrecuencias
            titulo={COPY.seccionFortalezas}
            descripcion={COPY.seccionFortalezasDescripcion}
            items={ficha.fortalezasObservadas}
            vacio={COPY.sinFortalezas}
          />

          <SeccionFrecuencias
            titulo={COPY.seccionNecesidades}
            descripcion={COPY.seccionNecesidadesDescripcion}
            items={ficha.necesidadesApoyoDocumentadas}
            vacio={COPY.sinNecesidades}
          />

          <SeccionPlanificadosSinUso items={ficha.apoyosPlanificadosSinUso} />
        </>
      )}
    </div>
  );
}

function EstadoVacio({ estudianteId }: { estudianteId: string }) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        {COPY.vacioTitulo}
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
        {COPY.vacioTexto}
      </p>
      <Link
        href={`/intervenciones/nueva?estudianteId=${encodeURIComponent(estudianteId)}`}
        className="mt-6 inline-flex rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
      >
        {COPY.registrarIntervencion}
      </Link>
    </section>
  );
}

function ResumenConteos({ ficha }: { ficha: ApoyosParticipacionFicha }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-6">
      <p className="text-sm text-slate-600">{COPY.resumenConteos(ficha)}</p>
    </section>
  );
}

function SeccionApoyosDocumentados({
  apoyos,
  participacionLabels,
}: {
  apoyos: ApoyoDocumentadoItem[];
  participacionLabels: Record<
    keyof ApoyoDocumentadoItem["participacion"],
    string
  >;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">
        {COPY.seccionApoyos}
      </h3>
      <p className="mt-1 text-xs text-slate-500">{COPY.seccionApoyosDescripcion}</p>

      {apoyos.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{COPY.sinApoyos}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {apoyos.map((apoyo) => (
            <li
              key={apoyo.apoyoKey}
              className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-4"
            >
              <p className="text-sm font-medium text-slate-900">{apoyo.nombre}</p>
              <p className="mt-1 text-xs text-slate-600">
                {COPY.intervencionesDocumentadas(apoyo.intervenciones)}
              </p>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {(
                  Object.keys(apoyo.participacion) as Array<
                    keyof ApoyoDocumentadoItem["participacion"]
                  >
                ).map((clave) => {
                  const valor = apoyo.participacion[clave];
                  if (valor === 0) return null;
                  return (
                    <div key={clave} className="text-xs text-slate-600">
                      <dt className="font-medium text-slate-700">
                        {participacionLabels[clave]}
                      </dt>
                      <dd className="mt-0.5">{COPY.veces(valor)}</dd>
                    </div>
                  );
                })}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SeccionFrecuencias({
  titulo,
  descripcion,
  items,
  vacio,
}: {
  titulo: string;
  descripcion: string;
  items: FrecuenciaDocumentadaItem[];
  vacio: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">{titulo}</h3>
      <p className="mt-1 text-xs text-slate-500">{descripcion}</p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{vacio}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.nombre}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-2.5 text-sm"
            >
              <span className="text-slate-800">{item.nombre}</span>
              <span className="tabular-nums text-slate-500">
                {COPY.veces(item.veces)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SeccionPlanificadosSinUso({
  items,
}: {
  items: ApoyosParticipacionFicha["apoyosPlanificadosSinUso"];
}) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">
        {COPY.seccionPlanificados}
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        {COPY.seccionPlanificadosDescripcion}
      </p>
      <AvisoInclusivoParticipacion variant="general" className="mt-4" />
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={`${item.apoyoId}-${item.objetivoId}`}
            className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
          >
            <p className="text-sm font-medium text-slate-900">
              {item.apoyoNombre}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {COPY.planificadoEn(item.objetivoNombre)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
