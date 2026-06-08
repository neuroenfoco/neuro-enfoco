import { getObjetivoPieAnalytics } from "@/lib/pie-analytics/endpoints";
import { isPieAnalyticsObjetivoInput } from "@/lib/pie-analytics/validators";
import { NextResponse } from "next/server";

/**
 * POST /api/analytics/objetivos
 * Body: PieAnalyticsObjetivoInput (snapshot desacoplado del storage)
 *
 * Stateless: permite reutilizar el motor desde IA, reportes o migración a backend.
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

  if (!isPieAnalyticsObjetivoInput(body)) {
    return NextResponse.json(
      { error: "PieAnalyticsObjetivoInput inválido." },
      { status: 400 }
    );
  }

  return NextResponse.json(getObjetivoPieAnalytics(body));
}
