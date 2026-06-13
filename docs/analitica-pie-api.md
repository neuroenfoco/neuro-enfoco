# Analítica pedagógica PIE — Documento técnico

Motor de análisis automático para Objetivos PIE de **Neuro Enfoco**.  
Estado actual: **sin IA** — expone métricas, indicadores y candidatos de conclusión (`templateId` + `variables`) listos para una capa de generación de texto futura.

**Ubicación del código:** `src/lib/pie-analytics/`  
**Rutas HTTP:** `src/app/api/analytics/`

---

## 1. Arquitectura

```
localStorage (objetivos, sesiones, apoyos)
        │
        ▼
buildPieAnalyticsObjetivoInput()     ← adaptador cliente
        │
        ▼
PieAnalyticsObjetivoInput  ──POST──►  /api/analytics/*
        │
        ▼
aggregateObjetivoAnalytics()  →  métricas + indicadores
        │
        ▼
buildInsightCandidates()    →  candidatos de conclusión
```

**Principio:** el motor es **stateless**. No lee `localStorage` directamente en las rutas API. El cliente (o un futuro backend) envía un snapshot JSON (`PieAnalyticsObjetivoInput`). Esto permite reutilizar el mismo motor desde UI, reportes, jobs batch o IA sin cambiar la lógica.

---

## 2. Endpoints HTTP

Todos los endpoints son **POST**, aceptan `Content-Type: application/json` y devuelven JSON.

### 2.1 `POST /api/analytics/objetivos`

Análisis completo de un objetivo PIE: métricas + insights.

| Campo | Valor |
|-------|-------|
| **Body** | `PieAnalyticsObjetivoInput` |
| **200** | `ObjetivoPIEAnalyticsResponse` |
| **400** | `{ "error": "..." }` |

### 2.2 `POST /api/analytics/estudiantes`

Análisis consolidado de todos los objetivos de un estudiante.

| Campo | Valor |
|-------|-------|
| **Body** | `PieAnalyticsEstudianteInput` |
| **200** | `EstudiantePIEAnalyticsResponse` |
| **400** | `{ "error": "..." }` |

### 2.3 `POST /api/analytics/insights`

Solo indicadores de disponibilidad y candidatos de conclusión (sin el bloque `analytics` completo).

| Campo | Valor |
|-------|-------|
| **Body** | `PieAnalyticsObjetivoInput` |
| **200** | `{ objetivoId, indicadores, insights }` |
| **400** | `{ "error": "..." }` |

### 2.4 Respuestas de error

```json
{ "error": "Cuerpo JSON inválido." }
```

```json
{ "error": "PieAnalyticsObjetivoInput inválido." }
```

```json
{ "error": "PieAnalyticsEstudianteInput inválido." }
```

---

## 3. Endpoints internos (cliente)

Funciones exportadas desde `src/lib/pie-analytics/endpoints.ts`. Misma lógica que las rutas HTTP, invocables directamente en el navegador.

| Función | Entrada | Salida |
|---------|---------|--------|
| `getObjetivoPieAnalytics(input)` | `PieAnalyticsObjetivoInput` | `ObjetivoPIEAnalyticsResponse` |
| `getEstudiantePieAnalytics(input)` | `PieAnalyticsEstudianteInput` | `EstudiantePIEAnalyticsResponse` |
| `getObjetivoPieAnalyticsFromStorage(objetivoId)` | `string` | `ObjetivoPIEAnalyticsResponse \| null` |
| `getEstudiantePieAnalyticsFromStorage(estudianteId)` | `string` | `EstudiantePIEAnalyticsResponse` |
| `getObjetivoPieAnalyticsMetricsOnly(input)` | `PieAnalyticsObjetivoInput` | `ObjetivoPIEAnalytics` (sin `insights`) |

Objeto agrupado:

```typescript
import { pieAnalyticsEndpoints } from "@/lib/pie-analytics";

pieAnalyticsEndpoints.objetivo(input);
pieAnalyticsEndpoints.estudiante(input);
pieAnalyticsEndpoints.objetivoFromStorage(objetivoId);
pieAnalyticsEndpoints.estudianteFromStorage(estudianteId);
pieAnalyticsEndpoints.metricsOnly(input);
```

**Adaptador de storage:**

```typescript
import { buildPieAnalyticsObjetivoInput } from "@/lib/pie-analytics";

const input = buildPieAnalyticsObjetivoInput(objetivoId);
```

---

## 4. Modelos de entrada

### 4.1 `PieAnalyticsEvidencia`

Evidencia derivada de una sesión vinculada a la dimensión del objetivo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `sesionId` | `string` | ID de la sesión |
| `fecha` | `string` | Fecha de la sesión (texto o ISO) |
| `estadoInicial` | `string` | Estado emocional al inicio |
| `estadoFinal` | `string` | Estado emocional al cierre |
| `impacto` | `number` | `estadoFinal − estadoInicial` (escala 1–5) |
| `fortalezas` | `string[]` | Fortalezas observadas en la sesión |
| `logro` | `string` | Logro registrado |

