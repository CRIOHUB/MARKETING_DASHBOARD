import { db } from './index'
import * as schema from './schema'

// ─── Raw data ─────────────────────────────────────────────────────────────────
// CONV + MIX synced from live "SEGUIMIENTO KPIS 2026.xlsx" (2026-06-17) and
// "SEGUIMIENTO PROSPECCION 2026.xlsx" (read via the M365 connector).
// ing=leads, val=válidos, serv=total servicios, monto=inversión (S/).
// venta / venta_online / venta_offline are SALES IN UNITS (from "Captación vs
// Venta", online vs offline channel). Revenue in soles is NOT tracked, so
// roas=0 and roi_pct=0 (Venta S/ and ROAS removed from the UI).
// Derived: cr1=val/ing, cr2=serv/val, cr3=serv/ing, cpl=monto/ing, cpa=monto/serv.
const CONV = [
  { mes: 'ENE', mayo_mode: false, ing: 2333, val: 1765, serv: 139, monto: 12000, venta: 137, venta_online: 97, venta_offline: 40, cac: 0, roas: 0, cpl: 5.14, cpa: 86.33, cr1: 75.7, cr2: 7.9, cr3: 6.0, roi_pct: 0 },
  { mes: 'FEB', mayo_mode: false, ing: 2343, val: 1696, serv: 76, monto: 12423, venta: 66, venta_online: 43, venta_offline: 23, cac: 0, roas: 0, cpl: 5.30, cpa: 163.46, cr1: 72.4, cr2: 4.5, cr3: 3.2, roi_pct: 0 },
  { mes: 'MAR', mayo_mode: false, ing: 1876, val: 1443, serv: 99, monto: 18217, venta: 99, venta_online: 81, venta_offline: 18, cac: 0, roas: 0, cpl: 9.71, cpa: 184.01, cr1: 76.9, cr2: 6.9, cr3: 5.3, roi_pct: 0 },
  { mes: 'ABR', mayo_mode: false, ing: 1417, val: 1417, serv: 42, monto: 19968.47, venta: 45, venta_online: 37, venta_offline: 8, cac: 0, roas: 0, cpl: 14.09, cpa: 475.44, cr1: 100.0, cr2: 3.0, cr3: 3.0, roi_pct: 0 },
  { mes: 'MAY', mayo_mode: false, ing: 1607, val: 1050, serv: 120, monto: 20000, venta: 120, venta_online: 92, venta_offline: 28, cac: 0, roas: 0, cpl: 12.45, cpa: 166.67, cr1: 65.3, cr2: 11.4, cr3: 7.5, roi_pct: 0 },
  // JUN — datos reales del consolidado: Monto 19,600; Captación vs Venta online 109 / offline 28 / total 137.
  // serv 125 = mix sin Seg. Total (UCU73+ADN19+Tamiz30+MyPren3). cpl=monto/ing, cpa=monto/serv.
  { mes: 'JUN', mayo_mode: false, ing: 1413, val: 975, serv: 125, monto: 19600, venta: 137, venta_online: 109, venta_offline: 28, cac: 268.5, roas: 0, cpl: 13.87, cpa: 156.80, cr1: 69.0, cr2: 12.8, cr3: 8.8, roi_pct: 0 },
]

const MIX = [
  // "Seguridad Total" is tracked as a separate bundle, not part of TOTAL SERV.
  { mes: 'ENE', servicio: 'UCU', servicios: 80, venta: 0 },
  { mes: 'ENE', servicio: 'ADN', servicios: 22, venta: 0 },
  { mes: 'ENE', servicio: 'Tamizaje', servicios: 35, venta: 0 },
  { mes: 'ENE', servicio: 'MyPrenatal', servicios: 2, venta: 0 },
  { mes: 'ENE', servicio: 'Seguridad Total', servicios: 2, venta: 0 },
  { mes: 'FEB', servicio: 'UCU', servicios: 50, venta: 0 },
  { mes: 'FEB', servicio: 'ADN', servicios: 6, venta: 0 },
  { mes: 'FEB', servicio: 'Tamizaje', servicios: 17, venta: 0 },
  { mes: 'FEB', servicio: 'MyPrenatal', servicios: 3, venta: 0 },
  { mes: 'FEB', servicio: 'Seguridad Total', servicios: 8, venta: 0 },
  { mes: 'MAR', servicio: 'UCU', servicios: 56, venta: 0 },
  { mes: 'MAR', servicio: 'ADN', servicios: 19, venta: 0 },
  { mes: 'MAR', servicio: 'Tamizaje', servicios: 18, venta: 0 },
  { mes: 'MAR', servicio: 'MyPrenatal', servicios: 6, venta: 0 },
  { mes: 'MAR', servicio: 'Seguridad Total', servicios: 9, venta: 0 },
  { mes: 'ABR', servicio: 'UCU', servicios: 31, venta: 0 },
  { mes: 'ABR', servicio: 'ADN', servicios: 3, venta: 0 },
  { mes: 'ABR', servicio: 'Tamizaje', servicios: 4, venta: 0 },
  { mes: 'ABR', servicio: 'MyPrenatal', servicios: 4, venta: 0 },
  { mes: 'ABR', servicio: 'Seguridad Total', servicios: 5, venta: 0 },
  { mes: 'MAY', servicio: 'UCU', servicios: 58, venta: 0 },
  { mes: 'MAY', servicio: 'ADN', servicios: 23, venta: 0 },
  { mes: 'MAY', servicio: 'Tamizaje', servicios: 31, venta: 0 },
  { mes: 'MAY', servicio: 'MyPrenatal', servicios: 8, venta: 0 },
  { mes: 'MAY', servicio: 'Seguridad Total', servicios: 24, venta: 0 },
  // JUN — avance preliminar (servicios entregados por FFVV; online/atribución pendiente)
  { mes: 'JUN', servicio: 'UCU', servicios: 73, venta: 0 },
  { mes: 'JUN', servicio: 'ADN', servicios: 19, venta: 0 },
  { mes: 'JUN', servicio: 'Tamizaje', servicios: 30, venta: 0 },
  { mes: 'JUN', servicio: 'MyPrenatal', servicios: 3, venta: 0 },
  { mes: 'JUN', servicio: 'Seguridad Total', servicios: 60, venta: 0 },
]

