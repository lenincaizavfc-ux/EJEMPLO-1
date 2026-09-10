# AUDITORÍA DE ACCESIBILIDAD (WCAG 2.2 AA), UX Y DISEÑO RESPONSIVE

**Proyecto:** Página dedicada a Cristiano Ronaldo  
**Ubicación:** `C:\EJEMPLO 1\paginaCristianoRonaldo\`  
**Archivos evaluados:**
- `index.html` (18.933 bytes, 428 líneas)
- `styles.css` (14.949 bytes, 791 líneas)
- `script.js` (6.161 bytes, 194 líneas)
- Directorio de imágenes `img/` (7 archivos JPEG)  
**Modalidad de la auditoría:** No destructiva (ningún archivo de código fuente ha sido modificado).  
**Herramientas de verificación empleadas:** Node.js v24 (verificación sintáctica), Headless Microsoft Edge vía Chrome DevTools Protocol (CDP) para mediciones de layout en tiempo de ejecución, script de cálculo de luminancia relativa y contraste WCAG 2.2, análisis estático de marcado HTML5 y especificación WAI-ARIA 1.2.

---

## 1. RESUMEN EJECUTIVO

Se ha realizado una auditoría exhaustiva de accesibilidad web bajo el estándar internacional **WCAG 2.2 (Nivel AA)**, combinada con una evaluación de **Experiencia de Usuario (UX)** y **Diseño Web Responsivo** sobre el sitio web dedicado a Cristiano Ronaldo.

### 1.1. Estado General y Conclusiones Principales
El sitio presenta una base visual moderna, cuidada y con una paleta cromática oscura de alto impacto visual. Cuenta con fortalezas notables: una declaración semántica base estructurada (`<header>`, `<main>`, `<footer>`, `<section>`), una jerarquía de encabezados ordenada (`h1` a `h3`), contraste cromático de texto excelente que supera holgadamente los umbrales mínimos de WCAG (ratios superiores a 7:1 y 14:1 en la mayoría de textos), imágenes con textos alternativos descriptivos y sintaxis JavaScript válida sin errores fatales en consola.

Sin embargo, la auditoría ha identificado **fallos funcionales y de accesibilidad críticos y de severidad alta** que impiden la conformidad plena con **WCAG 2.2 AA** y degradan la experiencia de navegación para usuarios con discapacidades motrices, visuales o que navegan exclusivamente con teclado:

1. **Incumplimiento de WCAG 2.2 AA (Criterio 2.5.8 - Target Size Minimum):** El botón de menú móvil (`#menuToggle`) presenta una altura física interactiva de solo **18,78 px**, por debajo del mínimo normativo de **24 × 24 px**.
2. **Encabezados ocultos a tecnología asistiva:** Los 11 títulos `<h3>` de la trayectoria están atrapados dentro de contenedores colapsados con `aria-hidden="true"`, impidiendo que los lectores de pantalla descubran la estructura de la carrera.
3. **Colisión visual y funcional en 768 px:** Existe un solapamiento directo confirmado empíricamente entre el subtítulo del sitio (`.site-tagline`) y el botón de menú móvil (`.menu-toggle`) debido a un conflicto de media queries en `@media (min-width: 768px)` y `@media (max-width: 768px)`.
4. **Enlace de salto ("Skip link") omitido en el HTML:** El CSS contiene estilos completos para `.skip-link`, pero el elemento nunca fue insertado en `index.html`.
5. **Inaccesibilidad de teclado en la tabla responsive:** La tabla de estadísticas genera desbordamiento horizontal en pantallas pequeñas (`overflow-x: auto`), pero carece de foco de teclado (`tabindex="0"`), imposibilitando que usuarios de teclado revisen las columnas ocultas.
6. **Ocultamiento de contenido por cabecera fija:** La cabecera en escritorio mide **121,58 px**, pero el CSS declara `--header-height: 80px;`, provocando que al navegar por anclas se oculte la parte superior de las secciones bajo la barra fija.

### 1.2. Resumen Cuantitativo de Hallazgos

