import type { AuthUser } from "@/lib/auth/auth-types";
import type { UserRole } from "@/lib/auth/auth-types";
import type { AuthService } from "@/lib/auth/auth-service";
import {
  getPermissionsForRole,
  type Permission,
} from "@/lib/auth/permissions";

const DEMO_ADMIN: AuthUser = {
  id: "demo-admin",
  nombre: "Administrador Demo",
  email: "admin@demo.neuroenfoco.cl",
  rol: "administrador",
  estado: "activo",
};

export class LocalAuthService implements AuthService {
  getCurrentUser(): AuthUser {
    return DEMO_ADMIN;
  }

  isAuthenticated(): boolean {
    return true;
  }

  hasPermission(permission: Permission): boolean {
    return getPermissionsForRole(this.getCurrentUser().rol).includes(permission);
  }

  hasRole(role: UserRole): boolean {
    return this.getCurrentUser().rol === role;
  }
}
