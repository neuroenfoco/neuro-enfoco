"use client";

import { HallazgoEntradaHibrida } from "@/components/perfil/HallazgoEntradaHibrida";
import { PerfilMarcoTerritorio } from "@/components/perfil/PerfilMarcoTerritorio";
import { GLOSSARY } from "@/lib/copy/glossary";
import { getHallazgoBusquedaPlaceholder } from "@/lib/hallazgo-catalogo-utils";
import type { HallazgoIngresoBorrador } from "@/lib/ingreso-pie";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";
import { useState } from "react";
import {
  INGRESO_GRUPOS_ESTUDIANTE,
  INGRESO_GRUPOS_PARTICIPACION,
  type IngresoPieGrupoConfig,
} from "@/components/ingreso/ingreso-pie-grupos";

type IngresoPiePasoHallazgosProps = {
  etapa: "estudiante" | "participacion";
  borradores: HallazgoIngresoBorrador[];
  onBorradorAgregado: (borrador: HallazgoIngresoBorrador) => void;
  onBorradorEliminado: (index: number) => void;
};

export function IngresoPiePasoHallazgos({
  etapa,
  borradores,
  onBorradorAgregado,
  onBorradorEliminado,
}: IngresoPiePasoHallazgosProps) {
  const grupos =
    etapa === "estudiante"
      ? INGRESO_GRUPOS_ESTUDIANTE
      : INGRESO_GRUPOS_PARTICIPACION;

  const contenido = (
    <>
      {etapa === "participacion" ? null : (
        <p className="mb-4 text-sm text-slate-600">
          {GLOSSARY.ingresoPie.sinHallazgosAviso}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {grupos.map((grupo) => (
          <IngresoPieGrupoBorrador
            key={grupo.tipo}
            grupo={grupo}
            borradores={borradores.filter((item) => item.tipo === grupo.tipo)}
            onBorradorAgregado={onBorradorAgregado}
            onBorradorEliminado={onBorradorEliminado}
            allBorradores={borradores}
          />
        ))}
      </div>
    </>
  );

  if (etapa === "estudiante") {
    return (
      <PerfilMarcoTerritorio dimension="perfil_estudiante">
        <p className="mb-4 text-sm font-semibold text-slate-800">
          {GLOSSARY.marco.perfilEstudiante.sobreElEstudiante}
        </p>
        {contenido}
      </PerfilMarcoTerritorio>
    );
  }

  return (
    <PerfilMarcoTerritorio
      dimension="perfil_participacion"
      showAviso
      avisoVariant="perfilBase"
    >
      <p className="mb-4 text-sm font-semibold text-slate-800">
        {GLOSSARY.marco.perfilParticipacion.condicionesIniciales}
      </p>
      {contenido}
    </PerfilMarcoTerritorio>
  );
}

function IngresoPieGrupoBorrador({
  grupo,
  borradores,
  allBorradores,
  onBorradorAgregado,
  onBorradorEliminado,
}: {
  grupo: IngresoPieGrupoConfig;
  borradores: HallazgoIngresoBorrador[];
  allBorradores: HallazgoIngresoBorrador[];
  onBorradorAgregado: (borrador: HallazgoIngresoBorrador) => void;
  onBorradorEliminado: (index: number) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  function handleBorradorAgregado(borrador: HallazgoIngresoBorrador) {
    onBorradorAgregado(borrador);
  }

  function handleRemove(localIndex: number) {
    const item = borradores[localIndex];
    const globalIndex = allBorradores.findIndex(
      (candidate) =>
        candidate.tipo === item.tipo &&
        candidate.nombre === item.nombre &&
        candidate.catalogoId === item.catalogoId
    );
    if (globalIndex !== -1) onBorradorEliminado(globalIndex);
  }

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">{grupo.title}</h3>

      {borradores.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{grupo.emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {borradores.map((item, index) => (
            <li
              key={`${item.tipo}-${item.catalogoId ?? item.nombre}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-2.5"
            >
              <span className="text-sm font-medium text-slate-800">
                {item.nombre}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-xs font-semibold text-rose-700 hover:text-rose-800"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      {isAdding ? (
        <HallazgoEntradaHibrida
          estudianteId=""
          tipo={grupo.tipo as HallazgoTipo}
          accent={grupo.accent}
          placeholder={getHallazgoBusquedaPlaceholder(grupo.tipo)}
          origen="ingreso_pie"
          modoPersistencia="borrador"
          onBorradorAgregado={handleBorradorAgregado}
          onAdded={() => setIsAdding(false)}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className={`mt-4 text-sm font-semibold ${
            grupo.accent === "amber"
              ? "text-amber-800 hover:text-amber-900"
              : "text-indigo-700 hover:text-indigo-800"
          }`}
        >
          ➕ {grupo.addLabel}
        </button>
      )}
    </section>
  );
}