| Severidad | Total | Principales áreas afectadas |
| :--- | :---: | :--- |
| **Crítica** | 3 | Tamaño de objetivos táctiles (WCAG 2.5.8), Árbol de accesibilidad en Timeline (WCAG 1.3.1 / 4.1.2), Colisión de breakpoint en 768 px |
| **Alta** | 5 | Omisión de Skip Link, Navegación de teclado en tabla responsive, Desajuste de scroll-padding vs header fijo, Intercepción destructiva de hash en JS, Ausencia de `prefers-reduced-motion` |
| **Media** | 6 | Nombres accesibles en botones de hitos, Falsa interactividad en galería (`cursor: pointer`), `aria-label` estático en menú móvil, Inconsistencia de Scroll Spy en Hero, Dimensiones invertidas en imágenes (CLS), Falta de `scope="row"` y leyenda en tabla |
| **Baja** | 5 | Atributo `type="button"` omitido en 12 botones, Frase en idioma extranjero sin atributo `lang`, Resiliencia estadística en HTML inicial, Contraste de bordes decorativos, Contención de scroll en menú móvil horizontal |
| **Total** | **19** | |

---

## 2. CRITERIOS QUE CUMPLEN SATISFACTORIAMENTE

Para garantizar un reporte equilibrado y objetivo, se certifica el cumplimiento de los siguientes requisitos:

- **Estructura base del documento (WCAG 3.1.1 - Nivel A):** Declaración de tipo de documento correcta (`<!DOCTYPE html>`) y presencia del atributo de idioma primario `<html lang="es">`.
- **Control del Viewport y Escalabilidad (WCAG 1.4.4 - Nivel AA):** Meta-etiqueta `<meta name="viewport" content="width=device-width, initial-scale=1.0">` sin directivas restrictivas (`user-scalable=no` o `maximum-scale=1.0` ausentes), permitiendo zoom del usuario hasta el 200%.
- **Contraste de Color de Texto (WCAG 1.4.3 - Nivel AA):**
  - Texto base (`#e8e6e3`) sobre fondo (`#0a0a0f`): **15,86:1** (Supera ampliamente el umbral de 4,5:1).
  - Texto base (`#e8e6e3`) sobre superficies (`#14141f` y `#1c1c2e`): **14,67:1** y **13,43:1**.
  - Texto atenuado (`#9a9a9a`) sobre fondo (`#0a0a0f`): **7,02:1** (Cumple AA).
  - Dorado primario (`#d4a843`) sobre fondo (`#0a0a0f`): **8,92:1** (Cumple AA).
  - Botón primario (texto `#0a0a0f` sobre fondo `#d4a843`): **8,92:1** (Excelente contraste).
- **Indicador de Foco Visible (WCAG 2.4.7 - Nivel AA):** Definición global `:focus-visible` con contorno sólido de 3 px en color dorado (`#d4a843`) y desfase (`outline-offset: 3px`), con un contraste de 8,92:1 contra el fondo.
- **Textos alternativos en imágenes (WCAG 1.1.1 - Nivel A):** Las 7 imágenes del proyecto cuentan con atributo `alt` redactado de manera coherente, descriptiva y en español, sin textos redundantes del tipo "imagen de".
- **Jerarquía de Encabezados (WCAG 1.3.1 - Nivel A):** Estructura lineal y consistente desde `<h1>` (título del sitio) pasando por `<h2>` (secciones) hasta `<h3>` (subsecciones y tablas), sin saltos injustificados de niveles (p. ej. no hay saltos de `h1` a `h3`).
- **Navegación y Cierre con Teclado del Menú Móvil (WCAG 2.1.2 - Nivel A):** El script implementa captura de la tecla `Escape` para cerrar el menú desplegado y devolver el foco al botón disparador.
- **Ausencia de Desbordamiento Horizontal Global (WCAG 1.4.10 - Nivel AA):** El documento principal (`<html>` y `<body>`) no produce scroll horizontal involuntario en las resoluciones evaluadas (320 px, 390 px, 768 px y 1200 px).
- **Sintaxis de JavaScript:** Archivos `script.js` y `server.js` con sintaxis ECMAScript válida, sin errores de compilación ni excepciones no controladas en el ciclo inicial.

---

## 3. HALLAZGOS Y EVIDENCIA CONCRETA

### 3.1. Hallazgos Críticos

#### [CRIT-01] Botón de menú móvil no cumple el tamaño mínimo de objetivo táctil (WCAG 2.2 AA Criterio 2.5.8)
- **Archivos:** `styles.css` (líneas 125–132, 134–146), `index.html` (líneas 17–19).
- **Elemento afectado:** `<button class="menu-toggle" id="menuToggle">`.
- **Evidencia empírica:** Medición realizada mediante CDP a 320 px, 390 px y 768 px:
  - Ancho medido: **45,19 px**.
  - Altura física medida: **18,78 px**.
  - **Motivo técnico:** El contenedor del botón tiene `padding: 0.4rem 0.6rem;` (6,4 px vertical). El elemento `.hamburger` tiene `height: 2px;`. Los trazos superior e inferior son pseudoelementos `::before` y `::after` con `position: absolute; top: -7px; / top: 7px;`. Al estar posicionados de manera absoluta, **no aportan altura al cálculo del modelo de caja del botón padre**.
  - **Criterio vulnerado:** WCAG 2.2 AA – 2.5.8 *Target Size (Minimum)* que exige un tamaño mínimo de **24 × 24 px** CSS.