**Estados emocionales válidos y su valor numérico:**

| Label | Valor |
|-------|-------|
| Muy alterada | 1 |
| Alterada | 2 |
| Neutral | 3 |
| Regulada | 4 |
| Muy regulada | 5 |

### 4.2 `PieAnalyticsApoyo`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `apoyoId` | `string` | ID del apoyo |
| `nombre` | `string` | Nombre del apoyo |
| `descripcion` | `string` | Descripción pedagógica |
| `fechaInicio` | `string` | Inicio de implementación (ISO) |
| `fechaTermino` | `string?` | Fin opcional (ISO) |
| `activo` | `boolean` | Sin término o término ≥ hoy |
| `duracionDias` | `number \| null` | Días entre inicio y término (o hoy) |

### 4.3 `PieAnalyticsObjetivoInput`

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `objetivoId` | `string` | Sí |
| `estudianteId` | `string` | Sí |
| `nombre` | `string` | Sí |
| `dimensionRelacionada` | `string` | Sí |
| `lineaBase` | `string` | No |
| `fechaLineaBase` | `string` | No |
| `metaLogro` | `string` | No |
| `barreraDetectada` | `string` | No |
| `evidencias` | `PieAnalyticsEvidencia[]` | Sí |
| `apoyos` | `PieAnalyticsApoyo[]` | Sí |

### 4.4 `PieAnalyticsEstudianteInput`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `estudianteId` | `string` | ID del estudiante |
| `objetivos` | `PieAnalyticsObjetivoInput[]` | Lista de objetivos con sus evidencias y apoyos |

---

## 5. Modelos de salida

### 5.1 `ObjetivoPIEAnalytics`

Paquete principal de métricas por objetivo.

| Sección | Tipo | Contenido |
|---------|------|-----------|
| Identificación | campos escalares | `objetivoId`, `estudianteId`, `nombre`, `dimensionRelacionada`, `generadoEn` |
| `alcance` | `AlcanceAnalitico` | Totales y cobertura temporal |
| `lineaBase` | `ContextoLineaBase` | Descripción y fecha de línea base |
| `metaLogro` | `string \| null` | Meta observable |
| `barreraDetectada` | `string \| null` | Barrera registrada |
| `fortalezas` | `MetricasFortalezas` | Frecuencia y correlación con impacto |
| `estados` | `EvolucionEstados` | Evolución emocional |
| `impacto` | `MetricasImpacto` | Estadísticas y tendencias temporales |
| `apoyos` | `MetricasApoyos` | Efectividad por apoyo y categoría |
| `indicadores` | `IndicadorAnalitico[]` | Señales de datos suficientes |

### 5.2 `EstudiantePIEAnalytics`

| Sección | Descripción |
|---------|-------------|
| `objetivos` | Array de `ObjetivoPIEAnalytics` (uno por objetivo) |
| `consolidado.impactoPromedioGlobal` | Promedio de impactos promedio por objetivo |
| `consolidado.fortalezasTransversales` | Top 5 fortalezas sumando todos los objetivos |
| `consolidado.categoriaApoyoMasEfectiva` | Categoría de apoyo con mejor impacto agregado |
| `consolidado.objetivosConMejoraSostenida` | Objetivos con `mejoraSostenida === true` en ventana de 8 semanas |

### 5.3 `InsightCandidate`

Candidato para conclusión automática futura. **No incluye texto natural.**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `templateId` | `InsightTemplateId` | Plantilla a renderizar |
| `listo` | `boolean` | Si hay datos suficientes para emitir la conclusión |
| `confianza` | `"baja" \| "media" \| "alta"` | Nivel de confianza estadística |
| `variables` | `Record<string, string \| number>` | Variables para la plantilla |

**Plantillas disponibles (`InsightTemplateId`):**

| ID | Conclusión futura orientativa |
|----|-------------------------------|
| `apoyo_mayor_avance` | *"El estudiante muestra mayores avances cuando utiliza apoyos visuales."* |
| `fortalezas_asociadas_progreso` | *"Las fortalezas más asociadas al progreso son perseverancia y autonomía."* |
| `mejora_sostenida_temporal` | *"Las evidencias muestran mejora sostenida durante las últimas 8 semanas."* |
| `evolucion_estados_positiva` | *"Los estados finales promedian mejor que los estados iniciales en el seguimiento."* |

---

## 6. Métricas calculadas

### 6.1 Alcance (`AlcanceAnalitico`)

| Métrica | Cálculo |
|---------|---------|
| `totalEvidencias` | Cantidad de evidencias en el input |
| `totalApoyos` | Cantidad de apoyos registrados |
| `apoyosActivos` | Apoyos con `activo === true` |
| `semanasConEvidencia` | Semanas distintas con al menos una evidencia |
| `diasSeguimiento` | Días entre primera y última evidencia (`null` si < 2 fechas válidas) |

### 6.2 Fortalezas (`MetricasFortalezas`)

