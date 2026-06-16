"use client";

import { FormBlock } from "@/components/objetivos/FormBlock";
import { ObjetivoSustentadoEnEvaluacionBlock } from "@/components/objetivos/ObjetivoSustentadoEnEvaluacionBlock";
import { AvisoInclusivoParticipacion } from "@/components/perfil/AvisoInclusivoParticipacion";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  APOYO_PLANIFICADO_OTRO_ID,
  CATALOGO_APOYOS_PLANIFICADOS,
  CATALOGO_ESPACIOS_PLANIFICADOS,
  mergeApoyosPlanificadosStorage,
  partitionApoyosPlanificadosIds,
} from "@/lib/pie-apoyos-planificados-catalog";
import type { SesionEspacioId } from "@/lib/sesiones-form-catalog";
import {
  CUSTOM_ID,
  findDesarrolloByNombreEnArea,
  getDesarrolloNombre,
  getDesarrollosPorArea,
  getMetaPlantillas,
} from "@/lib/pie-desarrollo-catalog";
import { CATALOGO_OTRO_ID } from "@/lib/catalogos/catalog-types";
import {
  getCategoriaLabel,
  getCatalogItemsPorCategoria,
  getCategoriasNavegables,
} from "@/lib/hallazgo-catalogo-utils";
import { getCondicionesParticipacionFormState } from "@/lib/objetivo-condiciones-participacion";
import {
  getApoyosSugeridosParaCondiciones,
  getCondicionesSugeridasDesdePerfilBase,
} from "@/lib/objetivo-planificacion-sugerencias";
import {
  PIE_DIMENSION_OPTIONS,
  type ObjetivoPIE,
} from "@/lib/pie-objectives-storage";
import type { Estudiante } from "@/lib/students-storage";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ObjetivoPIEPlanificacionPayload = {
  estudianteId: string;
  nombre: string;
  dimensionRelacionada: string;
  condicionesParticipacionIds?: string[];
  condicionParticipacionOtro?: string;
  metaLogro: string;
  lineaBase: string;
  fechaLineaBase?: string;
  descripcion?: string;
  desarrolloCatalogoId?: string;
  esDesarrolloPersonalizado?: boolean;
  apoyosPlanificadosIds?: string[];
  apoyoPlanificadoOtro?: string;
  conclusionEvaluativaIds?: string[];
};

/** @deprecated Use ObjetivoPIEPlanificacionPayload */
export type ObjetivoPIEPlanificacionSubmitInput = ObjetivoPIEPlanificacionPayload;

export type ObjetivoPIEPlanificacionInitialValues = {
  estudianteId: string;
  dimensionRelacionada: string;
  desarrolloCatalogoId: string;
  esDesarrolloPersonalizado: boolean;
  nombrePersonalizado: string;
  lineaBase: string;
  fechaLineaBase: string;
  metaLogro: string;
  condicionesParticipacionIds: string[];
  condicionParticipacionOtro: string;
  apoyosPlanificadosIds: string[];
  espaciosPlanificadosIds: SesionEspacioId[];
  apoyoPlanificadoOtro: string;
  descripcion: string;
  evaluacionOrigenId?: string;
  conclusionEvaluativaIds?: string[];
};

type ObjetivoPIEPlanificacionFormProps = {
  mode?: "create" | "edit";
  estudiantes: Estudiante[];
  initialEstudianteId?: string;
  initialValues?: ObjetivoPIEPlanificacionInitialValues;
  onSubmit?: (payload: ObjetivoPIEPlanificacionPayload) => void;
  onSave?: (payload: ObjetivoPIEPlanificacionPayload) => void | Promise<void>;
  cancelHref?: string;
  submitLabel: string;
  isSaving: boolean;
};

const COPY = GLOSSARY.objetivo.planificacion;

