"use client";

import { HallazgoEntradaHibrida } from "@/components/perfil/HallazgoEntradaHibrida";
import { HallazgoHistorialTrigger } from "@/components/perfil/HallazgoHistorialTrigger";
import { PerfilMarcoTerritorio } from "@/components/perfil/PerfilMarcoTerritorio";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getHallazgoBusquedaPlaceholder,
  getHallazgoFormulacionOriginalVisible,
} from "@/lib/hallazgo-catalogo-utils";
import {
  deleteHallazgoPerfil,
  formatHallazgoConfirmaciones,
  getHallazgosPerfilBaseByEstudianteId,
  updateHallazgoPerfilNombre,
  type HallazgoPerfil,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";
import { useCallback, useEffect, useState } from "react";

type EstudiantePerfilBaseTabProps = {
  estudianteId: string;
  estudiantePrimerNombre: string;
};

type GrupoConfig = {
  tipo: HallazgoTipo;
  title: string;
  addLabel: string;
  emptyLabel: string;
  accent: "teal" | "amber";
};

const GRUPOS_ESTUDIANTE: GrupoConfig[] = [
  {
    tipo: "fortaleza",
    title: "Fortalezas conocidas",
    addLabel: "Agregar fortaleza",
    emptyLabel: "Sin fortalezas en el perfil base.",
    accent: "teal",
  },
  {
    tipo: "interes",
    title: "Intereses conocidos",
    addLabel: "Agregar interés",
    emptyLabel: "Sin intereses en el perfil base.",
    accent: "teal",
  },
];

const GRUPOS_PARTICIPACION: GrupoConfig[] = [
  {
    tipo: "contexto_exito",
    title: "Contextos de éxito conocidos",
    addLabel: "Agregar contexto de éxito",
    emptyLabel: "Sin contextos de éxito en el perfil base.",
    accent: "teal",
  },
  {
    tipo: "barrera",
    title: GLOSSARY.marco.condicionesParticipacion.tituloConocidas,
    addLabel: GLOSSARY.marco.condicionesParticipacion.agregar,
    emptyLabel: "Sin condiciones de participación en el perfil base.",
    accent: "amber",
  },
];

export function EstudiantePerfilBaseTab({
  estudianteId,
  estudiantePrimerNombre,
}: EstudiantePerfilBaseTabProps) {
  const [hallazgos, setHallazgos] = useState<HallazgoPerfil[]>([]);

  const refresh = useCallback(() => {
    setHallazgos(getHallazgosPerfilBaseByEstudianteId(estudianteId));
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

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Conocimiento profesional inicial
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          {GLOSSARY.perfilBase.tituloDe(estudiantePrimerNombre)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {GLOSSARY.perfilBase.subtitulo}
        </p>
      </section>

      <PerfilMarcoTerritorio dimension="perfil_estudiante">
        <p className="mb-4 text-sm font-semibold text-slate-800">
          {GLOSSARY.marco.perfilEstudiante.sobreElEstudiante}
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {GRUPOS_ESTUDIANTE.map((grupo) => (
            <PerfilBaseGrupoEditor
              key={grupo.tipo}
              estudianteId={estudianteId}
              grupo={grupo}
              items={hallazgos.filter((item) => item.tipo === grupo.tipo)}
              onChange={refresh}
            />
          ))}
        </div>
      </PerfilMarcoTerritorio>

      <PerfilMarcoTerritorio
        dimension="perfil_participacion"
        showAviso
        avisoVariant="perfilBase"
      >
        <p className="mb-4 text-sm font-semibold text-slate-800">
          {GLOSSARY.marco.perfilParticipacion.condicionesIniciales}
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {GRUPOS_PARTICIPACION.map((grupo) => (
            <PerfilBaseGrupoEditor
              key={grupo.tipo}
              estudianteId={estudianteId}
              grupo={grupo}
              items={hallazgos.filter((item) => item.tipo === grupo.tipo)}
              onChange={refresh}
            />
          ))}
        </div>
      </PerfilMarcoTerritorio>
    </div>
  );
}

function PerfilBaseGrupoEditor({
  estudianteId,
  grupo,
  items,
  onChange,
}: {
  estudianteId: string;
  grupo: GrupoConfig;
  items: HallazgoPerfil[];
  onChange: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  function startEdit(item: HallazgoPerfil) {
    setEditingId(item.id);
    setEditName(item.nombre);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  function saveEdit(hallazgoId: string) {
    const updated = updateHallazgoPerfilNombre(hallazgoId, editName);
    if (!updated) return;
    cancelEdit();
    onChange();
  }

  function handleDelete(hallazgoId: string) {
    if (!deleteHallazgoPerfil(hallazgoId)) return;
    onChange();
  }

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">{grupo.title}</h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{grupo.emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const formulacionOriginal = getHallazgoFormulacionOriginalVisible(item);

            return (
            <li
              key={item.id}
              className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
            >
              {editingId === item.id ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(item.id)}
                      disabled={!editName.trim()}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.nombre}</p>
                    {formulacionOriginal ? (
                      <p className="mt-1 text-xs text-slate-500">
                        Registrado originalmente como: &ldquo;{formulacionOriginal}&rdquo;
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-slate-500">
                      {formatHallazgoConfirmaciones(item.totalObservaciones)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                    <HallazgoHistorialTrigger hallazgoId={item.id} />
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-xs font-semibold text-indigo-700 hover:text-indigo-800"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-semibold text-rose-700 hover:text-rose-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
          })}
        </ul>
      )}

      {isAdding ? (
        <HallazgoEntradaHibrida
          estudianteId={estudianteId}
          tipo={grupo.tipo}
          accent={grupo.accent}
          placeholder={getHallazgoBusquedaPlaceholder(grupo.tipo)}
          onAdded={() => {
            setIsAdding(false);
            onChange();
          }}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className={`mt-4 text-sm font-semibold ${
            grupo.accent === "amber"
              ? "text-amber-800 hover:text-amber-900"
              : "text-indigo-700 hover:text-indigo-800"
          }`}
        >
          ➕ {grupo.addLabel}
        </button>
      )}
    </section>
  );
}