const VM = [
  { mes: 'ENE', exec: 'Milagritos', zona: 'Lima', visitas: 139, pot_uso: 0, notas: 'Top: Sta.Isabel 24, Delgado 13, El Golf 10' },
  { mes: 'ENE', exec: 'Marylin', zona: 'Lima', visitas: 139, pot_uso: 0, notas: 'Cl.Int.San Borja 29, SANNA SB 15, RP 9' },
  { mes: 'ENE', exec: 'Adler', zona: 'Lima/Prov', visitas: 144, pot_uso: 0, notas: 'Centenario PJ 12, Jesús del Norte 11' },
  { mes: 'ENE', exec: 'Velia', zona: 'Arequipa', visitas: 141, pot_uso: 0, notas: 'Clínica San Pablo AQP 14, DAC 19' },
  { mes: 'FEB', exec: 'Milagritos', zona: 'Lima', visitas: 145, pot_uso: 0, notas: 'Sta.Isabel 35, Delgado 23, Angloam. 9' },
  { mes: 'FEB', exec: 'Marylin', zona: 'Lima', visitas: 131, pot_uso: 0, notas: 'Cl.Int.SB 20, SANNA SB 20, RP 14' },
  { mes: 'FEB', exec: 'Adler', zona: 'Lima/Prov', visitas: 120, pot_uso: 0, notas: 'Centenario PJ 12, Jesús del Norte 11' },
  { mes: 'FEB', exec: 'Velia', zona: 'Arequipa', visitas: 127, pot_uso: 0, notas: 'DAC 11, Pol.EsSalud Yanahuara 10' },
  { mes: 'MAR', exec: 'Milagros', zona: 'Lima', visitas: 110, pot_uso: 0, notas: 'Delgado 15, San Felipe 10, SANNA Golf 9' },
  { mes: 'MAR', exec: 'Marylin', zona: 'Lima', visitas: 145, pot_uso: 0, notas: 'Cl.Int.SB 33, SANNA SB 19, Sta.Isabel 17' },
  { mes: 'MAR', exec: 'Adler', zona: 'Lima/Prov', visitas: 109, pot_uso: 0, notas: 'Centenario PJ 10, Hogar de la Madre 8' },
  { mes: 'MAR', exec: 'Velia', zona: 'Arequipa', visitas: 143, pot_uso: 0, notas: 'DAC 13, San Juan de Dios 13' },
  { mes: 'ABR', exec: 'Milagros', zona: 'Lima', visitas: 143, pot_uso: 0, notas: 'Delgado 28, San Felipe 24, SANNA Golf 23' },
  { mes: 'ABR', exec: 'Marylin', zona: 'Lima', visitas: 139, pot_uso: 0, notas: 'Cl.Int.SB 27, SANNA SB 24, RP 12' },
  { mes: 'ABR', exec: 'Velia', zona: 'Arequipa', visitas: 131, pot_uso: 0, notas: 'Pol.EsSalud Yanahuara 13, San Pablo AQP 13' },
]

const VMCAT = [
  { mes: 'ENE', exec: 'Milagritos', cat: 'Secretaria', visitas: 17 },
  { mes: 'ENE', exec: 'Milagritos', cat: 'Médicos', visitas: 113 },
  { mes: 'ENE', exec: 'Milagritos', cat: 'Obstetras', visitas: 9 },
  { mes: 'ENE', exec: 'Marylin', cat: 'Secretaria', visitas: 14 },
  { mes: 'ENE', exec: 'Marylin', cat: 'Médicos', visitas: 115 },
  { mes: 'ENE', exec: 'Marylin', cat: 'Obstetras', visitas: 10 },
  { mes: 'ENE', exec: 'Adler', cat: 'Secretaria', visitas: 9 },
  { mes: 'ENE', exec: 'Adler', cat: 'Médicos', visitas: 113 },
  { mes: 'ENE', exec: 'Adler', cat: 'Obstetras', visitas: 22 },
  { mes: 'ENE', exec: 'Velia', cat: 'Secretaria', visitas: 20 },
  { mes: 'ENE', exec: 'Velia', cat: 'Médicos', visitas: 111 },
  { mes: 'ENE', exec: 'Velia', cat: 'Obstetras', visitas: 10 },
  { mes: 'FEB', exec: 'Milagritos', cat: 'Secretaria', visitas: 19 },
  { mes: 'FEB', exec: 'Milagritos', cat: 'Médicos', visitas: 113 },
  { mes: 'FEB', exec: 'Milagritos', cat: 'Obstetras', visitas: 13 },
  { mes: 'FEB', exec: 'Marylin', cat: 'Secretaria', visitas: 13 },
  { mes: 'FEB', exec: 'Marylin', cat: 'Médicos', visitas: 107 },
  { mes: 'FEB', exec: 'Marylin', cat: 'Obstetras', visitas: 11 },
  { mes: 'FEB', exec: 'Adler', cat: 'Secretaria', visitas: 6 },
  { mes: 'FEB', exec: 'Adler', cat: 'Médicos', visitas: 94 },
  { mes: 'FEB', exec: 'Adler', cat: 'Obstetras', visitas: 20 },
  { mes: 'FEB', exec: 'Velia', cat: 'Secretaria', visitas: 13 },
  { mes: 'FEB', exec: 'Velia', cat: 'Médicos', visitas: 107 },
  { mes: 'FEB', exec: 'Velia', cat: 'Obstetras', visitas: 7 },
  { mes: 'MAR', exec: 'Milagros', cat: 'Secretaria', visitas: 4 },
  { mes: 'MAR', exec: 'Milagros', cat: 'Médicos', visitas: 104 },
  { mes: 'MAR', exec: 'Milagros', cat: 'Obstetras', visitas: 2 },
  { mes: 'MAR', exec: 'Marylin', cat: 'Secretaria', visitas: 14 },
  { mes: 'MAR', exec: 'Marylin', cat: 'Médicos', visitas: 117 },
  { mes: 'MAR', exec: 'Marylin', cat: 'Obstetras', visitas: 14 },
  { mes: 'MAR', exec: 'Adler', cat: 'Secretaria', visitas: 3 },
  { mes: 'MAR', exec: 'Adler', cat: 'Médicos', visitas: 78 },
  { mes: 'MAR', exec: 'Adler', cat: 'Obstetras', visitas: 28 },
  { mes: 'MAR', exec: 'Velia', cat: 'Secretaria', visitas: 15 },
  { mes: 'MAR', exec: 'Velia', cat: 'Médicos', visitas: 118 },
  { mes: 'MAR', exec: 'Velia', cat: 'Obstetras', visitas: 10 },
  { mes: 'ABR', exec: 'Milagros', cat: 'Secretaria', visitas: 5 },
  { mes: 'ABR', exec: 'Milagros', cat: 'Médicos', visitas: 128 },
  { mes: 'ABR', exec: 'Milagros', cat: 'Obstetras', visitas: 10 },
  { mes: 'ABR', exec: 'Marylin', cat: 'Secretaria', visitas: 9 },
  { mes: 'ABR', exec: 'Marylin', cat: 'Médicos', visitas: 114 },
  { mes: 'ABR', exec: 'Marylin', cat: 'Obstetras', visitas: 16 },
  { mes: 'ABR', exec: 'Velia', cat: 'Secretaria', visitas: 19 },
  { mes: 'ABR', exec: 'Velia', cat: 'Médicos', visitas: 104 },
  { mes: 'ABR', exec: 'Velia', cat: 'Obstetras', visitas: 8 },
]

const CLIN = [
  { clinica: 'Clínica Delgado', rep: 'Milagros', zona: 'Lima', visitas: 28, mes: 'ABR' },
  { clinica: 'San Felipe', rep: 'Milagros', zona: 'Lima', visitas: 24, mes: 'ABR' },
  { clinica: 'SANNA El Golf', rep: 'Milagros', zona: 'Lima', visitas: 23, mes: 'ABR' },
  { clinica: 'Clínica Miraflores', rep: 'Milagros', zona: 'Lima', visitas: 14, mes: 'ABR' },
  { clinica: 'Angloamericana', rep: 'Milagros', zona: 'Lima', visitas: 11, mes: 'ABR' },
  { clinica: 'Cl. Internacional SB', rep: 'Marylin', zona: 'Lima', visitas: 27, mes: 'ABR' },
  { clinica: 'SANNA San Borja', rep: 'Marylin', zona: 'Lima', visitas: 24, mes: 'ABR' },
  { clinica: 'Ricardo Palma', rep: 'Marylin', zona: 'Lima', visitas: 12, mes: 'ABR' },
  { clinica: 'Clínica Santa Isabel', rep: 'Marylin', zona: 'Lima', visitas: 11, mes: 'ABR' },
  { clinica: 'Montesur', rep: 'Marylin', zona: 'Lima', visitas: 6, mes: 'ABR' },
  { clinica: 'Pol. EsSalud Yanahuara', rep: 'Velia', zona: 'Arequipa', visitas: 13, mes: 'ABR' },
  { clinica: 'Clínica San Pablo AQP', rep: 'Velia', zona: 'Arequipa', visitas: 13, mes: 'ABR' },
  { clinica: 'Clínica San Juan de Dios', rep: 'Velia', zona: 'Arequipa', visitas: 11, mes: 'ABR' },
  { clinica: 'AUNA Valle Sur AQP', rep: 'Velia', zona: 'Arequipa', visitas: 9, mes: 'ABR' },
  { clinica: 'Clínica Arequipa', rep: 'Velia', zona: 'Arequipa', visitas: 9, mes: 'ABR' },
  { clinica: 'Centenario Pto. de Jesús', rep: 'Adler', zona: 'Lima/Prov', visitas: 10, mes: 'MAR' },
  { clinica: 'Hogar de la Madre', rep: 'Adler', zona: 'Lima', visitas: 8, mes: 'MAR' },
  { clinica: 'Jesús del Norte', rep: 'Adler', zona: 'Lima', visitas: 11, mes: 'ENE' },
  { clinica: 'DAC (Arequipa)', rep: 'Velia', zona: 'Arequipa', visitas: 13, mes: 'MAR' },
  { clinica: 'Good Hope', rep: 'Milagros', zona: 'Lima', visitas: 8, mes: 'ENE' },
]

