export type UserRole =
  | "administrador"
  | "coordinador_pie"
  | "educador_diferencial"
  | "psicologo"
  | "fonoaudiologo"
  | "terapeuta_ocupacional"
  | "docente";

export type UserStatus = "activo" | "inactivo";

export type AuthUser = {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  estado: UserStatus;
};
