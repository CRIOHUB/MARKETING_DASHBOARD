// Static reference data that doesn't need DB storage

export const ALL_MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'] as const
export type Mes = typeof ALL_MESES[number]

export const META_VEND: Record<string, { ucu: number; adn: number; tamizaje: number; myprenatal: number }> = {
  Lima:      { ucu: 15, adn: 5, tamizaje: 5, myprenatal: 2 },
  Provincia: { ucu: 15, adn: 5, tamizaje: 5, myprenatal: 2 },
}

export const META_CAPT: Record<string, { ucu: number; adn: number; tamizaje: number; myprenatal: number }> = {
  Lima:     { ucu: 30, adn: 15, tamizaje: 15, myprenatal: 12 },
  Arequipa: { ucu: 10, adn: 5,  tamizaje: 5,  myprenatal: 4  },
}

export const SCORECARD_DEF = {
  meses: ['ENE','FEB','MAR','ABR','MAY'] as string[],
  meta_fy_ventas: 968,
  sections: [
    {
      id: 'digital', num: '①', title: 'Digital Performance', color: '#2563EB',
      kpis: [
        { id: 'leads_digital', label: 'Total Leads Digital', fmt: 'num', better: 'higher', meta_fy: 13500, real_fy: 5386, meta: [1000,1000,1000,1000,1000], real: [1295,981,992,1013,1105] },
        { id: 'ventas_digitales', label: 'Ventas Digitales', fmt: 'num', better: 'higher', meta_fy: 656, real_fy: 204, meta: [54,35,39,54,54], real: [54,35,45,26,44] },
        { id: 'cpl', label: 'CPL (S/ ÷ leads)', fmt: 'soles', better: 'lower', meta_fy: 48, real_fy: 29, meta: [71,70,69,51,38], real: [21,26,33,35,31] },
        { id: 'cr_digital', label: 'CR Digital (%)', fmt: 'pct', better: 'higher', meta_fy: 0.045, real_fy: 0.0379, meta: [0.045,0.045,0.045,0.045,0.045], real: [0.0417,0.0357,0.0454,0.0257,0.0398] },
      ],
    },
    {
      id: 'influencer', num: '②', title: 'Influencer & Partnerships', color: '#7C3AED',
      kpis: [
        { id: 'influencers', label: 'Influencers Activos', fmt: 'num', better: 'higher', meta_fy: 12, real_fy: 5, meta: [1,1,1,1,1], real: [1,1,1,1,1] },
        { id: 'aliados', label: 'Aliados Activos', fmt: 'num', better: 'higher', meta_fy: 24, real_fy: 15, meta: [2,2,2,2,2], real: [3,3,3,3,3] },
      ],
    },
    {
      id: 'leads', num: '③', title: 'Leads Totales', color: '#0891B2',
      kpis: [
        { id: 'leads_online', label: 'Leads Online (Digital)', fmt: 'num', better: 'higher', meta_fy: 13500, real_fy: 5386, meta: [1000,1000,1000,1000,1000], real: [1295,981,992,1013,1105] },
        { id: 'leads_offline', label: 'Leads Offline (VM + Eventos)', fmt: 'num', better: 'higher', meta_fy: 12000, real_fy: 4190, meta: [1250,1250,1000,750,750], real: [1038,1362,884,404,502] },
        { id: 'total_leads', label: 'TOTAL LEADS', fmt: 'num', better: 'higher', bold: true, meta_fy: 25500, real_fy: 9576, meta: [2250,2250,2000,1750,1750], real: [2333,2343,1876,1417,1607] },
      ],
    },
    {
      id: 'conversion', num: '④', title: 'Conversión', color: '#D97706',
      kpis: [
        { id: 'cr_online', label: 'CR Online — Lead Digital → Cliente', fmt: 'pct', better: 'higher', meta_fy: 0.045, real_fy: 0.0379, meta: [0.045,0.045,0.045,0.045,0.045], real: [0.0417,0.0357,0.0454,0.0257,0.0398] },
        { id: 'cr_offline', label: 'CR Offline — Lead Offline → Cliente', fmt: 'pct', better: 'higher', meta_fy: 0.045, real_fy: 0.0224, meta: [0.045,0.045,0.045,0.045,0.045], real: [0.023,0.012,0.028,0.02,0.029] },
      ],
    },
    {
      id: 'negocios', num: '⑤', title: 'Resultados de Negocio', color: '#059669',
      kpis: [
        { id: 'ventas_criocord', label: 'Ventas CrioCord (uds)', fmt: 'num', better: 'higher', bold: true, meta_fy: 968, real_fy: 277, meta: [80,51,57,80,80], real: [80,51,57,31,58] },
      ],
    },
  ],
} as const

export const CHART_COLORS = {
  UCU: '#0B5394',
  ADN: '#16A085',
  Tamizaje: '#E67E22',
  MyPrenatal: '#8E44AD',
  'Seguridad Total': '#E74C3C',
  digital: '#2563EB',
  vm: '#D97706',
  mkt: '#059669',
}

export const VEND_COLORS: Record<string, string> = {
  'Liseth Rondon': '#0B5394',
  'Adler Rosales': '#E67E22',
  'Heinrrich Stechmann': '#16A085',
  'Carolina Vasques': '#8E44AD',
  Lourdes: '#27AE60',
  Yvan: '#2980B9',
  Gerson: '#C9A961',
  Adriana: '#E74C3C',
  Claudia: '#16A085',
}
