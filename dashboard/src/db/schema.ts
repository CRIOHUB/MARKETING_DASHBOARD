import {
  pgTable, pgEnum, text, integer, doublePrecision,
  boolean, date, varchar, jsonb, serial,
} from 'drizzle-orm/pg-core'

// ── Enums ────────────────────────────────────────────────────
export const estadoProyectoEnum = pgEnum('estado_proyecto', [
  'PENDIENTE', 'EN_PROGRESO', 'FINALIZADO', 'DETENIDO',
])

// ── Conversión / KPIs Digitales ───────────────────────────────
export const conversionData = pgTable('conversion_data', {
  id: serial('id').primaryKey(),
  mes: varchar('mes', { length: 3 }).notNull(),
  mayoMode: boolean('mayo_mode').default(false),
  ing: doublePrecision('ing'),
  val: doublePrecision('val'),
  serv: doublePrecision('serv'),
  monto: doublePrecision('monto'),
  venta: doublePrecision('venta'),
  ventaOnline: doublePrecision('venta_online'),
  ventaOffline: doublePrecision('venta_offline'),
  cac: doublePrecision('cac'),
  roas: doublePrecision('roas'),
  cpl: doublePrecision('cpl'),
  cpa: doublePrecision('cpa'),
  cr1: doublePrecision('cr1'),
  cr2: doublePrecision('cr2'),
  cr3: doublePrecision('cr3'),
  roiPct: doublePrecision('roi_pct'),
})

// ── Mix de Servicios ─────────────────────────────────────────
export const serviceMix = pgTable('service_mix', {
  id: serial('id').primaryKey(),
  mes: varchar('mes', { length: 3 }).notNull(),
  servicio: varchar('servicio', { length: 50 }).notNull(),
  servicios: doublePrecision('servicios'),
  venta: doublePrecision('venta'),
})

// ── Visita Médica ────────────────────────────────────────────
export const visitaMedica = pgTable('visita_medica', {
  id: serial('id').primaryKey(),
  mes: varchar('mes', { length: 3 }).notNull(),
  exec: varchar('exec', { length: 100 }).notNull(),
  zona: varchar('zona', { length: 50 }),
  visitas: doublePrecision('visitas'),
  potUso: integer('pot_uso').default(0),
  notas: text('notas'),
})

// ── Visita Médica por Categoría ──────────────────────────────
export const visitaMedicaCategoria = pgTable('visita_medica_categoria', {
  id: serial('id').primaryKey(),
  mes: varchar('mes', { length: 3 }).notNull(),
  exec: varchar('exec', { length: 100 }).notNull(),
  cat: varchar('cat', { length: 50 }).notNull(),
  visitas: doublePrecision('visitas'),
})

// ── Clínicas ─────────────────────────────────────────────────
export const clinicas = pgTable('clinicas', {
  id: serial('id').primaryKey(),
  clinica: varchar('clinica', { length: 100 }).notNull(),
  rep: varchar('rep', { length: 100 }),
  zona: varchar('zona', { length: 50 }),
  visitas: integer('visitas'),
  mes: varchar('mes', { length: 3 }),
})

// ── Captación ────────────────────────────────────────────────
export const captacion = pgTable('captacion', {
  id: serial('id').primaryKey(),
  captador: varchar('captador', { length: 150 }).notNull(),
  canal: varchar('canal', { length: 50 }),
  mes: varchar('mes', { length: 3 }).notNull(),
  ventas: integer('ventas'),
})

// ── Presupuesto ──────────────────────────────────────────────
export const presupuesto = pgTable('presupuesto', {
  id: serial('id').primaryKey(),
  mes: varchar('mes', { length: 3 }).notNull(),
  online: doublePrecision('online'),
  offline: doublePrecision('offline'),
  eventos: doublePrecision('eventos'),
  gastado: doublePrecision('gastado'),
  gastoTotal: doublePrecision('gasto_total'),
  pptoPlan: doublePrecision('ppto_plan'),
  cumplPct: doublePrecision('cumpl_pct'),
})

// ── Historial de Gastos ──────────────────────────────────────
export const historialGastos = pgTable('historial_gastos', {
  id: serial('id').primaryKey(),
  fecha: date('fecha').notNull(),
  mes: varchar('mes', { length: 3 }).notNull(),
  categoria: varchar('categoria', { length: 50 }),
  descripcion: text('descripcion'),
  monto: doublePrecision('monto'),
})

