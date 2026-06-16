"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  CATALOGO_ROLES_PROFESIONAL,
  type RolProfesionalId,
} from "@/lib/institucional/roles-profesional-catalog";
import type { Profesional } from "@/lib/repositories/profesionales-repository";

export type ProfesionalFormValues = {
  nombres: string;
  apellidos: string;
  rolPrincipalId: RolProfesionalId;
  email: string;
  activo: boolean;
};

type ProfesionalFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<ProfesionalFormValues>;
  isSaving?: boolean;
  onSubmit: (values: ProfesionalFormValues) => void;
  onCancel: () => void;
};

const defaultValues: ProfesionalFormValues = {
  nombres: "",
  apellidos: "",
  rolPrincipalId: "educadora_diferencial",
  email: "",
  activo: true,
};

export function profesionalToFormValues(
  profesional: Profesional
): ProfesionalFormValues {
  return {
    nombres: profesional.nombres,
    apellidos: profesional.apellidos,
    rolPrincipalId: profesional.rolPrincipalId,
    email: profesional.email ?? "",
    activo: profesional.activo,
  };
}

export function ProfesionalForm({
  mode,
  initialValues,
  isSaving = false,
  onSubmit,
  onCancel,
}: ProfesionalFormProps) {
  const copy = GLOSSARY.profesional;
  const values = { ...defaultValues, ...initialValues };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    onSubmit({
      nombres: String(form.get("nombres") ?? ""),
      apellidos: String(form.get("apellidos") ?? ""),
      rolPrincipalId: String(
        form.get("rolPrincipalId") ?? "educadora_diferencial"
      ) as RolProfesionalId,
      email: String(form.get("email") ?? ""),
      activo: form.get("activo") === "on",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="profesional-nombres"
            className="block text-sm font-medium text-slate-700"
          >
            {copy.nombres}
          </label>
          <input
            id="profesional-nombres"
            name="nombres"
            required
            defaultValue={values.nombres}
            className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="profesional-apellidos"
            className="block text-sm font-medium text-slate-700"
          >
            {copy.apellidos}
          </label>
          <input
            id="profesional-apellidos"
            name="apellidos"
            required
            defaultValue={values.apellidos}
            className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="profesional-rol"
            className="block text-sm font-medium text-slate-700"
          >
            {copy.rolPrincipal}
          </label>
          <select
            id="profesional-rol"
            name="rolPrincipalId"
            defaultValue={values.rolPrincipalId}
            className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {CATALOGO_ROLES_PROFESIONAL.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="profesional-email"
            className="block text-sm font-medium text-slate-700"
          >
            {copy.email}
          </label>
          <input
            id="profesional-email"
            name="email"
            type="email"
            defaultValue={values.email}
            className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="activo"
              defaultChecked={values.activo}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/30"
            />
            {copy.activo}
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copy.cancelar}
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700 disabled:opacity-60"
        >
          {mode === "create" ? copy.guardarNuevo : copy.guardarCambios}
        </button>
      </div>
    </form>
  );
}
