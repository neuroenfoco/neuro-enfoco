import { getEstudiantePieAnalytics } from "@/lib/pie-analytics/endpoints";
import { isPieAnalyticsEstudianteInput } from "@/lib/pie-analytics/validators";
import { NextResponse } from "next/server";

/**
 * POST /api/analytics/estudiantes
 * Body: PieAnalyticsEstudianteInput
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

  if (!isPieAnalyticsEstudianteInput(body)) {
    return NextResponse.json(
      { error: "PieAnalyticsEstudianteInput inválido." },
      { status: 400 }
    );
  }

  return NextResponse.json(getEstudiantePieAnalytics(body));
}
