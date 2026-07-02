import { sql } from 'drizzle-orm'
import { db } from './index'

/**
 * Idempotent DDL that mirrors src/db/schema.ts.
 * Lets us create the full schema at runtime (from /api/seed) without
 * needing drizzle-kit / Node.js on the deploy machine.
 *
 * ⚠️ Keep in sync with schema.ts if columns change.
 */
const STATEMENTS: string[] = [
  `DO $$ BEGIN
     CREATE TYPE estado_proyecto AS ENUM ('PENDIENTE','EN_PROGRESO','FINALIZADO','DETENIDO');
   EXCEPTION WHEN duplicate_object THEN null; END $$;`,

  `CREATE TABLE IF NOT EXISTS conversion_data (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     mayo_mode boolean DEFAULT false,
     ing double precision,
     val double precision,
     serv double precision,
     monto double precision,
     venta double precision,
     venta_online double precision,
     venta_offline double precision,
     cac double precision,
     roas double precision,
     cpl double precision,
     cpa double precision,
     cr1 double precision,
     cr2 double precision,
     cr3 double precision,
     roi_pct double precision
   );`,

  `CREATE TABLE IF NOT EXISTS service_mix (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     servicio varchar(50) NOT NULL,
     servicios double precision,
     venta double precision
   );`,

  `CREATE TABLE IF NOT EXISTS visita_medica (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     exec varchar(100) NOT NULL,
     zona varchar(50),
     visitas double precision,
     pot_uso integer DEFAULT 0,
     notas text
   );`,

  `CREATE TABLE IF NOT EXISTS visita_medica_categoria (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     exec varchar(100) NOT NULL,
     cat varchar(50) NOT NULL,
     visitas double precision
   );`,

  `CREATE TABLE IF NOT EXISTS clinicas (
     id serial PRIMARY KEY,
     clinica varchar(100) NOT NULL,
     rep varchar(100),
     zona varchar(50),
     visitas integer,
     mes varchar(3)
   );`,

  `CREATE TABLE IF NOT EXISTS captacion (
     id serial PRIMARY KEY,
     captador varchar(150) NOT NULL,
     canal varchar(50),
     mes varchar(3) NOT NULL,
     ventas integer
   );`,

  `CREATE TABLE IF NOT EXISTS presupuesto (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     online double precision,
     offline double precision,
     eventos double precision,
     gastado double precision,
     gasto_total double precision,
     ppto_plan double precision,
     cumpl_pct double precision
   );`,

  `CREATE TABLE IF NOT EXISTS historial_gastos (
     id serial PRIMARY KEY,
     fecha date NOT NULL,
     mes varchar(3) NOT NULL,
     categoria varchar(50),
     descripcion text,
     monto double precision
   );`,

  `CREATE TABLE IF NOT EXISTS vendedores (
     id serial PRIMARY KEY,
     exec varchar(100) NOT NULL,
     zona varchar(50),
     mes varchar(3) NOT NULL,
     ucu integer DEFAULT 0,
     adn integer DEFAULT 0,
     tamizaje integer DEFAULT 0,
     myprenatal integer DEFAULT 0,
     seg_total integer DEFAULT 0,
     leads integer DEFAULT 0,
     validos integer DEFAULT 0
   );`,

  `CREATE TABLE IF NOT EXISTS comunicaciones (
     id serial PRIMARY KEY,
     fecha date NOT NULL,
     mes varchar(3) NOT NULL,
     canal varchar(50),
     audiencia varchar(50),
     tipo varchar(50),
     tema text,
     hecho boolean DEFAULT false
   );`,

  `CREATE TABLE IF NOT EXISTS proyectos (
     id varchar(10) PRIMARY KEY,
     nombre text NOT NULL,
     resp varchar(100),
     inicio date,
     fin date,
     estado estado_proyecto DEFAULT 'PENDIENTE',
     notas text
   );`,

  `CREATE TABLE IF NOT EXISTS actividades (
     id serial PRIMARY KEY,
     actividad varchar(150) NOT NULL,
     cat varchar(50),
     hecho boolean DEFAULT false,
     meses jsonb
   );`,

  `CREATE TABLE IF NOT EXISTS inversion_bruta (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     inv_pub double precision,
     inv_total double precision,
     ppto_total double precision,
     pct_ejec integer
   );`,

  `CREATE TABLE IF NOT EXISTS captacion_rep (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     rep varchar(100) NOT NULL,
     canal varchar(50),
     ucu integer DEFAULT 0,
     tamizaje integer DEFAULT 0,
     adn integer DEFAULT 0,
     myprenatal integer DEFAULT 0,
     total integer DEFAULT 0
   );`,

  `CREATE TABLE IF NOT EXISTS vm_prospeccion (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     captador varchar(150) NOT NULL,
     canal varchar(50),
     leads integer DEFAULT 0,
     captaciones integer DEFAULT 0,
     detalle text
   );`,

  `CREATE TABLE IF NOT EXISTS prospeccion_ingresos (
     id serial PRIMARY KEY,
     mes varchar(3) NOT NULL,
     grupo varchar(50) NOT NULL,
     captador varchar(100) NOT NULL,
     cordon integer DEFAULT 0,
     tamizaje integer DEFAULT 0,
     adn integer DEFAULT 0,
     myprenatal integer DEFAULT 0,
     total integer DEFAULT 0
   );`,

  // Columnas nuevas de gasto/leads por canal (idempotente sobre tabla existente)
  `ALTER TABLE conversion_data ADD COLUMN IF NOT EXISTS monto_offline double precision;`,
  `ALTER TABLE conversion_data ADD COLUMN IF NOT EXISTS ing_online double precision;`,
  `ALTER TABLE conversion_data ADD COLUMN IF NOT EXISTS ing_offline double precision;`,
]

export async function createSchema() {
  for (const stmt of STATEMENTS) {
    await db.execute(sql.raw(stmt))
  }
}
