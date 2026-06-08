import { aggregateObjetivoAnalytics } from "@/lib/pie-analytics/aggregator";
import { buildInsightCandidates } from "@/lib/pie-analytics/insights";
import { isPieAnalyticsObjetivoInput } from "@/lib/pie-analytics/validators";
import { NextResponse } from "next/server";

/**
 * POST /api/analytics/insights
 * Body: PieAnalyticsObjetivoInput
 *
 * Devuelve solo candidatos de conclusión (sin texto natural).
 * La capa de IA futura consumirá templateId + variables.
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

  const analytics = aggregateObjetivoAnalytics(body);

  return NextResponse.json({
    objetivoId: analytics.objetivoId,
    indicadores: analytics.indicadores,
    insights: buildInsightCandidates(analytics),
  });
}
