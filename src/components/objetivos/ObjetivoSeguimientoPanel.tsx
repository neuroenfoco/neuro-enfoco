"use client";

import { ObjetivoSeguimientoCard } from "@/components/objetivos/ObjetivoSeguimientoCard";
import {
  getObjetivoSeguimiento,
  type ObjetivoSeguimiento,
} from "@/lib/objetivos/objetivo-seguimiento";
import { useCallback, useEffect, useState } from "react";

type ObjetivoSeguimientoPanelProps = {
  objetivoId: string;
  estudianteId?: string;
};

export function ObjetivoSeguimientoPanel({
  objetivoId,
  estudianteId,
}: ObjetivoSeguimientoPanelProps) {
  const [seguimiento, setSeguimiento] = useState<ObjetivoSeguimiento | null>(
    null
  );

  const refresh = useCallback(() => {
    setSeguimiento(getObjetivoSeguimiento(objetivoId));
  }, [objetivoId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!seguimiento) return null;

  return (
    <ObjetivoSeguimientoCard
      seguimiento={seguimiento}
      estudianteId={estudianteId}
    />
  );
}
