# PROMPT COWORK — AUTOMATIZACIÓN DECK DE MARKETING CRIOCORD
## SEGUIMIENTO KPIS 2026 · HOJA TOTAL · MES DE ABRIL

---

## 🎯 OBJETIVO

Automatizar el llenado del **DECK DE MARKETING (SEGUIMIENTO KPIS 2026.xlsx)** para el mes de **ABRIL 2026**, extrayendo datos de dos archivos fuente en OneDrive y calculando los KPIs correspondientes. El resultado se escribirá en un **archivo local nuevo** (copia del deck) sin tocar los archivos originales del OneDrive.

---

## 📁 ARCHIVOS INVOLUCRADOS

### 1. DECK DE MARKETING (DESTINO — se clona localmente)
- **Nombre:** `SEGUIMIENTO KPIS 2026.xlsx`
- **OneDrive:** `dwalcheff@criocord.com.pe` → `Documents/4. MARKETING/1. ADMINISTRATIVO PROMOCION/RESULTADOS COM-MKT/DECKS DE MARKETING/`
- **Drive ID:** `b!z41ivl5V2UeN4cirssXecaQUKNkvyY9OiKBzDg6JRRU-KIMlbPkMQagZcNNdWW-G`
- **Item ID:** `01HR4RPXE6LKKZATJO4BBITKSYEMAMG3CW`
- **Hoja a trabajar:** `TOTAL` (las columnas siguen el orden ENERO→DICIEMBRE)
- **⚠️ IMPORTANTE:** Descargar una copia local. NO editar el archivo en OneDrive.

### 2. SEGUIMIENTO DE PROSPECCION (FUENTE)
- **Nombre:** `SEGUIMIENTO PROSPECCION 2026.xlsx`
- **OneDrive:** `dwalcheff@criocord.com.pe` → `Documents/4. MARKETING/1. ADMINISTRATIVO PROMOCION/SEGUIMIENTO DE PROSPECCION/2026/`
- **Drive ID:** `b!z41ivl5V2UeN4cirssXecaQUKNkvyY9OiKBzDg6JRRU-KIMlbPkMQagZcNNdWW-G`
- **Item ID:** `01HR4RPXBNL3VGRLFS4JBLIDX5QHCY7Q5C`

### 3. PRESUPUESTO CONSOLIDADO MKT (FUENTE)
- **Nombre:** `PPTO CONSOLIDADO MKT DW.xlsx`
- **OneDrive:** `murteaga@criocord.com.pe` → `Documents/Documentos/Marketing/Presupuestos/2026/`
- **Drive ID:** `b!rPw68EJVXkeKtl53cXE-tAYTkZM8XKBFjA6rlEklVxsSPa6dMlIEQJS2GRPwXdz8`
- **Item ID:** `01GF536ENOPN66PT4OYBBKFE253L2GZNW4`

---

## 🗂️ ESTRUCTURA DEL DECK — HOJA TOTAL

La hoja TOTAL del deck tiene las siguientes filas clave (los datos de cada mes están en columnas de ENERO a DICIEMBRE):

| Fila / Etiqueta | Descripción | Fuente |
|---|---|---|
| **TOTAL PROSPECTOS (2026)** | Total de prospectos ingresados válidos del mes | PROSPECCION |
| **MONTO 26** | Gasto promocional del mes (S/) | PPTO MKT DW |
| **TOTAL PROSPECTOS (2025)** | Total prospectos válidos del mismo mes del año anterior | PROSPECCION (referencia) |
| **% vs LY** | Variación vs año anterior (calculado) | Fórmula |
| **UCU / ADN / TAMIZ / MYPREN** (ventas 2026) | Ventas por servicio del mes | PROSPECCION |
| **TOTAL SERV 26** | Suma de ventas todos los servicios 2026 | Fórmula |
| **% TC 26** | Tasa de cierre = TOTAL SERV 26 / TOTAL PROSPECTOS VÁLIDOS | Fórmula |
| **LEADS G.** | Número de leads generados — **INGRESO MANUAL** | Manual por Daniel |
| **LEAD A PROSPECTO** | Conversión lead→prospecto = TOTAL PROSPECTOS / LEADS G. | Fórmula |
| **CONVERSION PROSP-CLIENTE** | Conversión prospecto→cliente = TOTAL SERV / TOTAL PROSPECTOS | Fórmula |