| Métrica | Cálculo |
|---------|---------|
| `frecuencia` | Veces que aparece la fortaleza en evidencias |
| `impactoPromedioAsociado` | Promedio de `impacto` en sesiones donde aparece |
| `deltaImpacto` | `impactoPromedioAsociado − impactoPromedioGlobal` |
| `pesoAsociacion` | `frecuenciaNormalizada × 0.4 + impactoNormalizado × 0.6` (0–1) |
| `masFrecuentes` | Top 5 por frecuencia |
| `asociadasAProgreso` | Fortalezas con ≥ 2 sesiones y `deltaImpacto > 0`, ordenadas por `pesoAsociacion` |

**Umbral mínimo:** `ANALYTICS_MIN_EVIDENCIAS_FORTALEZA = 2`

### 6.3 Estados emocionales (`EvolucionEstados`)

| Métrica | Cálculo |
|---------|---------|
| `estadoInicialPromedio` | Promedio del valor numérico de estados iniciales |
| `estadoFinalPromedio` | Promedio del valor numérico de estados finales |
| `deltaEmocionalPromedio` | Promedio de `impacto` por sesión |
| `primeraEvidencia` | Primera evidencia cronológica con resumen de estados |
| `ultimaEvidencia` | Última evidencia cronológica |

**Umbral mínimo:** `ANALYTICS_MIN_EVIDENCIAS_ESTADOS = 2`

### 6.4 Impacto (`MetricasImpacto`)

| Métrica | Cálculo |
|---------|---------|
| `promedio` | Media aritmética de impactos |
| `mediana` | Mediana de impactos |
| `minimo` / `maximo` | Valores extremos |
| `tendencia8Semanas` | Ver § 6.5 con ventana = 8 |
| `tendencia4Semanas` | Ver § 6.5 con ventana = 4 |

### 6.5 Tendencia temporal (`TendenciaImpacto`)

Ventana móvil respecto a la fecha de referencia (`generadoEn` o `new Date()`).

| Métrica | Cálculo |
|---------|---------|
| `impactoPromedioVentana` | Promedio de impactos en las últimas N semanas |
| `impactoPromedioPrevio` | Promedio de impactos anteriores a la ventana |
| `delta` | `impactoPromedioVentana − impactoPromedioPrevio` |
| `sesionesEnVentana` | Evidencias dentro de la ventana |
| `sesionesPrevias` | Evidencias anteriores a la ventana |
| `mejoraSostenida` | `sesionesEnVentana ≥ 3` AND `impactoPromedioVentana > 0` AND (`delta ≥ 0` o sin período previo) |
| `direccion` | `ascendente` (delta > 0.2), `descendente` (delta < −0.2), `estable`, o `insuficiente` (< 3 sesiones) |

**Umbrales:** `ANALYTICS_MIN_EVIDENCIAS_TENDENCIA = 3`, ventanas de 4 y 8 semanas.

### 6.6 Apoyos (`MetricasApoyos`)

| Métrica | Cálculo |
|---------|---------|
| `categoria` | Inferida por palabras clave en nombre + descripción |
| `evidenciasDuranteApoyo` | Evidencias cuya fecha cae entre `fechaInicio` y `fechaTermino` (o hoy si activo) |
| `impactoPromedioDuranteApoyo` | Promedio de impacto de esas evidencias |
| `deltaImpactoVsGlobal` | `impactoPromedioDuranteApoyo − impactoPromedioGlobal` |
| `rankingPorImpacto` | Apoyos con ≥ 2 evidencias durante vigencia, ordenados por impacto |
| `resumenPorCategoria` | Agregación por categoría de apoyo |
| `categoriaMasEfectiva` | Categoría con mayor impacto promedio |

**Categorías de apoyo (`CategoriaApoyo`):**

| Categoría | Ejemplos de keywords |
|-----------|---------------------|
| `visual` | agenda visual, pictograma, imagen, cartel |
| `temporal` | temporizador, cronómetro, horario |
| `espacial` | espacio de regulación, rincón, sala sensorial |
| `social` | compañero tutor, pareja, apoyo entre pares |
| `narrativo` | historias sociales, cuento, narrativa |
| `otro` | Sin coincidencia |

**Umbral mínimo:** `ANALYTICS_MIN_EVIDENCIAS_APOYO = 2`

### 6.7 Indicadores analíticos (`IndicadorAnalitico`)

| Tipo | `listo` cuando |
|------|----------------|
| `apoyo_efectividad` | Hay ranking de apoyos y al menos 1 apoyo registrado |
| `fortaleza_progreso` | Hay fortalezas con `deltaImpacto > 0` |
| `mejora_sostenida` | `tendencia8Semanas.mejoraSostenida === true` |
| `evolucion_estados` | ≥ 2 evidencias y delta emocional calculable |
| `linea_base_comparativa` | Línea base declarada y ≥ 2 evidencias |

**Confianza:** `baja` (< mínimo), `media` (≥ mínimo), `alta` (≥ 2× mínimo).

---

## 7. Ejemplo de request — objetivo

Escenario: objetivo de regulación emocional con agenda visual y pictogramas, 5 sesiones en 10 semanas.