#### [CRIT-02] Encabezados `<h3>` de la trayectoria ocultos a lectores de pantalla por uso de `aria-hidden="true"`
- **Archivos:** `index.html` (líneas 100–229), `styles.css` (líneas 449–466).
- **Elemento afectado:** Todos los bloques `<div class="timeline-detail" id="timeline-detail-..." aria-hidden="true">` y sus encabezados hijos `<h3>`.
- **Evidencia concreta:**
  En el estado colapsado inicial, el HTML contiene:
  ```html
  <div class="timeline-detail" id="timeline-detail-2002" aria-hidden="true">
    <h3>Debut profesional — Sporting CP</h3>
    <p>Con tan solo 17 años...</p>
  </div>
  ```
  Al aplicar `aria-hidden="true"`, el navegador elimina todo el subárbol del árbol de accesibilidad. Cuando un usuario de lector de pantalla pulsa la tecla rápida de navegación por encabezados (`H` en NVDA/JAWS/VoiceOver), los 11 hitos más trascendentes de la carrera son invisibles. El usuario salta directamente desde `<h2>Trayectoria</h2>` hasta `<h2>Estadísticas de Carrera</h2>`.
  - **Criterios vulnerados:** WCAG 1.3.1 *Info and Relationships*, WCAG 4.1.2 *Name, Role, Value*.

#### [CRIT-03] Colisión visual y funcional en 768 px por solapamiento de Media Queries
- **Archivos:** `styles.css` (líneas 663–680 y 682–729).
- **Elemento afectado:** `.site-tagline` y `.menu-toggle` dentro de `.header-content`.
- **Evidencia empírica:**
  A 768 px exactos (ancho estándar de tablet vertical / iPad):
  - `@media (min-width: 768px)` activa `.site-tagline { display: block; position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); }`.
  - `@media (max-width: 768px)` activa `.menu-toggle { display: block; }` y `.main-nav { display: none; }`.
  - **Medición de colisión:**
    - `taglineRect`: `left: 526.95px`, `right: 729.00px`.
    - `btnRect`: `left: 683.81px`, `right: 729.00px`.
    - `overlap: true`.
  - El lema *"La leyenda viva del fútbol mundial"* se dibuja directamente sobre el botón hamburguesa, provocando ilegibilidad de texto e intercepción de toques táctiles.

---

### 3.2. Hallazgos Altos

#### [ALTO-01] Omisión en HTML del enlace de salto al contenido principal ("Skip Link")
- **Archivos:** `styles.css` (líneas 67–79), `index.html` (líneas 11–32).
- **Elemento afectado:** Región superior del `<body>`.
- **Evidencia:** `styles.css` define las clases `.skip-link` y `.skip-link:focus` con posicionamiento absoluto y z-index 1000. No obstante, en `index.html` no existe ninguna etiqueta `<a>` con dicha clase.
- **Impacto:** Los usuarios de teclado están forzados a presionar la tecla Tab repetidamente por todos los enlaces de la navegación en cada recarga de página para acceder al contenido.
- **Criterio vulnerado:** WCAG 2.4.1 *Bypass Blocks* (Nivel A).

#### [ALTO-02] Tabla con scroll horizontal inaccesible mediante teclado en pantallas móviles
- **Archivos:** `index.html` (líneas 267–268), `styles.css` (líneas 537–540).
- **Elemento afectado:** `<div class="table-responsive">`.
- **Evidencia:** A 320 px de ancho, el contenedor mide 270 px y la tabla mide 506 px. El contenedor activa desplazamiento horizontal vía `overflow-x: auto`. Sin embargo, el contenedor no posee `tabindex="0"` ni `role="region"`. Un usuario que navega sin ratón no puede enfocar el contenedor ni usar las flechas del teclado para desplazar y leer las columnas derechas ("Partidos", "Goles", "Asistencias").
- **Criterio vulnerado:** WCAG 2.1.1 *Keyboard* (Nivel A).

