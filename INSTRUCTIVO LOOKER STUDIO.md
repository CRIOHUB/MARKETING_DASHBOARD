# INSTRUCTIVO LOOKER STUDIO — CRIOCORD PERÚ 2026
**Dashboard de KPIs de Marketing | Embudo 5 Etapas**
*Versión 1.0 — Mayo 2026 | Dueño: Equipo MKT Digital*

---

## ¿QUÉ ES LOOKER STUDIO?

Looker Studio (antes Google Data Studio) es una herramienta **gratuita** de Google para crear dashboards interactivos conectados a fuentes de datos en tiempo real. Para CrioCord, es la herramienta recomendada porque:

- **Gratuita** para el uso que necesitamos
- **Conectores nativos** para GA4, Google Ads y Google Sheets (sin costo adicional)
- **Actualización automática** diaria de los datos
- **Compartir por link** sin instalar nada en el computador del receptor
- **Filtros interactivos** (Mes, Representante, Servicio, Canal, Ciudad)

---

## PASO 1 — PREPARACIÓN (30 minutos)

### 1.1 Cuentas necesarias
Antes de empezar, verifica que tienes acceso a:

| Cuenta | Para qué | URL |
|--------|----------|-----|
| Google (Gmail corporativo) | Acceso a Looker Studio | accounts.google.com |
| GA4 de criocord.com.pe | Sesiones web, usuarios nuevos | analytics.google.com |
| Google Ads | Impresiones, clics, inversión | ads.google.com |
| Google Sheets | DATA HUB 2026 (copia en Drive) | drive.google.com |
| Meta Business Suite | Meta Ads (manual/CSV) | business.facebook.com |

> **IMPORTANTE:** Usa siempre el correo `dwalcheff@criocord.com.pe` (o el corporativo designado) para que los permisos queden centralizados.

### 1.2 Subir el DATA HUB a Google Sheets
El archivo `CRIOCORD - DATA HUB 2026.xlsx` que está en tu carpeta local debe subirse a Google Drive:

