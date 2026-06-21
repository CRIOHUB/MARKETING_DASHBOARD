# BRIEFING — Dashboard Marketing CrioCord 2026
> Referencia técnica y de contenido para revisión y continuación del proyecto.  
> Actualizado al: 26/05/2026 · Autor: Daniel Walcheff

---

## 1. ARCHIVOS DEL PROYECTO

| Archivo | Ubicación local |
|---|---|
| Dashboard HTML (abrir en navegador) | `DECK DE MARKETING/DASHBOARD CRIOCORD 2026.html` |
| Script generador Python | `DECK DE MARKETING/GENERAR_DASHBOARD.py` |
| Acceso rápido (doble clic) | `DECK DE MARKETING/▶ ABRIR DASHBOARD.bat` |
| Logo CrioCord (pendiente de colocar aquí) | `DECK DE MARKETING/logo_criocord.png` ← guardar aquí para que se embeba |

> **Para regenerar el dashboard:** ejecutar `▶ ABRIR DASHBOARD.bat` o correr `python GENERAR_DASHBOARD.py` desde la carpeta.

---

## 2. FUENTES DE DATOS (ONEDRIVE)

| Nombre | Enlace | Qué alimenta |
|---|---|---|
| SEGUIMIENTO KPIS 2026 | https://pecriocord-my.sharepoint.com/:x:/g/personal/dwalcheff_criocord_com_pe/IQCeWpWQTS7gQomqWCMAw2xWAZJBQ-MyZ5hA2UTpCLqTyIQ?e=LRiUsS | Inversión publicitaria (monto 26), conversión, ROAS, KPIs |
| PPTO CONSOLIDADO MKT DW | https://pecriocord-my.sharepoint.com/:x:/g/personal/murteaga_criocord_com_pe/IQCue33nz47AQqKTXdr0bLbcAZ2JyPGIQSLn0a4-dDR8UZ8?e=acHopA | Inversión total MKT, presupuesto planificado |
| SEGUIMIENTO PROSPECCION 2026 | https://pecriocord-my.sharepoint.com/personal/dwalcheff_criocord_com_pe/Documents/4.%20MARKETING/1.%20ADMINISTRATIVO%20PROMOCION/SEGUIMIENTO%20DE%20PROSPECCION/2026/SEGUIMIENTO%20PROSPECCION%202026.xlsx | Captación por rep y servicio (online/offline por unidades) |
| CAPTACION ONLINE/OFFLINE detalle | https://pecriocord-my.sharepoint.com/:x:/g/personal/dwalcheff_criocord_com_pe/IQAtXuporLLiQrQO_YHFj8OiAfEO0zeZjRqXtvxjUal_eMQ?e=caSJeU | Unidades online vs offline por servicio y por representante |
| CRONOGRAMA 2026 | https://pecriocord-my.sharepoint.com/personal/dwalcheff_criocord_com_pe/Documents/Daniel%20Walcheff%20-%20Personal/2025/SEGUIMIENTOS%20PERSONALES/CRONOGRAMA%202026%20FINAL.xlsx | Cronograma de actividades |
| PLAN DE MARKETING (Canva) | https://canva.link/p96n1grngu39whh | Referencia del plan comercial |
| VENDEDORES (Canva) | https://canva.link/oyhkmdd208y33og | Referencia metas vendedores |

---

## 3. REGLAS DE NEGOCIO (INVARIABLES)

- **Solo CrioCord** — excluir Lazo de Vida completamente.
- **No filtro por Marca** — el dashboard siempre muestra solo CrioCord.
- **Nunca mostrar:** pagos a médicos/secretarias/parteras, comisiones, sueldos, viáticos, escalas de comisión 2026, ROI por representante médico.
- **Visita Médica:** solo actividad + cobertura + captación. Nunca datos financieros de los representantes.
- **Lenguaje:** nunca "cura"; usar siempre "potencial de uso", "herramienta de apoyo", "según indicación médica".
- **No modificar archivos originales en OneDrive** — solo leer. Trabajar en copia local.

---

## 4. CLASIFICACIÓN ONLINE / OFFLINE

