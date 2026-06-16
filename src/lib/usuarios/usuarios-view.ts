import type { UsuarioInstitucional } from "@/lib/usuarios/usuario-types";

const MOCK_USUARIOS: UsuarioInstitucional[] = [
  {
    id: "usr-admin",
    nombre: "Administrador Demo",
    email: "admin@demo.neuroenfoco.cl",
    rol: "administrador",
    estado: "activo",
  },
  {
    id: "usr-coord-pie",
    nombre: "María González",
    email: "maria.gonzalez@establecimiento.cl",
    rol: "coordinador_pie",
    estado: "activo",
  },
  {
    id: "usr-ed-dif",
    nombre: "Carlos Ruiz",
    email: "carlos.ruiz@establecimiento.cl",
    rol: "educador_diferencial",
    estado: "activo",
  },
  {
    id: "usr-psico",
    nombre: "Ana Martínez",
    email: "ana.martinez@establecimiento.cl",
    rol: "psicologo",
    estado: "activo",
  },
];

export function getUsuariosInstitucionales(): UsuarioInstitucional[] {
  return MOCK_USUARIOS;
}
