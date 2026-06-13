export type PACIEstado = "borrador" | "vigente" | "cerrado";

export type PACI = {
  id: string;
  estudianteId: string;
  periodoLabel: string;
  periodoInicio?: string;
  periodoFin?: string;
  estado: PACIEstado;
  evaluacionReferenciaId?: string;
  sintesisInstitucional?: string;
  paciAnteriorId?: string;
  declaradoVigenteEn?: string;
  cerradoEn?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type PACIObjetivo = {
  id: string;
  paciId: string;
  objetivoPieId: string;
  orden: number;
  creadoEn: string;
};

export type SavePACIInput = {
  estudianteId: string;
  periodoLabel: string;
  periodoInicio?: string;
  periodoFin?: string;
  evaluacionReferenciaId?: string;
  sintesisInstitucional?: string;
  paciAnteriorId?: string;
  objetivoPieIds?: string[];
};

export type UpdatePACIBorradorInput = {
  periodoInicio?: string;
  periodoFin?: string;
  evaluacionReferenciaId?: string;
  sintesisInstitucional?: string;
};

export type SyncPACIObjetivosInput = {
  objetivoPieIds: string[];
};

export type CanDeclararPACIVigenteResult = {
  ok: boolean;
  errores: string[];
  advertencias: string[];
};