#### [ALTO-03] Desajuste de `--header-height` frente a la cabecera fija oculta títulos al navegar
- **Archivos:** `styles.css` (líneas 18, 30–33, 94–103).
- **Elemento afectado:** `:root`, `html`, `.site-header`.
- **Evidencia:** En escritorio, la cabecera fija contiene dos líneas de contenido (título superior + barra de navegación inferior). La altura real calculada es de **121,58 px**. Sin embargo, en `:root` se define `--header-height: 80px;` y `scroll-padding-top: var(--header-height);`. Al pulsar cualquier enlace ancla (`#biografia`, `#trayectoria`, `#estadisticas`, `#galeria`), el navegador sitúa el inicio de la sección a 80 px del borde superior, dejando **41,58 px del título de la sección tapados bajo la cabecera fija**.
- **Criterio vulnerado:** WCAG 2.2 AA – 2.4.11 *Focus Not Obscured (Minimum)*.

#### [ALTO-04] Manipulación de enlaces con `preventDefault()` destruye la navegación de teclado y el historial
- **Archivos:** `script.js` (líneas 180–191).
- **Elemento afectado:** `document.querySelectorAll('a[href^="#"]')`.
- **Evidencia:** El código ejecuta `e.preventDefault()` y seguidamente `target.scrollIntoView({ behavior: 'smooth', block: 'start' })`. Al cancelar el evento predeterminado:
  1. No se actualiza el hash en la barra de direcciones (`window.location.hash`).
  2. No se transfiere el foco de teclado al elemento destino (`target.focus()`). Si un usuario de teclado presiona Enter en "Trayectoria", el foco permanece en el enlace del menú; al presionar Tab, avanza a "Estadísticas" en el menú, en lugar de ingresar a los hitos de la sección.
- **Criterio vulnerado:** WCAG 2.4.3 *Focus Order* (Nivel A).

#### [ALTO-05] Ausencia total de adaptación a usuarios con sensibilidad al movimiento (`prefers-reduced-motion`)
- **Archivos:** `styles.css` (línea 31, 759–769), `script.js` (líneas 100–131, 154–175).
- **Elemento afectado:** Animaciones de scroll, contadores numéricos y efectos fade-in.
- **Evidencia:** Búsqueda textual de `prefers-reduced-motion` en todo el proyecto devuelve cero resultados. Se imponen 2000 ms de mutaciones numéricas continuas (60 fps), traslaciones de entrada en elementos y desplazamiento suave forzado a usuarios que tienen configurada la reducción de movimiento en su sistema operativo.
- **Criterio vulnerado:** WCAG 2.2 AA – 2.3.3 *Animation from Interactions*, WCAG 2.2.2 *Pause, Stop, Hide*.

---

### 3.3. Hallazgos Medios

#### [MED-01] Nombres accesibles insuficientes en los botones de la línea de tiempo
- **Archivos:** `index.html` (líneas 101, 112, 124, 137, 149, 161, 173, 185, 197, 209, 221).
- **Elemento afectado:** `<button class="timeline-marker">`.
- **Evidencia:** Cada botón contiene únicamente el año (`<span class="timeline-year">2002</span>`). Para un usuario de lector de pantalla, la lista de botones se anuncia como: "2002, botón", "2003, botón", "2006-07, botón", sin indicar qué evento se expandirá o describirá.
- **Criterio vulnerado:** WCAG 2.4.4 *Link Purpose / Label in Name*, WCAG 4.1.2 *Name, Role, Value*.

#### [MED-02] Falsa interactividad en la galería de imágenes (Affordance engañoso)
- **Archivos:** `styles.css` (líneas 590–604), `index.html` (líneas 340–405).
- **Elemento afectado:** `.gallery-item`.
- **Evidencia:** La regla CSS establece `cursor: pointer;` y animación `:hover` con elevación (`translateY(-4px)`) y sombra luminosa. No obstante, las tarjetas son elementos estáticos `<figure>`, no poseen listeners en `script.js`, no tienen `tabindex` y no abren ningún modal ni imagen a tamaño completo.
- **Impacto UX:** El cursor de puntero comunica al usuario de ratón que el elemento ejecutará una acción, provocando clics inútiles y desconcierto.

#### [MED-03] Atributos ARIA desactualizados en el botón de navegación móvil
- **Archivos:** `index.html` (línea 17), `script.js` (líneas 16–19, 21–37).
- **Elemento afectado:** `#menuToggle`.
- **Evidencia:** El botón tiene estático `aria-label="Abrir menú de navegación"`. Cuando el menú está desplegado (`aria-expanded="true"`), el `aria-label` no cambia a "Cerrar menú de navegación". Además, carece del atributo asociativo `aria-controls="mainNav"`.

