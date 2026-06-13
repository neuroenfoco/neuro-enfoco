"use client";

import type { CatalogKind, HallazgoCatalogItem } from "@/lib/catalogos/catalog-types";
import {
  getCatalogItemsPorCategoria,
  getCatalogKindLabel,
  getCategoriaLabel,
  getCategoriasNavegables,
} from "@/lib/hallazgo-catalogo-utils";
import { useEffect, useState } from "react";

type HallazgoCatalogoModalProps = {
  catalogKind: CatalogKind;
  onSelect: (item: HallazgoCatalogItem) => void;
  onClose: () => void;
};

export function HallazgoCatalogoModal({
  catalogKind,
  onSelect,
  onClose,
}: HallazgoCatalogoModalProps) {
  const categorias = getCategoriasNavegables(catalogKind);
  const itemsPorCategoria = getCatalogItemsPorCategoria(catalogKind);
  const [categoriaAbierta, setCategoriaAbierta] = useState<string | null>(
    categorias[0] ?? null
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div
        className="flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col rounded-t-2xl border border-slate-200/80 bg-white shadow-xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hallazgo-catalogo-title"
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Catálogo institucional
              </p>
              <h2
                id="hallazgo-catalogo-title"
                className="mt-1 text-lg font-semibold text-slate-900"
              >
                {getCatalogKindLabel(catalogKind)}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Selecciona un ítem para registrarlo en el perfil base.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {categorias.map((categoriaId) => {
              const items = itemsPorCategoria[categoriaId] ?? [];
              const abierta = categoriaAbierta === categoriaId;

              return (
                <div
                  key={categoriaId}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/40"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setCategoriaAbierta(abierta ? null : categoriaId)
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                    aria-expanded={abierta}
                  >
                    <span className="text-sm font-semibold text-slate-800">
                      {getCategoriaLabel(categoriaId)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {abierta ? "▲" : "▼"} {items.length}
                    </span>
                  </button>

                  {abierta ? (
                    <ul className="border-t border-slate-200/60 px-2 pb-2">
                      {items.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(item)}
                            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900"
                          >
                            {item.nombre}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