export function buildPlanificacionValuesFromObjetivo(
  objetivo: ObjetivoPIE & { fechaLineaBase?: string }
): ObjetivoPIEPlanificacionInitialValues {
  let desarrolloCatalogoId = objetivo.desarrolloCatalogoId ?? "";
  let esDesarrolloPersonalizado = objetivo.esDesarrolloPersonalizado ?? false;
  let nombrePersonalizado = "";

  if (
    objetivo.esDesarrolloPersonalizado ||
    desarrolloCatalogoId === CUSTOM_ID
  ) {
    desarrolloCatalogoId = CUSTOM_ID;
    esDesarrolloPersonalizado = true;
    nombrePersonalizado = objetivo.nombre;
  } else if (!desarrolloCatalogoId) {
    const match = findDesarrolloByNombreEnArea(
      objetivo.dimensionRelacionada,
      objetivo.nombre
    );

    if (match) {
      desarrolloCatalogoId = match.id;
    } else {
      desarrolloCatalogoId = CUSTOM_ID;
      esDesarrolloPersonalizado = true;
      nombrePersonalizado = objetivo.nombre;
    }
  }

  const rawIds = [...(objetivo.apoyosPlanificadosIds ?? [])];
  const otroTexto = objetivo.apoyoPlanificadoOtro?.trim() ?? "";

  if (otroTexto && !rawIds.includes(APOYO_PLANIFICADO_OTRO_ID)) {
    rawIds.push(APOYO_PLANIFICADO_OTRO_ID);
  }

  const { apoyosIds, espaciosIds } = partitionApoyosPlanificadosIds(rawIds);
  const condiciones = getCondicionesParticipacionFormState(objetivo);

  return {
    estudianteId: objetivo.estudianteId,
    dimensionRelacionada: objetivo.dimensionRelacionada,
    desarrolloCatalogoId,
    esDesarrolloPersonalizado,
    nombrePersonalizado,
    lineaBase: objetivo.lineaBase ?? "",
    fechaLineaBase: objetivo.fechaLineaBase ?? "",
    metaLogro: objetivo.metaLogro ?? "",
    condicionesParticipacionIds: condiciones.condicionesParticipacionIds,
    condicionParticipacionOtro: condiciones.condicionParticipacionOtro,
    apoyosPlanificadosIds: apoyosIds,
    espaciosPlanificadosIds: espaciosIds,
    apoyoPlanificadoOtro: otroTexto,
    descripcion: objetivo.descripcion ?? "",
    evaluacionOrigenId: undefined,
    conclusionEvaluativaIds: undefined,
  };
}

