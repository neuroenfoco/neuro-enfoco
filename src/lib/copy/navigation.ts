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
  objetivos: "/objetivos",
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
