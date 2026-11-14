const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const canonicalOrigin = 'https://cortex.sistemazenit.com';
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function requireMatch(file, pattern, message) {
  if (!pattern.test(read(file))) errors.push(`${file}: ${message}`);
}

requireMatch('CNAME', /^cortex\.sistemazenit\.com\s*$/m, 'CNAME no coincide con el dominio canónico.');
requireMatch('index.html', /canonical" href="https:\/\/cortex\.sistemazenit\.com\//, 'falta canonical de portada.');
requireMatch('index.html', /og:url" content="https:\/\/cortex\.sistemazenit\.com\//, 'falta og:url de portada.');
requireMatch('index.html', /href="css\/landing\.css"/, 'la landing debe cargar su hoja de estilos externa.');
requireMatch('index.html', /aria-labelledby="faq-title"/, 'el bloque de FAQ debe tener un nombre accesible.');
requireMatch('index.html', /El enlace de compra no está disponible/, 'la landing debe explicar el estado real del checkout.');
requireMatch('biblioteca.html', /<meta name="robots" content="noindex,follow">/, 'la biblioteca interna debe estar marcada como noindex.');
requireMatch('app.html', /<meta name="robots" content="noindex,follow">/, 'la academia dinámica debe estar marcada como noindex.');
requireMatch('robots.txt', /Sitemap:\s*https:\/\/cortex\.sistemazenit\.com\/sitemap\.xml/, 'robots.txt no declara el sitemap canónico.');
requireMatch('sitemap.xml', /<loc>https:\/\/cortex\.sistemazenit\.com\/<\/loc>/, 'sitemap.xml no contiene la portada canónica.');

const landing = read('index.html');
if (/<style\b/i.test(landing)) errors.push('index.html: mover los estilos de landing a css/landing.css.');
if (/href="\/api\/checkout"/.test(landing)) errors.push('index.html: no debe enlazar al checkout actualmente no disponible.');
if (/cdn\.tailwindcss\.com|cdnjs\.cloudflare\.com/.test(landing)) errors.push('index.html: la landing no debe cargar Tailwind ni Font Awesome por CDN.');
requireMatch('index.html', /href="css\/tailwind\.generated\.css"/, 'falta cargar el CSS estático de Tailwind.');
for (const asset of [
  'js/visuals/cortex-open-doors.webp',
  'js/visuals/cortex-human-forces.webp',
  'js/visuals/cortex-self-awareness.webp',
  'js/visuals/cortex-negotiation.webp',
  'js/visuals/cortex-connection.webp'
]) {
  if (!fs.existsSync(path.join(root, asset))) errors.push(`falta recurso optimizado de landing: ${asset}.`);
}
if (!fs.existsSync(path.join(root, 'css/landing.css'))) errors.push('falta css/landing.css.');
if (!fs.existsSync(path.join(root, 'css/tailwind.generated.css'))) errors.push('falta css/tailwind.generated.css. Ejecuta npm run build.');
if (!fs.existsSync(path.join(root, 'css/tailwind.source.css'))) errors.push('falta css/tailwind.source.css.');
if (!fs.existsSync(path.join(root, 'tailwind.config.js'))) errors.push('falta tailwind.config.js.');

for (const file of ['index.html', 'biblioteca.html', 'app.html']) {
  const html = read(file);
  if (html.includes('psicologiaoscura.sistemazenit.com')) {
    errors.push(`${file}: contiene el dominio antiguo.`);
  }
  const blankLinks = [...html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)];
  for (const match of blankLinks) {
    if (!/rel=["'][^"']*(?:noopener|noreferrer)/i.test(match[0])) {
      errors.push(`${file}: enlace target=_blank sin noopener/noreferrer.`);
    }
  }
  const images = [...html.matchAll(/<img\b[^>]*>/gi)];
  for (const match of images) {
    if (!/\balt=["'][^"']*["']/i.test(match[0])) {
      errors.push(`${file}: imagen sin atributo alt: ${match[0].slice(0, 100)}`);
    }
  }
}

for (const file of ['index.html', 'biblioteca.html', 'app.html', '404.html', 'robots.txt', 'sitemap.xml', 'package.json', 'package-lock.json']) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`falta archivo requerido: ${file}`);
}

try {
  const pkg = JSON.parse(read('package.json'));
  for (const script of ['check', 'test', 'dev', 'build', 'build:css']) {
    if (!pkg.scripts?.[script]) errors.push(`package.json: falta script ${script}.`);
  }
} catch (error) {
  errors.push(`package.json: JSON inválido (${error.message}).`);
}

if (errors.length) {
  console.error('Publication validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Publication validation passed.');
}
