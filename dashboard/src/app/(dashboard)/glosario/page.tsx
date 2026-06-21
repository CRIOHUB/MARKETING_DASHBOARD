import { GlassCard } from '@/components/ui/glass-card'

const GLOSARIO = [
  { term: 'UCU', def: 'Ultrasonido Cervical Uterino. Servicio insignia de CrioCord.' },
  { term: 'ADN', def: 'Prueba de filiación genética. Servicio de alta rentabilidad.' },
  { term: 'Tamizaje', def: 'Cribado neonatal para detección temprana de enfermedades metabólicas.' },
  { term: 'MyPrenatal', def: 'Servicio de cuidado prenatal integral.' },
  { term: 'Seguridad Total', def: 'Paquete combinado de servicios de salud materno-fetal.' },
  { term: 'CR1', def: 'Tasa de conversión Lead → Válido (primer filtro).' },
  { term: 'CR2', def: 'Tasa de conversión Válido → Prospecto calificado.' },
  { term: 'CR3', def: 'Tasa de conversión Lead → Cliente (conversión final).' },
  { term: 'CPL', def: 'Costo por Lead — inversión publicitaria dividida entre leads generados.' },
  { term: 'CPA', def: 'Costo por Adquisición — inversión total dividida entre clientes captados.' },
  { term: 'ROAS', def: 'Return On Ad Spend — venta generada por cada sol de inversión publicitaria.' },
  { term: 'ROI', def: 'Retorno sobre la inversión total de marketing.' },
  { term: 'CAC', def: 'Customer Acquisition Cost — igual al CPA pero incluyendo todos los costos operativos.' },
  { term: 'VM', def: 'Visita Médica — canal de captación presencial en clínicas y hospitales.' },
  { term: 'MKT Dig.', def: 'Marketing Digital — canales online: Meta Ads, Google, TikTok, etc.' },
  { term: 'Zona Lima', def: 'Territorio comercial: Lima Metropolitana y Callao.' },
  { term: 'Zona Provincia', def: 'Territorio comercial: Arequipa, Trujillo y otras ciudades.' },
  { term: 'PPto Plan', def: 'Presupuesto planificado para el período.' },
  { term: 'Ejecución %', def: 'Porcentaje del presupuesto planificado que fue efectivamente gastado.' },
  { term: 'Meta FY', def: 'Meta de ventas para el año fiscal completo (Full Year).' },
  { term: 'YTD', def: 'Year-to-Date — acumulado desde el inicio del año hasta la fecha actual.' },
  { term: 'KPI', def: 'Key Performance Indicator — indicador clave de rendimiento.' },
  { term: 'Scorecard', def: 'Tablero resumen de KPIs con comparativa frente a metas.' },
]

export default function GlosarioPage() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4 }}>Glosario</h2>
        <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>Términos y métricas utilizados en el dashboard.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {GLOSARIO.map(({ term, def }) => (
          <div key={term} className="glass glass-hover" style={{
            borderRadius: 'var(--r-sm)', padding: '14px 16px',
            cursor: 'default', transition: 'background var(--t-fast)',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13, fontWeight: 700,
              color: 'var(--color-primary)', marginBottom: 5,
            }}>
              {term}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>
              {def}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
