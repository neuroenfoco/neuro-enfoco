import { hasPermission } from "@/lib/auth/current-user";
import type { Permission } from "@/lib/auth/permissions";

export function requirePermission(permission: Permission): void {
  if (!hasPermission(permission)) {
    throw new Error(`Permiso requerido: ${permission}`);
  }
}

export function canViewReportes(): boolean {
  return hasPermission("reportes.read");
}

export function canEditPACI(): boolean {
  return hasPermission("paci.write");
}

export function canManageUsuarios(): boolean {
  return hasPermission("configuracion.write");
}
