import { APP_CONFIG } from "@/lib/config/app-config";
import type { AsyncEstudiantesRepository } from "@/lib/repositories/async-ready";
import {
  LocalApoyosRepository,
  type ApoyosRepository,
} from "@/lib/repositories/apoyos-repository";
import {
  LocalConclusionesEvaluativasRepository,
  type ConclusionesEvaluativasRepository,
} from "@/lib/repositories/conclusiones-evaluativas-repository";
import {
  LocalEspaciosRepository,
  type EspaciosRepository,
} from "@/lib/repositories/espacios-repository";
import {
  LocalEstudiantesRepository,
  type EstudiantesRepository,
} from "@/lib/repositories/estudiantes-repository";
import { LocalAsyncEstudiantesRepository } from "@/lib/repositories/local-async-estudiantes-repository";
import { SupabaseEstudiantesRepository } from "@/lib/repositories/supabase-estudiantes-repository";
import {
  LocalEvaluacionesRepository,
  type EvaluacionesRepository,
} from "@/lib/repositories/evaluaciones-repository";
import {
  LocalHallazgosEvaluativosRepository,
  type HallazgosEvaluativosRepository,
} from "@/lib/repositories/hallazgos-evaluativos-repository";
import {
  LocalIntervencionesRepository,
  type IntervencionesRepository,
} from "@/lib/repositories/intervenciones-repository";
import {
  LocalMarcoInstitucionalRepository,
  type MarcoInstitucionalRepository,
} from "@/lib/repositories/marco-institucional-repository";
import {
  LocalObjetivosRepository,
  type ObjetivosRepository,
} from "@/lib/repositories/objetivos-repository";
import {
  LocalPACIRepository,
  type PACIRepository,
} from "@/lib/repositories/paci-repository";
import {
  LocalParticipacionesEvaluacionRepository,
  type ParticipacionesEvaluacionRepository,
} from "@/lib/repositories/participaciones-evaluacion-repository";
import {
  LocalProfesionalesRepository,
  type ProfesionalesRepository,
} from "@/lib/repositories/profesionales-repository";
import {
  LocalSesionesRepository,
  type SesionesRepository,
} from "@/lib/repositories/sesiones-repository";
import {
  LocalVinculosConclusionObjetivoRepository,
  type VinculosConclusionObjetivoRepository,
} from "@/lib/repositories/vinculos-conclusion-objetivo-repository";

let estudiantesRepository: EstudiantesRepository | null = null;
let estudiantesRepositoryAsync: AsyncEstudiantesRepository | null = null;
let objetivosRepository: ObjetivosRepository | null = null;
let evaluacionesRepository: EvaluacionesRepository | null = null;
let paciRepository: PACIRepository | null = null;
let intervencionesRepository: IntervencionesRepository | null = null;
let apoyosRepository: ApoyosRepository | null = null;
let sesionesRepository: SesionesRepository | null = null;
let espaciosRepository: EspaciosRepository | null = null;
let profesionalesRepository: ProfesionalesRepository | null = null;
let marcoInstitucionalRepository: MarcoInstitucionalRepository | null = null;
let participacionesEvaluacionRepository: ParticipacionesEvaluacionRepository | null =
  null;
let hallazgosEvaluativosRepository: HallazgosEvaluativosRepository | null = null;
let conclusionesEvaluativasRepository: ConclusionesEvaluativasRepository | null =
  null;
let vinculosConclusionObjetivoRepository: VinculosConclusionObjetivoRepository | null =
  null;

function assertLocalProvider(): void {
  if (APP_CONFIG.dataProvider !== "local") {
    throw new Error(
      `Data provider "${APP_CONFIG.dataProvider}" aún no está implementado.`
    );
  }
}

export function getEstudiantesRepository(): EstudiantesRepository {
  assertLocalProvider();
  if (!estudiantesRepository) {
    estudiantesRepository = new LocalEstudiantesRepository();
  }
  return estudiantesRepository;
}

export function getEstudiantesRepositoryAsync(): AsyncEstudiantesRepository {
  if (!estudiantesRepositoryAsync) {
    if (APP_CONFIG.estudiantesDataProvider === "supabase") {
      estudiantesRepositoryAsync = new SupabaseEstudiantesRepository();
    } else {
      estudiantesRepositoryAsync = new LocalAsyncEstudiantesRepository(
        new LocalEstudiantesRepository()
      );
    }
  }
  return estudiantesRepositoryAsync;
}

