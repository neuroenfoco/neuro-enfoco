"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { HallazgoIngresoBorrador, IngresoPieMarcoInput } from "@/lib/ingreso-pie";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";

const COPY = GLOSSARY.ingresoPie;

type IngresoPiePasoConfirmacionProps = {
  estudiante: { nombre: string; curso: string };
  marco: IngresoPieMarcoInput;
  borradores: HallazgoIngresoBorrador[];
};

function countByTipo(
  borradores: HallazgoIngresoBorrador[],
  tipo: HallazgoIngresoBorrador["tipo"]
): number {
  return borradores.filter((item) => item.tipo === tipo).length;
}

export function IngresoPiePasoConfirmacion({
  estudiante,
  marco,
  borradores,
}: IngresoPiePasoConfirmacionProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-slate-600">
        {COPY.confirmarSubtitulo}
      </p>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Estudiante</h3>
        <dl className="mt-3 space-y-2 text-sm text-slate-700">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Nombre</dt>
            <dd className="font-medium">{estudiante.nombre.trim()}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Curso</dt>
            <dd className="font-medium">{estudiante.curso.trim()}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">
          {COPY.marcoResumenTitulo}
        </h3>
        <dl className="mt-3 space-y-2 text-sm text-slate-700">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">{COPY.fechaIngreso}</dt>
            <dd className="font-medium">
              {formatMarcoFechaDisplay(marco.fechaIngresoPIE)}
            </dd>
          </div>
          {marco.fechaProximaReevaluacionIntegral ? (
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{COPY.proximaReevaluacion}</dt>
              <dd className="font-medium">
                {formatMarcoFechaDisplay(marco.fechaProximaReevaluacionIntegral)}
              </dd>
            </div>
          ) : null}
          {marco.tipoNEE ? (
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{COPY.tipoNee}</dt>
              <dd className="font-medium">{marco.tipoNEE}</dd>
            </div>
          ) : null}
          {marco.diagnosticoPrincipal ? (
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{COPY.diagnosticoPrincipal}</dt>
              <dd className="max-w-[60%] text-right font-medium">
                {marco.diagnosticoPrincipal}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-indigo-200/60 bg-indigo-50/30 p-5">
        <h3 className="text-sm font-semibold text-slate-900">Perfil Base inicial</h3>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          <li>{countByTipo(borradores, "fortaleza")} fortaleza(s)</li>
          <li>{countByTipo(borradores, "interes")} interés(es)</li>
          <li>{countByTipo(borradores, "contexto_exito")} contexto(s) de éxito</li>
          <li>{countByTipo(borradores, "barrera")} condición(es) de participación</li>
        </ul>
        {borradores.length === 0 ? (
          <p className="mt-3 text-xs text-slate-500">{COPY.sinHallazgosAviso}</p>
        ) : null}
      </section>
    </div>
  );
}
