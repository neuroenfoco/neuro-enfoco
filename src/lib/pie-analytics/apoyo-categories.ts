import type { CategoriaApoyo } from "@/lib/pie-analytics/types";

const CATEGORIA_KEYWORDS: Record<Exclude<CategoriaApoyo, "otro">, string[]> = {
  visual: [
    "agenda visual",
    "pictograma",
    "visual",
    "imagen",
    "cartel",
    "secuencia visual",
  ],
  temporal: ["temporizador", "cronometro", "crónometro", "tiempo", "horario"],
  espacial: ["espacio de regulación", "espacio de regulacion", "rincón", "rincon", "sala sensorial"],
  social: ["compañero tutor", "companero tutor", "tutor", "pareja", "apoyo entre pares"],
  narrativo: ["historia social", "historias sociales", "cuento", "narrativa"],
};

export function inferirCategoriaApoyo(nombre: string, descripcion = ""): CategoriaApoyo {
  const texto = `${nombre} ${descripcion}`.toLowerCase();

  for (const [categoria, keywords] of Object.entries(CATEGORIA_KEYWORDS) as [
    Exclude<CategoriaApoyo, "otro">,
    string[],
  ][]) {
    if (keywords.some((keyword) => texto.includes(keyword))) {
      return categoria;
    }
  }

  return "otro";
}

export const CATEGORIA_APOYO_LABELS: Record<CategoriaApoyo, string> = {
  visual: "apoyos visuales",
  temporal: "apoyos temporales",
  espacial: "espacios de regulación",
  social: "apoyos sociales",
  narrativo: "historias sociales",
  otro: "otros apoyos",
};