export function getObjetivosRepository(): ObjetivosRepository {
  assertLocalProvider();
  if (!objetivosRepository) {
    objetivosRepository = new LocalObjetivosRepository();
  }
  return objetivosRepository;
}

export function getEvaluacionesRepository(): EvaluacionesRepository {
  assertLocalProvider();
  if (!evaluacionesRepository) {
    evaluacionesRepository = new LocalEvaluacionesRepository();
  }
  return evaluacionesRepository;
}

export function getPACIRepository(): PACIRepository {
  assertLocalProvider();
  if (!paciRepository) {
    paciRepository = new LocalPACIRepository();
  }
  return paciRepository;
}

export function getIntervencionesRepository(): IntervencionesRepository {
  assertLocalProvider();
  if (!intervencionesRepository) {
    intervencionesRepository = new LocalIntervencionesRepository();
  }
  return intervencionesRepository;
}

export function getApoyosRepository(): ApoyosRepository {
  assertLocalProvider();
  if (!apoyosRepository) {
    apoyosRepository = new LocalApoyosRepository();
  }
  return apoyosRepository;
}

export function getSesionesRepository(): SesionesRepository {
  assertLocalProvider();
  if (!sesionesRepository) {
    sesionesRepository = new LocalSesionesRepository();
  }
  return sesionesRepository;
}

export function getEspaciosRepository(): EspaciosRepository {
  assertLocalProvider();
  if (!espaciosRepository) {
    espaciosRepository = new LocalEspaciosRepository();
  }
  return espaciosRepository;
}

export function getProfesionalesRepository(): ProfesionalesRepository {
  assertLocalProvider();
  if (!profesionalesRepository) {
    profesionalesRepository = new LocalProfesionalesRepository();
  }
  return profesionalesRepository;
}

export function getMarcoInstitucionalRepository(): MarcoInstitucionalRepository {
  assertLocalProvider();
  if (!marcoInstitucionalRepository) {
    marcoInstitucionalRepository = new LocalMarcoInstitucionalRepository();
  }
  return marcoInstitucionalRepository;
}

export function getParticipacionesEvaluacionRepository(): ParticipacionesEvaluacionRepository {
  assertLocalProvider();
  if (!participacionesEvaluacionRepository) {
    participacionesEvaluacionRepository =
      new LocalParticipacionesEvaluacionRepository();
  }
  return participacionesEvaluacionRepository;
}

export function getHallazgosEvaluativosRepository(): HallazgosEvaluativosRepository {
  assertLocalProvider();
  if (!hallazgosEvaluativosRepository) {
    hallazgosEvaluativosRepository = new LocalHallazgosEvaluativosRepository();
  }
  return hallazgosEvaluativosRepository;
}

export function getConclusionesEvaluativasRepository(): ConclusionesEvaluativasRepository {
  assertLocalProvider();
  if (!conclusionesEvaluativasRepository) {
    conclusionesEvaluativasRepository =
      new LocalConclusionesEvaluativasRepository();
  }
  return conclusionesEvaluativasRepository;
}

export function getVinculosConclusionObjetivoRepository(): VinculosConclusionObjetivoRepository {
  assertLocalProvider();
  if (!vinculosConclusionObjetivoRepository) {
    vinculosConclusionObjetivoRepository =
      new LocalVinculosConclusionObjetivoRepository();
  }
  return vinculosConclusionObjetivoRepository;
}

/** Reinicia instancias singleton (útil en tests). */
export function resetRepositoriesForTests(): void {
  estudiantesRepository = null;
  estudiantesRepositoryAsync = null;
  objetivosRepository = null;
  evaluacionesRepository = null;
  paciRepository = null;
  intervencionesRepository = null;
  apoyosRepository = null;
  sesionesRepository = null;
  espaciosRepository = null;
  profesionalesRepository = null;
  marcoInstitucionalRepository = null;
  participacionesEvaluacionRepository = null;
  hallazgosEvaluativosRepository = null;
  conclusionesEvaluativasRepository = null;
  vinculosConclusionObjetivoRepository = null;
}
