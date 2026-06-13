import { GLOSSARY } from "@/lib/copy/glossary";

export type AppNavId =
  | "dashboard"
  | "estudiantes"
  | "intervenciones"
  | "objetivos"
  | "reportes";

export const ROUTES = {
  dashboard: "/",
  estudiantes: "/estudiantes",
  intervenciones: "/intervenciones",
  intervencionesNueva: "/intervenciones/nueva",
  profesionales: "/profesionales",
  profesionalesNuevo: "/profesionales/nuevo",
  profesionalEditar: (id: string) => `/profesionales/${id}/editar`,
  objetivos: "/objetivos",
  evaluacionesNueva: "/evaluaciones/nueva",
  evaluacionCaptura: (id: string) => `/evaluaciones/${id}`,
  evaluacionPlanificar: (id: string) => `/evaluaciones/${id}/planificar`,
  paciNuevo: (estudianteId?: string) =>
    estudianteId
      ? `/paci/nuevo?estudianteId=${encodeURIComponent(estudianteId)}`
      : "/paci/nuevo",
  paciDetalle: (id: string) => `/paci/${id}`,
  estudiantePaciTab: (estudianteId: string) =>
    `/estudiantes/${estudianteId}?tab=paci`,
  reportes: "#",
} as const;

export type AppNavItem = {
  id: AppNavId;
  label: string;
  href: string;
  active: boolean;
};

export function getAppNavItems(activeId: AppNavId): AppNavItem[] {
  return [
    {
      id: "dashboard",
      label: GLOSSARY.nav.dashboard,
      href: ROUTES.dashboard,
      active: activeId === "dashboard",
    },
    {
      id: "estudiantes",
      label: GLOSSARY.nav.estudiantes,
      href: ROUTES.estudiantes,
      active: activeId === "estudiantes",
    },
    {
      id: "intervenciones",
      label: GLOSSARY.nav.intervenciones,
      href: ROUTES.intervenciones,
      active: activeId === "intervenciones",
    },
    {
      id: "objetivos",
      label: GLOSSARY.nav.objetivos,
      href: ROUTES.objetivos,
      active: activeId === "objetivos",
    },
    {
      id: "reportes",
      label: GLOSSARY.nav.reportes,
      href: ROUTES.reportes,
      active: activeId === "reportes",
    },
  ];
}