#### [MED-04] Inconsistencia en Scroll Spy al visualizar la sección Hero
- **Archivos:** `script.js` (líneas 43–67), `index.html` (líneas 13, 23, 34).
- **Elemento afectado:** Función `updateActiveNav()`.
- **Evidencia:** `sections` se obtiene mediante `document.querySelectorAll('section[id]')`. La sección con `id="hero"` está incluida en la lista, pero ningún enlace del menú tiene `href="#hero"` (el enlace inicial apunta a `#inicio`, que pertenece al `<header>`). Cuando el usuario se desplaza por el Hero, el script retira la clase `.active` de todos los enlaces y ninguno coincide, dejando la navegación sin indicador de posición activa.

#### [MED-05] Inversión de dimensiones `width` y `height` en imágenes (Riesgo de CLS)
- **Archivos:** `index.html` (líneas 52–53, 345–346, 356–357, 367–368, 378–379, 389–390, 400–401), archivos físicos en `img/`.
- **Elemento afectado:** Etiquetas `<img>`.
- **Evidencia técnica comparativa:**
  - `cr7-retrato.jpg`: Archivo real **500 × 772 px** (ratio 0,65). Atributos HTML: `width="500" height="600"` (ratio 0,83).
  - `cr7-madrid.jpg`: Archivo real **500 × 592 px** (vertical). Atributos HTML: `width="592" height="500"` (horizontal invertido).
  - `cr7-united.jpg`: Archivo real **500 × 375 px** (horizontal). Atributos HTML: `width="375" height="500"` (vertical invertido).
  - `cr7-croacia.jpg`: Archivo real **500 × 749 px**. Atributos HTML: `width="749" height="500"`.
  - `cr7-nassr.jpg`: Archivo real **500 × 994 px**. Atributos HTML: `width="994" height="500"`.
  - `cr7-siu.jpg`: Archivo real **500 × 695 px**. Atributos HTML: `width="695" height="500"`.
- **Impacto UX / Rendimiento:** El navegador utiliza los atributos `width` y `height` para calcular el espacio reservado (`aspect-ratio`). Al estar invertidos, se produce un salto visual brusco de maquetación (Cumulative Layout Shift) en la carga.

#### [MED-06] Estructura tabular sin leyenda ni encabezados de fila (`scope="row"`)
- **Archivos:** `index.html` (líneas 266–329).
- **Elemento afectado:** `<table class="stats-table">`.
- **Evidencia:** El título de la tabla se encuentra en un `<h3 class="table-title">` externo sin vinculación semántica (falta `<caption>` o `aria-labelledby`). En el cuerpo `<tbody>`, los nombres de los equipos son celdas estándar `<td>` en vez de encabezados de fila `<th scope="row">`.
- **Criterio vulnerado:** WCAG 1.3.1 *Info and Relationships*.

---

### 3.4. Hallazgos Bajos

#### [BAJ-01] Omisión del atributo `type="button"` en 12 elementos `<button>`
- **Archivos:** `index.html` (líneas 17, 101, 112, 124, 137, 149, 161, 173, 185, 197, 209, 221).
- **Elemento afectado:** `#menuToggle` y los 11 botones `.timeline-marker`.
- **Evidencia:** Todos los botones carecen de `type="button"`, asumiendo el comportamiento por defecto del estándar HTML (`type="submit"`).

#### [BAJ-02] Frase en idioma extranjero no etiquetada en el Hero
- **Archivos:** `index.html` (línea 37).
- **Elemento afectado:** `<h2>El homme le plus décide</h2>`.
- **Evidencia:** Frase en francés con incorrección morfológica ("El homme le plus décide" en vez de "L'homme le plus décisif" o su equivalente en español "El hombre más decisivo"). Al no contar con `lang="fr"`, un lector de pantalla configurado en español intentará pronunciarla fonéticamente en castellano.
- **Criterio vulnerado:** WCAG 3.1.2 *Language of Parts* (Nivel AA).

#### [BAJ-03] Inicialización a cero en HTML sin degradación progresiva para estadísticas
- **Archivos:** `index.html` (líneas 241, 245, 249...), `script.js` (líneas 100–131).
- **Elemento afectado:** `.stat-number`.
- **Evidencia:** El texto inicial en el HTML es `0`. Si el usuario imprime la página sin haber hecho scroll hasta la sección, o si JavaScript no se ejecuta, las estadísticas quedan impresas como "0 Goles", "0 Asistencias", "0 Balones de Oro".

