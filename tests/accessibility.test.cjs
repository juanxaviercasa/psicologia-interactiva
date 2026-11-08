const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const app=fs.readFileSync('js/app.js','utf8'),html=fs.readFileSync('app.html','utf8'),css=fs.readFileSync('css/styles.css','utf8');
test('Notas de alumnos nunca se insertan como etiquetas HTML',()=>{
  assert.doesNotMatch(app,/\$\{notes\}<\/textarea>/);
  assert.match(app,/\$\{this\.escapeHTML\(notes\)\}<\/textarea>/);
});
test('El botón de completar refleja la aprobación y no el simple desafío',()=>{
  assert.match(app,/const canFinish=!!this\.getPillarScores\(\)/);
  assert.match(app,/btn\.disabled=!canFinish/);
});
test('Los modales son accesibles y restauran foco',()=>{
  assert.match(html,/id="lessonModal" role="dialog" aria-modal="true"/);
  assert.match(html,/id="searchModal" role="dialog" aria-modal="true"/);
  assert.match(app,/keepDialogFocus\(e\)/);
  assert.match(app,/this\._previousLessonFocus\.focus\(\)/);
});
test('Tarjetas se pueden voltear con teclado y preferencias de movimiento son respetadas',()=>{
  assert.match(html,/id="fcFlipToggle"/);
  assert.match(html,/onkeydown="if\(event\.key==='Enter'/);
  assert.match(css,/prefers-reduced-motion/);
});