// ── Fuerza de Ventas ─────────────────────────────────────────
export const vendedores = pgTable('vendedores', {
  id: serial('id').primaryKey(),
  exec: varchar('exec', { length: 100 }).notNull(),
  zona: varchar('zona', { length: 50 }),
  mes: varchar('mes', { length: 3 }).notNull(),
  ucu: integer('ucu').default(0),
  adn: integer('adn').default(0),
  tamizaje: integer('tamizaje').default(0),
  myprenatal: integer('myprenatal').default(0),
  segTotal: integer('seg_total').default(0),
  leads: integer('leads').default(0),
  validos: integer('validos').default(0),
})

// ── Comunicaciones ───────────────────────────────────────────
export const comunicaciones = pgTable('comunicaciones', {
  id: serial('id').primaryKey(),
  fecha: date('fecha').notNull(),
  mes: varchar('mes', { length: 3 }).notNull(),
  canal: varchar('canal', { length: 50 }),
  audiencia: varchar('audiencia', { length: 50 }),
  tipo: varchar('tipo', { length: 50 }),
  tema: text('tema'),
  hecho: boolean('hecho').default(false),
})

// ── Proyectos ────────────────────────────────────────────────
export const proyectos = pgTable('proyectos', {
  id: varchar('id', { length: 10 }).primaryKey(),
  nombre: text('nombre').notNull(),
  resp: varchar('resp', { length: 100 }),
  inicio: date('inicio'),
  fin: date('fin'),
  estado: estadoProyectoEnum('estado').default('PENDIENTE'),
  notas: text('notas'),
})

// ── Actividades / Calendario ─────────────────────────────────
export const actividades = pgTable('actividades', {
  id: serial('id').primaryKey(),
  actividad: varchar('actividad', { length: 150 }).notNull(),
  cat: varchar('cat', { length: 50 }),
  hecho: boolean('hecho').default(false),
  meses: jsonb('meses').$type<Record<string, string>>(),
})

// ── Inversión Bruta ──────────────────────────────────────────
export const inversionBruta = pgTable('inversion_bruta', {
  id: serial('id').primaryKey(),
  mes: varchar('mes', { length: 3 }).notNull(),
  invPub: doublePrecision('inv_pub'),
  invTotal: doublePrecision('inv_total'),
  pptoTotal: doublePrecision('ppto_total'),
  pctEjec: integer('pct_ejec'),
})

// ── Captación por Rep (VM) ───────────────────────────────────
export const captacionRep = pgTable('captacion_rep', {
  id: serial('id').primaryKey(),
  mes: varchar('mes', { length: 3 }).notNull(),
  rep: varchar('rep', { length: 100 }).notNull(),
  canal: varchar('canal', { length: 50 }),
  ucu: integer('ucu').default(0),
  tamizaje: integer('tamizaje').default(0),
  adn: integer('adn').default(0),
  myprenatal: integer('myprenatal').default(0),
  total: integer('total').default(0),
})

// ── VM Prospección ───────────────────────────────────────────
export const vmProspeccion = pgTable('vm_prospeccion', {
  id: serial('id').primaryKey(),
  mes: varchar('mes', { length: 3 }).notNull(),
  captador: varchar('captador', { length: 150 }).notNull(),
  canal: varchar('canal', { length: 50 }),
  leads: integer('leads').default(0),
  captaciones: integer('captaciones').default(0),
  detalle: text('detalle'),
})

// ── Tipos exportados ──────────────────────────────────────────
export type ConversionData = typeof conversionData.$inferSelect
export type ServiceMix = typeof serviceMix.$inferSelect
export type VisitaMedica = typeof visitaMedica.$inferSelect
export type Vendedor = typeof vendedores.$inferSelect
export type Comunicacion = typeof comunicaciones.$inferSelect
export type Proyecto = typeof proyectos.$inferSelect
export type Actividad = typeof actividades.$inferSelect
export type Presupuesto = typeof presupuesto.$inferSelect
export type CaptacionRep = typeof captacionRep.$inferSelect
export type VmProspeccion = typeof vmProspeccion.$inferSelect