const CAPT = [
  { captador: 'Digital / MKT + Comercial', canal: 'digital', mes: 'ENE', ventas: 108 },
  { captador: 'VM — Milagros Herrera', canal: 'vm', mes: 'ENE', ventas: 21 },
  { captador: 'VM — Marylin', canal: 'vm', mes: 'ENE', ventas: 17 },
  { captador: 'VM — Velia', canal: 'vm', mes: 'ENE', ventas: 10 },
  { captador: 'Digital / MKT + Comercial', canal: 'digital', mes: 'FEB', ventas: 97 },
  { captador: 'VM — Milagros Herrera', canal: 'vm', mes: 'FEB', ventas: 18 },
  { captador: 'VM — Marylin', canal: 'vm', mes: 'FEB', ventas: 15 },
  { captador: 'VM — Velia', canal: 'vm', mes: 'FEB', ventas: 8 },
  { captador: 'Digital / MKT + Comercial', canal: 'digital', mes: 'MAR', ventas: 112 },
  { captador: 'VM — Milagros Herrera', canal: 'vm', mes: 'MAR', ventas: 19 },
  { captador: 'VM — Marylin', canal: 'vm', mes: 'MAR', ventas: 16 },
  { captador: 'VM — Velia', canal: 'vm', mes: 'MAR', ventas: 9 },
  { captador: 'Digital / MKT + Comercial', canal: 'digital', mes: 'ABR', ventas: 45 },
  { captador: 'VM — Milagros Herrera', canal: 'vm', mes: 'ABR', ventas: 8 },
  { captador: 'VM — Marylin', canal: 'vm', mes: 'ABR', ventas: 3 },
  { captador: 'VM — Velia', canal: 'vm', mes: 'ABR', ventas: 1 },
]

const PPTO = [
  { mes: 'ENE', online: 9624.25, offline: 2375.75, eventos: 0, gastado: 12000, gasto_total: 13200, ppto_plan: 12000, cumpl_pct: 110 },
  { mes: 'FEB', online: 9624.25, offline: 2798.75, eventos: 0, gastado: 12423, gasto_total: 13623, ppto_plan: 14000, cumpl_pct: 97.3 },
  { mes: 'MAR', online: 9624.25, offline: 2730.09, eventos: 5862.66, gastado: 18217, gasto_total: 19617, ppto_plan: 18000, cumpl_pct: 109 },
  { mes: 'ABR', online: 9624.25, offline: 2730.09, eventos: 7614.13, gastado: 19968.47, gasto_total: 21368.47, ppto_plan: 20000, cumpl_pct: 106.8 },
  { mes: 'MAY', online: 9624.25, offline: 2730.09, eventos: 0, gastado: 12354.34, gasto_total: 13754.34, ppto_plan: 23429, cumpl_pct: 58.7 },
]

const HIST = [
  { fecha: '2026-01-05', mes: 'ENE', categoria: 'Digital', desc: 'Meta Ads — Enero', monto: 4200 },
  { fecha: '2026-01-08', mes: 'ENE', categoria: 'Digital', desc: 'Google Ads — Enero', monto: 3500 },
  { fecha: '2026-01-12', mes: 'ENE', categoria: 'Digital', desc: 'Producción contenido Instagram', monto: 1924.25 },
  { fecha: '2026-01-20', mes: 'ENE', categoria: 'Eventos', desc: 'Open Lab + Rebranding', monto: 2375.75 },
  { fecha: '2026-01-31', mes: 'ENE', categoria: 'Administrativo', desc: 'Diseño & herramientas', monto: 1200 },
  { fecha: '2026-02-05', mes: 'FEB', categoria: 'Digital', desc: 'Meta Ads — Febrero', monto: 4200 },
  { fecha: '2026-02-08', mes: 'FEB', categoria: 'Digital', desc: 'Google Ads — Febrero', monto: 3500 },
  { fecha: '2026-02-12', mes: 'FEB', categoria: 'Digital', desc: 'Producción contenido WATI/Mail', monto: 1924.25 },
  { fecha: '2026-02-17', mes: 'FEB', categoria: 'Eventos', desc: 'Open Lab Feb + materiales', monto: 2798.75 },
  { fecha: '2026-02-28', mes: 'FEB', categoria: 'Administrativo', desc: 'Diseño & herramientas', monto: 1200 },
  { fecha: '2026-03-05', mes: 'MAR', categoria: 'Digital', desc: 'Meta Ads — Marzo', monto: 4200 },
  { fecha: '2026-03-08', mes: 'MAR', categoria: 'Digital', desc: 'Google Ads — Marzo', monto: 3500 },
  { fecha: '2026-03-10', mes: 'MAR', categoria: 'Digital', desc: 'Promo ADN S/890', monto: 1924.25 },
  { fecha: '2026-03-16', mes: 'MAR', categoria: 'Eventos', desc: 'Congreso + materiales VM', monto: 2730.09 },
  { fecha: '2026-03-20', mes: 'MAR', categoria: 'Eventos', desc: 'Cena con médicos Lima', monto: 5862.66 },
  { fecha: '2026-03-31', mes: 'MAR', categoria: 'Administrativo', desc: 'Diseño & herramientas', monto: 1400 },
  { fecha: '2026-04-05', mes: 'ABR', categoria: 'Digital', desc: 'Meta Ads — Abril', monto: 4200 },
  { fecha: '2026-04-08', mes: 'ABR', categoria: 'Digital', desc: 'Google Ads — Abril', monto: 3500 },
  { fecha: '2026-04-12', mes: 'ABR', categoria: 'Digital', desc: 'Producción Newsletter + WATI', monto: 1924.25 },
  { fecha: '2026-04-16', mes: 'ABR', categoria: 'Eventos', desc: 'Evento Obstetras Piso 13', monto: 2730.09 },
  { fecha: '2026-04-26', mes: 'ABR', categoria: 'Eventos', desc: 'Día Secretaria: Sorteo + SPA', monto: 7614.13 },
  { fecha: '2026-04-30', mes: 'ABR', categoria: 'Administrativo', desc: 'Diseño & herramientas', monto: 1400 },
]

