import { getIntervencionesAnalytics } from "@/lib/intervenciones-analytics/endpoints";
import { isIntervencionesAnalyticsInput } from "@/lib/intervenciones-analytics/validators";
import { NextResponse } from "next/server";

/**
 * POST /api/analytics/intervenciones
 * Body: IntervencionesAnalyticsInput (snapshot stateless)
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo JSON inválido." },
      { status: 400 }
    );
  }

  if (!isIntervencionesAnalyticsInput(body)) {
    return NextResponse.json(
      { error: "IntervencionesAnalyticsInput inválido." },
      { status: 400 }
    );
  }

  return NextResponse.json(getIntervencionesAnalytics(body));
}
