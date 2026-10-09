# ⚽ Rivas CF - Sistema Oficial de Estadísticas y Gestión de Plantilla

**Proyecto Académico para la carrera de Ingeniería en Sistemas**  
Desarrollado con tecnologías web estándar (**HTML5**, **CSS3** y **JavaScript Vanilla**) con persistencia en **LocalStorage**.  
Personalizado y enfocado exclusivamente en el club de fútbol **Rivas CF**.

---

## 📋 1. Objetivo del Proyecto

El objetivo principal de **Rivas CF Stats** es proporcionar una plataforma web interactiva, moderna y ligera para la **gestión integral de la plantilla del primer equipo de Rivas CF**, el seguimiento de sus estadísticas individuales y colectivas, la visualización de fichas técnicas deportivas (*Scouting Cards*), y el control de su desempeño en la liga.

La aplicación permite inscribir y dar de baja futbolistas, subir o generar fotografías deportivas, registrar los resultados de los partidos del club y calcular dinámicamente tanto la valoración de rendimiento (**Rating OVR de 50 a 99**) como la tabla de clasificación del campeonato, **sin depender de servidores externos ni bases de datos complejas**.

---

## 🛡️ 2. Características del Sistema para Rivas CF

1. **Gestión Integral de la Plantilla (Roster Management):**
   - Todos los futbolistas pertenecen exclusivamente a la plantilla de **Rivas CF**.
   - Barra superior con **chips de desglose en vivo**:
     - 👥 **Plantilla Total:** Cantidad de futbolistas activos.
     - 🧤 **Porteros:** Cantidad de guardametas en plantilla.
     - 🛡️ **Defensas:** Centrales y laterales.
     - ⚙️ **Centrocampistas:** Medios y volantes creativos.
     - ⚡ **Delanteros:** Extremos y goleadores.
     - 🎖️ **Capitán:** Identificación del líder o capitanes oficiales del club.

2. **Inscripción y Edición Rápida de Jugadores:**
   - Botón directo **"+ Inscribir Jugador"**.
   - Subida de fotografía desde la computadora o celular (con compresión automática mediante HTML5 Canvas a menos de 25 KB para proteger la memoria de LocalStorage).
   - Generación automática de avatares deportivos vectoriales SVG si no se dispone de foto física.
   - Atributos completos: Nombre, Dorsal (con validación de no duplicidad en el club), Posición, Altura (cm), Nacionalidad con bandera, Pierna Hábil, e interruptor de **Capitán del Club**.
   - Cálculo en tiempo real de la **Valoración de Rendimiento (Rating OVR)** y **Valor de Mercado Estimado (€M)**.

3. **Bajas de Jugadores Optimizadas:**
   - Botón de papelera (🗑️) en la tabla y en la tarjeta del jugador.
   - Ventana modal de confirmación deportiva: *"¿Estás seguro de que deseas dar de baja a [Nombre] (#Dorsal) de la plantilla oficial de Rivas CF?"*.
   - Al confirmar, el jugador se elimina inmediatamente de la plantilla, recalculando en tiempo real los contadores, chips, fichas técnicas y gráficos del club.

4. **Dashboard de Rendimiento del Club:**
   - Tarjetas KPI: Total de Jugadores, Partidos Disputados por Rivas CF, Goles Marcados por Rivas CF, Asistencias del Equipo.
   - Gráfico nativo con Canvas: **Goleadores de la Plantilla de Rivas CF** (barras con los máximos anotadores del primer equipo).
   - Listas de máximos goleadores, máximos asistentes y últimos resultados del club.

5. **Galería de Fichas Técnicas (Scouting & Trading Cards):**
   - Cartas coleccionables con el dorsal, bandera, altura, pierna hábil, valoración OVR y valor de mercado.
   - Brazalete dorado **© CAPITÁN** para los capitanes del equipo.
   - Filtro para ver únicamente capitanes y ordenamientos avanzados.

6. **Competición de Liga:**
   - Registro de los partidos de Rivas CF frente a sus rivales de liga (AD Parla, CD Móstoles, RSD Alcalá, Pozuelo CF, Las Rozas CF, etc.).
   - Tabla de posiciones oficial donde **Rivas CF aparece resaltado con un diseño exclusivo (borde verde neón y medalla ⭐ RIVAS CF)**.