| Canal | Quiénes |
|---|---|
| **Online / Digital** | MKT: Daniel Walcheff, Roberto Oliden, Luis Julca, Andrea, Lourdes, Gerson, Yvan, Katherine, Marcos + Comercial: Liseth Rondon, Heinrrich Stechmann, Carolina Vasques + Anualidades |
| **Offline / VM** | SOLO: Milagros Herrera, Marylin, Velia (visitas médicas directas) |
| **Nota Adler Rosales** | Estuvo en MKT hasta marzo 2026; pasó a Comercial en abril |

---

## 5. REPRESENTANTES DE PROMOCIÓN (VM/Campo)

| Nombre | Estado |
|---|---|
| Velia | Activa |
| Marylin | Activa |
| Milagros H (Milagros Herrera) | Activa |
| Milagritos | Activa |
| Alejandra | Activa |
| Renzo | Activo |
| Adler | En VM hasta mar 2026 (luego pasó a Comercial) |

---

## 6. DESDE MAYO 2026 — CAMBIO EN MÉTRICA

- **Antes de mayo (ENE–ABR):** se mide Lead → Prospecto Válido → Cliente (3 etapas, CR1 + CR2 + CR3).
- **Desde mayo en adelante:** todos los prospectos = Leads. Solo se mide Lead → Cliente (CR3). No existe más "Prospecto Válido".
- En el código esto se controla con el flag `mayo_mode: true/false` en cada registro del array `CONV`.

---

## 7. METAS POR VENDEDOR (`META_VEND`)

Estas metas son **solo para seguimiento de cumplimiento**, NO para calcular comisiones.

| Zona | UCU | ADN | Tamizaje | MyPrenatal |
|---|---|---|---|---|
| Lima | 30 | 15 | 15 | 12 |
| Provincia | 10 | 5 | 5 | 4 |

Vendedores comerciales (Comercial / Ejecutivos):
- Liseth Rondon (Lima)
- Adler Rosales (Lima, desde ABR)
- Heinrrich Stechmann (Provincia)
- Carolina Vasques (Provincia/Lima)

---

## 8. DETALLE POR PESTAÑA DEL DASHBOARD

---

### 8.1 RESUMEN ← recientemente actualizado

**Fuentes:** SEGUIMIENTO KPIS 2026 + PPTO CONSOLIDADO MKT DW + SEGUIMIENTO PROSPECCION 2026

**KPIs fila 1 (Inversión):**
- Inversión Publicitaria (Meta/Google/Digital) ← monto 26 del KPIS 2026
- Inversión Total MKT (totalidad del área) ← PPTO CONSOLIDADO MKT DW
- Presupuesto Total Planificado
- % Ejecutado promedio

**Datos hardcodeados confirmados:**

| Mes | Inv. Publicitaria | Inv. Total MKT | Presupuesto | % Ejec. |
|---|---|---|---|---|
| ENE | S/ 12,000.00 | S/ 35,083.78 | S/ 48,390.27 | 73% |
| FEB | S/ 12,423.00 | S/ 22,671.26 | S/ 27,258.09 | 83% |
| MAR | S/ 18,217.00 | S/ 69,770.29 | S/ 30,535.48 | 228% |
| ABR | S/ 19,968.50 | S/ 57,531.32 | S/ 43,172.47 | 133% |

**KPIs fila 2 (Desempeño):**
- Ventas Acumuladas · Clientes Totales · ROAS Promedio · CR Lead→Cliente

**Gráficos:**
1. Inversión Pub vs Total MKT vs Presupuesto — barras agrupadas con % ejecutado encima
2. Captación Online vs Offline en **UNIDADES** — con filtro por servicio (UCU, Tamizaje, ADN, MyPrenatal)
3. ROAS Mensual
4. Tasa de Conversión simplificada: CR3 (Lead→Cliente) + CR1 punteado solo ENE-ABR

**Tabla — Captación por Representante y Servicio:**
- FEB 2026 confirmado desde el archivo de captación (screenshot recibido)
- ENE, MAR, ABR: pendientes de actualización

