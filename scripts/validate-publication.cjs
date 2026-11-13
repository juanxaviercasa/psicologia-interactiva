const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('node:url');

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
requireMatch('index.html', new RegExp(`canonical" href="${canonicalOrigin.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}/"`), 'falta canonical de portada.');
requireMatch('index.html', new RegExp(`og:url" content="${canonicalOrigin.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}/"`), 'falta og:url de portada.');
requireMatch('biblioteca.html', /<meta name="robots" content="noindex,follow">/, 'la biblioteca interna debe estar marcada como noindex.');
requireMatch('app.html', /<meta name="robots" content="noindex,follow">/, 'la academia dinámica debe estar marcada como noindex.');
requireMatch('robots.txt', /Sitemap:\s*https:\/\/cortex\.sistemazenit\.com\/sitemap\.xml/, 'robots.txt no declara el sitemap canónico.');
requireMatch('sitemap.xml', /<loc>https:\/\/cortex\.sistemazenit\.com\/<\/loc>/, 'sitemap.xml no contiene la portada canónica.');

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

for (const file of ['index.html', 'biblioteca.html', 'app.html', '404.html', 'robots.txt', 'sitemap.xml', 'package.json']) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`falta archivo requerido: ${file}`);
}

try {
  const pkg = JSON.parse(read('package.json'));
  for (const script of ['check', 'test', 'dev']) {
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
