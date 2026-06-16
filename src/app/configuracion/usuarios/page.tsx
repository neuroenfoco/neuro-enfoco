import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import type { UserRole } from "@/lib/auth/auth-types";
import { getUsuariosInstitucionales } from "@/lib/usuarios/usuarios-view";

const ROLE_LABELS: Record<UserRole, string> = {
  administrador: GLOSSARY.roles.administrador,
  coordinador_pie: GLOSSARY.roles.coordinadorPie,
  educador_diferencial: GLOSSARY.roles.educadorDiferencial,
  psicologo: GLOSSARY.roles.psicologo,
  fonoaudiologo: GLOSSARY.roles.fonoaudiologo,
  terapeuta_ocupacional: GLOSSARY.roles.terapeutaOcupacional,
  docente: GLOSSARY.roles.docente,
};

export default function ConfiguracionUsuariosPage() {
  const usuarios = getUsuariosInstitucionales();
  const copy = GLOSSARY.configuracion;
  const usuariosCopy = GLOSSARY.usuarios;

  return (
    <AppShell activeNav="configuracion">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-6 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {copy.usuariosTitulo}
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
            {copy.usuariosSubtitulo}
          </p>
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
          {usuariosCopy.avisoSoloLectura}
        </div>

        <div className="overflow-hidden rounded-xl border border-teal-900/5 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {usuariosCopy.columnaNombre}
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {usuariosCopy.columnaRol}
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {usuariosCopy.columnaCorreo}
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {usuariosCopy.columnaEstado}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    {usuariosCopy.sinRegistros}
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-slate-900">
                      {usuario.nombre}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-600">
                      {ROLE_LABELS[usuario.rol]}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-600">
                      {usuario.email}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          usuario.estado === "activo"
                            ? "bg-teal-50 text-teal-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {usuario.estado === "activo"
                          ? usuariosCopy.estadoActivo
                          : usuariosCopy.estadoInactivo}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-500">
          {copy.avisoFuturo}
        </p>
      </main>
    </AppShell>
  );
}