const VEND = [
  { exec: 'Lourdes', zona: 'Lima', mes: 'ENE', ucu: 19, adn: 2, tamizaje: 5, myprenatal: 0, seg_total: 0, leads: 159, validos: 126 },
  { exec: 'Heinrrich Stechmann', zona: 'Provincia', mes: 'ENE', ucu: 13, adn: 1, tamizaje: 2, myprenatal: 0, seg_total: 1, leads: 203, validos: 172 },
  { exec: 'Liseth Rondon', zona: 'Lima', mes: 'ENE', ucu: 15, adn: 7, tamizaje: 9, myprenatal: 0, seg_total: 1, leads: 90, validos: 69 },
  { exec: 'Carolina Vasques', zona: 'Lima', mes: 'ENE', ucu: 9, adn: 3, tamizaje: 3, myprenatal: 0, seg_total: 0, leads: 147, validos: 97 },
  { exec: 'Yvan', zona: 'Lima', mes: 'ENE', ucu: 10, adn: 2, tamizaje: 4, myprenatal: 0, seg_total: 0, leads: 158, validos: 134 },
  { exec: 'Gerson', zona: 'Lima', mes: 'ENE', ucu: 11, adn: 6, tamizaje: 6, myprenatal: 0, seg_total: 0, leads: 199, validos: 163 },
  { exec: 'Adriana', zona: 'Lima', mes: 'ENE', ucu: 3, adn: 1, tamizaje: 6, myprenatal: 0, seg_total: 0, leads: 141, validos: 116 },
  { exec: 'Lourdes', zona: 'Lima', mes: 'FEB', ucu: 9, adn: 0, tamizaje: 6, myprenatal: 0, seg_total: 2, leads: 79, validos: 60 },
  { exec: 'Heinrrich Stechmann', zona: 'Provincia', mes: 'FEB', ucu: 7, adn: 0, tamizaje: 2, myprenatal: 0, seg_total: 3, leads: 151, validos: 123 },
  { exec: 'Liseth Rondon', zona: 'Lima', mes: 'FEB', ucu: 15, adn: 2, tamizaje: 4, myprenatal: 0, seg_total: 1, leads: 94, validos: 84 },
  { exec: 'Carolina Vasques', zona: 'Lima', mes: 'FEB', ucu: 5, adn: 1, tamizaje: 2, myprenatal: 0, seg_total: 1, leads: 150, validos: 99 },
  { exec: 'Yvan', zona: 'Lima', mes: 'FEB', ucu: 3, adn: 0, tamizaje: 0, myprenatal: 0, seg_total: 1, leads: 81, validos: 65 },
  { exec: 'Gerson', zona: 'Lima', mes: 'FEB', ucu: 7, adn: 0, tamizaje: 1, myprenatal: 0, seg_total: 0, leads: 127, validos: 100 },
  { exec: 'Adriana', zona: 'Lima', mes: 'FEB', ucu: 4, adn: 3, tamizaje: 2, myprenatal: 0, seg_total: 0, leads: 90, validos: 76 },
  { exec: 'Lourdes', zona: 'Lima', mes: 'MAR', ucu: 6, adn: 2, tamizaje: 0, myprenatal: 0, seg_total: 1, leads: 191, validos: 152 },
  { exec: 'Heinrrich Stechmann', zona: 'Provincia', mes: 'MAR', ucu: 17, adn: 4, tamizaje: 6, myprenatal: 0, seg_total: 3, leads: 190, validos: 163 },
  { exec: 'Liseth Rondon', zona: 'Lima', mes: 'MAR', ucu: 15, adn: 4, tamizaje: 6, myprenatal: 0, seg_total: 3, leads: 132, validos: 114 },
  { exec: 'Carolina Vasques', zona: 'Lima', mes: 'MAR', ucu: 12, adn: 2, tamizaje: 2, myprenatal: 0, seg_total: 1, leads: 142, validos: 105 },
  { exec: 'Yvan', zona: 'Lima', mes: 'MAR', ucu: 0, adn: 0, tamizaje: 0, myprenatal: 0, seg_total: 0, leads: 20, validos: 16 },
  { exec: 'Gerson', zona: 'Lima', mes: 'MAR', ucu: 2, adn: 4, tamizaje: 2, myprenatal: 0, seg_total: 0, leads: 64, validos: 47 },
  { exec: 'Adriana', zona: 'Lima', mes: 'MAR', ucu: 4, adn: 3, tamizaje: 2, myprenatal: 0, seg_total: 1, leads: 76, validos: 59 },
  { exec: 'Adler Rosales', zona: 'Lima', mes: 'ABR', ucu: 5, adn: 2, tamizaje: 2, myprenatal: 1, seg_total: 0, leads: 0, validos: 0 },
  { exec: 'Heinrrich Stechmann', zona: 'Provincia', mes: 'ABR', ucu: 7, adn: 0, tamizaje: 0, myprenatal: 3, seg_total: 3, leads: 0, validos: 0 },
  { exec: 'Liseth Rondon', zona: 'Lima', mes: 'ABR', ucu: 7, adn: 1, tamizaje: 1, myprenatal: 0, seg_total: 2, leads: 0, validos: 0 },
  { exec: 'Carolina Vasques', zona: 'Lima', mes: 'ABR', ucu: 6, adn: 0, tamizaje: 1, myprenatal: 0, seg_total: 0, leads: 0, validos: 0 },
  { exec: 'Adler Rosales', zona: 'Lima', mes: 'MAY', ucu: 9, adn: 8, tamizaje: 7, myprenatal: 1, seg_total: 5, leads: 42, validos: 0 },
  { exec: 'Heinrrich Stechmann', zona: 'Provincia', mes: 'MAY', ucu: 17, adn: 9, tamizaje: 11, myprenatal: 4, seg_total: 8, leads: 226, validos: 0 },
  { exec: 'Liseth Rondon', zona: 'Lima', mes: 'MAY', ucu: 17, adn: 3, tamizaje: 7, myprenatal: 3, seg_total: 7, leads: 197, validos: 0 },
  { exec: 'Carolina Vasques', zona: 'Lima', mes: 'MAY', ucu: 15, adn: 3, tamizaje: 6, myprenatal: 0, seg_total: 4, leads: 135, validos: 0 },
  // JUN — Ventas por Asesor Comercial (hoja JUN-26, SEGUIMIENTO PROSPECCION 2026.xlsx).
  // seg_total = "Seguridad Total S" + "Seguridad Total T". ucu = Cordones.
  { exec: 'Adler Rosales', zona: 'Lima', mes: 'JUN', ucu: 17, adn: 6, tamizaje: 9, myprenatal: 0, seg_total: 15, leads: 0, validos: 0 },
  { exec: 'Heinrrich Stechmann', zona: 'Provincia', mes: 'JUN', ucu: 17, adn: 7, tamizaje: 9, myprenatal: 1, seg_total: 10, leads: 0, validos: 0 },
  { exec: 'Liseth Rondon', zona: 'Lima', mes: 'JUN', ucu: 20, adn: 2, tamizaje: 6, myprenatal: 1, seg_total: 17, leads: 0, validos: 0 },
  { exec: 'Carolina Vasques', zona: 'Lima', mes: 'JUN', ucu: 18, adn: 4, tamizaje: 6, myprenatal: 0, seg_total: 11, leads: 0, validos: 0 },
  { exec: 'Claudia', zona: 'Lima', mes: 'JUN', ucu: 1, adn: 0, tamizaje: 0, myprenatal: 1, seg_total: 4, leads: 0, validos: 0 },
  { exec: 'Oficina', zona: 'Lima', mes: 'JUN', ucu: 0, adn: 0, tamizaje: 0, myprenatal: 0, seg_total: 3, leads: 0, validos: 0 },
]

