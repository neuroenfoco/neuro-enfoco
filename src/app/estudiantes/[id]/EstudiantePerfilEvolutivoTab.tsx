"use client";

import { AvisoInclusivoParticipacion } from "@/components/perfil/AvisoInclusivoParticipacion";
import { HallazgoHistorialTrigger } from "@/components/perfil/HallazgoHistorialTrigger";
import { PerfilMarcoTerritorio } from "@/components/perfil/PerfilMarcoTerritorio";
import { InstitutionalInfoCard } from "@/components/institutional/InstitutionalInfoCard";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  formatPerfilEvolutivoConfirmaciones,
  getPerfilEvolutivoFicha,
  type PerfilEvolutivoFicha,
  type PerfilEvolutivoItem,
  type PerfilEvolutivoOrigenConteo,
} from "@/lib/perfil-evolutivo-ficha";
import { useCallback, useEffect, useState } from "react";

type EstudiantePerfilEvolutivoTabProps = {
  estudianteId: string;
  estudiantePrimerNombre: string;
};

export function EstudiantePerfilEvolutivoTab({
  estudianteId,
  estudiantePrimerNombre,
}: EstudiantePerfilEvolutivoTabProps) {
  const guidance = GLOSSARY.institutionalGuidance.perfilEvolutivo;
  const [ficha, setFicha] = useState<PerfilEvolutivoFicha>(() =>
    typeof window === "undefined"
      ? emptyFicha(estudianteId)
      : getPerfilEvolutivoFicha(estudianteId)
  );

  const refresh = useCallback(() => {
    setFicha(getPerfilEvolutivoFicha(estudianteId));
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
      <section className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
          {GLOSSARY.perfilEvolutivo.tab}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          {GLOSSARY.perfilEvolutivo.tituloDe(estudiantePrimerNombre)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {GLOSSARY.perfilEvolutivo.subtitulo}
        </p>
      </section>

      <InstitutionalInfoCard
        variant="info"
        title={guidance.info.title}
        body={guidance.info.body}
        detail={guidance.info.detail}
      />

      {!ficha.tieneRegistros ? (
        <InstitutionalInfoCard
          variant="recomendacion"
          body={guidance.recomendacionSinRegistros.body}
        />
      ) : null}

      {!ficha.tieneRegistros ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-600">{GLOSSARY.perfilEvolutivo.vacioGeneral}</p>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
            <h3 className="text-sm font-semibold text-slate-900">
              {GLOSSARY.perfilEvolutivo.resumenTitulo}
            </h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ResumenItem
                label={GLOSSARY.perfilEvolutivo.fortalezasConocidas}
                value={ficha.resumen.fortalezasConocidas}
              />
              <ResumenItem
                label={GLOSSARY.perfilEvolutivo.interesesConocidos}
                value={ficha.resumen.interesesConocidos}
              />
              <ResumenItem
                label={GLOSSARY.perfilEvolutivo.contextosDocumentados}
                value={ficha.resumen.contextosExitoDocumentados}
              />
              <ResumenItem
                label={GLOSSARY.perfilEvolutivo.condicionesDocumentadas}
                value={ficha.resumen.condicionesDocumentadas}
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
            <h3 className="text-sm font-semibold text-slate-900">
              {GLOSSARY.perfilEvolutivo.distribucionTitulo}
            </h3>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <DistribucionOrigen
                titulo={GLOSSARY.perfilEvolutivo.distribucionPerfilBase}
                conteo={ficha.distribucionPerfilBase}
              />
              <DistribucionOrigen
                titulo={GLOSSARY.perfilEvolutivo.distribucionIntervenciones}
                conteo={ficha.distribucionIntervenciones}
              />
            </div>
          </section>

          <PerfilMarcoTerritorio dimension="perfil_estudiante">
            <p className="mb-1 text-sm font-medium text-slate-700">
              {GLOSSARY.perfilEvolutivo.preguntaEstudiante}
            </p>
            <p className="mb-5 text-sm text-slate-600">
              {GLOSSARY.perfilEvolutivo.subtituloEstudiante}
            </p>
            <div className="space-y-8">
              <HallazgoEvolutivoSeccion
                titulo={GLOSSARY.perfilEvolutivo.seccionFortalezas}
                vacio={GLOSSARY.perfilEvolutivo.vacioFortalezas}
                items={ficha.fortalezas}
              />
              <HallazgoEvolutivoSeccion
                titulo={GLOSSARY.perfilEvolutivo.seccionIntereses}
                vacio={GLOSSARY.perfilEvolutivo.vacioIntereses}
                items={ficha.intereses}
              />
            </div>
          </PerfilMarcoTerritorio>

          <PerfilMarcoTerritorio
            dimension="perfil_participacion"
            showAviso
            avisoVariant="general"
          >
            <p className="mb-1 text-sm font-medium text-slate-700">
              {GLOSSARY.perfilEvolutivo.preguntaParticipacion}
            </p>
            <p className="mb-5 text-sm text-slate-600">
              {GLOSSARY.perfilEvolutivo.subtituloParticipacion}
            </p>
            <div className="space-y-8">
              <HallazgoEvolutivoSeccion
                titulo={GLOSSARY.perfilEvolutivo.seccionContextos}
                vacio={GLOSSARY.perfilEvolutivo.vacioContextos}
                items={ficha.contextosExito}
              />
              <HallazgoEvolutivoSeccion
                titulo={GLOSSARY.perfilEvolutivo.seccionCondiciones}
                vacio={GLOSSARY.perfilEvolutivo.vacioCondiciones}
                items={ficha.condiciones}
                mostrarAvisoCondicion
              />
            </div>
          </PerfilMarcoTerritorio>
        </>
      )}
    </div>
  );
}

function emptyFicha(estudianteId: string): PerfilEvolutivoFicha {
  const emptyConteo: PerfilEvolutivoOrigenConteo = {
    fortalezas: 0,
    intereses: 0,
    contextosExito: 0,
    condiciones: 0,
  };

  return {
    estudianteId,
    resumen: {
      fortalezasConocidas: 0,
      interesesConocidos: 0,
      contextosExitoDocumentados: 0,
      condicionesDocumentadas: 0,
    },
    distribucionPerfilBase: emptyConteo,
    distribucionIntervenciones: emptyConteo,
    fortalezas: [],
    intereses: [],
    contextosExito: [],
    condiciones: [],
    tieneRegistros: false,
  };
}

function ResumenItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function DistribucionOrigen({
  titulo,
  conteo,
}: {
  titulo: string;
  conteo: PerfilEvolutivoOrigenConteo;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
      <h4 className="text-sm font-semibold text-slate-900">{titulo}</h4>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        <li>{GLOSSARY.perfilEvolutivo.conteoFortalezas(conteo.fortalezas)}</li>
        <li>{GLOSSARY.perfilEvolutivo.conteoIntereses(conteo.intereses)}</li>
        <li>{GLOSSARY.perfilEvolutivo.conteoContextos(conteo.contextosExito)}</li>
        <li>{GLOSSARY.perfilEvolutivo.conteoCondiciones(conteo.condiciones)}</li>
      </ul>
    </div>
  );
}

function HallazgoEvolutivoSeccion({
  titulo,
  vacio,
  items,
  mostrarAvisoCondicion = false,
}: {
  titulo: string;
  vacio: string;
  items: PerfilEvolutivoItem[];
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
        <p className="mt-3 text-sm text-slate-500">{vacio}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <HallazgoEvolutivoCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

function HallazgoEvolutivoCard({ item }: { item: PerfilEvolutivoItem }) {
  return (
    <li className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-slate-900">{item.nombre}</h4>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <EvolutivoDetalle
              label={GLOSSARY.perfilEvolutivo.labelOrigen}
              value={item.origenLabel}
            />
            <EvolutivoDetalle
              label={GLOSSARY.perfilEvolutivo.labelConfirmaciones}
              value={formatPerfilEvolutivoConfirmaciones(item.totalConfirmaciones)}
            />
            <EvolutivoDetalle
              label={GLOSSARY.perfilEvolutivo.labelPrimeraObservacion}
              value={item.primeraObservacionDisplay ?? GLOSSARY.perfilEvolutivo.sinObservaciones}
            />
            <EvolutivoDetalle
              label={GLOSSARY.perfilEvolutivo.labelUltimaObservacion}
              value={item.ultimaObservacionDisplay ?? GLOSSARY.perfilEvolutivo.sinObservaciones}
            />
          </dl>
        </div>
        <div className="shrink-0">
          <HallazgoHistorialTrigger hallazgoId={item.id} />
        </div>
      </div>
    </li>
  );
}

function EvolutivoDetalle({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}