```json
{
  "objetivoId": "obj-7f3a-9c21-b4e8-4d1f6a0b2c39",
  "estudianteId": "est-martina-001",
  "nombre": "Regular respuesta ante transiciones de rutina",
  "dimensionRelacionada": "Regulación emocional",
  "lineaBase": "Ante cambios de actividad presenta llanto y se aleja del grupo durante 5–8 minutos.",
  "fechaLineaBase": "2026-01-15T12:00:00.000Z",
  "metaLogro": "Anticipar transiciones con apoyo visual y permanecer en el espacio grupal al menos 4 de 5 veces.",
  "barreraDetectada": "Dificultad para anticipar cambios de rutina sin mediación adulta.",
  "evidencias": [
    {
      "sesionId": "ses-001",
      "fecha": "15 ene 2026",
      "estadoInicial": "Alterada",
      "estadoFinal": "Neutral",
      "impacto": 1,
      "fortalezas": ["Perseverancia"],
      "logro": "Utilizó la agenda visual con apoyo del educador."
    },
    {
      "sesionId": "ses-002",
      "fecha": "29 ene 2026",
      "estadoInicial": "Alterada",
      "estadoFinal": "Regulada",
      "impacto": 2,
      "fortalezas": ["Perseverancia", "Autonomía"],
      "logro": "Anticipó el cambio mirando la agenda sin recordatorio verbal."
    },
    {
      "sesionId": "ses-003",
      "fecha": "12 feb 2026",
      "estadoInicial": "Neutral",
      "estadoFinal": "Regulada",
      "impacto": 1,
      "fortalezas": ["Autonomía"],
      "logro": "Transición a lenguaje con pictogramas sin abandono del grupo."
    },
    {
      "sesionId": "ses-004",
      "fecha": "26 feb 2026",
      "estadoInicial": "Neutral",
      "estadoFinal": "Regulada",
      "impacto": 1,
      "fortalezas": ["Perseverancia", "Autonomía"],
      "logro": "Completó la transición con temporizador visual."
    },
    {
      "sesionId": "ses-005",
      "fecha": "12 mar 2026",
      "estadoInicial": "Regulada",
      "estadoFinal": "Muy regulada",
      "impacto": 1,
      "fortalezas": ["Autonomía", "Colaboración"],
      "logro": "Gestionó el cambio de taller de forma autónoma."
    }
  ],
  "apoyos": [
    {
      "apoyoId": "apo-001",
      "nombre": "Agenda visual",
      "descripcion": "Secuencia pictográfica de actividades diarias en el pupitre.",
      "fechaInicio": "2026-01-10T12:00:00.000Z",
      "activo": true,
      "duracionDias": 61
    },
    {
      "apoyoId": "apo-002",
      "nombre": "Pictogramas",
      "descripcion": "Tarjetas ARASAAC para anticipar cambios de espacio.",
      "fechaInicio": "2026-02-01T12:00:00.000Z",
      "activo": true,
      "duracionDias": 39
    },
    {
      "apoyoId": "apo-003",
      "nombre": "Temporizador visual",
      "descripcion": "Time Timer para transiciones de 3 minutos.",
      "fechaInicio": "2026-02-20T12:00:00.000Z",
      "activo": true,
      "duracionDias": 20
    }
  ]
}
```

---

## 8. Ejemplo de response — `POST /api/analytics/objetivos`

