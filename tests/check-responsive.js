/**
 * check-responsive.js — Verificacion de responsividad / adaptabilidad
 *
 * Verifica:
 * - Meta viewport correcto
 * - Media queries en CSS (mobile-first o desktop breakpoints)
 * - Uso de unidades relativas (rem, em, %, vw, vh)
 * - Grid / Flexbox para layouts adaptativos
 * - Imagenes con max-width: 100%
 * - Tap targets suficientemente grandes (44x44px minimo WCAG)
 * - Sin scroll horizontal en movil
 */

const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, '..', 'paginaCristianoRonaldo', 'index.html');
const CSS_FILE = path.join(__dirname, '..', 'paginaCristianoRonaldo', 'styles.css');

const html = fs.readFileSync(HTML_FILE, 'utf8');
const css = fs.readFileSync(CSS_FILE, 'utf8');

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
// 1. META VIEWPORT
// =====================
console.log('\n--- Meta Viewport ---');
check('Viewport presente', /<meta[^>]+name=["']viewport["']/.test(html), 'Falta meta viewport');
check('width=device-width', /width\s*=\s*device-width/.test(html), 'Viewport sin width=device-width');
check('initial-scale=1', /initial-scale\s*=\s*1/.test(html), 'Viewport sin initial-scale=1');

// =====================
// 2. MEDIA QUERIES
// =====================
console.log('\n--- Media Queries ---');
const mediaQueries = css.match(/@media[^{]+/g) || [];
check('Media queries presentes', mediaQueries.length >= 2, `Solo ${mediaQueries.length} media query(s) encontrada(s) (se esperan al menos 2)`);

// Detectar breakpoints
const breakpoints = [];
mediaQueries.forEach(mq => {
  const minMatch = mq.match(/min-width:\s*(\d+)px/);
  const maxMatch = mq.match(/max-width:\s*(\d+)px/);
  if (minMatch) breakpoints.push({ type: 'min', value: parseInt(minMatch[1]) });
  if (maxMatch) breakpoints.push({ type: 'max', value: parseInt(maxMatch[1]) });
});
check('Breakpoint movil (max-width ~768px)', breakpoints.some(b => b.type === 'max' && b.value <= 780), 'No se encontro breakpoint para movil');
check('Breakpoint tablet/desktop (min-width ~768px)', breakpoints.some(b => b.type === 'min' && b.value >= 750 && b.value <= 780), 'No se encontro breakpoint para tablet/desktop');

// =====================
// 3. UNIDADES RELATIVAS
// =====================
console.log('\n--- Unidades Relativas ---');
const remUsage = (css.match(/\d+rem/g) || []).length;
const emUsage = (css.match(/\d+em(?![-])/g) || []).length;
const percentUsage = (css.match(/\d+%/g) || []).length;
const vwUsage = (css.match(/\d+(\.\d+)?vw/g) || []).length;
const clampUsage = (css.match(/clamp\(/g) || []).length;

check('Uso de rem/em', remUsage + emUsage > 5, `Solo ${remUsage + emUsage} uso(s) de rem/em`);
check('Uso de porcentajes', percentUsage > 5, `Solo ${percentUsage} uso(s) de porcentajes`);
check('Uso de clamp() para tipografia fluida', clampUsage >= 1, `Solo ${clampUsage} uso(s) de clamp()`);

// =====================
// 4. FLEXBOX / GRID
// =====================
console.log('\n--- Layout Adaptativo ---');
const flexUsage = (css.match(/display:\s*flex/g) || []).length;
const gridUsage = (css.match(/display:\s*grid/g) || []).length;
check('Uso de Flexbox', flexUsage >= 2, `Solo ${flexUsage} uso(s) de Flexbox (se esperan al menos 2)`);
check('Uso de CSS Grid', gridUsage >= 2, `Solo ${gridUsage} uso(s) de CSS Grid (se esperan al menos 2)`);

// auto-fit / auto-fill para grids adaptables
const autoFitCount = (css.match(/auto-fit|auto-fill/g) || []).length;
check('Grid con auto-fit/auto-fill para adaptables', autoFitCount >= 1, `Solo ${autoFitCount} uso(s) de auto-fit/auto-fill`);

// =====================
// 5. IMAGENES RESPONSIVAS
// =====================
console.log('\n--- Imagenes Responsivas ---');
check('img max-width: 100%', /img\s*\{[^}]*max-width:\s*100%/.test(css), 'Falta max-width: 100% en img');
check('img height: auto', /img\s*\{[^}]*height:\s*auto/.test(css), 'Falta height: auto en img');

// =====================
// 6. TAP TARGETS (WCAG 2.5.5)
// =====================
console.log('\n--- Tap Targets (WCAG 2.5.5) ---');
// Verificar que botones/enlaces tengan minimo 44x44px
const minTapSizes = css.match(/min-width:\s*44px|min-height:\s*44px|padding.*44px/g) || [];
check('Tap targets minimo 44px', minTapSizes.length >= 1, 'No se encontro minimo de 44px para tap targets');

// Enlaces de navegacion con padding suficiente
const navLinkPadding = css.match(/nav-link[\s{][^}]*padding/g) || [];
check('Nav links con padding suficiente', navLinkPadding.length >= 1, 'Nav links sin padding para tap targets');

// =====================
// 7. SCROLL HORIZONTAL
// =====================
console.log('\n--- Overflow Control ---');
const hasOverflowXHidden = /overflow-x:\s*(hidden|auto)/.test(css);
warn('Overflow X controlado', hasOverflowXHidden, 'No se encontro overflow-x hidden/auto');

// =====================
// 8. CONTENIDO SCROLLABLE ACCESIBLE
// =====================
console.log('\n--- Tabla Scrollable ---');
check('Tabla responsive accesible', /role=["']region["']/.test(html) && /tabindex=["']0["']/.test(html), 'Tabla scrollable sin role="region" y tabindex="0"');

// =====================
// 9. DISPLAY NONE / RESPONSIVE NAV
// =====================
console.log('\n--- Navegacion Responsive ---');
check('Menu toggle para movil', /menu-toggle/.test(css), 'No se encontro estilo para menu toggle movil');
check('Nav oculto en movil (display: none)', /\.main-nav[\s{][^}]*display:\s*none/.test(css), 'Nav no se oculta en movil');
check('Nav visible en movil (nav-open)', /nav-open/.test(css), 'No se encontro clase nav-open para nav movil');

// Report
console.log('\n========================================');
console.log('  RESPONSIVIDAD / ADAPTABILIDAD');
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
  console.log(`  ✅ RESPONSIVIDAD VERIFICADA — ${passed.length} aprobado(s) | ${warnings.length} advertencia(s)\n`);
  process.exit(0);
}