**Valores ya confirmados para meses anteriores (ENERO–MARZO):**
- Enero: Prospectos válidos = 1,765 · Monto = S/ 12,000 · Ventas = 139
- Febrero: Prospectos válidos = 1,696 · Monto = S/ 12,423 · Ventas = 81
- Marzo: Prospectos válidos = 1,443 · Monto = S/ 18,217 · Ventas = 100

---

## 📊 PASO 1 — EXTRAER DATOS DE PROSPECTOS (ABRIL)

**Archivo:** `SEGUIMIENTO PROSPECCION 2026.xlsx`

### Prospectos Totales Válidos (TOTAL GENERAL CRIOCORD)

El total de prospectos válidos de ABRIL = suma de TODAS las fuentes válidas:

**ONLINE:**
- **COMERCIAL (FFVV):** Sumar columna VALIDOS de: LOURDES + HEINRRICH + CAROLINA + LISETH + ADLER (en su rol comercial) → Total FFVV Comercial
- **MARKETING (MKT):** Sumar columna VALIDOS de: DANIEL + ANDREA GIUSTI + ROBERTO + LUIS → Total MKT
- **ANUALIDADES:** Sumar columna VALIDOS de: MARCOS + KATHERINE → Total Anualidades

**OFFLINE:**
- **VISITADORES (VM):** Sumar columna VALIDOS de: MILAGROS + MARYLIN + VELIA → Total Visitadores
  - *(Nota: para ABRIL, ADLER aparece en el rol VISITADOR en la hoja de Abril)*

**TOTAL GENERAL CRIOCORD VÁLIDOS ABRIL = COMERCIAL + MKT + ANUALIDADES + VISITADORES**

> ⚠️ Para el deck HOJA TOTAL, el campo "Total Prospectos" es este TOTAL GENERAL VÁLIDO.

### Ventas por Servicio (ABRIL)

En la sección **REPORTE DE VENTAS DEL MES - ABRIL** del archivo PROSPECCION:

- **UCU (CORDONES):** Total de ventas de Cordones del mes (MKT + VM combinados)
- **ADN:** Total de ventas de ADN del mes
- **TAMIZ (TAMIZAJE):** Total de ventas de Tamizaje del mes
- **MYPREN (MY PRENATAL):** Total de ventas de My Prenatal del mes
- **TOTAL SERV 26 ABRIL = UCU + ADN + TAMIZ + MYPREN**

**Desglose por canal:**
- MKT CRIO = ventas online (columna MKT CRIO del reporte de ventas)
- VM = ventas offline (suma de MILAGROS + MARYLIN + VELIA + ADLER en el reporte de ventas)

---

## 💰 PASO 2 — CALCULAR GASTO PROMOCIONAL (MONTO 26 ABRIL)

**Archivo:** `PPTO CONSOLIDADO MKT DW.xlsx`

El gasto promocional de ABRIL es la suma de las categorías INCLUIDAS, excluyendo explícitamente ciertos ítems.

### FÓRMULA DEL GASTO PROMOCIONAL:

```
MONTO 26 ABRIL = GASTO ONLINE + GASTO OFFLINE + EVENTOS/ACTIVIDADES + CAMPAÑAS
```

### GASTO ONLINE (incluir):
- ✅ Extensión PREMIUM SENDER
- ✅ CHAT GPT MKT
- ✅ Meta (campañas enfocadas a prospección)
- ✅ Google (campañas de prospección)
- ✅ Tik Tok (campañas de prospección)
- ✅ Brevo (correos masivos)
- ✅ SMS
- ✅ Wati ANUALIDADES — **solo mensajes + MFTs** (NO la suscripción)
- ❌ **EXCLUIR:** Wati ANUALIDADES Suscripción
- ❌ **EXCLUIR:** Wati COMERCIALES (suscripción y mensajes)
- ❌ **EXCLUIR:** Capcut
- ❌ **EXCLUIR:** Calendly (plan y plan Fcells)
- ❌ **EXCLUIR:** N8n
- ❌ **EXCLUIR:** Zapier

> ⚠️ Nota interpretativa: "WATI ANUALIDADES" = los mensajes de WhatsApp para prospectos de anualidades SÍ se incluyen. Solo se excluye la suscripción fija de plataforma.

### GASTO OFFLINE (incluir):
- ✅ Materiales y recursos:
  - Trípticos UCU
  - Trípticos PARAGUAS
  - Tarjetas
  - Acrílicos (porta trípticos)
  - Tarjetones
  - Invitaciones
  - Precontratos