```json
{
  "analytics": {
    "objetivoId": "obj-7f3a-9c21-b4e8-4d1f6a0b2c39",
    "estudianteId": "est-martina-001",
    "nombre": "Regular respuesta ante transiciones de rutina",
    "dimensionRelacionada": "Regulación emocional",
    "generadoEn": "2026-06-03T14:30:00.000Z",
    "alcance": {
      "totalEvidencias": 5,
      "totalApoyos": 3,
      "apoyosActivos": 3,
      "semanasConEvidencia": 5,
      "diasSeguimiento": 56
    },
    "lineaBase": {
      "descripcion": "Ante cambios de actividad presenta llanto y se aleja del grupo durante 5–8 minutos.",
      "fecha": "2026-01-15T12:00:00.000Z"
    },
    "metaLogro": "Anticipar transiciones con apoyo visual y permanecer en el espacio grupal al menos 4 de 5 veces.",
    "barreraDetectada": "Dificultad para anticipar cambios de rutina sin mediación adulta.",
    "fortalezas": {
      "masFrecuentes": [
        {
          "nombre": "Perseverancia",
          "frecuencia": 3,
          "impactoPromedioAsociado": 1.3,
          "sesionesConFortaleza": 3,
          "deltaImpacto": 0.1,
          "pesoAsociacion": 0.26
        },
        {
          "nombre": "Autonomía",
          "frecuencia": 3,
          "impactoPromedioAsociado": 1.3,
          "sesionesConFortaleza": 3,
          "deltaImpacto": 0.1,
          "pesoAsociacion": 0.26
        },
        {
          "nombre": "Colaboración",
          "frecuencia": 1,
          "impactoPromedioAsociado": 1,
          "sesionesConFortaleza": 1,
          "deltaImpacto": -0.2,
          "pesoAsociacion": 0.05
        }
      ],
      "asociadasAProgreso": [
        {
          "nombre": "Perseverancia",
          "frecuencia": 3,
          "impactoPromedioAsociado": 1.3,
          "sesionesConFortaleza": 3,
          "deltaImpacto": 0.1,
          "pesoAsociacion": 0.26
        },
        {
          "nombre": "Autonomía",
          "frecuencia": 3,
          "impactoPromedioAsociado": 1.3,
          "sesionesConFortaleza": 3,
          "deltaImpacto": 0.1,
          "pesoAsociacion": 0.26
        }
      ]
    },
    "estados": {
      "estadoInicialPromedio": 2.8,
      "estadoFinalPromedio": 4,
      "deltaEmocionalPromedio": 1.2,
      "primeraEvidencia": {
        "sesionId": "ses-001",
        "fecha": "15 ene 2026",
        "estadoInicial": { "label": "Alterada", "valor": 2 },
        "estadoFinal": { "label": "Neutral", "valor": 3 },
        "impacto": 1
      },
      "ultimaEvidencia": {
        "sesionId": "ses-005",
        "fecha": "12 mar 2026",
        "estadoInicial": { "label": "Regulada", "valor": 4 },
        "estadoFinal": { "label": "Muy regulada", "valor": 5 },
        "impacto": 1
      }
    },
    "impacto": {
      "promedio": 1.2,
      "mediana": 1,
      "minimo": 1,
      "maximo": 2,
      "tendencia8Semanas": {
        "ventanaSemanas": 8,
        "impactoPromedioVentana": 1.2,
        "impactoPromedioPrevio": null,
        "delta": 1.2,
        "sesionesEnVentana": 5,
        "sesionesPrevias": 0,
        "mejoraSostenida": true,
        "direccion": "ascendente"
      },
      "tendencia4Semanas": {
        "ventanaSemanas": 4,
        "impactoPromedioVentana": 1,
        "impactoPromedioPrevio": 1.5,
        "delta": -0.5,
        "sesionesEnVentana": 2,
        "sesionesPrevias": 3,
        "mejoraSostenida": false,
        "direccion": "insuficiente"
      }
    },
    "apoyos": {
      "items": [
        {
          "apoyoId": "apo-001",
          "nombre": "Agenda visual",
          "descripcion": "Secuencia pictográfica de actividades diarias en el pupitre.",
          "fechaInicio": "2026-01-10T12:00:00.000Z",
          "activo": true,
          "duracionDias": 61,
          "categoria": "visual",
          "evidenciasDuranteApoyo": 5,
          "impactoPromedioDuranteApoyo": 1.2,
          "deltaImpactoVsGlobal": 0
        },
        {
          "apoyoId": "apo-002",
          "nombre": "Pictogramas",
          "descripcion": "Tarjetas ARASAAC para anticipar cambios de espacio.",
          "fechaInicio": "2026-02-01T12:00:00.000Z",
          "activo": true,
          "duracionDias": 39,
          "categoria": "visual",
          "evidenciasDuranteApoyo": 3,
          "impactoPromedioDuranteApoyo": 1,
          "deltaImpactoVsGlobal": -0.2
        },
        {
          "apoyoId": "apo-003",
          "nombre": "Temporizador visual",
          "descripcion": "Time Timer para transiciones de 3 minutos.",
          "fechaInicio": "2026-02-20T12:00:00.000Z",
          "activo": true,
          "duracionDias": 20,
          "categoria": "visual",
          "evidenciasDuranteApoyo": 2,
          "impactoPromedioDuranteApoyo": 1,
          "deltaImpactoVsGlobal": -0.2
        }
      ],
      "rankingPorImpacto": [
        {
          "apoyoId": "apo-001",
          "nombre": "Agenda visual",
          "categoria": "visual",
          "impactoPromedio": 1.2,
          "evidencias": 5,
          "deltaImpactoVsGlobal": 0
        },
        {
          "apoyoId": "apo-002",
          "nombre": "Pictogramas",
          "categoria": "visual",
          "impactoPromedio": 1,
          "evidencias": 3,
          "deltaImpactoVsGlobal": -0.2
        },
        {
          "apoyoId": "apo-003",
          "nombre": "Temporizador visual",
          "categoria": "visual",
          "impactoPromedio": 1,
          "evidencias": 2,
          "deltaImpactoVsGlobal": -0.2
        }
      ],
      "resumenPorCategoria": [
        {
          "categoria": "visual",
          "impactoPromedio": 1.07,
          "evidencias": 10,
          "apoyosDistintos": 3
        }
      ],
      "categoriaMasEfectiva": "visual"
    },
    "indicadores": [
      {
        "tipo": "apoyo_efectividad",
        "listo": true,
        "confianza": "alta",
        "datosMinimos": 2,
        "datosActuales": 5,
        "descripcion": "Permite comparar impacto promedio por apoyo y categoría de apoyo."
      },
      {
        "tipo": "fortaleza_progreso",
        "listo": true,
        "confianza": "media",
        "datosMinimos": 2,
        "datosActuales": 3,
        "descripcion": "Permite identificar fortalezas con mayor delta de impacto respecto al promedio."
      },
      {
        "tipo": "mejora_sostenida",
        "listo": true,
        "confianza": "alta",
        "datosMinimos": 3,
        "datosActuales": 5,
        "descripcion": "Evalúa tendencia de impacto en ventana de 8 semanas."
      },
      {
        "tipo": "evolucion_estados",
        "listo": true,
        "confianza": "alta",
        "datosMinimos": 2,
        "datosActuales": 5,
        "descripcion": "Compara estados iniciales y finales promedio a lo largo del seguimiento."
      },
      {
        "tipo": "linea_base_comparativa",
        "listo": true,
        "confianza": "alta",
        "datosMinimos": 2,
        "datosActuales": 5,
        "descripcion": "Prepara comparación entre línea base declarada y evidencias registradas."
      }
    ]
  },
  "insights": [
    {
      "templateId": "apoyo_mayor_avance",
      "listo": false,
      "confianza": "alta",
      "variables": {
        "categoriaApoyo": "apoyos visuales",
        "impactoPromedio": 1.07,
        "evidencias": 10,
        "apoyosDistintos": 3
      }
    },
    {
      "templateId": "fortalezas_asociadas_progreso",
      "listo": true,
      "confianza": "media",
      "variables": {
        "fortalezas": "perseverancia y autonomía",
        "cantidadFortalezas": 2,
        "impactoDeltaTop": 0.1
      }
    },
    {
      "templateId": "mejora_sostenida_temporal",
      "listo": true,
      "confianza": "alta",
      "variables": {
        "ventanaSemanas": 8,
        "sesionesEnVentana": 5,
        "impactoPromedioVentana": 1.2,
        "deltaImpacto": 1.2,
        "direccion": "ascendente"
      }
    },
    {
      "templateId": "evolucion_estados_positiva",
      "listo": true,
      "confianza": "alta",
      "variables": {
        "estadoInicialPromedio": 2.8,
        "estadoFinalPromedio": 4,
        "deltaEmocional": 1.2,
        "totalEvidencias": 5
      }
    }
  ]
}
```

