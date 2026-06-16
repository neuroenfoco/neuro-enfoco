"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getHallazgosConsolidadosPerfilBase,
  type HallazgoPerfil,
} from "@/lib/perfil-hallazgos-storage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.objetivo.detalle;
const MAX_ITEMS = 3;

type FacilitadorTipo = "fortaleza" | "interes" | "contexto_exito";

type GrupoConfig = {
  tipo: FacilitadorTipo;
  titulo: string;
};

const GRUPOS: GrupoConfig[] = [
  { tipo: "fortaleza", titulo: COPY.facilitadoresFortalezas },
  { tipo: "interes", titulo: COPY.facilitadoresIntereses },
  { tipo: "contexto_exito", titulo: COPY.facilitadoresContextos },
];

type FacilitadoresPorTipo = {
  fortaleza: HallazgoPerfil[];
  interes: HallazgoPerfil[];
  contexto_exito: HallazgoPerfil[];
};

type ObjetivoFacilitadoresParticipacionSectionProps = {
  estudianteId: string;
};

export function ObjetivoFacilitadoresParticipacionSection({
  estudianteId,
}: ObjetivoFacilitadoresParticipacionSectionProps) {
  const [hallazgos, setHallazgos] = useState<FacilitadoresPorTipo>({
    fortaleza: [],
    interes: [],
    contexto_exito: [],
  });

  const refresh = useCallback(() => {
    setHallazgos({
      fortaleza: getHallazgosConsolidadosPerfilBase(estudianteId, "fortaleza").slice(
        0,
        MAX_ITEMS
      ),
      interes: getHallazgosConsolidadosPerfilBase(estudianteId, "interes").slice(
        0,
        MAX_ITEMS
      ),
      contexto_exito: getHallazgosConsolidadosPerfilBase(
        estudianteId,
        "contexto_exito"
      ).slice(0, MAX_ITEMS),
    });
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

  const tieneAlguno =
    hallazgos.fortaleza.length > 0 ||
    hallazgos.interes.length > 0 ||
    hallazgos.contexto_exito.length > 0;

  return (
    <section className="mt-8 rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50/30 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-900/90">
        {COPY.facilitadoresTitulo}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {COPY.facilitadoresSubtitulo}
      </p>

      {!tieneAlguno ? (
        <div className="mt-6">
          <p className="text-sm text-slate-600">{COPY.facilitadoresVacio}</p>
          <Link
            href={`/estudiantes/${estudianteId}?tab=perfil-base`}
            className="mt-3 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            {COPY.verPerfilBase}
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {GRUPOS.map((grupo) => {
            const items = hallazgos[grupo.tipo];
            if (items.length === 0) return null;

            return (
              <div key={grupo.tipo}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {grupo.titulo}
                </h3>
                <ul className="mt-2 space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800"
                    >
                      {item.nombre}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <Link
            href={`/estudiantes/${estudianteId}?tab=perfil-base`}
            className="inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            {COPY.verPerfilBase}
          </Link>
        </div>
      )}
    </section>
  );
}