---

## 📁 3. Estructura de Archivos

```text
Futbol Estadisticas/
│
├── index.html        # Interfaz de Rivas CF, plantilla, dashboard, fichas y modales
├── styles.css        # Tema oscuro atlético, cartas de scouting y resaltado de Rivas CF
├── script.js         # Lógica de Rivas CF, compresión de fotos, bajas, OVR y LocalStorage
├── tests.html        # Suite de 18 pruebas automatizadas para Rivas CF
└── README.md         # Documentación académica y manual de usuario
```

---

## 🚀 4. Cómo Ejecutar el Proyecto

Dado que la aplicación funciona íntegramente en el navegador cliente:

1. Abre el explorador de archivos de Windows y dirígete a:
   `C:\Users\DELL\Documents\Futbol Estadisticas`
2. Haz **doble clic** sobre el archivo `index.html`.
3. Se abrirá automáticamente en tu navegador web predeterminado (Chrome, Edge, Firefox o Brave).

---

## 🧪 5. Guía para Probar las Funciones Paso a Paso

### 1. Inscribir un Nuevo Jugador en Rivas CF
1. En la pestaña **"Plantilla Rivas CF"** (o en el encabezado), pulsa **"+ Inscribir Jugador"**.
2. Sube una fotografía desde tu equipo o deja que se genere el avatar automático con sus iniciales.
3. Rellena los datos (ejemplo: *Álvaro Morata*, Dorsal *99*, Posición *Delantero*, Altura *189 cm*, Nacionalidad *España 🇪🇸*, Pierna *Derecha*).
4. Asigna sus partidos y goles (ej. *8 PJ, 6 Goles, 2 Asistencias*).
5. Observa cómo el formulario calcula en vivo su **Rating OVR** (ej. *86 OVR - Jugador Clave*) y su valor de mercado.
6. Pulsa **"Guardar en Plantilla de Rivas CF"**.
7. Verás la notificación emergente (*Toast*) y el contador de la plantilla aumentará a 21 jugadores.

### 2. Dar de Baja (Eliminar) a un Jugador
1. En cualquier fila de la tabla de la plantilla, pulsa el botón rojo de la **papelera (🗑️)**.
2. Aparecerá el modal de confirmación con los datos del jugador.
3. Pulsa **"Confirmar"**.
4. El futbolista será eliminado inmediatamente de la plantilla de Rivas CF y todos los contadores y fichas técnicas se actualizarán al instante.

### 3. Filtros y Búsqueda en la Plantilla
1. Escribe en el buscador de la plantilla (ej. `"David"` o `"Colombia"`).
2. Filtra por posición (*Delantero*, *Centrocampista*, *Defensa*, *Portero*).
3. Marca la casilla **"Solo Capitanes ©"** para ver únicamente a los capitanes oficiales del club.
4. Cambia el ordenamiento (*Más Goles*, *Mayor Rendimiento OVR*, *Dorsal #*).

### 4. Consultar Fichas Técnicas
1. Ve a la pestaña **"Fichas Técnicas"**.
2. Observa las cartas de los jugadores de Rivas CF con sus atributos físicos y métricas de rendimiento.
3. Haz clic en **"Ficha Técnica"** en cualquiera de ellas para abrir la ventana con el informe ampliado.

### 5. Registrar Partido y Ver a Rivas CF en la Tabla
1. Ve a la pestaña **"Partidos del Club"**.
2. Registra un nuevo encuentro (ejemplo: *Rivas CF* [3] vs *CD Móstoles* [0]).
3. Ve a la pestaña **"Clasificación de Liga"**: comprobarás que Rivas CF aparece en lo alto de la tabla con la fila destacada en verde neón y su medalla **⭐ RIVAS CF**.

### 6. Ejecutar las Pruebas Automatizadas
- Abre el archivo `tests.html` en tu navegador.
- Ejecuta 18 pruebas unitarias y de integración que verifican la persistencia, la pertenencia exclusiva a Rivas CF, el desglose de posiciones, la adición/eliminación de jugadores y la tabla de liga.

---

## 👨‍💻 Créditos
- **Club:** Rivas CF
- **Proyecto:** Rivas CF Stats
- **Propósito:** Proyecto Académico de Ingeniería en Sistemas
- **Licencia:** Abierta para fines formativos
