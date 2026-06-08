import { redirect } from "next/navigation";

export default function NuevaSesionRedirectPage() {
  redirect("/intervenciones/nueva");
}
