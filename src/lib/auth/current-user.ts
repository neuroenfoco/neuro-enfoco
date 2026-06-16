import type { AuthUser, UserRole } from "@/lib/auth/auth-types";
import { getAuthService } from "@/lib/auth/auth-service-factory";
import type { Permission } from "@/lib/auth/permissions";

export function getCurrentUser(): AuthUser {
  const user = getAuthService().getCurrentUser();
  if (!user) {
    throw new Error("No authenticated user");
  }
  return user;
}

export function isAuthenticated(): boolean {
  return getAuthService().isAuthenticated();
}

export function hasPermission(permission: Permission): boolean {
  return getAuthService().hasPermission(permission);
}

export function hasRole(role: UserRole): boolean {
  return getAuthService().hasRole(role);
}