const COMMS = [
  { fecha: '2026-01-20', mes: 'ENE', canal: 'OPEN LAB', audiencia: 'Clientes', tipo: 'Evento', tema: 'Open Lab + Rebranding + Tamizaje', hecho: true },
  { fecha: '2026-02-12', mes: 'FEB', canal: 'WATI', audiencia: 'Médicos', tipo: 'Video', tema: 'Video 2: Más que Criopreservación', hecho: true },
  { fecha: '2026-02-16', mes: 'FEB', canal: 'MAIL', audiencia: 'Médicos', tipo: 'Newsletter', tema: 'Más que Criopreservación', hecho: true },
  { fecha: '2026-02-17', mes: 'FEB', canal: 'MAIL', audiencia: 'Clientes', tipo: 'Email', tema: 'Referidos + Seguridad Total + Open Lab', hecho: true },
  { fecha: '2026-03-02', mes: 'MAR', canal: 'WATI', audiencia: 'Obstetras', tipo: 'Newsletter', tema: 'Células Criopreservadas 29 Años', hecho: true },
  { fecha: '2026-03-03', mes: 'MAR', canal: 'BOLETÍN', audiencia: 'Clientes', tipo: 'Email', tema: 'Open Lab + Seguridad Total + Referidos', hecho: true },
  { fecha: '2026-03-09', mes: 'MAR', canal: 'MAIL', audiencia: 'Médicos', tipo: 'Newsletter', tema: 'Células Criopreservadas 29 Años', hecho: true },
  { fecha: '2026-03-09', mes: 'MAR', canal: 'MAIL', audiencia: 'Secretarias', tipo: 'Newsletter', tema: 'Células Criopreservadas 29 Años', hecho: true },
  { fecha: '2026-03-10', mes: 'MAR', canal: 'PROMO', audiencia: 'Clientes', tipo: 'Promo', tema: 'ADN S/890', hecho: true },
  { fecha: '2026-03-23', mes: 'MAR', canal: 'WATI', audiencia: 'Médicos', tipo: 'Video', tema: 'Video 3: Más que Criopreservación', hecho: true },
  { fecha: '2026-03-23', mes: 'MAR', canal: 'WATI', audiencia: 'Obstetras', tipo: 'Video', tema: 'Video 3 + Invitación Evento', hecho: true },
  { fecha: '2026-03-23', mes: 'MAR', canal: 'WATI', audiencia: 'Secretarias', tipo: 'Video', tema: 'Video 3: Más que Criopreservación', hecho: true },
  { fecha: '2026-04-06', mes: 'ABR', canal: 'MAIL', audiencia: 'Secretarias', tipo: 'Newsletter', tema: 'Test Prenatal + Sorteo Día Secretaria', hecho: true },
  { fecha: '2026-04-10', mes: 'ABR', canal: 'MAIL', audiencia: 'Médicos', tipo: 'Newsletter', tema: 'Test Prenatal + Link prospección', hecho: true },
  { fecha: '2026-04-10', mes: 'ABR', canal: 'WATI', audiencia: 'Prospectos', tipo: 'WhatsApp', tema: 'Beneficios de Criopreservación', hecho: true },
  { fecha: '2026-04-10', mes: 'ABR', canal: 'CORREO', audiencia: 'Anualidades', tipo: 'Cobranza', tema: 'Notificación cobranza + Promo 50%', hecho: true },
  { fecha: '2026-04-15', mes: 'ABR', canal: 'WATI', audiencia: 'Prospectos', tipo: 'WhatsApp', tema: 'Beneficios del Tamizaje', hecho: true },
  { fecha: '2026-04-16', mes: 'ABR', canal: 'EVENTO', audiencia: 'Obstetras', tipo: 'Evento', tema: 'Evento Obstetras Piso 13', hecho: true },
  { fecha: '2026-04-18', mes: 'ABR', canal: 'WATI', audiencia: 'Prospectos', tipo: 'WhatsApp', tema: 'Beneficios de Criopreservación', hecho: true },
  { fecha: '2026-04-20', mes: 'ABR', canal: 'WATI', audiencia: 'Secretarias', tipo: 'Video', tema: 'Video 2 + Sorteo', hecho: true },
  { fecha: '2026-04-24', mes: 'ABR', canal: 'WATI', audiencia: 'Prospectos', tipo: 'WhatsApp', tema: 'Beneficios My Prenatal', hecho: true },
  { fecha: '2026-04-26', mes: 'ABR', canal: 'EVENTO', audiencia: 'Secretarias', tipo: 'Evento', tema: 'Día Secretaria: SORTEO 2 SPA', hecho: true },
  { fecha: '2026-04-27', mes: 'ABR', canal: 'MAIL', audiencia: 'Clientes', tipo: 'Cobranza', tema: 'Cobranza 50%', hecho: true },
  { fecha: '2026-05-05', mes: 'MAY', canal: 'WATI', audiencia: 'Médicos', tipo: 'WhatsApp', tema: 'Sorteo ADN + registro', hecho: true },
  { fecha: '2026-05-05', mes: 'MAY', canal: 'WATI', audiencia: 'Obstetras', tipo: 'Newsletter', tema: 'Comparativo MyPrenatal', hecho: true },
  { fecha: '2026-05-05', mes: 'MAY', canal: 'MAIL', audiencia: 'Clientes', tipo: 'Cobranza', tema: 'Cobranza 50%', hecho: true },
  { fecha: '2026-05-05', mes: 'MAY', canal: 'WATI', audiencia: 'Prospectos', tipo: 'WhatsApp', tema: 'Promo S/2,000 — Descalificados Marzo', hecho: true },
  { fecha: '2026-05-05', mes: 'MAY', canal: 'MAIL', audiencia: 'Anualidades', tipo: 'Cobranza', tema: 'Cobranza + Promo 50%', hecho: true },
  { fecha: '2026-05-08', mes: 'MAY', canal: 'BOLETÍN', audiencia: 'Clientes', tipo: 'Email', tema: 'Día de la Madre + Seguridad Total', hecho: true },
  { fecha: '2026-05-11', mes: 'MAY', canal: 'WATI', audiencia: 'Médicos', tipo: 'WhatsApp', tema: 'Ganadores ADN + Link prospección', hecho: true },
  { fecha: '2026-05-11', mes: 'MAY', canal: 'WATI', audiencia: 'Obstetras', tipo: 'WhatsApp', tema: 'Sorteo + 3 Cupones Nunari', hecho: true },
  { fecha: '2026-05-11', mes: 'MAY', canal: 'WATI', audiencia: 'Secretarias', tipo: 'WhatsApp', tema: 'Anuncio ganadoras + link prospección', hecho: true },
  { fecha: '2026-05-18', mes: 'MAY', canal: 'MAIL', audiencia: 'Clientes', tipo: 'Email', tema: 'Open Lab + Ganadores Día de la Madre', hecho: true },
  { fecha: '2026-05-25', mes: 'MAY', canal: 'WATI', audiencia: 'Médicos', tipo: 'Video', tema: 'Video + Invitación taller MyPrenatal', hecho: true },
  { fecha: '2026-05-25', mes: 'MAY', canal: 'WATI', audiencia: 'Obstetras', tipo: 'Video', tema: 'Video + Link de prospección', hecho: true },
  { fecha: '2026-05-25', mes: 'MAY', canal: 'WATI', audiencia: 'Secretarias', tipo: 'Video', tema: 'Video + Invitación taller + Link', hecho: true },
  { fecha: '2026-06-08', mes: 'JUN', canal: 'MAIL', audiencia: 'Médicos', tipo: 'Newsletter', tema: 'Veritas y CrioCord', hecho: true },
  { fecha: '2026-06-08', mes: 'JUN', canal: 'MAIL', audiencia: 'Obstetras', tipo: 'Newsletter', tema: 'Veritas y CrioCord', hecho: true },
  { fecha: '2026-06-08', mes: 'JUN', canal: 'MAIL', audiencia: 'Secretarias', tipo: 'Newsletter', tema: 'Veritas y CrioCord', hecho: true },
  { fecha: '2026-06-22', mes: 'JUN', canal: 'WATI', audiencia: 'Médicos', tipo: 'Evento', tema: 'Taller Online MyPrenatal: Dr. Armando Rojas', hecho: false },
  { fecha: '2026-06-22', mes: 'JUN', canal: 'WATI', audiencia: 'Obstetras', tipo: 'Evento', tema: 'Evento Obstetras + NUEVO LINK', hecho: false },
]