#### [BAJ-04] Ratio de contraste bajo en bordes decorativos de componentes
- **Archivos:** `styles.css` (línea 14, `--color-border: #2a2a3e`).
- **Elemento afectado:** Bordes de `.timeline-marker`, `.stat-card` y `.table-responsive`.
- **Evidencia:** El color `#2a2a3e` sobre el fondo `#0a0a0f` presenta un contraste de **1,41:1** (por debajo de 3:1 exigido en WCAG 1.4.11 para bordes de componentes de interfaz cuando el borde es el único indicador visual de delimitación).

#### [BAJ-05] Menú móvil sin contención de scroll en pantallas de baja altura
- **Archivos:** `styles.css` (líneas 94–103, 687–695).
- **Elemento afectado:** `.site-header`, `.main-nav.nav-open`.
- **Evidencia:** En dispositivos móviles en orientación horizontal (p. ej. altura de 320 px o 375 px), el menú desplegado alcanza 401 px. Al no contar con `max-height` ni `overflow-y: auto`, los enlaces inferiores ("Galería") quedan fuera de pantalla y no pueden ser alcanzados mediante scroll.

---

## 4. COMPORTAMIENTO POR RESOLUCIÓN (RESPONSIVE VIEWPORT AUDIT)

### 4.1. Dispositivos Ultra-estrechos (320 px — iPhone SE 1.ª gen, Galaxy Fold externo)
- **Cabecera:** El título "Cristiano Ronaldo" (1,6 rem) y el botón hamburguesa no caben en una sola línea horizontal debido a los 48 px de padding lateral total. El título parte en dos líneas, aumentando la altura de la cabecera cerrada a **112 px**.
- **Menú móvil desplegado:** La cabecera alcanza **401,42 px** de altura, consumiendo el **66,9% de la altura de la pantalla** (en viewport de 600 px de alto).
- **Datos biográficos:** En `.bio-facts`, la propiedad `min-width: 160px;` en la etiqueta `strong` deja únicamente 72 px de espacio disponible para el texto del valor, generando saltos de línea antiestéticos.
- **Tabla:** Ancho del viewport 320 px, contenedor 270 px, tabla 506 px. Funciona el scroll horizontal interno de `.table-responsive`, pero es inaccesible por teclado.
- **Tarjetas de estadísticas:** Con `grid-template-columns: 1fr 1fr;` a 480 px, cada tarjeta dispone de ~104 px de ancho útil interior; los textos grandes caben con margen estrecho.

### 4.2. Dispositivos Móviles Estándar (390 px — iPhone 12 / 13 / 14 / 15)
- **Cabecera:** El título y el botón hamburguesa conviven en una línea (altura cerrada: **68,5 px**).
- **Menú desplegado:** Funciona con fluidez táctil, pero persiste el objetivo táctil deficiente (18,78 px) en el botón de cierre.
- **Tabla:** El contenedor mide 342 px frente a 506 px de tabla; scroll horizontal táctil suave.
- **Galería:** Una sola columna de imágenes a ancho completo con altura fija de 280 px (`object-fit: cover`).

### 4.3. Tablets y Breakpoint Intermedio (768 px — iPad vertical)
- **Conflicto Crítico de Breakpoint:** Punto de fallo exacto. Ambas reglas de media query (`min-width: 768px` y `max-width: 768px`) se aplican simultáneamente. El lema `.site-tagline` aparece superpuesto sobre el botón `.menu-toggle` (`overlap: true` comprobado empíricamente).
- **Biografía:** La retícula conmuta a dos columnas (`300px 1fr`), con buena legibilidad.
- **Estadísticas:** La tabla alcanza los 720 px disponibles y ya no requiere desplazamiento horizontal.

### 4.4. Escritorio (1024 px, 1200 px, 1440 px)
- **Cabecera fija:** Se muestran las dos filas (marca arriba, lista de 5 enlaces centrados abajo). Altura real: **121,58 px**.
- **Desplazamiento por anclas:** Se manifiesta el fallo de `--header-height: 80px`, recortando 41,58 px superiores de los títulos de sección.
- **Galería:** Retícula fluida de 3 columnas bien balanceada.
- **Contraste y lectura:** Excelente legibilidad y jerarquía tipográfica general.

---

## 5. RECOMENDACIONES DE CORRECCIÓN DETALLADAS

