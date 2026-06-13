"use client";

import { HallazgoCatalogoModal } from "@/components/perfil/HallazgoCatalogoModal";
import type { HallazgoCatalogItem } from "@/lib/catalogos/catalog-types";
import { CATALOGO_OTRO_ID } from "@/lib/catalogos/catalog-types";
import {
  getCategoriaLabel,
  getHallazgoBusquedaPlaceholder,
  hallazgoTipoToCatalogKind,
} from "@/lib/hallazgo-catalogo-utils";
import {
  buscarCoincidenciasHallazgo,
  type HallazgoNormalizacionSugerencia,
} from "@/lib/hallazgos-normalizacion";
import type { HallazgoIngresoBorrador } from "@/lib/ingreso-pie";
import { saveHallazgoEvaluativo } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import type { HallazgoEvaluativo } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  createHallazgoPerfil,
  createHallazgoPerfilBase,
  type HallazgoOrigen,
  type HallazgoPerfil,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 400;

type HallazgoEntradaHibridaProps = {
  estudianteId: string;
  tipo: HallazgoTipo;
  placeholder?: string;
  accent?: "teal" | "amber";
  /** Origen del hallazgo al persistir. Por defecto perfil_base. */
  origen?: HallazgoOrigen;
  /** Requerido si origen === ingreso_pie y modoPersistencia === inmediato. */
  perfilBaseDesde?: string;
  /** inmediato: Perfil Base; borrador: ingreso wizard; evaluativo: HallazgoEvaluativo. */
  modoPersistencia?: "inmediato" | "borrador" | "evaluativo";
  /** Requerido si modoPersistencia === evaluativo. */
  evaluacionIntegralId?: string;
  onAdded: () => void;
  onCancel: () => void;
  onHallazgoCreated?: (hallazgo: HallazgoPerfil) => void;
  onHallazgoEvaluativoCreated?: (hallazgo: HallazgoEvaluativo) => void;
  onBorradorAgregado?: (borrador: HallazgoIngresoBorrador) => void;
};

