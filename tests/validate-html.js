/**
 * validate-html.js — Validación HTML5 del archivo index.html
 * Verifica: DOCTYPE, lang, charset, viewport, meta tags,
 * headings hierarchy, images con alt, labels en formularios,
 * tablas con thead/tbody/th, landmarks ARIA, enlaces internos.
 */

const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, '..', 'paginaCristianoRonaldo', 'index.html');
const html = fs.readFileSync(HTML_FILE, 'utf8');

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

// 1. DOCTYPE
check('HTML5 DOCTYPE', /<!DOCTYPE html>/i.test(html), 'Falta declaracion <!DOCTYPE html>');

// 2. <html lang>
check('HTML lang attribute', /<html[^>]+lang=["'][^"']+["']/.test(html), 'Falta atributo lang en <html>');

// 3. <meta charset>
check('Meta charset UTF-8', /<meta[^>]+charset=["']?UTF-8["']?/i.test(html), 'Falta meta charset UTF-8');

// 4. <meta viewport>
check('Meta viewport', /<meta[^>]+name=["']viewport["'][^>]+/.test(html), 'Falta meta viewport para responsividad');

// 5. <title>
check('Title tag', /<title>[^<]+<\/title>/.test(html), 'Falta o esta vacio el tag <title>');

// 6. Meta description
check('Meta description', /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/.test(html), 'Falta meta description');

// 7. All images have alt attribute
const imgRegex = /<img[^>]*>/gi;
const images = html.match(imgRegex) || [];
let imagesWithoutAlt = 0;
let imagesWithEmptyAlt = 0;
images.forEach(img => {
  if (!/alt=["'][^"']+["']/.test(img) && !/alt=["']["']/.test(img)) {
    imagesWithoutAlt++;
  }
});
check('All images have alt text', imagesWithoutAlt === 0, `${imagesWithoutAlt} imagen(es) sin atributo alt`);

// 8. Images have width and height
let imagesWithoutDimensions = 0;
images.forEach(img => {
  if (!/width=["']?\d+["']?/.test(img) || !/height=["']?\d+["']?/.test(img)) {
    imagesWithoutDimensions++;
  }
});
warn('Images have width/height', imagesWithoutDimensions === 0, `${imagesWithoutDimensions} imagen(es) sin dimensiones explicitas`);

// 9. Heading hierarchy (h1 -> h2 -> h3)
const headingRegex = /<h(\d)[^>]*>/gi;
const headings = [];
let match;
while ((match = headingRegex.exec(html)) !== null) {
  headings.push(parseInt(match[1]));
}
let headingIssues = 0;
for (let i = 1; i < headings.length; i++) {
  if (headings[i] - headings[i - 1] > 1) {
    headingIssues++;
  }
}
check('Heading hierarchy', headingIssues === 0, `${headingIssues} salto(s) en la jerarquia de encabezados`);

// 10. Single h1
const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
check('Single H1', h1Count === 1, `Se encontro(n) ${h1Count} h1 (deberia ser 1)`);

// 11. Nav landmark
check('Nav landmark', /<nav[\s>]/i.test(html), 'Falta elemento <nav> como landmark');

// 12. Main landmark
check('Main landmark', /<main[\s>]/i.test(html), 'Falta elemento <main> como landmark');

// 13. Header landmark
check('Header landmark', /<header[\s>]/i.test(html), 'Falta elemento <header> como landmark');

// 14. Footer landmark
check('Footer landmark', /<footer[\s>]/i.test(html), 'Falta elemento <footer> como landmark');

// 15. Skip link
check('Skip navigation link', /skip/i.test(html), 'Falta enlace de salto para navegacion (skip link)');

// 16. aria-label on nav
check('Nav aria-label', /<nav[^>]+aria-label=["'][^"']+["']/.test(html), 'Falta aria-label en <nav>');

// 17. Table structure (thead, tbody, th)
check('Table thead', /<thead>/.test(html), 'Falta <thead> en tabla');
check('Table tbody', /<tbody>/.test(html), 'Falta <tbody> en tabla');
check('Table th scope', /<th[^>]+scope=["']col["']/.test(html) || /<th[^>]+scope=["']row["']/.test(html), 'Falta scope en <th>');

// 18. Table caption
check('Table caption or visually-hidden', /<caption/i.test(html) || /visually-hidden/i.test(text = html), 'Tabla sin caption o texto accesible');

// 19. Link target _blank should have rel="noopener"
const externalLinks = html.match(/<a[^>]+href=["']https?:\/\/[^"']+["'][^>]*>/gi) || [];
let unsafeExternalLinks = 0;
externalLinks.forEach(link => {
  if (/target=["']_blank["']/.test(link) && !/rel=["'][^"']*noopener/.test(link)) {
    unsafeExternalLinks++;
  }
});
check('External links security (rel=noopener)', unsafeExternalLinks === 0, `${unsafeExternalLinks} enlace(s) externo(s) sin rel=noopener`);

// 20. Responsive meta tag check
check('Viewport initial-scale', /initial-scale\s*=\s*1/.test(html), 'Viewport sin initial-scale=1');

// 21. prefers-reduced-motion check in CSS
const cssPath = path.join(__dirname, '..', 'paginaCristianoRonaldo', 'styles.css');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  check('prefers-reduced-motion support', /prefers-reduced-motion/.test(css), 'CSS sin soporte para prefers-reduced-motion');
}

// 22. aria-expanded on interactive elements
const ariaExpandedCount = (html.match(/aria-expanded/g) || []).length;
warn('ARIA expanded attributes', ariaExpandedCount > 0, 'No se encontraron atributos aria-expanded');

// Report
console.log('\n========================================');
console.log('  VALIDACION HTML5');
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
  console.log(`  ✅ HTML5 VALIDADO — ${passed.length} aprobado(s) | ${warnings.length} advertencia(s)\n`);
  process.exit(0);
}
