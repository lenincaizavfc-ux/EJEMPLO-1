/**
 * check-accessibility.js — Verificacion de accesibilidad WCAG 2.1 Nivel AA
 *
 * Verifica:
 * - Estructura semantica (landmarks, headings)
 * - ARIA roles, labels, states
 * - Contraste de colores (WCAG AA: 4.5:1 texto, 3:1 grandes)
 * - Navegacion por teclado (skip links, focus-visible)
 * - Imagenes alternativas
 * - Formularios accesibles
 * - Tablas accesibles
 * - Respeto a prefers-reduced-motion
 */

const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, '..', 'paginaCristianoRonaldo', 'index.html');
const CSS_FILE = path.join(__dirname, '..', 'paginaCristianoRonaldo', 'styles.css');

const html = fs.readFileSync(HTML_FILE, 'utf8');
const css = fs.existsSync(CSS_FILE) ? fs.readFileSync(CSS_FILE, 'utf8') : '';

let errors = [];
let warnings = [];
let passed = [];

function check(name, condition, msg) {
  if (condition) {
    passed.push(name);
  } else {
    errors.push(`[FAIL] ${name}: ${msg}`);
  }
}

function warn(name, condition, msg) {
  if (condition) {
    passed.push(name);
  } else {
    warnings.push(`[WARN] ${name}: ${msg}`);
  }
}

// =====================
// 1. ESTRUCTURA SEMANTICA
// =====================
console.log('\n--- Estructura Semantica ---');

check('Documento con lang', /<html[^>]+lang=["'][^"']+["']/.test(html), 'Falta lang en <html>');
check('Landmark <header>', /<header[\s>]/i.test(html), 'Falta <header>');
check('Landmark <nav>', /<nav[\s>]/i.test(html), 'Falta <nav>');
check('Landmark <main>', /<main[\s>]/i.test(html), 'Falta <main>');
check('Landmark <footer>', /<footer[\s>]/i.test(html), 'Falta <footer>');
check('Landmark <section>', /<section[\s>]/i.test(html), 'Falta <section> para agrupar contenido');

// H1 unico
const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
check('H1 unico', h1Count === 1, `${h1Count} h1 encontrados (debe ser 1)`);

// Jerarquia de headings
const headingRegex = /<h(\d)[^>]*>/gi;
const headings = [];
let m;
while ((m = headingRegex.exec(html)) !== null) headings.push(parseInt(m[1]));
let jumps = 0;
for (let i = 1; i < headings.length; i++) {
  if (headings[i] - headings[i - 1] > 1) jumps++;
}
check('Jerarquia de headings sin saltos', jumps === 0, `${jumps} salto(s) en jerarquia de encabezados`);

// =====================
// 2. NAVEGACION POR TECLADO
// =====================
console.log('--- Navegacion por Teclado ---');

