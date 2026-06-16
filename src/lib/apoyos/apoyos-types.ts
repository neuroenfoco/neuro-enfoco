/** Tipo institucional del apoyo (ApoyoPIE). */
export type ApoyoPIETipo =
  | "adaptacion_acceso"
  | "adaptacion_curricular"
  | "apoyo_emocional"
  | "apoyo_sensorial"
  | "apoyo_comunicacion"
  | "apoyo_conductual"
  | "otro";

export type ApoyoPIEEstado = "activo" | "suspendido" | "finalizado";

/**
 * Apoyo institucional implementado (entidad canónica ApoyoPIE).
 * Responde «¿Qué apoyo estamos implementando?» — distinto del uso documentado
 * en intervenciones (`Sesion.apoyosUtilizados`).
 */
export type ApoyoPIE = {
  id: string;
  estudianteId: string;
  objetivoPieId?: string;
  nombre: string;
  tipo: ApoyoPIETipo;
  descripcion?: string;
  responsableProfesionalId?: string;
  responsableNombreSnapshot?: string;
  responsable?: string;
  frecuencia?: string;
  estado: ApoyoPIEEstado;
  creadoEn: string;
  actualizadoEn: string;
};

export type CreateApoyoPIEInput = {
  estudianteId: string;
  objetivoPieId?: string;
  nombre: string;
  tipo: ApoyoPIETipo;
  descripcion?: string;
  responsableProfesionalId?: string;
  responsable?: string;
  frecuencia?: string;
  estado?: ApoyoPIEEstado;
};

export type UpdateApoyoPIEInput = {
  nombre?: string;
  tipo?: ApoyoPIETipo;
  descripcion?: string;
  responsableProfesionalId?: string;
  responsable?: string;
  frecuencia?: string;
  estado?: ApoyoPIEEstado;
  objetivoPieId?: string;
};
