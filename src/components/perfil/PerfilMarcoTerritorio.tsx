import { GLOSSARY } from "@/lib/copy/glossary";
import type { HallazgoDimension } from "@/lib/hallazgo-labels";
import { getHallazgoDimensionLabel } from "@/lib/hallazgo-labels";
import type { ReactNode } from "react";
import { AvisoInclusivoParticipacion } from "./AvisoInclusivoParticipacion";

type PerfilMarcoTerritorioProps = {
  dimension: HallazgoDimension;
  children: ReactNode;
  showAviso?: boolean;
  avisoVariant?: "general" | "perfilBase" | "condicionHallazgo" | "condicionIntervencion";
  className?: string;
};

export function PerfilMarcoTerritorio({
  dimension,
  children,
  showAviso = false,
  avisoVariant = "general",
  className = "",
}: PerfilMarcoTerritorioProps) {
  const isEstudiante = dimension === "perfil_estudiante";
  const subtitulo = isEstudiante
    ? GLOSSARY.marco.perfilEstudiante.subtitulo
    : GLOSSARY.marco.perfilParticipacion.subtitulo;

  return (
    <section
      className={`rounded-2xl border p-5 sm:p-6 ${
        isEstudiante
          ? "border-teal-200/60 bg-gradient-to-br from-teal-50/30 via-white to-white"
          : "border-sky-200/60 bg-gradient-to-br from-sky-50/20 via-white to-white"
      } ${className}`}
    >
      <div className="mb-5">
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${
            isEstudiante ? "text-teal-800" : "text-sky-800"
          }`}
        >
          {getHallazgoDimensionLabel(dimension)}
        </p>
        <p className="mt-1 text-sm text-slate-600">{subtitulo}</p>
      </div>

      {showAviso && (
        <AvisoInclusivoParticipacion variant={avisoVariant} className="mb-5" />
      )}

      {children}
    </section>
  );
}