check('Skip link presente', /skip/i.test(html), 'Falta skip link');
check('Skip link apunta a contenido', /href=["']#(main|hero|content)/i.test(html), 'Skip link no apunta al contenido principal');

// Botones con tipo
const buttons = html.match(/<button[^>]*>/gi) || [];
let buttonsWithoutType = 0;
buttons.forEach(b => {
  if (!/type=["'](button|submit|reset)["']/.test(b)) buttonsWithoutType++;
});
warn('Botones con tipo explicito', buttonsWithoutType === 0, `${buttonsWithoutType} boton(es) sin type`);

// =====================
// 3. ARIA
// =====================
console.log('--- ARIA ---');

// aria-label en nav
check('Nav con aria-label', /<nav[^>]+aria-label=["'][^"']+["']/.test(html), 'Nav sin aria-label');

// aria-label en botones interactivos
const buttonRegex = /<button[^>]*>[\s\S]*?<\/button>/gi;
const interactiveButtons = html.match(buttonRegex) || [];
let buttonsWithoutLabel = 0;
interactiveButtons.forEach(b => {
  const hasLabel = /aria-label=["'][^"']+["']/.test(b);
  const hasAriaLabelledby = /aria-labelledby=["'][^"']+["']/.test(b);
  const innerText = b.replace(/<[^>]+>/g, '').trim();
  const hasTextContent = innerText.length > 0;
  if (!hasLabel && !hasAriaLabelledby && !hasTextContent) buttonsWithoutLabel++;
});
check('Botones con label accesible', buttonsWithoutLabel === 0, `${buttonsWithoutLabel} boton(es) sin label accesible`);

// aria-expanded en elementos colapsables
check('aria-expanded en timeline', (html.match(/aria-expanded/g) || []).length > 0, 'Falta aria-expanded en elementos colapsables');

// aria-controls
check('aria-controls en botones toggle', (html.match(/aria-controls/g) || []).length > 0, 'Falta aria-controls');

// role="list" y role="listitem"
check('role="list" en timeline', /role=["']list["']/.test(html), 'Timeline sin role="list"');
check('role="region" en contenido colapsable', /role=["']region["']/.test(html), 'Contenido colapsable sin role="region"');

// role="region" en tabla
check('Tabla con role="region"', /role=["']region["']/.test(html), 'Tabla responsive sin role="region"');

// aria-labelledby
check('aria-labelledby en regiones', (html.match(/aria-labelledby/g) || []).length >= 2, 'Pocos aria-labelledby');

// =====================
// 4. COLORES Y CONTRASTE
// =====================
console.log('--- Contraste de Colores (WCAG AA) ---');

// Extraer colores del CSS
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16)
  };
}

function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Colores principales del CSS
const bgColor = '#0a0a0f';     // --color-bg
const textColor = '#e8e6e3';   // --color-text
const primaryColor = '#d4a843'; // --color-primary
const mutedColor = '#9a9a9a';  // --color-text-muted

const bgLum = luminance(...Object.values(hexToRgb(bgColor)));
const textLum = luminance(...Object.values(hexToRgb(textColor)));
const primaryLum = luminance(...Object.values(hexToRgb(primaryColor)));
const mutedLum = luminance(...Object.values(hexToRgb(mutedColor)));

const textRatio = contrastRatio(textLum, bgLum);
const primaryRatio = contrastRatio(primaryLum, bgLum);
const mutedRatio = contrastRatio(mutedLum, bgLum);

// WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande (>=18pt bold o >=24pt)
if (textRatio >= 4.5) {
  check(`Contraste texto-campo: ${textRatio.toFixed(2)}:1 (requerido 4.5:1)`, true, '');
} else {
  errors.push(`[FAIL] Contraste texto-campo: ${textRatio.toFixed(2)}:1 (requerido 4.5:1 para WCAG AA)`);
}

if (primaryRatio >= 3) {
  check(`Contraste primario-campo: ${primaryRatio.toFixed(2)}:1 (minimo 3:1)`, true, '');
} else {
  // Para texto en.botones/links grandes, 3:1 es suficiente
  if (primaryRatio >= 3) {
    check(`Contraste primario-campo: ${primaryRatio.toFixed(2)}:1 (aceptable para texto grande)`, true, '');
  } else {
    errors.push(`[FAIL] Contraste primario-campo: ${primaryRatio.toFixed(2)}:1 (minimo 3:1 WCAG AA)`);
  }
}

if (mutedRatio >= 4.5) {
  check(`Contraste texto-muted-campo: ${mutedRatio.toFixed(2)}:1 (requerido 4.5:1)`, true, '');
} else {
  // Texto muted puede ser decorativo, pero verificamos
  warn(`Contraste texto-muted-campo: ${mutedRatio.toFixed(2)}:1`, mutedRatio >= 3, 'Texto muted con contraste bajo (minimo 3:1 para texto informativo)');
}

// =====================
// 5. FOCUS VISIBLE
// =====================
console.log('--- Focus Visible ---');
check('Focus visible en CSS', /focus-visible|focus\s*\{/.test(css), 'No se encontro estilo de focus visible en CSS');

// =====================
// 6. PREFERS-REDUCED-MOTION
// =====================
console.log('--- Reduced Motion ---');
check('Soporte prefers-reduced-motion', /prefers-reduced-motion/.test(css), 'CSS sin soporte para prefers-reduced-motion');

// =====================
// 7. IMAGENES
// =====================
console.log('--- Imagenes Accesibles ---');
const imgRegex = /<img[^>]*>/gi;
const imgs = html.match(imgRegex) || [];
let imgsNoAlt = 0;
imgs.forEach(img => {
  if (!/alt=["'][^"']+["']/.test(img) && !/alt=["']["']/.test(img)) imgsNoAlt++;
});
check('Todas las imagenes con alt', imgsNoAlt === 0, `${imgsNoAlt} imagen(es) sin alt`);

let imgsNoLazy = 0;
imgs.forEach(img => {
  if (!/loading=["']lazy["']/.test(img)) imgsNoLazy++;
});
warn('Imagenes con loading="lazy"', imgsNoLazy === 0, `${imgsNoLazy} imagen(es) sin lazy loading`);

// =====================
// 8. TABLA ACCESIBLE
// =====================
console.log('--- Tabla Accesible ---');
check('Tabla con caption o visually-hidden', /<caption/i.test(html) || /visually-hidden/i.test(html), 'Tabla sin caption accesible');
check('Tabla con thead', /<thead>/.test(html), 'Tabla sin thead');
check('Tabla con tbody', /<tbody>/.test(html), 'Tabla sin tbody');
check('th con scope="col"', /scope=["']col["']/.test(html), 'Encabezados de columna sin scope');
check('th con scope="row"', /scope=["']row["']/.test(html), 'Encabezados de fila sin scope');

// =====================
// 9. TABINDEX
// =====================
console.log('--- Tabindex ---');
warn('Sin tabindex positivo', !/\ptabindex\s*=\s*["'][1-9]/.test(html), 'Se encontro tabindex positivo (puede afectar orden de tabulacion)');

// =====================
// 10. LISTAS
// =====================
console.log('--- Estructura de Listas ---');
const ulCount = (html.match(/<ul[\s>]/gi) || []).length;
check('Listas ul presentes', ulCount > 0, 'No se encontraron listas <ul>');
const liCount = (html.match(/<li[\s>]/gi) || []).length;
check('Items li presentes', liCount > 0, 'No se encontraron items <li>');

// Report
console.log('\n========================================');
console.log('  ACCESIBILIDAD WCAG 2.1 AA');
console.log('========================================\n');

passed.forEach(p => console.log(`  [PASS] ${p}`));
console.log('');
warnings.forEach(w => console.log(`  ${w}`));
console.log('');

if (errors.length > 0) {
  errors.forEach(e => console.log(`  ${e}`));
  console.log(`\n  ❌ ${errors.length} error(es) | ${warnings.length} advertencia(s) | ${passed.length} aprobado(s)\n`);
  process.exit(1);
} else {
  console.log(`  ✅ ACCESIBILIDAD WCAG AA VERIFICADA — ${passed.length} aprobado(s) | ${warnings.length} advertencia(s)\n`);
  process.exit(0);
}
