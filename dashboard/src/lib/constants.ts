// Static reference data that doesn't need DB storage

export const ALL_MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'] as const
export type Mes = typeof ALL_MESES[number]

export const SERVICIOS = ['UCU', 'ADN', 'Tamizaje', 'MyPrenatal', 'Seguridad Total'] as const
export type Servicio = typeof SERVICIOS[number]

export const META_VEND: Record<string, { ucu: number; adn: number; tamizaje: number; myprenatal: number }> = {
  Lima:      { ucu: 15, adn: 5, tamizaje: 5, myprenatal: 2 },
  Provincia: { ucu: 15, adn: 5, tamizaje: 5, myprenatal: 2 },
}

export const META_CAPT: Record<string, { ucu: number; adn: number; tamizaje: number; myprenatal: number }> = {
  Lima:     { ucu: 30, adn: 15, tamizaje: 15, myprenatal: 12 },
  Arequipa: { ucu: 10, adn: 5,  tamizaje: 5,  myprenatal: 4  },
}

// KPIs 2026 Scoreboard — official report to Mexico.
// Source: SCOREBOARD.xlsx (updated manually by Daniel). meta = 12 months
// (ENE–DIC), real = months reported so far (ENE–MAY). fmt: num | pct | mxn.
// Color: %≥100 verde, 85–99 amarillo, <85 rojo.
export const SCORECARD_DEF = {
  meses: ['ENE','FEB','MAR','ABR','MAY'] as string[],
  meta_fy_ventas: 968,
  sections: [
    {
      num: '①', title: 'DIGITAL PERFORMANCE',
      kpis: [
        { label: 'Total Leads Digital', fmt: 'num', better: 'higher', meta: [1000,1000,1000,1000,1000,1000,1250,1250,1250,1250,1250,1250], real: [1295,981,992,1013,1105], metaFy: 13500, realFy: 5386 },
        { label: 'Ventas Digitales', fmt: 'num', better: 'higher', meta: [54,35,39,54,54,54,61,61,61,61,61,61], real: [54,35,45,26,44], metaFy: 656, realFy: 204 },
        { label: 'CPL (MXN ÷ leads)', fmt: 'mxn', better: 'lower', meta: [71,70,69,51,38,48,46,50,32,50,23,24], real: [21,26,33,35,31], metaFy: 572, realFy: 146 },
        { label: 'CR Digital', fmt: 'pct', better: 'higher', meta: [4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5], real: [4.17,3.57,4.54,2.57,3.98], metaFy: 4.5, realFy: 3.79 },
      ],
    },
    {
      num: '②', title: 'INFLUENCER & PARTNERSHIPS',
      kpis: [
        { label: 'Influencers Activos', fmt: 'num', better: 'higher', meta: [1,1,1,1,1,1,1,1,1,1,1,1], real: [1,1,1,1,1], metaFy: 12, realFy: 5 },
        { label: 'Aliados Activos', fmt: 'num', better: 'higher', meta: [2,2,2,2,2,2,2,2,2,2,2,2], real: [3,3,3,3,3], metaFy: 24, realFy: 15 },
      ],
    },
    {
      num: '③', title: 'LEADS TOTALES',
      kpis: [
        { label: 'Leads Offline', fmt: 'num', better: 'higher', meta: [1250,1250,1000,750,750,1000,1000,1000,1000,1000,1000,1000], real: [1038,1362,884,404,502], metaFy: 12000, realFy: 4190 },
        { label: 'TOTAL LEADS', fmt: 'num', better: 'higher', bold: true, meta: [2250,2250,2000,1750,1750,2000,2250,2250,2250,2250,2250,2250], real: [2333,2343,1876,1417,1607], metaFy: 25500, realFy: 9576 },
      ],
    },
    {
      num: '④', title: 'CONVERSIÓN (baseline 2025)',
      kpis: [
        { label: 'Lead-to-Client Conv.', fmt: 'pct', better: 'higher', meta: [4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5], real: [3.43,2.18,3.04,2.19,3.61], metaFy: 4.5, realFy: 2.89 },
        { label: 'CR Offline', fmt: 'pct', better: 'higher', meta: [4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5], real: [2.30,1.20,2.80,2.00,2.90], metaFy: 4.5, realFy: 2.24 },
      ],
    },
    {
      num: '⑤', title: 'RESULTADOS DE NEGOCIO',
      kpis: [
        { label: 'Criocord (ventas uds)', fmt: 'num', better: 'higher', bold: true, meta: [80,51,57,80,80,80,90,90,90,90,90,90], real: [80,51,57,31,58], metaFy: 968, realFy: 277 },
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