**Datos FEB confirmados:**

| Rep | Canal | UCU | Tamizaje | ADN | MyPrenatal | Total |
|---|---|---|---|---|---|---|
| MKT CrioCord | Online | 34 | 12 | 6 | 0 | 52 |
| Milagritos | Offline | 5 | 1 | 1 | 0 | 7 |
| Marylin | Offline | 5 | 1 | 0 | 0 | 6 |
| Adler | Offline | 1 | 1 | 1 | 1 | 4 |
| Velia | Offline | 5 | 1 | 1 | 2 | 9 |
| Alejandra | Offline | 2 | 2 | 0 | 0 | 4 |
| Milagros H | Offline | 0 | 0 | 0 | 3 | 3 |

**PENDIENTE para RESUMEN:**
- [ ] Datos de captación ENE, MAR, ABR por rep y servicio (del archivo de prospección)
- [ ] Logo CrioCord: guardar `logo_criocord.png` en la carpeta y regenerar

---

### 8.2 VISITA MÉDICA

**Fuente:** SEGUIMIENTO PROSPECCION 2026

**Filtros:** por Representante (Milagros Herrera, Marylin, Velia) + filtro global de mes

**KPIs:** Total Visitas · Clínicas Cubiertas · Potencial de Uso · Ventas Captadas VM

**Gráficos:**
1. Visitas por Representante / Mes (barras agrupadas)
2. Ventas por Captador / Mes (barras apiladas — Digital + 3 VM reps)
3. Visitas por Categoría: Médicos / Obstetras / Secretarias (pie)
4. Cobertura por Clínica (barras horizontales — visitas + ventas)

**Tabla:** Mes · Representante · Zona · Visitas · Potencial de Uso

**Restricción:** solo actividad, cobertura y captación. Sin datos financieros de los representantes.

**PENDIENTE:**
- [ ] Actualizar con nuevos representantes: Milagritos, Alejandra, Renzo (solo tienen datos reales desde sus fechas de incorporación)

---

### 8.3 MARKETING KPIS (reemplaza "Conversión & ROAS")

**Fuente:** SEGUIMIENTO KPIS 2026

**Framework:** CONQUER

**KPIs (8 cajas):** Total Leads · Total Clientes · CPL Promedio · CPA Promedio · ROAS Promedio · ROI Acumulado · CAC Promedio · CR Lead→Cliente

**Gráficos:**
1. CPL & CPA por Mes (barras agrupadas)
2. ROAS & ROI% Mensual (doble eje)
3. Embudo de Conversión — 3 etapas ENE-ABR / 2 etapas desde MAY
4. Tasas CR1 / CR2 / CR3 por mes (líneas)
5. Inversión vs Ventas mensual (barras agrupadas)

**Tabla:** todos los KPIs por mes, con nota "≡ leads" en columna Prospecto para MAY+

**Nota mayo:** banner naranja que explica el cambio de métrica desde mayo

---

### 8.4 MIX DE SERVICIOS

**Fuente:** SEGUIMIENTO KPIS 2026

**Servicios:** UCU · ADN · Tamizaje · MyPrenatal · Seguridad Total

**Gráficos:**
1. Distribución por Servicio — pie (unidades acumuladas)
2. Unidades por Servicio / Mes — barras apiladas
3. Ventas Online vs Offline por Mes (S/) — barras apiladas (proporciones estimadas 78/22%)

**Tabla:** UCU · ADN · Tamizaje · MyPrenatal · Seg. Total · Total por mes

**PENDIENTE:**
- [ ] El gráfico Online vs Offline del Mix usa proporción estimada (78% online / 22% offline). Reemplazar con datos reales cuando estén disponibles.

---

### 8.5 PRESUPUESTO

**Fuente:** PPTO CONSOLIDADO MKT DW

**KPIs:** Presupuesto Planificado · Gasto Promocional · Gasto Total Ejecutado · % Cumplimiento

**Gráficos:**
1. Presupuesto Total vs Gasto Ejecutado por Mes — barras agrupadas con % encima (verde ≤100%, rojo >100%)
2. % de Cumplimiento por Mes — barras de color variable
3. Distribución por Categoría — pie (Digital / Eventos / Administrativo)