> **Nota:** Los valores numéricos del ejemplo son representativos del escenario descrito. Los valores exactos dependen de la fecha de referencia al momento de ejecutar el análisis.

**Conclusión futura derivada del insight `fortalezas_asociadas_progreso`:**  
*"Las fortalezas más asociadas al progreso son perseverancia y autonomía."*

**Conclusión futura derivada del insight `mejora_sostenida_temporal`:**  
*"Las evidencias muestran mejora sostenida durante las últimas 8 semanas."*

---

## 9. Ejemplo de response — `POST /api/analytics/insights`

Mismo body que § 7. Respuesta reducida:

```json
{
  "objetivoId": "obj-7f3a-9c21-b4e8-4d1f6a0b2c39",
  "indicadores": [
    {
      "tipo": "apoyo_efectividad",
      "listo": true,
      "confianza": "alta",
      "datosMinimos": 2,
      "datosActuales": 5,
      "descripcion": "Permite comparar impacto promedio por apoyo y categoría de apoyo."
    },
    {
      "tipo": "fortaleza_progreso",
      "listo": true,
      "confianza": "media",
      "datosMinimos": 2,
      "datosActuales": 3,
      "descripcion": "Permite identificar fortalezas con mayor delta de impacto respecto al promedio."
    },
    {
      "tipo": "mejora_sostenida",
      "listo": true,
      "confianza": "alta",
      "datosMinimos": 3,
      "datosActuales": 5,
      "descripcion": "Evalúa tendencia de impacto en ventana de 8 semanas."
    },
    {
      "tipo": "evolucion_estados",
      "listo": true,
      "confianza": "alta",
      "datosMinimos": 2,
      "datosActuales": 5,
      "descripcion": "Compara estados iniciales y finales promedio a lo largo del seguimiento."
    },
    {
      "tipo": "linea_base_comparativa",
      "listo": true,
      "confianza": "alta",
      "datosMinimos": 2,
      "datosActuales": 5,
      "descripcion": "Prepara comparación entre línea base declarada y evidencias registradas."
    }
  ],
  "insights": [
    {
      "templateId": "apoyo_mayor_avance",
      "listo": true,
      "confianza": "alta",
      "variables": {
        "apoyoNombre": "Agenda visual",
        "categoriaApoyo": "apoyos visuales",
        "impactoPromedio": 1.2,
        "evidencias": 5,
        "deltaImpacto": 0.3
      }
    },
    {
      "templateId": "fortalezas_asociadas_progreso",
      "listo": true,
      "confianza": "media",
      "variables": {
        "fortalezas": "perseverancia y autonomía",
        "cantidadFortalezas": 2,
        "impactoDeltaTop": 0.1
      }
    },
    {
      "templateId": "mejora_sostenida_temporal",
      "listo": true,
      "confianza": "alta",
      "variables": {
        "ventanaSemanas": 8,
        "sesionesEnVentana": 5,
        "impactoPromedioVentana": 1.2,
        "deltaImpacto": 1.2,
        "direccion": "ascendente"
      }
    },
    {
      "templateId": "evolucion_estados_positiva",
      "listo": true,
      "confianza": "alta",
      "variables": {
        "estadoInicialPromedio": 2.8,
        "estadoFinalPromedio": 4,
        "deltaEmocional": 1.2,
        "totalEvidencias": 5
      }
    }
  ]
}
```