- ❌ **EXCLUIR:** Bolsas para Kit Lona
- ❌ **EXCLUIR:** Bolsas para kit tocuyo
- ❌ **EXCLUIR:** Caja nuevo KIT
- ❌ **EXCLUIR:** Bolsas de Criobag
- ❌ **EXCLUIR:** Caja Chica (de Jefe MKT, Representantes y Promotores)
- ✅ Influencer / Anualidad / Colaboración
- ✅ Testimonios de clientes
- ✅ Cortesías y Canjes (Offline)
- ✅ Viajes y provincias de representantes (Velia, Adler, etc.) — gastos de traslado vinculados a prospección

### EVENTOS / ACTIVIDADES DE DIFUSIÓN (TODO — incluir completo):
- ✅ Expoferia Maternidad (Lima, Arequipa, Cuzco, Huancayo) — participación + armado + gastos adicionales
- ✅ Congresos médicos (Ginecología, Obstetricia, ALAPP, SPOG, etc.)
- ✅ Entrevistas con médicos (honorarios + sala de podcast)
- ✅ Activaciones en clínicas
- ✅ Webinars online
- ✅ Charlas médicas presenciales
- ✅ Open Lab
- ✅ Inicios de Ciclo (catering + RR PP + sala)
- ✅ Entrenamiento (Olga Soto)
- ✅ Obstetras Criocord (catering)
- ✅ Cortesías y Canjes (Eventos)

### CAMPAÑAS (TODO — incluir completo):
- ✅ Branding - Freelance
- ✅ Chatbot / IA N8N / Respuesta automática
- ✅ El regalo más grande / Embarazada "Mama Criocord"
- ✅ Más que Criopreservación
- ✅ Vallas publicitarias
- ✅ Referidos de clientes / Momento WOW / Baby Flowers
- ✅ Cualquier otro ítem categorizado como CAMPAÑA

### RESULTADO:
```
MONTO 26 ABRIL = [suma de todos los ítems INCLUIDOS en la columna ABRIL del PPTO MKT DW]
```

**Referencia de valores ABRIL del PPTO MKT DW (ya leídos):**
- Criocord TOTAL GASTO ABRIL = S/ 62,401.32
- Adntro TOTAL GASTO ABRIL = S/ 2,522
- My Prenatal TOTAL GASTO ABRIL = S/ 9,076.75
- Tamizaje TOTAL GASTO ABRIL = S/ 0

> El MONTO 26 del deck NO es el total bruto del PPTO. Es solo la porción de gasto PROMOCIONAL según las exclusiones definidas arriba. Hay que sumar ítem por ítem de la columna ABRIL aplicando las reglas de inclusión/exclusión.

---

## 🧮 PASO 3 — CALCULAR KPIs (HOJA TOTAL, ABRIL)

Con los datos obtenidos en Pasos 1 y 2, calcular:

### Tasa de Cierre (% TC 26)
```
% TC 26 ABRIL = TOTAL SERV 26 ABRIL / TOTAL PROSPECTOS VÁLIDOS ABRIL
```
*Ejemplo: si ventas = 96 y prospectos = 3,347 → % TC = 2.87% ≈ 2.9%*

### Variación vs Año Anterior (% vs LY)
```
% vs LY ABRIL = (TOTAL PROSPECTOS VÁLIDOS 2026 ABRIL / TOTAL PROSPECTOS VÁLIDOS 2025 ABRIL) - 1
```
*El valor 2025 ya está en el deck (fila 2025 de la HOJA TOTAL). Para ABRIL 2025 = 2,209*

### Lead a Prospecto
```
LEAD A PROSPECTO ABRIL = TOTAL PROSPECTOS VÁLIDOS / LEADS GENERADOS
```
*⚠️ LEADS GENERADOS es dato MANUAL — Daniel lo ingresa directamente en el deck.*

### Conversión Prospecto → Cliente
```
CONVERSION PROSP-CLIENTE ABRIL = TOTAL SERV 26 / TOTAL PROSPECTOS VÁLIDOS
```
*(Mismo cálculo que % TC 26, expresado diferente en el deck)*

### CAC (Costo por Adquisición de Cliente)
```
CAC ABRIL = MONTO 26 / TOTAL SERV 26
```

### ROI %
```
ROI ABRIL = (VENTAS TOTALES S/ - MONTO 26) / MONTO 26 × 100
```
*Las ventas totales en S/ están en el deck (fila VENTA — es el revenue total del mes)*

---

## 📝 PASO 4 — ESCRIBIR EN EL ARCHIVO LOCAL