export function HallazgoEntradaHibrida({
  estudianteId,
  tipo,
  placeholder,
  accent = "teal",
  origen = "perfil_base",
  perfilBaseDesde,
  modoPersistencia = "inmediato",
  evaluacionIntegralId,
  onAdded,
  onCancel,
  onHallazgoCreated,
  onHallazgoEvaluativoCreated,
  onBorradorAgregado,
}: HallazgoEntradaHibridaProps) {
  const placeholderText =
    placeholder ?? getHallazgoBusquedaPlaceholder(tipo);
  const catalogKind = hallazgoTipoToCatalogKind(tipo);
  const [texto, setTexto] = useState("");
  const [sugerencias, setSugerencias] = useState<HallazgoNormalizacionSugerencia[]>(
    []
  );
  const [sugerenciaSeleccionadaId, setSugerenciaSeleccionadaId] = useState<
    string | null
  >(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ejecutarBusqueda = useCallback(
    (valor: string) => {
      const trimmed = valor.trim();
      if (trimmed.length < 2) {
        setSugerencias([]);
        setSugerenciaSeleccionadaId(null);
        setBusquedaRealizada(trimmed.length === 0);
        return;
      }

      const resultados = buscarCoincidenciasHallazgo(trimmed, {
        catalogo: catalogKind,
      });
      setSugerencias(resultados);
      setSugerenciaSeleccionadaId(resultados[0]?.id ?? null);
      setBusquedaRealizada(true);
    },
    [catalogKind]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      ejecutarBusqueda(texto);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [texto, ejecutarBusqueda]);

  function handleBlur() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    ejecutarBusqueda(texto);
  }

  function persistHallazgo(
    input: Parameters<typeof createHallazgoPerfil>[0]
  ): HallazgoPerfil | null {
    if (modoPersistencia === "borrador") {
      onBorradorAgregado?.({
        tipo,
        nombre: input.nombre,
        catalogoKind: input.catalogoKind,
        catalogoId: input.catalogoId,
        formulacionOriginal: input.formulacionOriginal,
      });
      setTexto("");
      setSugerencias([]);
      setSugerenciaSeleccionadaId(null);
      setBusquedaRealizada(false);
      onAdded();
      return null;
    }

    if (modoPersistencia === "evaluativo") {
      if (!evaluacionIntegralId || !estudianteId.trim()) return null;
      const created = saveHallazgoEvaluativo({
        evaluacionIntegralId,
        estudianteId: estudianteId.trim(),
        tipo: input.tipo,
        nombre: input.nombre,
        catalogoKind: input.catalogoKind,
        catalogoId: input.catalogoId,
        formulacionOriginal: input.formulacionOriginal,
      });
      if (!created) return null;
      onHallazgoEvaluativoCreated?.(created);
      setTexto("");
      setSugerencias([]);
      setSugerenciaSeleccionadaId(null);
      setBusquedaRealizada(false);
      onAdded();
      return null;
    }

    let created: HallazgoPerfil | null = null;

    if (origen === "perfil_base") {
      created = createHallazgoPerfilBase(input);
    } else if (origen === "ingreso_pie") {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[HallazgoEntradaHibrida] origen ingreso_pie en modo inmediato está deprecado; use modoPersistencia borrador."
        );
      }
      return null;
    } else {
      created = createHallazgoPerfil({ ...input, origen: "intervencion" });
    }

    if (!created) return null;
    onHallazgoCreated?.(created);
    onAdded();
    return created;
  }

  function registrarDesdeSugerencia() {
    const sugerencia = sugerencias.find(
      (item) => item.id === sugerenciaSeleccionadaId
    );
    if (!sugerencia) return;

    const formulacion = texto.trim();
    persistHallazgo({
      estudianteId,
      tipo,
      nombre: sugerencia.nombre,
      catalogoKind: sugerencia.catalogo,
      catalogoId: sugerencia.id,
      formulacionOriginal: formulacion || undefined,
    });
  }

  function registrarFormulacionPropia() {
    const formulacion = texto.trim();
    if (!formulacion) return;

    persistHallazgo({
      estudianteId,
      tipo,
      nombre: formulacion,
      catalogoKind: catalogKind,
      catalogoId: CATALOGO_OTRO_ID,
      formulacionOriginal: formulacion,
    });
  }

  function registrarDesdeCatalogo(item: HallazgoCatalogItem) {
    const created = persistHallazgo({
      estudianteId,
      tipo,
      nombre: item.nombre,
      catalogoKind: catalogKind,
      catalogoId: item.id,
    });
    if (!created) return;
    setShowCatalogModal(false);
  }

  const textoValido = texto.trim().length > 0;
  const haySugerencias = sugerencias.length > 0;
  const accentButton =
    accent === "amber"
      ? "bg-amber-700 hover:bg-amber-800"
      : "bg-indigo-600 hover:bg-indigo-700";
  const accentLink =
    accent === "amber"
      ? "text-amber-800 hover:text-amber-900"
      : "text-indigo-700 hover:text-indigo-800";

  return (
    <>
      <div className="mt-4 space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
        <div>
          <label className="sr-only" htmlFor={`hallazgo-texto-${tipo}`}>
            Formulación libre
          </label>
          <input
            id={`hallazgo-texto-${tipo}`}
            type="text"
            value={texto}
            onChange={(event) => {
              setBusquedaRealizada(false);
              setTexto(event.target.value);
            }}
            onBlur={handleBlur}
            placeholder={placeholderText}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            autoFocus
          />
        </div>

        <button
          type="button"
          onClick={() => setShowCatalogModal(true)}
          className={`text-sm font-semibold ${accentLink}`}
        >
          Explorar catálogo institucional
        </button>

        {haySugerencias ? (
          <div className="space-y-3 rounded-xl border border-indigo-100 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">
              ¿Quisiste decir?
            </p>
            <fieldset className="space-y-2">
              {sugerencias.map((sugerencia) => (
                <label
                  key={sugerencia.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 px-3 py-2 hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name={`sugerencia-${tipo}`}
                    value={sugerencia.id}
                    checked={sugerenciaSeleccionadaId === sugerencia.id}
                    onChange={() => setSugerenciaSeleccionadaId(sugerencia.id)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">
                      {sugerencia.nombre}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {getCategoriaLabel(sugerencia.categoria)}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={registrarDesdeSugerencia}
                disabled={!sugerenciaSeleccionadaId}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${accentButton}`}
              >
                Usar sugerencia
              </button>
              <button
                type="button"
                onClick={registrarFormulacionPropia}
                disabled={!textoValido}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Registrar formulación propia
              </button>
            </div>
          </div>
        ) : busquedaRealizada && textoValido ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={registrarFormulacionPropia}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${accentButton}`}
            >
              Agregar
            </button>
          </div>
        ) : null}

        <div className="flex gap-2 border-t border-slate-200/60 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            Cancelar
          </button>
        </div>
      </div>

      {showCatalogModal ? (
        <HallazgoCatalogoModal
          catalogKind={catalogKind}
          onSelect={registrarDesdeCatalogo}
          onClose={() => setShowCatalogModal(false)}
        />
      ) : null}
    </>
  );
}
