"use client";

import { GLOSSARY } from "@/lib/copy/glossary";

export type EstudianteDatosBasicosValues = {
  nombre: string;
  curso: string;
};

type EstudianteDatosBasicosFormProps = {
  values: EstudianteDatosBasicosValues;
  isSaving?: boolean;
  error?: string | null;
  onChange: (values: EstudianteDatosBasicosValues) => void;
  onSubmit: (values: EstudianteDatosBasicosValues) => void;
  onCancel: () => void;
};

const inputClassName =
  "w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20";

export function EstudianteDatosBasicosForm({
  values,
  isSaving = false,
  error,
  onChange,
  onSubmit,
  onCancel,
}: EstudianteDatosBasicosFormProps) {
  const copy = GLOSSARY.estudiante;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {copy.labelNombre}
          </span>
          <input
            type="text"
            required
            value={values.nombre}
            onChange={(event) =>
              onChange({ ...values, nombre: event.target.value })
            }
            className={inputClassName}
            placeholder={copy.placeholderNombre}
            disabled={isSaving}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {copy.labelCurso}
          </span>
          <input
            type="text"
            required
            value={values.curso}
            onChange={(event) =>
              onChange({ ...values, curso: event.target.value })
            }
            className={inputClassName}
            placeholder={copy.placeholderCurso}
            disabled={isSaving}
          />
        </label>
      </div>

      {error && (
        <p
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700 disabled:opacity-60"
        >
          {isSaving ? copy.guardando : copy.nuevoGuardar}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          {copy.nuevoCancelar}
        </button>
      </div>
    </form>
  );
}