> En este ejemplo alternativo, `apoyo_mayor_avance` tiene `listo: true` porque el apoyo individual supera el impacto global (`deltaImpacto > 0`).

**Conclusión futura derivada:**  
*"El estudiante muestra mayores avances cuando utiliza apoyos visuales."*

---

## 10. Ejemplo de request — estudiante

```json
{
  "estudianteId": "est-martina-001",
  "objetivos": [
    {
      "objetivoId": "obj-7f3a-9c21-b4e8-4d1f6a0b2c39",
      "estudianteId": "est-martina-001",
      "nombre": "Regular respuesta ante transiciones de rutina",
      "dimensionRelacionada": "Regulación emocional",
      "evidencias": [],
      "apoyos": []
    },
    {
      "objetivoId": "obj-2b8c-1a40-e6f9-7c3d5b8a1e22",
      "estudianteId": "est-martina-001",
      "nombre": "Participar en actividades grupales",
      "dimensionRelacionada": "Interacción social",
      "evidencias": [
        {
          "sesionId": "ses-010",
          "fecha": "5 mar 2026",
          "estadoInicial": "Neutral",
          "estadoFinal": "Regulada",
          "impacto": 1,
          "fortalezas": ["Colaboración"],
          "logro": "Participó en juego cooperativo con un par."
        }
      ],
      "apoyos": [
        {
          "apoyoId": "apo-010",
          "nombre": "Compañero tutor",
          "descripcion": "Estudiante de 6° básico acompaña en recreo.",
          "fechaInicio": "2026-02-15T12:00:00.000Z",
          "activo": true,
          "duracionDias": 17
        }
      ]
    }
  ]
}
```

---

## 11. Ejemplo de response — `POST /api/analytics/estudiantes`

```json
{
  "analytics": {
    "estudianteId": "est-martina-001",
    "generadoEn": "2026-06-03T14:30:00.000Z",
    "totalObjetivos": 2,
    "objetivos": [
      {
        "objetivoId": "obj-7f3a-9c21-b4e8-4d1f6a0b2c39",
        "estudianteId": "est-martina-001",
        "nombre": "Regular respuesta ante transiciones de rutina",
        "dimensionRelacionada": "Regulación emocional",
        "generadoEn": "2026-06-03T14:30:00.000Z",
        "alcance": {
          "totalEvidencias": 0,
          "totalApoyos": 0,
          "apoyosActivos": 0,
          "semanasConEvidencia": 0,
          "diasSeguimiento": null
        },
        "lineaBase": { "descripcion": null, "fecha": null },
        "metaLogro": null,
        "barreraDetectada": null,
        "fortalezas": { "masFrecuentes": [], "asociadasAProgreso": [] },
        "estados": {
          "estadoInicialPromedio": null,
          "estadoFinalPromedio": null,
          "deltaEmocionalPromedio": null,
          "primeraEvidencia": null,
          "ultimaEvidencia": null
        },
        "impacto": {
          "promedio": null,
          "mediana": null,
          "minimo": null,
          "maximo": null,
          "tendencia8Semanas": {
            "ventanaSemanas": 8,
            "impactoPromedioVentana": null,
            "impactoPromedioPrevio": null,
            "delta": null,
            "sesionesEnVentana": 0,
            "sesionesPrevias": 0,
            "mejoraSostenida": false,
            "direccion": "insuficiente"
          },
          "tendencia4Semanas": {
            "ventanaSemanas": 4,
            "impactoPromedioVentana": null,
            "impactoPromedioPrevio": null,
            "delta": null,
            "sesionesEnVentana": 0,
            "sesionesPrevias": 0,
            "mejoraSostenida": false,
            "direccion": "insuficiente"
          }
        },
        "apoyos": {
          "items": [],
          "rankingPorImpacto": [],
          "resumenPorCategoria": [],
          "categoriaMasEfectiva": null
        },
        "indicadores": []
      }
    ],
    "consolidado": {
      "impactoPromedioGlobal": 1.1,
      "fortalezasTransversales": [
        {
          "nombre": "Perseverancia",
          "frecuencia": 3,
          "impactoPromedioAsociado": null,
          "sesionesConFortaleza": 3,
          "deltaImpacto": 0.1,
          "pesoAsociacion": 3
        },
        {
          "nombre": "Autonomía",
          "frecuencia": 3,
          "impactoPromedioAsociado": null,
          "sesionesConFortaleza": 3,
          "deltaImpacto": 0.1,
          "pesoAsociacion": 3
        }
      ],
      "categoriaApoyoMasEfectiva": "visual",
      "objetivosConMejoraSostenida": 1
    }
  },
  "insights": [
    {
      "templateId": "fortalezas_asociadas_progreso",
      "listo": true,
      "confianza": "media",
      "variables": {
        "fortalezas": "perseverancia y autonomía",
        "cantidadFortalezas": 2,
        "impactoDeltaTop": 0.1
      }
    },
    {
      "templateId": "mejora_sostenida_temporal",
      "listo": true,
      "confianza": "alta",
      "variables": {
        "ventanaSemanas": 8,
        "sesionesEnVentana": 5,
        "impactoPromedioVentana": 1.2,
        "deltaImpacto": 1.2,
        "direccion": "ascendente"
      }
    },
    {
      "templateId": "apoyo_mayor_avance",
      "listo": true,
      "confianza": "media",
      "variables": {
        "categoriaApoyo": "apoyos visuales",
        "alcance": "estudiante",
        "totalObjetivos": 2
      }
    }
  ]
}
```

