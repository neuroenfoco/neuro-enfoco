import { GLOSSARY } from "@/lib/copy/glossary";

type AvisoVariant =
  | "general"
  | "perfilBase"
  | "condicionHallazgo"
  | "condicionIntervencion";

const VARIANT_TEXT: Record<AvisoVariant, string> = {
  general: GLOSSARY.marco.avisosInclusivos.participacionGeneral,
  perfilBase: GLOSSARY.marco.avisosInclusivos.condicionPerfilBase,
  condicionHallazgo: GLOSSARY.marco.avisosInclusivos.condicionHallazgo,
  condicionIntervencion: GLOSSARY.marco.avisosInclusivos.condicionIntervencion,
};

type AvisoInclusivoParticipacionProps = {
  variant?: AvisoVariant;
  className?: string;
};

export function AvisoInclusivoParticipacion({
  variant = "general",
  className = "",
}: AvisoInclusivoParticipacionProps) {
  return (
    <p
      className={`rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-xs leading-relaxed text-slate-600 ${className}`}
    >
      {VARIANT_TEXT[variant]}
    </p>
  );
}