### Para [CRIT-01] y [MED-03]: Botón de menú móvil y tamaño táctil
En `styles.css`:
```css
/* Asegurar objetivo táctil mínimo de 44x44px (WCAG AAA / Requisito 2.5.8 AA superado) */
.menu-toggle {
  display: none;
  background: none;
  border: 2px solid var(--color-primary);
  border-radius: 6px;
  min-width: 44px;
  min-height: 44px;
  padding: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
```
En `index.html`:
```html
<button 
  type="button" 
  class="menu-toggle" 
  id="menuToggle" 
  aria-label="Abrir menú de navegación" 
  aria-expanded="false" 
  aria-controls="mainNav"
>
  <span class="hamburger" aria-hidden="true"></span>
</button>
```
En `script.js`:
```javascript
menuToggle.addEventListener('click', function () {
  var isOpen = mainNav.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
});
```

---

### Para [CRIT-02] y [MED-01]: Estructura de encabezados y nombres en Timeline
Reestructurar semánticamente en `index.html` integrando el encabezado en el botón interactivo (Patrón Accordion W3C APG):
```html
<div class="timeline-item" role="listitem">
  <h3>
    <button 
      type="button" 
      class="timeline-marker" 
      aria-expanded="false" 
      aria-controls="timeline-detail-2002"
      id="timeline-btn-2002"
    >
      <span class="timeline-year">2002</span>
      <span class="timeline-heading-text">Debut profesional — Sporting CP</span>
    </button>
  </h3>
  <div 
    class="timeline-detail" 
    id="timeline-detail-2002" 
    role="region" 
    aria-labelledby="timeline-btn-2002"
    hidden
  >
    <p>Con tan solo 17 años, Ronaldo debuta con el primer equipo del Sporting CP en la Primeira Liga...</p>
  </div>
</div>
```
*Nota:* El uso del atributo nativo HTML5 `hidden` (o `display: none`) es preferible a `aria-hidden="true"`, pues oculta visualmente y semánticamente el contenido colapsado sin desincronizar los estados.

---

### Para [CRIT-03]: Solución definitiva al conflicto de 768 px
En `styles.css`, cambiar el breakpoint móvil para evitar solapamientos en el valor entero:
```css
/* En lugar de @media (max-width: 768px), usar 767.98px: */
@media (max-width: 767.98px) {
  .menu-toggle {
    display: flex;
  }
  .main-nav {
    display: none;
  }
  /* ... resto de reglas móviles ... */
}

@media (min-width: 768px) {
  .site-tagline {
    display: block;
    /* ... */
  }
  .menu-toggle {
    display: none;
  }
  .main-nav {
    display: block !important;
  }
}
```

---

### Para [ALTO-01]: Incorporación del Skip Link
Insertar inmediatamente después de `<body>` en `index.html`:
```html
<body>
  <a href="#hero" class="skip-link">Saltar al contenido principal</a>
  <header class="site-header" id="inicio">
  ...
  <main id="main">
```

---

### Para [ALTO-02]: Accesibilidad de teclado en contenedor con scroll
En `index.html`:
```html
<div 
  class="table-responsive" 
  tabindex="0" 
  role="region" 
  aria-label="Tabla de estadísticas de goles por club y selección, desplazable horizontalmente"
>
  <table class="stats-table">
    <caption class="visually-hidden">Estadísticas completas de partidos, goles y asistencias por club</caption>
    ...
```

---

### Para [ALTO-03]: Sincronización de cabecera y `scroll-padding-top`
En `styles.css`:
```css
:root {
  --header-height: 125px; /* Altura real en escritorio */
}

@media (max-width: 767.98px) {
  :root {
    --header-height: 70px; /* Altura real en móvil cerrado */
  }
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: var(--header-height);
}
```

---

### Para [ALTO-04]: Corrección de navegación por anclas en JavaScript
En `script.js`, actualizar el bloque de scroll suave para gestionar el foco y el historial:
```javascript
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var href = this.getAttribute('href');
    if (href === '#' || href === '') return;

    var target = document.querySelector(href);
    if (target) {
      // Permitir actualización nativa del hash o gestionarla explícitamente:
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      // El scroll lo realiza el navegador gracias a html { scroll-behavior: smooth }
    }
  });
});
```

---

### Para [ALTO-05]: Soporte a `prefers-reduced-motion`
En `styles.css`:
```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
En `script.js` (al inicio de `animateCounters`):
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Renderizar números finales de inmediato sin temporizadores
  statNumbers.forEach(function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    el.textContent = target.toLocaleString('es-ES') + (target >= 100 ? '+' : '');
  });
  return;
}
```

---

