const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx=vm.createContext({window:{}});vm.runInContext(fs.readFileSync('js/quiz_factory.js','utf8'),ctx);
const f=vm.runInContext('QuizFactory',ctx);
test('Cada lección dispone de cinco objetivos de práctica',()=>{
  const q=f.create({title:'Reconocer sesgos',concept:'Hay que contrastar evidencia.',tacticalRule:'Pedir contexto y tiempo'});
  assert.equal(q.length,5);
  assert.equal(new Set(q.map(x=>x.badge)).size,5);
  q.forEach(x=>{assert.equal(x.options.length,4);assert.ok(x.correctIndex>=0&&x.correctIndex<4);});
});
test('Se utiliza un desafío contextual del material cuando existe',()=>{
  const p={title:'Sesgos',interactiveChallenge:{question:'¿Cuál es el dato?',options:['a','b','c','d'],correctIndex:2,successMessage:'Bien'}};
  const q=f.create(p);
  assert.equal(q[0].question,'¿Cuál es el dato?');assert.equal(q[0].correctIndex,2);
});
test('Un banco editorial completo tiene prioridad y los ejercicios no incluyen diagnóstico como respuesta correcta automática',()=>{
  const authored=Array.from({length:5},(_,i)=>({question:'Caso '+i,options:['a','b','c','d'],correctIndex:i%4,explanation:'Explicación'}));
  const q=f.create({title:'Módulo',quizQuestions:authored});
  assert.equal(q[0].question,'Caso 0');assert.equal(q[4].correctIndex,0);
  const fallback=f.create({title:'Módulo',realExample:'Una conversación tensa'});
  assert.match(fallback[2].options[0],/hechos/i);
  assert.doesNotMatch(fallback[4].options[0],/diagnóstico/i);
});
test('Preguntas renderizadas escaparán texto y tienen modo sin tiempo',()=>{
  const app=fs.readFileSync('js/app.js','utf8');
  assert.match(app,/QuizFactory\.create\(pillar\)/);
  assert.match(app,/quizUntimedMode/);
  assert.match(app,/this\.escapeHTML\(q\.question\)/);
  assert.match(app,/this\.escapeHTML\(q\.explanation\)/);
});
