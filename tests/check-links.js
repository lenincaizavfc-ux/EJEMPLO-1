/**
 * check-links.js — Verificacion de seguridad de enlaces externos
 *
 * Verifica:
 * - Enlaces externos usan HTTPS
 * - Enlaces con target="_blank" tienen rel="noopener noreferrer"
 * - Enlaces de YouTube son validos
 * - No hay enlaces a dominios sospechosos
 * - Enlaces internos apuntan a anchors existentes
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

// =====================
// 1. ENLACES EXTERNOS HTTPS
// =====================
console.log('\n--- Enlaces Externos ---');

const externalLinkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
let externalLinks = [];
let match;
while ((match = externalLinkRegex.exec(html)) !== null) {
  externalLinks.push({
    full: match[0],
    url: match[1]
  });
}

check('Enlaces externos encontrados para analizar', true, `Se encontraron ${externalLinks.length} enlace(s) externo(s)`);

const httpLinks = externalLinks.filter(l => l.url.startsWith('http://'));
check('Todos los enlaces externos usan HTTPS', httpLinks.length === 0, `${httpLinks.length} enlace(s) usan HTTP inseguro`);

// =====================
// 2. TARGET="_blank" CON REL="noopener"
// =====================
console.log('\n--- Seguridad target="_blank" ---');

const targetBlankLinks = externalLinks.filter(l => /target=["']_blank["']/.test(l.full));
const unsafeBlankLinks = targetBlankLinks.filter(l => !/rel=["'][^"']*noopener/.test(l.full));

check('target="_blank" con rel="noopener"', unsafeBlankLinks.length === 0, `${unsafeBlankLinks.length} enlace(s) con target="_blank" sin rel="noopener"`);

// =====================
// 3. ENLACES DE YOUTUBE
// =====================
console.log('\n--- Enlaces YouTube ---');

const youtubeLinks = externalLinks.filter(l => /youtube\.com|youtu\.be/.test(l.url));

if (youtubeLinks.length === 0) {
  warn('Enlaces YouTube', true, 'No hay enlaces de YouTube en la pagina (OK)');
} else {
  check('Enlaces YouTube encontrados', true, `${youtubeLinks.length} enlace(s) de YouTube`);

  youtubeLinks.forEach(link => {
    const url = link.url;

    // Verificar que sea HTTPS
    check(`YouTube HTTPS: ${url}`, url.startsWith('https://'), 'Enlace de YouTube sin HTTPS');

    // Verificar formato valido de YouTube
    const validYouTube = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]+/.test(url);
    check(`YouTube formato valido: ${url}`, validYouTube, 'Formato de URL de YouTube no reconocido');

    // Verificar que no sea un enlace de redireccion
    const isRedirect = /youtube\.com\/redirect/.test(url);
    warn(`YouTube sin redireccion: ${url}`, !isRedirect, 'Enlace de YouTube es un redirect (puede ser inseguro)');
  });
}

// =====================
// 4. DOMINIOS SOSPECHOSOS
// =====================
console.log('\n--- Dominios Sospechosos ---');

const suspiciousPatterns = [
  /bit\.ly/i,
  /tinyurl\.com/i,
  /goo\.gl/i,
  /t\.co/i,
  /is\.gd/i,
  /adf\.ly/i,
  /bc\.vc/i,
  /shorte\.st/i,
  /adfocus/i,
  /linkbucks/i,
];

let suspiciousLinks = [];
externalLinks.forEach(link => {
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(link.url)) {
      suspiciousLinks.push({ url: link.url, pattern: pattern.toString() });
    }
  });
});

check('Sin enlaces acortados/sospechosos', suspiciousLinks.length === 0, `${suspiciousLinks.length} enlace(s) sospechoso(s) encontrado(s)`);

// =====================
// 5. ENLACES INTERNOS
// =====================
console.log('\n--- Enlaces Internos ---');

const internalLinkRegex = /href=["']#([^"']+)["']/g;
let internalAnchors = [];
while ((match = internalLinkRegex.exec(html)) !== null) {
  internalAnchors.push(match[1]);
}

// IDs existentes en el HTML
const idRegex = /id=["']([^"']+)["']/g;
let existingIds = new Set();
while ((match = idRegex.exec(html)) !== null) {
  existingIds.add(match[1]);
}

let brokenInternalLinks = 0;
internalAnchors.forEach(anchor => {
  if (!existingIds.has(anchor)) {
    brokenInternalLinks++;
    warnings.push(`[WARN] Ancla interna rota: #${anchor} (no existe id="${anchor}")`);
  }
});

check('Enlaces internos apuntan a IDs existentes', brokenInternalLinks === 0, `${brokenInternalLinks} enlace(s) interno(s) roto(s)`);

// =====================
// 6. FORMULARIOS (si existen)
// =====================
console.log('\n--- Formularios ---');
const forms = html.match(/<form[^>]*>/gi) || [];
if (forms.length === 0) {
  warn('Formularios', true, 'No hay formularios en la pagina (OK)');
} else {
  // Verificar action con HTTPS
  const formsWithHttp = forms.filter(f => /action=["']http:\/\//i.test(f));
  check('Formularios con action HTTPS', formsWithHttp.length === 0, `${formsWithHttp.length} formulario(s) con action HTTP`);
}

// =====================
// 7. CSP HEADERS (recomendado)
// =====================
console.log('\n--- Seguridad Adicional ---');
warn('Content Security Policy meta tag', /<meta[^>]+http-equiv=["']Content-Security-Policy["']/.test(html), 'No se encontro CSP meta tag');

// Report
console.log('\n========================================');
console.log('  SEGURIDAD DE ENLACES');
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
  console.log(`  ✅ SEGURIDAD VERIFICADA — ${passed.length} aprobado(s) | ${warnings.length} advertencia(s)\n`);
  process.exit(0);
}
