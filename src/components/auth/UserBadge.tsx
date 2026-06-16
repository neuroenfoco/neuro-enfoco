"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { GLOSSARY } from "@/lib/copy/glossary";
import type { UserRole, UserStatus } from "@/lib/auth/auth-types";

const ROLE_LABELS: Record<UserRole, string> = {
  administrador: GLOSSARY.roles.administrador,
  coordinador_pie: GLOSSARY.roles.coordinadorPie,
  educador_diferencial: GLOSSARY.roles.educadorDiferencial,
  psicologo: GLOSSARY.roles.psicologo,
  fonoaudiologo: GLOSSARY.roles.fonoaudiologo,
  terapeuta_ocupacional: GLOSSARY.roles.terapeutaOcupacional,
  docente: GLOSSARY.roles.docente,
};

function getStatusLabel(estado: UserStatus): string {
  return estado === "activo"
    ? GLOSSARY.usuarios.estadoActivo
    : GLOSSARY.usuarios.estadoInactivo;
}

function getInitials(nombre: string): string {
  const parts = nombre.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NE";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function UserBadge() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const rolLabel = ROLE_LABELS[user.rol];
  const estadoLabel = getStatusLabel(user.estado);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800">
        {getInitials(user.nombre)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {user.nombre}
        </p>
        <p className="truncate text-xs text-slate-500">
          {rolLabel}
          <span className="mx-1 text-slate-300" aria-hidden>
            ·
          </span>
          <span
            className={
              user.estado === "activo" ? "text-teal-700" : "text-slate-400"
            }
          >
            {estadoLabel}
          </span>
        </p>
      </div>
    </div>
  );
}
