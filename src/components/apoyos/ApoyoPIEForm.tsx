"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type {
  ApoyoPIEEstado,
  ApoyoPIETipo,
} from "@/lib/apoyos/apoyos-types";

const COPY = GLOSSARY.apoyosImplementados;

const TIPOS: ApoyoPIETipo[] = [
  "adaptacion_acceso",
  "adaptacion_curricular",
  "apoyo_emocional",
  "apoyo_sensorial",
  "apoyo_comunicacion",
  "apoyo_conductual",
  "otro",
];

const ESTADOS: ApoyoPIEEstado[] = ["activo", "suspendido", "finalizado"];

export type ApoyoPIEFormValues = {
  nombre: string;
  tipo: ApoyoPIETipo;
  descripcion: string;
  responsable: string;
  frecuencia: string;
  estado: ApoyoPIEEstado;
};

type ApoyoPIEFormProps = {
  initialValues?: Partial<ApoyoPIEFormValues>;
  submitLabel: string;
  onSubmit: (values: ApoyoPIEFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

const DEFAULT_VALUES: ApoyoPIEFormValues = {
  nombre: "",
  tipo: "otro",
  descripcion: "",
  responsable: "",
  frecuencia: "",
  estado: "activo",
};

export function ApoyoPIEForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ApoyoPIEFormProps) {
  const values: ApoyoPIEFormValues = {
    ...DEFAULT_VALUES,
    ...initialValues,
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    onSubmit({
      nombre: String(form.get("nombre") ?? "").trim(),
      tipo: String(form.get("tipo") ?? "otro") as ApoyoPIETipo,
      descripcion: String(form.get("descripcion") ?? "").trim(),
      responsable: String(form.get("responsable") ?? "").trim(),
      frecuencia: String(form.get("frecuencia") ?? "").trim(),
      estado: String(form.get("estado") ?? "activo") as ApoyoPIEEstado,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        {COPY.campoNombre}
        <input
          name="nombre"
          defaultValue={values.nombre}
          required
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        {COPY.campoTipo}
        <select
          name="tipo"
          defaultValue={values.tipo}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
        >
          {TIPOS.map((tipo) => (
            <option key={tipo} value={tipo}>
              {GLOSSARY.barrerasApoyos.tipoApoyo(tipo)}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        {COPY.campoDescripcion}
        <textarea
          name="descripcion"
          defaultValue={values.descripcion}
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          {COPY.responsable}
          <input
            name="responsable"
            defaultValue={values.responsable}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          {COPY.frecuencia}
          <input
            name="frecuencia"
            defaultValue={values.frecuencia}
            placeholder={COPY.frecuenciaPlaceholder}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        {COPY.estadoApoyo}
        <select
          name="estado"
          defaultValue={values.estado}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
        >
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado === "activo"
                ? COPY.estadoActivo
                : estado === "suspendido"
                  ? COPY.estadoSuspendido
                  : COPY.estadoFinalizado}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50"
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {COPY.cancelar}
          </button>
        ) : null}
      </div>
    </form>
  );
}
