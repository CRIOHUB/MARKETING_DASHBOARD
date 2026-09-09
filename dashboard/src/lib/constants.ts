// Static reference data that doesn't need DB storage

export const ALL_MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'] as const
export type Mes = typeof ALL_MESES[number]

export const SERVICIOS = ['UCU', 'ADN', 'Tamizaje', 'MyPrenatal', 'Seguridad Total'] as const
export type Servicio = typeof SERVICIOS[number]

// Precio unitario (S/) por servicio. MyPrenatal y Seguridad Total: por definir.
export const PRECIOS_SERVICIO: Record<string, number> = {
  UCU: 4200,
  Tamizaje: 1500,
  ADN: 1200,
}

export const META_VEND: Record<string, { ucu: number; adn: number; tamizaje: number; myprenatal: number }> = {
  Lima:      { ucu: 15, adn: 5, tamizaje: 5, myprenatal: 2 },
  Provincia: { ucu: 15, adn: 5, tamizaje: 5, myprenatal: 2 },
}

export const META_CAPT: Record<string, { ucu: number; adn: number; tamizaje: number; myprenatal: number }> = {
  Lima:     { ucu: 30, adn: 15, tamizaje: 15, myprenatal: 12 },
  Arequipa: { ucu: 10, adn: 5,  tamizaje: 5,  myprenatal: 4  },
}

// KPIs 2026 Scoreboard — official report to Mexico.
// Source: CMO_Scorecard_LATAM_FY2026_v5 (19 Ago), updated manually by Daniel. meta = 12
// months (ENE–DIC), real = months reported so far (ENE–AGO). fmt: num | pct | mxn.
// Color: %≥100 verde, 85–99 amarillo, <85 rojo.
export const SCORECARD_DEF = {
  meses: ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO'] as string[],
  meta_fy_ventas: 968,
  sections: [
    {
      num: '①', title: 'DIGITAL PERFORMANCE',
      kpis: [
        { label: 'Total Leads Digital', fmt: 'num', better: 'higher', meta: [1000,1000,1000,1000,1000,1000,1250,1250,1250,1250,1250,1250], real: [1295,981,992,1013,1147,961,1316,1300], metaFy: 13500, realFy: 9005 },
        { label: 'Ventas Digitales', fmt: 'num', better: 'higher', meta: [54,35,39,54,54,54,61,61,61,61,61,61], real: [54,35,45,26,44,58,40,38], metaFy: 656, realFy: 340 },
        { label: 'CPL (MXN ÷ leads)', fmt: 'mxn', better: 'lower', meta: [71,70,69,51,38,48,46,50,32,50,23,24], real: [21,26,33,35,31,31,28,27], metaFy: 572, realFy: 232 },
        { label: 'CR Digital', fmt: 'pct', better: 'higher', meta: [4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5], real: [4.17,3.57,4.54,2.57,3.84,6.04,3.04,2.92], metaFy: 4.5, realFy: 3.83 },
      ],
    },
    {
      num: '②', title: 'INFLUENCER & PARTNERSHIPS',
      kpis: [
        { label: 'Influencers Activos', fmt: 'num', better: 'higher', meta: [1,1,1,1,1,1,1,1,1,1,1,1], real: [1,1,1,1,1,1,1,1], metaFy: 12, realFy: 10 },
        { label: 'Aliados Activos', fmt: 'num', better: 'higher', meta: [2,2,2,2,2,2,2,2,2,2,2,2], real: [3,3,3,3,3,3,3,2], metaFy: 24, realFy: 26 },
      ],
    },
    {
      num: '③', title: 'LEADS TOTALES',
      kpis: [
        { label: 'Leads Offline', fmt: 'num', better: 'higher', meta: [1250,1250,1000,750,750,1000,1000,1000,1000,1000,1000,1000], real: [1038,1362,884,404,502,523,778,571], metaFy: 12000, realFy: 6062 },
        { label: 'TOTAL LEADS', fmt: 'num', better: 'higher', bold: true, meta: [2250,2250,2000,1750,1750,2000,2250,2250,2250,2250,2250,2250], real: [2333,2343,1876,1417,1649,1484,2094,1871], metaFy: 25500, realFy: 15067 },
      ],
    },
    {
      num: '④', title: 'CONVERSIÓN (baseline 2025)',
      kpis: [
        { label: 'Lead-to-Client Conv.', fmt: 'pct', better: 'higher', meta: [3.25,3.25,3.25,3.25,3.25,3.25,3.25,3.25,3.25,3.25,3.25,3.25], real: [3.34,2.37,2.95,1.90,3.31,4.36,2.61,2.25], metaFy: 3.25, realFy: 2.89 },
        { label: 'CR Offline', fmt: 'pct', better: 'higher', meta: [2,2,2,2,2,2,2,2,2,2,2,2], real: [2.50,1.17,1.36,1.24,2.79,2.68,2.19,1.58], metaFy: 2, realFy: 1.94 },
      ],
    },
    {
      num: '⑤', title: 'RESULTADOS DE NEGOCIO',
      kpis: [
        { label: 'Criocord (ventas uds)', fmt: 'num', better: 'higher', bold: true, meta: [80,51,57,80,80,80,90,90,90,90,90,90], real: [80,51,57,31,58,72,57,47], metaFy: 968, realFy: 453 },
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