const ACT = [
  { actividad: 'Cierres Contables', cat: 'Contabilidad', hecho: true, meses: { ENE: '31', FEB: '27', MAR: '31', ABR: '30', MAY: '29', JUN: '30', JUL: '31', AGO: '31', SEP: '30', OCT: '30', NOV: '30', DIC: '31' } },
  { actividad: 'EEFF', cat: 'Contabilidad', hecho: true, meses: { ENE: '9', FEB: '6', MAR: '6', ABR: '9', MAY: '8', JUN: '5', JUL: '6', AGO: '7', SEP: '7', OCT: '7', NOV: '6', DIC: '7' } },
  { actividad: 'Inicio de Ciclo', cat: 'Interno', hecho: true, meses: { ENE: '9', FEB: '6', MAR: '3', ABR: '—', MAY: '2', JUN: '—', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Entrena. Ejecutivos', cat: 'Interno', hecho: true, meses: { ENE: '12-19', FEB: '—', MAR: '07-14', ABR: '—', MAY: '06-13', JUN: '—', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Entrena. Reps VM', cat: 'Interno', hecho: true, meses: { ENE: '20-23', FEB: '—', MAR: '15-20', ABR: '—', MAY: '14-17', JUN: '—', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Open Lab', cat: 'Evento', hecho: true, meses: { ENE: '20', FEB: '17', MAR: '—', ABR: '—', MAY: '18', JUN: '—', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Expoferia Lima / ADN', cat: 'Evento', hecho: false, meses: { ENE: '—', FEB: '—', MAR: '—', ABR: '—', MAY: '—', JUN: '—', JUL: '27-29', AGO: '—', SEP: '—', OCT: '24-26', NOV: '—', DIC: '16-18' } },
  { actividad: 'Congreso Med. Reproductiva', cat: 'Evento', hecho: false, meses: { ENE: '—', FEB: '—', MAR: '—', ABR: '—', MAY: '—', JUN: '—', JUL: '—', AGO: '08-11', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Evento Obstetras', cat: 'Evento', hecho: true, meses: { ENE: '—', FEB: '—', MAR: '—', ABR: '16', MAY: '—', JUN: '—', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Día de la Secretaria', cat: 'Campaña', hecho: true, meses: { ENE: '—', FEB: '—', MAR: '—', ABR: '26', MAY: '—', JUN: '—', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Día Madre / Doctora', cat: 'Campaña', hecho: true, meses: { ENE: '—', FEB: '—', MAR: '—', ABR: '—', MAY: '8', JUN: '—', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Sorteo ADN', cat: 'Campaña', hecho: true, meses: { ENE: '—', FEB: '—', MAR: '—', ABR: '—', MAY: '5', JUN: '—', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Taller Online MyPrenatal', cat: 'Evento', hecho: false, meses: { ENE: '—', FEB: '—', MAR: '—', ABR: '—', MAY: '—', JUN: '22', JUL: '—', AGO: '—', SEP: '—', OCT: '—', NOV: '—', DIC: '—' } },
  { actividad: 'Cenas con Médicos', cat: 'Evento', hecho: false, meses: { ENE: '?', FEB: '?', MAR: '?', ABR: '?', MAY: '?', JUN: '?', JUL: '?', AGO: '?', SEP: '?', OCT: '?', NOV: '?', DIC: '?' } },
]

const PROY_DEF = [
  { id: 'P001', nombre: 'Lanzamiento Nueva Web + CrioWallet', resp: 'Daniel Walcheff', inicio: '2026-05-01', fin: '2026-07-31', estado: 'EN_PROGRESO' as const, notas: 'Ver plan de marketing Canva.' },
  { id: 'P002', nombre: 'Expoferia Maternidad Lima — Stand ADN', resp: 'Daniel Walcheff', inicio: '2026-07-27', fin: '2026-07-29', estado: 'PENDIENTE' as const, notas: 'Cotizar espacio y stand. Jul 27-29.' },
  { id: 'P003', nombre: 'Congreso Peruano Medicina Reproductiva', resp: 'Daniel Walcheff', inicio: '2026-08-08', fin: '2026-08-11', estado: 'PENDIENTE' as const, notas: 'Confirmar participación y cotizar stand.' },
  { id: 'P004', nombre: 'Taller Online MyPrenatal — Dr. Armando Rojas', resp: 'Daniel Walcheff', inicio: '2026-06-22', fin: '2026-06-22', estado: 'PENDIENTE' as const, notas: 'Webinar con nuevo link de prospección.' },
  { id: 'P005', nombre: 'Open Lab Mayo 2026', resp: 'Daniel Walcheff', inicio: '2026-05-18', fin: '2026-05-18', estado: 'FINALIZADO' as const, notas: 'Completado. Ganadores Día de la Madre.' },
  { id: 'P006', nombre: 'Evento Obstetras — Piso 13', resp: 'Daniel Walcheff', inicio: '2026-04-16', fin: '2026-04-16', estado: 'FINALIZADO' as const, notas: 'Realizado. Presentación completa.' },
  { id: 'P007', nombre: 'Sorteo ADN + Registro Mayo', resp: 'Daniel Walcheff', inicio: '2026-05-05', fin: '2026-05-11', estado: 'FINALIZADO' as const, notas: 'Ganadores comunicados 11/05.' },
  { id: 'P008', nombre: 'Campaña Seguridad Total Q2', resp: 'Daniel Walcheff', inicio: '2026-05-01', fin: '2026-06-30', estado: 'EN_PROGRESO' as const, notas: 'Email + WATI a clientes activos.' },
  { id: 'P009', nombre: 'Incorporar Diana — VM Provincia (Junio)', resp: 'Daniel Walcheff', inicio: '2026-06-01', fin: '2026-06-30', estado: 'PENDIENTE' as const, notas: 'Onboarding nueva representante.' },
  { id: 'P010', nombre: 'Semana de la Maternidad Saludable', resp: 'Daniel Walcheff', inicio: '2026-05-01', fin: '2026-05-31', estado: 'EN_PROGRESO' as const, notas: 'Campaña digital activa.' },
]

const BINV = [
  { mes: 'ENE', inv_pub: 12000, inv_total: 35083.78, ppto_total: 48390.27, pct_ejec: 73 },
  { mes: 'FEB', inv_pub: 12423, inv_total: 22671.26, ppto_total: 27258.09, pct_ejec: 83 },
  { mes: 'MAR', inv_pub: 18217, inv_total: 69770.29, ppto_total: 30535.48, pct_ejec: 228 },
  { mes: 'ABR', inv_pub: 19968.5, inv_total: 56631.32, ppto_total: 43172.47, pct_ejec: 131 },
  { mes: 'MAY', inv_pub: 0, inv_total: 22454.92, ppto_total: 23428.92, pct_ejec: 96 },
]

const CAPT_REP = [
  { mes: 'ENE', rep: 'MKT CrioCord', canal: 'online', ucu: 54, tamizaje: 21, adn: 22, myprenatal: 0, total: 97 },
  { mes: 'ENE', rep: 'Milagritos', canal: 'offline', ucu: 13, tamizaje: 5, adn: 3, myprenatal: 0, total: 21 },
  { mes: 'ENE', rep: 'Marylin', canal: 'offline', ucu: 4, tamizaje: 1, adn: 0, myprenatal: 0, total: 5 },
  { mes: 'ENE', rep: 'Adler', canal: 'offline', ucu: 5, tamizaje: 2, adn: 2, myprenatal: 0, total: 9 },
  { mes: 'ENE', rep: 'Velia', canal: 'offline', ucu: 2, tamizaje: 1, adn: 0, myprenatal: 0, total: 3 },
  { mes: 'ENE', rep: 'Alejandra', canal: 'offline', ucu: 2, tamizaje: 0, adn: 0, myprenatal: 0, total: 2 },
  { mes: 'FEB', rep: 'MKT CrioCord', canal: 'online', ucu: 34, tamizaje: 8, adn: 1, myprenatal: 0, total: 43 },
  { mes: 'FEB', rep: 'Milagritos', canal: 'offline', ucu: 5, tamizaje: 1, adn: 1, myprenatal: 0, total: 7 },
  { mes: 'FEB', rep: 'Marylin', canal: 'offline', ucu: 5, tamizaje: 1, adn: 0, myprenatal: 0, total: 6 },
  { mes: 'FEB', rep: 'Adler', canal: 'offline', ucu: 1, tamizaje: 1, adn: 1, myprenatal: 1, total: 4 },
  { mes: 'FEB', rep: 'Velia', canal: 'offline', ucu: 5, tamizaje: 1, adn: 1, myprenatal: 2, total: 9 },
  { mes: 'FEB', rep: 'Alejandra', canal: 'offline', ucu: 2, tamizaje: 2, adn: 0, myprenatal: 0, total: 4 },
  { mes: 'FEB', rep: 'Milagros H', canal: 'offline', ucu: 0, tamizaje: 0, adn: 0, myprenatal: 3, total: 3 },
  { mes: 'MAR', rep: 'MKT CrioCord', canal: 'online', ucu: 45, tamizaje: 16, adn: 20, myprenatal: 0, total: 81 },
  { mes: 'MAR', rep: 'Marylin', canal: 'offline', ucu: 5, tamizaje: 1, adn: 0, myprenatal: 0, total: 6 },
  { mes: 'MAR', rep: 'Adler', canal: 'offline', ucu: 1, tamizaje: 1, adn: 3, myprenatal: 0, total: 5 },
  { mes: 'MAR', rep: 'Velia', canal: 'offline', ucu: 2, tamizaje: 0, adn: 1, myprenatal: 0, total: 3 },
  { mes: 'MAR', rep: 'Alejandra', canal: 'offline', ucu: 3, tamizaje: 0, adn: 1, myprenatal: 0, total: 4 },
  { mes: 'ABR', rep: 'MKT CrioCord', canal: 'online', ucu: 26, tamizaje: 4, adn: 3, myprenatal: 1, total: 34 },
  { mes: 'ABR', rep: 'Marylin', canal: 'offline', ucu: 1, tamizaje: 0, adn: 0, myprenatal: 0, total: 1 },
  { mes: 'ABR', rep: 'Milagros H', canal: 'offline', ucu: 4, tamizaje: 0, adn: 0, myprenatal: 2, total: 6 },
  { mes: 'ABR', rep: 'Velia', canal: 'offline', ucu: 0, tamizaje: 0, adn: 0, myprenatal: 1, total: 1 },
  { mes: 'MAY', rep: 'MKT CrioCord', canal: 'online', ucu: 44, tamizaje: 27, adn: 21, myprenatal: 0, total: 92 },
  { mes: 'MAY', rep: 'Milagros H', canal: 'offline', ucu: 6, tamizaje: 3, adn: 2, myprenatal: 3, total: 14 },
  { mes: 'MAY', rep: 'Marylin', canal: 'offline', ucu: 7, tamizaje: 1, adn: 0, myprenatal: 2, total: 10 },
  { mes: 'MAY', rep: 'Velia', canal: 'offline', ucu: 1, tamizaje: 0, adn: 0, myprenatal: 3, total: 4 },
]

const VM_PROSP = [
  { mes: 'ENE', captador: 'VM (total)', canal: 'vm', leads: 431, captaciones: 40, detalle: 'Milagritos+Marylin+Adler+Velia+Alejandra' },
  { mes: 'FEB', captador: 'VM (total)', canal: 'vm', leads: 656, captaciones: 33, detalle: 'Milagritos+Marylin+Adler+Velia+Alejandra' },
  { mes: 'MAR', captador: 'VM (total)', canal: 'vm', leads: 884, captaciones: 18, detalle: 'Milagros+Marylin+Adler+Velia' },
  { mes: 'ABR', captador: 'Milagros', canal: 'vm', leads: 403, captaciones: 6, detalle: '' },
  { mes: 'ABR', captador: 'Marylin', canal: 'vm', leads: 267, captaciones: 1, detalle: '' },
  { mes: 'ABR', captador: 'Velia', canal: 'vm', leads: 215, captaciones: 1, detalle: '' },
  { mes: 'ENE', captador: 'MKT CrioCord', canal: 'mkt', leads: 1295, captaciones: 97, detalle: 'Comercial 1097 + MKT digital 137 + Anualidades 61' },
  { mes: 'FEB', captador: 'MKT CrioCord', canal: 'mkt', leads: 981, captaciones: 43, detalle: 'Comercial 772 + MKT digital 156 + Anualidades 53' },
  { mes: 'MAR', captador: 'MKT CrioCord', canal: 'mkt', leads: 992, captaciones: 81, detalle: 'Comercial 815 + MKT digital 137 + Anualidades 40' },
  { mes: 'ABR', captador: 'MKT CrioCord', canal: 'mkt', leads: 4575, captaciones: 34, detalle: 'Comercial online + MKT digital + Anualidades' },
  { mes: 'MAY', captador: 'MKT CrioCord', canal: 'mkt', leads: 548, captaciones: 92, detalle: 'MKT digital + Comercial online + Anualidades' },
  { mes: 'MAY', captador: 'Milagros H', canal: 'vm', leads: 244, captaciones: 14, detalle: '' },
  { mes: 'MAY', captador: 'Marylin', canal: 'vm', leads: 161, captaciones: 10, detalle: '' },
  { mes: 'MAY', captador: 'Velia', canal: 'vm', leads: 97, captaciones: 4, detalle: '' },
  { mes: 'JUN', captador: 'MKT CrioCord', canal: 'mkt', leads: 191, captaciones: 0, detalle: 'Online MKT digital + Anualidades; ventas atribuidas a FFVV comercial' },
  { mes: 'JUN', captador: 'Milagros', canal: 'vm', leads: 102, captaciones: 0, detalle: 'Captación pendiente de atribución' },
  { mes: 'JUN', captador: 'Marylin', canal: 'vm', leads: 104, captaciones: 0, detalle: 'Captación pendiente de atribución' },
  { mes: 'JUN', captador: 'Velia', canal: 'vm', leads: 43, captaciones: 0, detalle: 'Captación pendiente de atribución' },
  { mes: 'JUN', captador: 'Diana', canal: 'vm', leads: 4, captaciones: 0, detalle: 'Nueva VM Provincia (onboarding junio)' },
]

// Prospección — INGRESADOS por captador/canal (hoja CRIOCORD, SEGUIMIENTO PROSPECCION
// 2026.xlsx). Métrica = prospectos ingresados (no ventas). cordon = UCU.
const PROSP_ING = [
  // JUN
  { mes: 'JUN', grupo: 'Visitadores', captador: 'Marylin',  cordon: 151, tamizaje: 0, adn: 0,  myprenatal: 9, total: 160 },
  { mes: 'JUN', grupo: 'Visitadores', captador: 'Diana',    cordon: 16,  tamizaje: 0, adn: 0,  myprenatal: 4, total: 20 },
  { mes: 'JUN', grupo: 'Visitadores', captador: 'Milagros', cordon: 231, tamizaje: 1, adn: 0,  myprenatal: 6, total: 238 },
  { mes: 'JUN', grupo: 'Visitadores', captador: 'Velia',    cordon: 98,  tamizaje: 2, adn: 0,  myprenatal: 5, total: 105 },
  { mes: 'JUN', grupo: 'Comercial',   captador: 'Adler',    cordon: 2,   tamizaje: 0, adn: 0,  myprenatal: 0, total: 2 },
  { mes: 'JUN', grupo: 'Comercial',   captador: 'Heinrich', cordon: 5,   tamizaje: 0, adn: 0,  myprenatal: 0, total: 5 },
  { mes: 'JUN', grupo: 'MKT',         captador: 'Daniel',   cordon: 408, tamizaje: 3, adn: 27, myprenatal: 2, total: 440 },
  { mes: 'JUN', grupo: 'Anualidades', captador: 'Katherine',cordon: 2,   tamizaje: 0, adn: 0,  myprenatal: 0, total: 2 },
  { mes: 'JUN', grupo: 'Anualidades', captador: 'Marcos',   cordon: 3,   tamizaje: 0, adn: 0,  myprenatal: 0, total: 3 },
]

// ─── Seed function ────────────────────────────────────────────────────────────

export async function seed() {
  console.log('Seeding database...')

  const allTables = [
    schema.conversionData, schema.serviceMix, schema.visitaMedica, schema.visitaMedicaCategoria,
    schema.clinicas, schema.captacion, schema.presupuesto, schema.historialGastos,
    schema.vendedores, schema.comunicaciones, schema.actividades, schema.proyectos,
    schema.inversionBruta, schema.captacionRep, schema.vmProspeccion,
    schema.prospeccionIngresos,
  ]
  for (const t of allTables) {
    try { await db.delete(t) } catch (e: any) { console.error('delete fail', e?.message ?? e) }
  }

  // Each insert runs independently: a failure in one table no longer leaves
  // the rest empty, and `results` reports exactly which table failed.
  const results: Record<string, string> = {}
  const step = async (name: string, fn: () => Promise<unknown>) => {
    try { await fn(); results[name] = 'ok'; console.log('✓', name) }
    catch (e: any) { results[name] = 'ERROR: ' + (e?.message ?? e); console.error('✗', name, e?.message ?? e) }
  }

  await step('conversion_data', () => db.insert(schema.conversionData).values(CONV.map(d => ({
    mes: d.mes, mayoMode: d.mayo_mode, ing: d.ing, val: d.val, serv: d.serv,
    monto: d.monto, venta: d.venta, ventaOnline: d.venta_online, ventaOffline: d.venta_offline,
    cac: d.cac, roas: d.roas, cpl: d.cpl, cpa: d.cpa,
    cr1: d.cr1, cr2: d.cr2, cr3: d.cr3, roiPct: d.roi_pct,
  }))))

  await step('service_mix', () => db.insert(schema.serviceMix).values(MIX.map(d => ({
    mes: d.mes, servicio: d.servicio, servicios: d.servicios, venta: d.venta,
  }))))

  await step('visita_medica', () => db.insert(schema.visitaMedica).values(VM.map(d => ({
    mes: d.mes, exec: d.exec, zona: d.zona, visitas: d.visitas, potUso: d.pot_uso, notas: d.notas,
  }))))

  await step('visita_medica_categoria', () => db.insert(schema.visitaMedicaCategoria).values(VMCAT.map(d => ({
    mes: d.mes, exec: d.exec, cat: d.cat, visitas: d.visitas,
  }))))

  await step('clinicas', () => db.insert(schema.clinicas).values(CLIN.map(d => ({
    clinica: d.clinica, rep: d.rep, zona: d.zona, visitas: d.visitas, mes: d.mes,
  }))))

  await step('captacion', () => db.insert(schema.captacion).values(CAPT.map(d => ({
    captador: d.captador, canal: d.canal, mes: d.mes, ventas: d.ventas,
  }))))

  await step('presupuesto', () => db.insert(schema.presupuesto).values(PPTO.map(d => ({
    mes: d.mes, online: d.online, offline: d.offline, eventos: d.eventos,
    gastado: d.gastado, gastoTotal: d.gasto_total, pptoPlan: d.ppto_plan, cumplPct: d.cumpl_pct,
  }))))

  await step('historial_gastos', () => db.insert(schema.historialGastos).values(HIST.map(d => ({
    fecha: d.fecha, mes: d.mes, categoria: d.categoria, descripcion: d.desc, monto: d.monto,
  }))))

  await step('vendedores', () => db.insert(schema.vendedores).values(VEND.map(d => ({
    exec: d.exec, zona: d.zona, mes: d.mes, ucu: d.ucu, adn: d.adn,
    tamizaje: d.tamizaje, myprenatal: d.myprenatal, segTotal: d.seg_total,
    leads: d.leads, validos: d.validos,
  }))))

  await step('comunicaciones', () => db.insert(schema.comunicaciones).values(COMMS.map(d => ({
    fecha: d.fecha, mes: d.mes, canal: d.canal, audiencia: d.audiencia,
    tipo: d.tipo, tema: d.tema, hecho: d.hecho,
  }))))

  await step('actividades', () => db.insert(schema.actividades).values(ACT.map(d => ({
    actividad: d.actividad, cat: d.cat, hecho: d.hecho, meses: d.meses,
  }))))

  await step('proyectos', () => db.insert(schema.proyectos).values(PROY_DEF))

  await step('inversion_bruta', () => db.insert(schema.inversionBruta).values(BINV.map(d => ({
    mes: d.mes, invPub: d.inv_pub, invTotal: d.inv_total,
    pptoTotal: d.ppto_total, pctEjec: d.pct_ejec,
  }))))

  await step('captacion_rep', () => db.insert(schema.captacionRep).values(CAPT_REP.map(d => ({
    mes: d.mes, rep: d.rep, canal: d.canal, ucu: d.ucu, tamizaje: d.tamizaje,
    adn: d.adn, myprenatal: d.myprenatal, total: d.total,
  }))))

  await step('vm_prospeccion', () => db.insert(schema.vmProspeccion).values(VM_PROSP.map(d => ({
    mes: d.mes, captador: d.captador, canal: d.canal,
    leads: d.leads, captaciones: d.captaciones, detalle: d.detalle,
  }))))

  await step('prospeccion_ingresos', () => db.insert(schema.prospeccionIngresos).values(PROSP_ING.map(d => ({
    mes: d.mes, grupo: d.grupo, captador: d.captador,
    cordon: d.cordon, tamizaje: d.tamizaje, adn: d.adn, myprenatal: d.myprenatal, total: d.total,
  }))))

  console.log('\nSeed complete.', results)
  return results
}