1. Abre [drive.google.com](https://drive.google.com)
2. Crear carpeta: **MKT CrioCord 2026 → Dashboard**
3. Arrastra el archivo `CRIOCORD - DATA HUB 2026.xlsx` a esa carpeta
4. Click derecho → **"Abrir con Google Sheets"** → se convierte automáticamente
5. Renombrar como: `CRIOCORD - DATA HUB 2026 [MASTER]`
6. Guardar la URL (la necesitarás en el Paso 3)

> **Regla:** Cada mes actualizas las pestañas CONVERSION y VISITA_MEDICA en este Sheets y el dashboard se refresca automáticamente.

---

## PASO 2 — CREAR EL REPORTE EN LOOKER STUDIO (20 minutos)

### 2.1 Abrir Looker Studio
1. Ir a [lookerstudio.google.com](https://lookerstudio.google.com)
2. Click en **"Crear"** → **"Informe"**
3. Se abrirá el editor de reportes

### 2.2 Configurar el tamaño de página
1. Menu **Página** → **Configuración de página actual**
2. Formato: **A4 horizontal** (para impresión) o **Pantalla ancha (16:9)** (para presentaciones)
3. Color de fondo: `F5F0FA` (lila muy claro, tono CrioCord)

---

## PASO 3 — CONECTAR FUENTES DE DATOS

### 3.1 Conectar Google Analytics 4 (GA4)
*Para: Sesiones web, Usuarios nuevos, Tiempo en página*

1. En Looker Studio, panel derecho → **"Añadir datos"**
2. Buscar y seleccionar: **"Google Analytics"**
3. Autorizar acceso con tu cuenta Google
4. Seleccionar la propiedad: **criocord.com.pe**
5. Click **"Añadir"**

**Dimensiones y métricas útiles de GA4:**
| Dimensión/Métrica | Nombre en GA4 | Uso en dashboard |
|---|---|---|
| Fecha | `Date` | Filtrar por mes |
| Sesiones | `Sessions` | Awareness — sesiones web |
| Usuarios nuevos | `New Users` | Awareness — usuarios nuevos |
| Tiempo medio en página | `Average Session Duration` | Consideración |
| País/Ciudad | `City` | Filtro geográfico |
| Fuente/Medio | `Session Source/Medium` | Canal de origen |
| Tasa de rebote | `Bounce Rate` | Calidad del tráfico |

> Si GA4 no está configurado en el sitio, contactar al proveedor web para instalar el `measurement ID` (G-XXXXXXX).

### 3.2 Conectar Google Ads
*Para: Impresiones, Clics, CTR, Inversión, CPL*

1. Panel derecho → **"Añadir datos"** → **"Google Ads"**
2. Autorizar y seleccionar la cuenta de Google Ads de CrioCord
3. Click **"Añadir"**

**Métricas útiles de Google Ads:**
| Métrica | Nombre | Uso |
|---|---|---|
| Impresiones | `Impressions` | Awareness |
| Clics | `Clicks` | Consideración |
| CTR | `CTR` | Consideración |
| Costo | `Cost` | Inversión por canal |
| Conversiones | `Conversions` | Leads from Google |
| CPC | `Average CPC` | Eficiencia |

### 3.3 Conectar Google Sheets (DATA HUB)
*Para: Visita Médica, Conversión, Retención, PPTO_DETALLE*

1. Panel derecho → **"Añadir datos"** → **"Google Sheets"**
2. Seleccionar: `CRIOCORD - DATA HUB 2026 [MASTER]`
3. **Repetir 7 veces** (una por pestaña):
   - Seleccionar pestaña `CONVERSION` → "Añadir" → nombrar **"Fuente: CONVERSION"**
   - Seleccionar pestaña `VISITA_MEDICA` → nombrar **"Fuente: VISITA_MEDICA"**
   - Seleccionar pestaña `AWARENESS` → nombrar **"Fuente: AWARENESS"**
   - Seleccionar pestaña `CONSIDERACION` → nombrar **"Fuente: CONSIDERACION"**
   - Seleccionar pestaña `RETENCION` → nombrar **"Fuente: RETENCION"**
   - Seleccionar pestaña `PPTO_DETALLE` → nombrar **"Fuente: PPTO_DETALLE"**
   - Seleccionar pestaña `GLOSARIO` → nombrar **"Fuente: GLOSARIO"**

> **Tip:** En cada conexión a Sheets, activa la opción **"Usar primera fila como encabezado"**.

### 3.4 Conectar Meta Ads (vía CSV o Supermetrics)
*Meta Ads no tiene conector nativo gratuito en Looker Studio.*

**Opción A — Manual (sin costo, recomendada para empezar):**
1. Exportar datos de Meta Ads Manager en CSV cada mes
2. Copiar los datos en una nueva pestaña del DATA HUB llamada `META_ADS_MANUAL`
3. Looker Studio leerá los datos desde Google Sheets automáticamente

Columnas a exportar desde Meta Ads Manager:
```
Fecha | Campaña | Conjunto de anuncios | Impresiones | Alcance | 
Clics | CTR | Inversión (S/) | Leads (formulario) | CPL | CPM
```

**Opción B — Supermetrics (tiene costo, ~$99/mes):**
1. Ir a [supermetrics.com](https://supermetrics.com)
2. Seleccionar conector **"Meta Ads → Google Sheets"**
3. Se configura una vez y actualiza automáticamente cada día
4. Looker Studio lee directamente desde Sheets

**Opción C — Plugin Supermetrics ya instalado en tu cuenta:**
> Tu cuenta ya tiene acceso al plugin `marketing:supermetrics`. Consulta con el equipo si está activo para conectar Meta Ads directamente.

---

## PASO 4 — CONSTRUIR LAS PÁGINAS DEL DASHBOARD (60-90 minutos)

### Estructura de páginas recomendada:

| Página | Nombre | Fuente principal |
|--------|--------|-----------------|
| 1 | Resumen Ejecutivo | CONVERSION + GA4 |
| 2 | Awareness & Consideración | GA4 + Google Ads + AWARENESS |
| 3 | Visita Médica | VISITA_MEDICA |
| 4 | Conversión por Canal | CONVERSION |
| 5 | Retención & Anualidades | RETENCION |
| 6 | Detalle Financiero | CONVERSION + PPTO_DETALLE |
| 7 | Glosario | GLOSARIO |

### 4.1 Añadir filtros globales (Filtros de Informe)
Estos filtros afectan a **todas las páginas** del reporte:

1. Menu **"Recursos"** → **"Gestionar los filtros del informe"**
2. Añadir los siguientes controles en la cabecera de cada página:

| Control | Tipo | Campo | Fuente |
|---------|------|-------|--------|
| Mes | Lista desplegable | `Fecha` (mes) | CONVERSION |
| Representante | Lista desplegable | `Representante` | VISITA_MEDICA |
| Servicio | Casillas | `Servicio` | CONVERSION |
| Ciudad | Lista desplegable | `Ciudad` | VISITA_MEDICA |
| Canal | Lista desplegable | `Canal` | CONVERSION |

> **NO incluir filtro Marca** — el dashboard es 100% CrioCord.

### 4.2 Tipos de visualización recomendados

**Big Numbers (KPIs):**
- Insertar → Selector de gráficos → **"Tarjeta de resultados"**
- Conectar a: CONVERSION, campo `Venta_S/` o `Servicios_Cerrados`
- Activar comparación con período anterior (flecha ▲▼)

**Gráfico de embudo:**
- Insertar → **"Gráfico de embudo"** (si está disponible) o simular con barras horizontales
- Campos: Leads → Ingresados → Válidos → Servicios
- Fuente: CONVERSION

**Tabla con tendencia (YoY):**
- Insertar → **"Tabla"**
- Dimensión: `Fecha` (mes)
- Métricas: `Servicios_Cerrados`, `ROAS`, `CAC`, `Pct_TC`
- Activar **"Comparación"** → Mismo período año anterior

**Gráfico de líneas (tendencia mensual):**
- Insertar → **"Gráfico de líneas"**
- Dimensión: `Fecha`
- Métricas: dos series — `Válidos 2026` y `Válidos 2025` (YoY)
- Colores: `#6B2D8A` (2026) y `#C9A961` (2025)

**Mapa por ciudad:**
- Insertar → **"Mapa geográfico"**
- Dimensión: `Ciudad`
- Métrica: `Visitas`
- Fuente: VISITA_MEDICA
- Filtrar por: País = Perú

**Donut de mix de servicios:**
- Insertar → **"Gráfico circular"**
- Dimensión: `Servicio`
- Métrica: `Servicios_Cerrados`
- Colores: UCU=#6B2D8A, ADN=#E8B4D8, Tamizaje=#C9A961, MyPrenatal=#2E7D32

**Heatmap CAC × Canal × Mes:**
- Insertar → **"Tabla dinámica"**
- Dimensión fila: `Canal`
- Dimensión columna: `Fecha` (mes)
- Métrica: `CAC`
- Activar escala de color (rojo=alto, verde=bajo)

### 4.3 Paleta de colores CrioCord

Configura estos colores como tema del reporte:
```
Color primario:   #6B2D8A  (lila)
Color secundario: #E8B4D8  (rosa)
Color acento:     #C9A961  (dorado)
Fondo:            #F5F0FA  (lila claro)
Texto:            #1A1A1A  (casi negro)
Éxito (verde):    #00B050
Alerta (rojo):    #C00000
Advertencia:      #FFC000
```

Para aplicar: **Tema y diseño** → **"Personalizar"** → ingresa los hex arriba.

---

## PASO 5 — CONFIGURAR ACTUALIZACIÓN AUTOMÁTICA

### 5.1 Actualización de Google Sheets
Los datos de GA4 y Google Ads se actualizan solos. Para el DATA HUB en Sheets:

1. Abrir `CRIOCORD - DATA HUB 2026 [MASTER]` en Google Sheets
2. **Extensiones** → **Apps Script**
3. Pegar este script para forzar refresco diario:

```javascript
function refreshData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var timestamp = new Date();
  sheet.getSheetByName('GLOSARIO').getRange('I2').setValue(
    'Última actualización: ' + timestamp.toLocaleString('es-PE')
  );
}

function createDailyTrigger() {
  ScriptApp.newTrigger('refreshData')
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();
}
```

4. Ejecutar `createDailyTrigger()` una vez → el script correrá todos los días a las 7am

### 5.2 Caché de Looker Studio
Looker Studio cachea los datos cada 12 horas por defecto. Para forzar actualización:
- Click en **⟳ (Actualizar datos)** en la barra superior del reporte
- O configurar caché en: **Recursos** → **Gestionar fuentes de datos** → **Editar** → cambiar "Actualización de datos" a **"1 hora"** (o el mínimo disponible)

---

## PASO 6 — PUBLICAR Y COMPARTIR

### 6.1 Publicar el reporte
1. Click en **"Compartir"** (botón azul superior derecho)
2. Añadir correos del equipo con rol **"Puede ver"**:
   - Dirección general
   - Jefes de área
   - Equipo MKT
3. Para vista pública (solo lectura): **"Administrar acceso"** → **"Cualquier usuario con el enlace puede ver"**

### 6.2 Obtener el link público
1. Click **"Compartir"** → **"Obtener enlace"**
2. Copiar el link → compartir por WhatsApp o correo
3. El receptor puede ver el dashboard en cualquier dispositivo **sin instalar nada**

### 6.3 Embed en sitio web o intranet (opcional)
1. **Archivo** → **"Incorporar informe"**
2. Copiar el código `<iframe>` generado
3. Pegarlo en la intranet o página interna de CrioCord

---

## PASO 7 — MANTENIMIENTO MENSUAL (15 minutos)

El día **4 de cada mes** (para tener el deck listo el día 5):

1. **Actualizar DATA HUB en Google Sheets:**
   - Abrir `CRIOCORD - DATA HUB 2026 [MASTER]`
   - Pestaña CONVERSION: añadir fila con datos del mes cerrado
   - Pestaña VISITA_MEDICA: añadir filas con resumen por representante
   - Pestaña RETENCION: actualizar métricas de anualidades (cuando disponibles)

2. **Exportar Meta Ads (si no tienes Supermetrics):**
   - Meta Ads Manager → Informes → Exportar CSV del mes
   - Copiar datos en pestaña `META_ADS_MANUAL` del Sheets

3. **Verificar que Looker Studio actualizó:**
   - Abrir el link del dashboard
   - Click **⟳ Actualizar datos**
   - Confirmar que los nuevos datos aparecen correctamente

4. **Tomar screenshot del dashboard** para el deck PowerPoint/PDF mensual

---

## PASO 8 — SOLUCIÓN DE PROBLEMAS COMUNES

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| "No hay datos" en una tabla | Filtro muy restrictivo | Ampliar rango de fechas o quitar filtros |
| Datos de GA4 no aparecen | Permisos o propiedad incorrecta | Verificar acceso en GA4 Admin |
| Meta Ads no conecta | Sin conector nativo gratuito | Usar Opción A (CSV manual) |
| Looker Studio no carga | Caché antigua | Click ⟳ o abrir en modo incógnito |
| Números no coinciden con Excel | Zona horaria diferente | Alinear zona horaria GA4 = America/Lima |
| Error "fuente desconectada" | Google Sheets movido o renombrado | Reconectar fuente en Recursos |

---

## REFERENCIAS Y RECURSOS

- [Looker Studio Help Center](https://support.google.com/looker-studio)
- [GA4 + Looker Studio: Guía oficial](https://support.google.com/analytics/answer/9021920)
- [Google Ads Connector](https://support.google.com/looker-studio/answer/7020238)
- [Supermetrics para Looker Studio](https://supermetrics.com/looker-studio)
- [Tutorial YouTube: Dashboard de Marketing en Looker Studio](https://youtube.com/results?search_query=looker+studio+marketing+dashboard)

---

## CONTACTO Y SOPORTE

| Responsable | Rol | Contacto |
|-------------|-----|----------|
| Daniel Walcheff | Jefe MKT / Dueño del dashboard | dwalcheff@criocord.com.pe |
| MKT Digital | Actualización semanal de datos | — |
| IT / Web | Configuración GA4 en el sitio | — |

---

*CrioCord Perú 2026 — Documento de uso interno. No compartir externamente sin autorización.*
*Generado: 22/05/2026 | v1.0*
