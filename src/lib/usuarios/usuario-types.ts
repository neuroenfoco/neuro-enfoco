import type { UserRole, UserStatus } from "@/lib/auth/auth-types";

export type UsuarioInstitucional = {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  estado: UserStatus;
};
