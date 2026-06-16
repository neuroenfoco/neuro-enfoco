import type { AsyncEstudiantesRepository } from "@/lib/repositories/async-ready";
import type { SaveEstudianteInput } from "@/lib/repositories/estudiantes-repository";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  estudianteRowToDomain,
  estudianteToRow,
  saveInputToEstudiante,
  type EstudianteRow,
} from "@/lib/supabase/estudiantes-mapper";
import { formatEstudianteFecha, type Estudiante } from "@/lib/students-storage";

const TABLE = "estudiantes";

export class SupabaseEstudiantesRepository implements AsyncEstudiantesRepository {
  async getAll(): Promise<Estudiante[]> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .order("fecha_creacion", { ascending: false });

    if (error) {
      throw new Error(`No se pudieron cargar los estudiantes: ${error.message}`);
    }

    return (data as EstudianteRow[]).map(estudianteRowToDomain);
  }

  async getById(id: string): Promise<Estudiante | null> {
    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`No se pudo cargar el estudiante: ${error.message}`);
    }

    if (!data) return null;

    return estudianteRowToDomain(data as EstudianteRow);
  }

  async save(input: SaveEstudianteInput): Promise<Estudiante> {
    const estudiante = saveInputToEstudiante(
      input,
      crypto.randomUUID(),
      formatEstudianteFecha()
    );
    const row = estudianteToRow(estudiante);

    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .insert(row)
      .select("*")
      .single();

    if (error) {
      throw new Error(`No se pudo guardar el estudiante: ${error.message}`);
    }

    return estudianteRowToDomain(data as EstudianteRow);
  }

  async marcarIngresoPieCompletado(
    estudianteId: string,
    completadoEn?: string
  ): Promise<Estudiante | null> {
    const fecha = completadoEn ?? formatEstudianteFecha();

    const { data, error } = await getSupabaseClient()
      .from(TABLE)
      .update({
        ingreso_pie_completado: true,
        ingreso_pie_completado_en: fecha,
      })
      .eq("id", estudianteId)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(
        `No se pudo marcar el ingreso PIE como completado: ${error.message}`
      );
    }

    if (!data) return null;

    return estudianteRowToDomain(data as EstudianteRow);
  }

  delete(_id: string): Promise<boolean> {
    return Promise.reject(
      new Error("delete() no está implementado en SupabaseEstudiantesRepository.")
    );
  }
}