1. **Descargar** `SEGUIMIENTO KPIS 2026.xlsx` del OneDrive a una carpeta local (ej. `C:\Criocord\Decks\` o la carpeta que indique Daniel).
2. **Renombrar** la copia como `SEGUIMIENTO KPIS 2026 - ABRIL [fecha].xlsx` para no confundirlo con el original.
3. **Abrir** el archivo y localizar la **HOJA TOTAL**.
4. **Ubicar la columna ABRIL** (la 4ª columna de datos, luego de ENERO, FEBRERO, MARZO).
5. **Escribir los siguientes valores:**

| Campo en el deck | Valor calculado |
|---|---|
| TOTAL PROSPECTOS VÁLIDOS 2026 (fila de prospectos 2026) | [resultado Paso 1] |
| MONTO 26 | [resultado Paso 2] |
| UCU (ventas 2026) | [UCU extraído Paso 1] |
| ADN (ventas 2026) | [ADN extraído Paso 1] |
| TAMIZ (ventas 2026) | [TAMIZ extraído Paso 1] |
| MYPREN (ventas 2026) | [MYPREN extraído Paso 1] |
| % TC 26 | [calculado Paso 3] |
| % vs LY | [calculado Paso 3] |
| CAC | [calculado Paso 3] |
| ROI % | [calculado Paso 3] |
| LEADS G. | ⚠️ DEJAR EN BLANCO — lo ingresa Daniel manualmente |
| LEAD A PROSPECTO | ⚠️ DEJAR EN BLANCO — depende de LEADS G. |
| CONVERSION PROSP-CLIENTE | [calculado Paso 3] |

6. **Guardar** el archivo local.
7. **Reportar** al usuario un resumen con todos los valores escritos y las fórmulas utilizadas.

---

## ⚠️ REGLAS Y RESTRICCIONES

1. **NUNCA modificar los archivos originales en OneDrive.** Solo lectura. Siempre trabajar sobre la copia local.
2. **LEADS GENERADOS** es siempre ingreso manual de Daniel — nunca intentar inferirlo o calcularlo.
3. **Los meses ENERO, FEBRERO y MARZO ya están llenados** — no tocar esas columnas.
4. Trabajar únicamente con la **HOJA TOTAL** (no las hojas por servicio UCU, ADN, TAMIZ, MYPREN — esas vienen en una segunda etapa).
5. Si algún ítem del PPTO MKT DW tiene valor 0 o está vacío para ABRIL → se suma como S/ 0.
6. Mostrar siempre el **detalle del cálculo del MONTO 26** (ítem por ítem incluido) para que Daniel pueda verificarlo.
7. Si hay algún ítem ambiguo en el PPTO (no está claro si incluir o excluir) → listar el ítem, indicar el monto, y preguntar a Daniel antes de sumarlo.

---

## 🔄 FLUJO DE EJECUCIÓN PASO A PASO

```
1. Conectar a OneDrive de dwalcheff@criocord.com.pe
2. Leer SEGUIMIENTO PROSPECCION 2026.xlsx → extraer datos de ABRIL
   a. Total prospectos válidos (TOTAL GENERAL CRIOCORD)
   b. Ventas por servicio: UCU, ADN, TAMIZ, MYPREN
3. Conectar a OneDrive de murteaga@criocord.com.pe
4. Leer PPTO CONSOLIDADO MKT DW.xlsx → columna ABRIL
   a. Sumar ítems INCLUIDOS según reglas de exclusión
   b. Calcular MONTO 26
5. Calcular KPIs: % TC, % vs LY, CAC, ROI, Conversión
6. Descargar copia local de SEGUIMIENTO KPIS 2026.xlsx
7. Escribir valores calculados en la copia local (HOJA TOTAL, columna ABRIL)
8. Guardar y reportar resumen al usuario
```

---

## 📌 NOTAS ADICIONALES PARA COWORK

- El deck usa **Soles peruanos (S/)** — mantener siempre esa denominación.
- Los porcentajes en el deck se muestran con 1 decimal (ej. `7.9%`, `3.1%`).
- Los valores de S/ en el deck aparecen con formato `S/ X,XXX.X` — respetar formato.
- Para mayo en adelante, el mismo proceso aplica, pero leyendo la columna MAYO del PPTO MKT DW y el mes MAYO del archivo de prospección.
- **Futura expansión:** Una vez validada la HOJA TOTAL, se replicará el mismo proceso para las hojas por servicio (UCU, ADN, TAMIZAJE, MY PRENATAL).

---

*Prompt preparado el 14/05/2026 · Basado en análisis directo de los tres archivos en OneDrive.*
*Elaborado por Claude (Anthropic) con acceso a la cuenta Microsoft 365 de Daniel Walcheff.*