### Para [MED-02]: Corrección de affordance en Galería
En `styles.css`:
```css
.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  cursor: default; /* Eliminar cursor: pointer si no abre lightbox */
}
```

---

### Para [MED-05]: Corrección de atributos de dimensiones en imágenes
Actualizar `index.html` con las medidas exactas de los archivos:
- `img/cr7-retrato.jpg`: `width="500" height="772"`
- `img/cr7-madrid.jpg`: `width="500" height="592"`
- `img/cr7-united.jpg`: `width="500" height="375"`
- `img/cr7-croacia.jpg`: `width="500" height="749"`
- `img/cr7-juve.jpg`: `width="500" height="716"`
- `img/cr7-nassr.jpg`: `width="500" height="994"`
- `img/cr7-siu.jpg`: `width="500" height="695"`

---

## 6. PLAN DE PRUEBAS DE REGRESIÓN TRAS CORREGIR

Una vez aplicadas las recomendaciones anteriores, deberán repetirse obligatoriamente las siguientes pruebas de validación:

1. **Prueba de objetivos táctiles en navegadores móviles (WCAG 2.5.8):**
   - Ejecutar inspección mediante DevTools en emulación móvil (320 px y 390 px) y verificar que `getBoundingClientRect()` del botón `#menuToggle` reporte como mínimo 44 × 44 px (o al menos 24 × 24 px para AA estricto).
2. **Prueba de inspección de árbol de accesibilidad (Accessibility Tree Inspection):**
   - Con Chrome/Edge DevTools (pestaña *Accessibility*), inspeccionar la sección de trayectoria con todos los hitos colapsados. Comprobar que los títulos de los hitos son reconocidos como encabezados de nivel 3 o etiquetas de botón legibles.
   - Navegar con lector de pantalla (NVDA en Windows mediante `NVDA + F7` -> Lista de elementos -> Encabezados) y verificar que aparecen los 11 hitos cronológicos.
3. **Prueba de regresión de viewport a 768 px exactos:**
   - Redimensionar la ventana a 768 × 1024 px. Verificar visualmente y por bounding box que `.site-tagline` no se sobrepone ni colisiona con el botón de menú móvil.
4. **Prueba de salto al contenido ("Skip link") con teclado:**
   - Recargar la página, presionar la tecla `Tab` una vez. Verificar que el enlace "Saltar al contenido principal" se vuelve visible en la esquina superior izquierda con foco dorado claro, y que al presionar `Enter` el foco se traslada al contenido principal (`#main` / `#hero`).
5. **Prueba de desplazamiento de tabla con teclado:**
   - En una ventana de 320 px o 390 px, navegar con la tecla `Tab` hasta la tabla de estadísticas. Verificar que el contenedor `.table-responsive` recibe el foco (indicador dorado visible) y que las teclas `Flecha Derecha` y `Flecha Izquierda` permiten desplazar la vista para revelar las columnas ocultas.
6. **Prueba de alineación de cabecera fija:**
   - En escritorio (1200 px), pulsar sucesivamente cada uno de los enlaces del menú principal ("Biografía", "Trayectoria", "Estadísticas", "Galería"). Verificar visualmente que la línea superior del título `<h2>` de cada sección queda completamente visible por debajo del borde inferior de la cabecera fija (margen de despeje >= 10 px).
7. **Prueba de transferencia de foco en anclas:**
   - Al activar un enlace del menú con `Enter`, presionar `Tab` inmediatamente después. Comprobar que el foco se traslada al primer elemento interactivo dentro de la sección seleccionada y no al siguiente enlace del menú.
8. **Prueba de reducción de movimiento (`prefers-reduced-motion`):**
   - Habilitar en Windows (*Configuración > Accesibilidad > Efectos visuales > Desactivar efectos de animación*) o en Edge (*Rendering > Emulate CSS media feature prefers-reduced-motion: reduce*).
   - Recargar la página y verificar:
     - El scroll al hacer clic en anclas es instantáneo (sin animación suave).
     - Los números de las tarjetas estadísticas se muestran directamente en su valor final sin conteo incremental de 2 segundos.
     - No se aprecian transiciones de entrada tipo fade-in con desplazamiento.
9. **Prueba de estabilidad visual de carga (CLS - Cumulative Layout Shift):**
   - Ejecutar una auditoría con Lighthouse en modo móvil. Comprobar que la métrica CLS se mantiene por debajo de **0,05** tras la corrección de los atributos `width` y `height` de las imágenes.

---
*Informe generado conforme a las directrices de auditoría independiente de código.*