export function ObjetivoPIEPlanificacionForm({
  mode = "create",
  estudiantes,
  initialEstudianteId = "",
  initialValues,
  onSubmit,
  onSave,
  cancelHref,
  submitLabel,
  isSaving,
}: ObjetivoPIEPlanificacionFormProps) {
  const submitHandler = onSubmit ?? onSave;
  const isEdit = mode === "edit";
  const [estudianteId, setEstudianteId] = useState(
    initialValues?.estudianteId ?? initialEstudianteId
  );
  const [dimensionRelacionada, setDimensionRelacionada] = useState(
    initialValues?.dimensionRelacionada ?? PIE_DIMENSION_OPTIONS[0]
  );
  const [desarrolloCatalogoId, setDesarrolloCatalogoId] = useState(
    initialValues?.desarrolloCatalogoId ?? ""
  );
  const [nombrePersonalizado, setNombrePersonalizado] = useState(
    initialValues?.nombrePersonalizado ?? ""
  );
  const [lineaBase, setLineaBase] = useState(initialValues?.lineaBase ?? "");
  const [fechaLineaBase, setFechaLineaBase] = useState(
    initialValues?.fechaLineaBase ?? ""
  );
  const [metaLogro, setMetaLogro] = useState(initialValues?.metaLogro ?? "");
  const [condicionesParticipacionIds, setCondicionesParticipacionIds] =
    useState<string[]>(initialValues?.condicionesParticipacionIds ?? []);
  const [condicionParticipacionOtro, setCondicionParticipacionOtro] =
    useState(initialValues?.condicionParticipacionOtro ?? "");
  const [descripcion, setDescripcion] = useState(initialValues?.descripcion ?? "");
  const [apoyosPlanificadosIds, setApoyosPlanificadosIds] = useState<string[]>(
    initialValues?.apoyosPlanificadosIds ?? []
  );
  const [espaciosPlanificadosIds, setEspaciosPlanificadosIds] = useState<
    SesionEspacioId[]
  >(initialValues?.espaciosPlanificadosIds ?? []);
  const [apoyoPlanificadoOtro, setApoyoPlanificadoOtro] = useState(
    initialValues?.apoyoPlanificadoOtro ?? ""
  );
  const [condicionesAbierto, setCondicionesAbierto] = useState(
    Boolean(initialValues?.condicionesParticipacionIds?.length)
  );
  const [showApoyosAviso, setShowApoyosAviso] = useState(false);
  const [condicionesOtroError, setCondicionesOtroError] = useState(false);
  const [touched, setTouched] = useState(false);
  const [evaluacionOrigenId, setEvaluacionOrigenId] = useState(
    initialValues?.evaluacionOrigenId ?? ""
  );
  const [conclusionEvaluativaIds, setConclusionEvaluativaIds] = useState<
    string[]
  >(initialValues?.conclusionEvaluativaIds ?? []);

  const condicionesPorCategoria = useMemo(
    () => getCatalogItemsPorCategoria("condiciones_participacion"),
    []
  );
  const condicionesCategorias = useMemo(
    () => getCategoriasNavegables("condiciones_participacion"),
    []
  );

  const desarrollosArea = useMemo(
    () => getDesarrollosPorArea(dimensionRelacionada),
    [dimensionRelacionada]
  );

  const metaPlantillas = useMemo(() => {
    if (!desarrolloCatalogoId || desarrolloCatalogoId === CUSTOM_ID) return [];
    return getMetaPlantillas(desarrolloCatalogoId);
  }, [desarrolloCatalogoId]);

  const condicionesDesdePerfil = useMemo(
    () => getCondicionesSugeridasDesdePerfilBase(estudianteId ?? ""),
    [estudianteId]
  );

  const condicionesPerfilPendientes = useMemo(
    () =>
      condicionesDesdePerfil.filter(
        (sugerencia) =>
          !condicionesParticipacionIds.includes(sugerencia.catalogoId)
      ),
    [condicionesDesdePerfil, condicionesParticipacionIds]
  );

  const apoyosSugeridos = useMemo(
    () => getApoyosSugeridosParaCondiciones(condicionesParticipacionIds),
    [condicionesParticipacionIds]
  );

  const apoyosSugeridosPendientes = useMemo(
    () =>
      apoyosSugeridos.filter(
        (apoyo) => !apoyosPlanificadosIds.includes(apoyo.id)
      ),
    [apoyosSugeridos, apoyosPlanificadosIds]
  );

  const esPersonalizado = desarrolloCatalogoId === CUSTOM_ID;

  function handleAreaChange(area: string) {
    if (isEdit && area === initialValues?.dimensionRelacionada) {
      setDimensionRelacionada(area);
      setDesarrolloCatalogoId(initialValues.desarrolloCatalogoId);
      setNombrePersonalizado(initialValues.nombrePersonalizado);
      return;
    }
    setDimensionRelacionada(area);
    setDesarrolloCatalogoId("");
    setNombrePersonalizado("");
  }

  function toggleApoyo(id: string) {
    setApoyosPlanificadosIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setShowApoyosAviso(false);
  }

  function toggleEspacio(id: SesionEspacioId) {
    setEspaciosPlanificadosIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setShowApoyosAviso(false);
  }

  function toggleCondicion(id: string) {
    setCondicionesParticipacionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (id !== CATALOGO_OTRO_ID) {
      setCondicionesOtroError(false);
    }
  }

  function agregarCondicionPerfil(catalogoId: string) {
    setCondicionesParticipacionIds((prev) =>
      prev.includes(catalogoId) ? prev : [...prev, catalogoId]
    );
  }

  function agregarTodasCondicionesPerfil() {
    setCondicionesParticipacionIds((prev) => {
      const ids = new Set(prev);
      for (const sugerencia of condicionesPerfilPendientes) {
        ids.add(sugerencia.catalogoId);
      }
      return [...ids];
    });
  }

  function agregarApoyoSugerido(apoyoId: string) {
    setApoyosPlanificadosIds((prev) =>
      prev.includes(apoyoId) ? prev : [...prev, apoyoId]
    );
    setShowApoyosAviso(false);
  }

  function agregarTodosApoyosSugeridos() {
    setApoyosPlanificadosIds((prev) => {
      const ids = new Set(prev);
      for (const apoyo of apoyosSugeridosPendientes) {
        ids.add(apoyo.id);
      }
      return [...ids];
    });
    setShowApoyosAviso(false);
  }

  const desarrolloValido =
    desarrolloCatalogoId !== "" &&
    (desarrolloCatalogoId !== CUSTOM_ID || nombrePersonalizado.trim().length > 0);

  const canSubmit =
    estudianteId.trim().length > 0 &&
    dimensionRelacionada.trim().length > 0 &&
    desarrolloValido &&
    lineaBase.trim().length > 0 &&
    metaLogro.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);

    if (!canSubmit || isSaving || !submitHandler) return;

    if (
      condicionesParticipacionIds.includes(CATALOGO_OTRO_ID) &&
      !condicionParticipacionOtro.trim()
    ) {
      setCondicionesOtroError(true);
      setCondicionesAbierto(true);
      return;
    }

    if (apoyosPlanificadosIds.length === 0 && espaciosPlanificadosIds.length === 0) {
      setShowApoyosAviso(true);
    }

    const nombre = getDesarrolloNombre(desarrolloCatalogoId, nombrePersonalizado);
    const apoyosIds = [...apoyosPlanificadosIds];
    const otroTexto = apoyoPlanificadoOtro.trim();

    if (otroTexto && !apoyosIds.includes(APOYO_PLANIFICADO_OTRO_ID)) {
      apoyosIds.push(APOYO_PLANIFICADO_OTRO_ID);
    }

    const mergedIds = mergeApoyosPlanificadosStorage(
      apoyosIds,
      espaciosPlanificadosIds
    );

    void submitHandler({
      estudianteId,
      nombre,
      dimensionRelacionada,
      condicionesParticipacionIds: condicionesParticipacionIds.length
        ? [...condicionesParticipacionIds]
        : undefined,
      condicionParticipacionOtro: condicionParticipacionOtro.trim() || undefined,
      metaLogro: metaLogro.trim(),
      lineaBase: lineaBase.trim(),
      fechaLineaBase: fechaLineaBase || undefined,
      descripcion: descripcion.trim() || undefined,
      desarrolloCatalogoId: esPersonalizado ? CUSTOM_ID : desarrolloCatalogoId,
      esDesarrolloPersonalizado: esPersonalizado,
      apoyosPlanificadosIds: mergedIds.length ? mergedIds : undefined,
      apoyoPlanificadoOtro: otroTexto || undefined,
      conclusionEvaluativaIds: conclusionEvaluativaIds.length
        ? [...conclusionEvaluativaIds]
        : undefined,
    });
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";
  const textareaClass = `${inputClass} min-h-[96px] resize-y`;
  const cardSelected =
    "border-violet-300 bg-violet-50 text-violet-900";
  const cardDefault =
    "border-slate-200 bg-white text-slate-700 hover:border-slate-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormBlock
        number={1}
        title={COPY.bloqueEstudiante}
        subtitle={COPY.bloqueEstudianteSub}
      >
        <label className="block text-sm font-medium text-slate-700">
          Estudiante
          <select
            required
            value={estudianteId}
            onChange={(e) => setEstudianteId(e.target.value)}
            className={`${inputClass} mt-1.5`}
          >
            <option value="">Seleccionar estudiante</option>
            {estudiantes.map((estudiante) => (
              <option key={estudiante.id} value={estudiante.id}>
                {estudiante.nombre}
              </option>
            ))}
          </select>
        </label>
        {touched && !estudianteId && (
          <p className="mt-2 text-xs text-rose-600">Selecciona un estudiante.</p>
        )}
      </FormBlock>

      <ObjetivoSustentadoEnEvaluacionBlock
        estudianteId={estudianteId}
        evaluacionOrigenId={evaluacionOrigenId}
        conclusionEvaluativaIds={conclusionEvaluativaIds}
        onEvaluacionOrigenChange={setEvaluacionOrigenId}
        onConclusionesChange={setConclusionEvaluativaIds}
        onDimensionSugerida={setDimensionRelacionada}
      />

      <FormBlock number={2} title={COPY.bloqueArea} subtitle={COPY.bloqueAreaSub}>
        <fieldset>
          <legend className="sr-only">{COPY.bloqueArea}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {PIE_DIMENSION_OPTIONS.map((area) => (
              <label
                key={area}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  dimensionRelacionada === area ? cardSelected : cardDefault
                }`}
              >
                <input
                  type="radio"
                  name="area-desarrollo"
                  value={area}
                  checked={dimensionRelacionada === area}
                  onChange={() => handleAreaChange(area)}
                  className="h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span>{area}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </FormBlock>

      <FormBlock
        number={3}
        title={COPY.bloqueDesarrollo}
        subtitle={COPY.bloqueDesarrolloSub}
      >
        <fieldset>
          <legend className="sr-only">{COPY.bloqueDesarrollo}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {desarrollosArea.map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  desarrolloCatalogoId === item.id ? cardSelected : cardDefault
                }`}
              >
                <input
                  type="radio"
                  name="desarrollo"
                  value={item.id}
                  checked={desarrolloCatalogoId === item.id}
                  onChange={() => setDesarrolloCatalogoId(item.id)}
                  className="h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span>{item.nombre}</span>
              </label>
            ))}
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition sm:col-span-2 ${
                esPersonalizado ? cardSelected : cardDefault
              }`}
            >
              <input
                type="radio"
                name="desarrollo"
                value={CUSTOM_ID}
                checked={esPersonalizado}
                onChange={() => setDesarrolloCatalogoId(CUSTOM_ID)}
                className="h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500"
              />
              <span>Objetivo personalizado</span>
            </label>
          </div>
        </fieldset>
        {esPersonalizado && (
          <label className="mt-4 block text-sm font-medium text-slate-700">
            {COPY.desarrolloPersonalizado}
            <textarea
              required
              value={nombrePersonalizado}
              onChange={(e) => setNombrePersonalizado(e.target.value)}
              placeholder={COPY.desarrolloPersonalizadoPlaceholder}
              className={`${textareaClass} mt-1.5`}
            />
          </label>
        )}
        {touched && !desarrolloValido && (
          <p className="mt-2 text-xs text-rose-600">
            Selecciona un desarrollo o describe un objetivo personalizado.
          </p>
        )}
      </FormBlock>

      <FormBlock
        number={4}
        title={COPY.bloqueSituacionActual}
        subtitle={COPY.bloqueSituacionActualSub}
      >
        <label className="block text-sm font-medium text-slate-700">
          {COPY.lineaBasePregunta}
          <textarea
            required
            value={lineaBase}
            onChange={(e) => setLineaBase(e.target.value)}
            className={`${textareaClass} mt-1.5`}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          {COPY.fechaLineaBase}
          <input
            type="date"
            value={fechaLineaBase}
            onChange={(e) => setFechaLineaBase(e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </label>
        {touched && !lineaBase.trim() && (
          <p className="mt-2 text-xs text-rose-600">
            Describe la situación actual del estudiante.
          </p>
        )}
      </FormBlock>

      <FormBlock number={5} title={COPY.bloqueMeta} subtitle={COPY.bloqueMetaSub}>
        {metaPlantillas.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-600">
              {COPY.metaPlantillasHint}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {metaPlantillas.map((plantilla) => (
                <button
                  key={plantilla}
                  type="button"
                  onClick={() => setMetaLogro(plantilla)}
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-left text-xs text-violet-900 transition hover:border-violet-300 hover:bg-violet-100"
                >
                  {plantilla}
                </button>
              ))}
            </div>
          </div>
        )}
        <label className="block text-sm font-medium text-slate-700">
          Meta observable
          <textarea
            required
            value={metaLogro}
            onChange={(e) => setMetaLogro(e.target.value)}
            className={`${textareaClass} mt-1.5`}
          />
        </label>
        {touched && !metaLogro.trim() && (
          <p className="mt-2 text-xs text-rose-600">Define la meta esperada.</p>
        )}
      </FormBlock>

      <section className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
        <button
          type="button"
          onClick={() => setCondicionesAbierto((open) => !open)}
          className="flex w-full items-start gap-4 px-6 py-4 text-left"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">
            6
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-slate-900">
              {COPY.bloqueCondiciones}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">{COPY.bloqueCondicionesSub}</p>
          </div>
          <span className="text-sm text-slate-400">{condicionesAbierto ? "−" : "+"}</span>
        </button>
        {condicionesAbierto && (
          <div className="space-y-6 border-t border-slate-100 px-6 pb-6 pt-4">
            <AvisoInclusivoParticipacion variant="condicionHallazgo" />
            <p className="text-xs leading-relaxed text-slate-400">
              {COPY.bloqueCondicionesAyuda}
            </p>
            {condicionesPerfilPendientes.length > 0 && (
              <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-violet-900">
                      {COPY.condicionesPerfilSugeridasTitulo}
                    </p>
                    <p className="mt-0.5 text-xs text-violet-800/80">
                      {COPY.condicionesPerfilSugeridasAyuda}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={agregarTodasCondicionesPerfil}
                    className="shrink-0 rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-800"
                  >
                    {COPY.condicionesPerfilAgregarTodas}
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {condicionesPerfilPendientes.map((sugerencia) => (
                    <li
                      key={sugerencia.catalogoId}
                      className="flex items-center justify-between gap-3 rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      <span>{sugerencia.nombre}</span>
                      <button
                        type="button"
                        onClick={() => agregarCondicionPerfil(sugerencia.catalogoId)}
                        className="shrink-0 text-xs font-medium text-violet-700 hover:text-violet-900"
                      >
                        {COPY.condicionesPerfilAgregar}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {condicionesCategorias.map((categoriaId) => {
              const items = (condicionesPorCategoria[categoriaId] ?? []).filter(
                (item) => item.id !== CATALOGO_OTRO_ID
              );
              if (items.length === 0) return null;

              return (
                <div key={categoriaId}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {getCategoriaLabel(categoriaId)}
                  </h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {items.map((item) => (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                          condicionesParticipacionIds.includes(item.id)
                            ? cardSelected
                            : cardDefault
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={condicionesParticipacionIds.includes(item.id)}
                          onChange={() => toggleCondicion(item.id)}
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span>{item.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Otro
              </h3>
              <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={condicionesParticipacionIds.includes(CATALOGO_OTRO_ID)}
                  onChange={() => toggleCondicion(CATALOGO_OTRO_ID)}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span>Otro (especificar)</span>
              </label>
              {(condicionesParticipacionIds.includes(CATALOGO_OTRO_ID) ||
                condicionParticipacionOtro.trim()) && (
                <input
                  type="text"
                  value={condicionParticipacionOtro}
                  onChange={(e) => {
                    setCondicionParticipacionOtro(e.target.value);
                    if (e.target.value.trim()) setCondicionesOtroError(false);
                  }}
                  placeholder="Describe la condición observada"
                  className={`${inputClass} mt-2`}
                  required={condicionesParticipacionIds.includes(CATALOGO_OTRO_ID)}
                />
              )}
              {condicionesOtroError && (
                <p className="mt-2 text-xs text-rose-600">
                  Especifica la condición cuando seleccionas «Otro».
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <FormBlock number={7} title={COPY.bloqueApoyos} subtitle={COPY.bloqueApoyosSub}>
        <div className="space-y-8">
          {apoyosSugeridosPendientes.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    {COPY.apoyosSugeridosTitulo}
                  </p>
                  <p className="mt-0.5 text-xs text-amber-800/80">
                    {COPY.apoyosSugeridosAyuda}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={agregarTodosApoyosSugeridos}
                  className="shrink-0 rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800"
                >
                  {COPY.apoyosSugeridosAgregarTodos}
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {apoyosSugeridosPendientes.map((apoyo) => (
                  <li
                    key={apoyo.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-amber-100 bg-white px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800">{apoyo.nombre}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Según: {apoyo.condicionesOrigen.join(" · ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => agregarApoyoSugerido(apoyo.id)}
                      className="shrink-0 text-xs font-medium text-amber-800 hover:text-amber-950"
                    >
                      {COPY.apoyosSugeridosAgregar}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                {COPY.bloqueApoyosCatalogoTitulo}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {COPY.bloqueApoyosCatalogoSub}
              </p>
            </div>
            {CATALOGO_APOYOS_PLANIFICADOS.map((categoria) => (
              <div key={categoria.id}>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {categoria.nombre}
                </h4>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {categoria.items.map((item) => (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                        apoyosPlanificadosIds.includes(item.id)
                          ? cardSelected
                          : cardDefault
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={apoyosPlanificadosIds.includes(item.id)}
                        onChange={() => toggleApoyo(item.id)}
                        className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span>{item.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Otro
              </h4>
              <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={apoyosPlanificadosIds.includes(APOYO_PLANIFICADO_OTRO_ID)}
                  onChange={() => toggleApoyo(APOYO_PLANIFICADO_OTRO_ID)}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span>Otro apoyo planificado</span>
              </label>
              {(apoyosPlanificadosIds.includes(APOYO_PLANIFICADO_OTRO_ID) ||
                apoyoPlanificadoOtro.trim()) && (
                <input
                  type="text"
                  value={apoyoPlanificadoOtro}
                  onChange={(e) => setApoyoPlanificadoOtro(e.target.value)}
                  placeholder={COPY.apoyoOtroPlaceholder}
                  className={`${inputClass} mt-2`}
                />
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              Espacios previstos para la participación
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Lugares donde el equipo anticipa trabajar el objetivo. No forman
              parte del catálogo de apoyos.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {CATALOGO_ESPACIOS_PLANIFICADOS.map((espacio) => (
                <label
                  key={espacio.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                    espaciosPlanificadosIds.includes(espacio.id)
                      ? cardSelected
                      : cardDefault
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={espaciosPlanificadosIds.includes(espacio.id)}
                    onChange={() => toggleEspacio(espacio.id)}
                    className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span>{espacio.nombre}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {showApoyosAviso && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            {COPY.apoyosVaciosAviso}
          </p>
        )}
      </FormBlock>

      <FormBlock
        number={8}
        title={COPY.bloqueObservaciones}
        subtitle={COPY.bloqueObservacionesSub}
      >
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={textareaClass}
        />
      </FormBlock>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {cancelHref ? (
          <Link
            href={cancelHref}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>
        ) : null}
        <button
          type="submit"
          disabled={isSaving || !canSubmit}
          className="rounded-xl bg-violet-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
