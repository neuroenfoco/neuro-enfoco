/**
 * Verificación read-only del resolver legacy → catálogo (sin localStorage).
 */
import { buscarCoincidenciasHallazgo } from "../src/lib/hallazgos-normalizacion";

const UMBRAL = 0.92;
const casos = [
  { texto: "Empatía", catalogo: "fortalezas" as const },
  { texto: "Creatividad", catalogo: "fortalezas" as const },
  { texto: "Animales", catalogo: "intereses" as const },
  { texto: "Videojuegos", catalogo: "intereses" as const },
  { texto: "No tolera los cambios de profesor", catalogo: "condiciones_participacion" as const },
  { texto: "Persistencia", catalogo: "fortalezas" as const },
];

for (const caso of casos) {
  const match = buscarCoincidenciasHallazgo(caso.texto, {
    catalogo: caso.catalogo,
    maxResultados: 1,
    umbralMinimo: UMBRAL,
  })[0];
  console.log(
    caso.texto,
    "→",
    match
      ? `${match.nombre} (${match.id}, score ${match.score})`
      : "sin match ≥ umbral"
  );
}