**Tabla historial:** fecha · categoría · descripción · monto (cada gasto registrado)

---

### 8.6 VENDEDORES

**Fuente:** SEGUIMIENTO KPIS 2026 / archivo de vendedores

**Filtros:** por Asesor (Liseth Rondon, Adler Rosales, Heinrrich Stechmann, Carolina Vasques) + filtro global de mes

**KPIs por asesor:** UCU · ADN · Tamizaje · MyPrenatal con barra de progreso vs meta Q2

**Referencia Q2 metas Lima:** UCU=30, ADN=15, Tamizaje=15, MyPrenatal=12  
**Referencia Q2 metas Provincia:** UCU=10, ADN=5, Tamizaje=5, MyPrenatal=4

**Gráficos:**
1. UCU por Asesor / Mes — con línea punteada roja = meta cuando hay un solo asesor seleccionado
2. ADN por Asesor / Mes
3. Tamizaje por Asesor / Mes
4. Cumplimiento de Objetivos — radar o barras de % vs meta

**Restricción:** solo cumplimiento de metas, nunca comisiones ni incentivos económicos.

---

### 8.7 CRONOGRAMA

Calendario de actividades de marketing 2026. Incluye:
- Comunicaciones enviadas (WATI, Mail, Newsletter, Eventos) con estado Hecho/Pendiente
- Actividades internas (cierres contables, entrenamientos, Open Lab, ferias, congresos)

---

### 8.8 PROYECTOS

Kanban de proyectos de marketing. Estado: EN_PROGRESO / PENDIENTE / FINALIZADO / DETENIDO.  
Datos persisten en `localStorage` del navegador. Se pueden agregar/editar/eliminar desde el dashboard.

---

### 8.9 GLOSARIO

Definiciones de todos los KPIs y términos del dashboard. Incluye nota "(antes: ADN Newborn)" para ADN como referencia histórica.

---

## 9. PENDIENTES GLOBALES

| # | Pendiente | Fuente de datos |
|---|---|---|
| 1 | Captación por rep/servicio ENE, MAR, ABR | Archivo de captación online/offline |
| 2 | Logo CrioCord (guardar PNG en carpeta y regenerar) | Archivo `logo_criocord.png` |
| 3 | Nuevos representantes VM (Milagritos, Alejandra, Renzo) con datos reales | SEGUIMIENTO PROSPECCION 2026 |
| 4 | Actualizar datos MKT (equipo completo: Andrea, Lourdes, Gerson, Yvan, Katherine, Marcos) | SEGUIMIENTO PROSPECCION 2026 |
| 5 | Online/Offline en unidades para ENE, MAR, ABR (Mix de Servicios) | Archivo de captación |
| 6 | Datos MAY 2026 en adelante cuando estén disponibles | SEGUIMIENTO KPIS 2026 |

---

## 10. ARQUITECTURA TÉCNICA

- **Lenguaje:** Python 3 (script generador) → HTML + JS autónomo (sin servidor)
- **Librerías JS:** Plotly.js 2.35.2 · Bootstrap 5.3.3 · Bootstrap Icons 1.11.3 · SheetJS 0.18.5
- **Datos:** JSON embebido en el HTML. El script lee `CRIOCORD - DATA HUB 2026.xlsx` si está presente; si no, usa datos hardcodeados.
- **Filtro global de mes:** función `gF(arr)` filtra cualquier array por mes seleccionado. `aplicarFiltroGlobal()` reconstruye todos los gráficos.
- **Mayo mode:** flag `mayo_mode` en cada registro de CONV. Controla si se muestra Prospecto Válido (false) o se unifica con Lead (true).
- **Colores diferenciados (8):**
  - AZ=#0B5394 · DO=#C9A961 · TQ=#16A085 · NA=#E67E22 · PU=#8E44AD · RO=#E74C3C · VE=#27AE60 · CI=#2980B9

---

*Documento generado por Claude (Cowork) para continuación del proyecto en nueva sesión.*