> Los `insights` a nivel estudiante incluyen solo candidatos con `listo: true` de cada objetivo, más un insight consolidado de categoría de apoyo si aplica.

---

## 12. Ejemplo — objetivo sin datos suficientes

Request con 1 evidencia y sin apoyos:

```json
{
  "objetivoId": "obj-nuevo",
  "estudianteId": "est-001",
  "nombre": "Objetivo recién creado",
  "dimensionRelacionada": "Comunicación",
  "evidencias": [
    {
      "sesionId": "ses-100",
      "fecha": "1 jun 2026",
      "estadoInicial": "Neutral",
      "estadoFinal": "Regulada",
      "impacto": 1,
      "fortalezas": ["Creatividad"],
      "logro": "Primera observación registrada."
    }
  ],
  "apoyos": []
}
```

Response parcial (`insights`):

```json
{
  "insights": [
    {
      "templateId": "apoyo_mayor_avance",
      "listo": false,
      "confianza": "baja",
      "variables": {
        "evidenciasRequeridas": 2,
        "evidenciasActuales": 0
      }
    },
    {
      "templateId": "fortalezas_asociadas_progreso",
      "listo": false,
      "confianza": "baja",
      "variables": {
        "fortalezas": "",
        "cantidadFortalezas": 0,
        "impactoDeltaTop": 0
      }
    },
    {
      "templateId": "mejora_sostenida_temporal",
      "listo": false,
      "confianza": "baja",
      "variables": {
        "ventanaSemanas": 8,
        "sesionesEnVentana": 1,
        "impactoPromedioVentana": 1,
        "deltaImpacto": 1,
        "direccion": "insuficiente"
      }
    },
    {
      "templateId": "evolucion_estados_positiva",
      "listo": false,
      "confianza": "baja",
      "variables": {
        "estadoInicialPromedio": 3,
        "estadoFinalPromedio": 4,
        "deltaEmocional": 1,
        "totalEvidencias": 1
      }
    }
  ]
}
```

---

## 13. Uso desde el cliente

```typescript
import {
  buildPieAnalyticsObjetivoInput,
  getObjetivoPieAnalytics,
  getObjetivoPieAnalyticsFromStorage,
} from "@/lib/pie-analytics";

// Opción A: directo desde storage
const resultado = getObjetivoPieAnalyticsFromStorage(objetivoId);

// Opción B: snapshot manual + motor
const input = buildPieAnalyticsObjetivoInput(objetivoId);
if (input) {
  const { analytics, insights } = getObjetivoPieAnalytics(input);
}

// Opción C: vía API (útil para IA server-side)
const response = await fetch("/api/analytics/objetivos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input),
});
const data = await response.json();
```

---

## 14. Extensión futura (IA)

La capa de IA deberá:

1. Filtrar `insights` donde `listo === true` y `confianza !== "baja"`.
2. Mapear `templateId` → plantilla de texto en español.
3. Interpolar `variables` en la plantilla.
4. Opcionalmente enriquecer con `analytics` completo para conclusiones compuestas.

El motor actual **no genera texto**; solo garantiza datos estructurados, umbrales y señales de confianza reproducibles.

---

## 15. Referencia de archivos

| Archivo | Rol |
|---------|-----|
| `src/lib/pie-analytics/types.ts` | Modelos TypeScript |
| `src/lib/pie-analytics/constants.ts` | Umbrales y ventanas |
| `src/lib/pie-analytics/aggregator.ts` | Orquestación |
| `src/lib/pie-analytics/metrics/*.ts` | Cálculo por dominio |
| `src/lib/pie-analytics/indicators.ts` | Indicadores de disponibilidad |
| `src/lib/pie-analytics/insights.ts` | Candidatos de conclusión |
| `src/lib/pie-analytics/endpoints.ts` | API interna cliente |
| `src/lib/pie-analytics/data-source.ts` | Adaptador localStorage |
| `src/lib/pie-analytics/validators.ts` | Validación de input API |
| `src/app/api/analytics/objetivos/route.ts` | HTTP objetivo |
| `src/app/api/analytics/estudiantes/route.ts` | HTTP estudiante |
| `src/app/api/analytics/insights/route.ts` | HTTP insights |
