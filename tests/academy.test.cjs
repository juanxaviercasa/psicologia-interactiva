const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function harness() {
  const storage = new Map();
  const localStorage = {
    getItem(k) { return storage.get(k) ?? null; },
    setItem(k,v) { storage.set(k,String(v)); },
    removeItem(k) { storage.delete(k); }
  };
  const context = vm.createContext({
    console, Date, Math, JSON, URLSearchParams,
    localStorage, sessionStorage: localStorage,
    window: {location:{search:''}, scrollTo(){}},
    document: {addEventListener(){}, getElementById(){return null}},
    CustomEvent: class {}
  });
  vm.runInContext(fs.readFileSync('js/app.js','utf8'),context,{filename:'app.js'});
  const app = vm.runInContext('App',context);
  const data = {
    modules: [{bookNumber:1,keyPillars:[{title:'Lección'}]}],
    flashcards: [{id:'fc-1',bookNumber:1,front:'P',back:'R'}],
    quizzes: [{id:'q1',question:'Pregunta',options:['Correcta','Otra'],correctIndex:0,explanation:'Explicación <img src=x onerror=alert(1)>'}]
  };
  app.getLibrosData=()=>data;
  app.renderCurrentFlashcard=()=>{};
  app.showToast=()=>{};
  app.updateAllUI=()=>{};
  app.addXP=function(n){this.state.xp+=n};
  app.playSound=()=>{};
  app.renderQuizzes=()=>{};
  app.state.progress={unlockedLessons:{'m1-0':true},completedLessons:{},flashcardRatings:{},quizRewards:{}};
  return {app,context,localStorage,data};
}

test('API del alumno escapa HTML externo',()=>{
  const {app}=harness();
  assert.equal(app.escapeHTML('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});

test('Tarjetas se pueden filtrar sin argumento y guardan fechas de repaso',()=>{
  const {app}=harness();
  app.filterFlashcards();
  assert.equal(app.state.filteredFlashcards.length,1);
  app.rateFlashcard('hard');
  assert.equal(app.state.progress.flashcardRatings['fc-1'].rating,'hard');
  assert.ok(app.state.progress.flashcardRatings['fc-1'].dueAt);
  app.rateFlashcard('easy');
  app.rateFlashcard('easy');
  assert.equal(app.state.xp,5,'no repetir recompensa de la misma tarjeta');
});

test('Evaluaciones conservan primera respuesta y no regalan XP por refrescar',()=>{
  const {app}=harness();
  app.checkQuizAnswer(0,0);
  assert.equal(app.state.quizScore,1);
  app.checkQuizAnswer(0,0);
  assert.equal(app.state.quizScore,1);
  assert.equal(app.state.xp,15);
  assert.equal(app.state.quizAnswered['quiz-q1'].correct,true);
});

test('Constancia requiere lección completada y nota aprobada',()=>{
  const {app,localStorage}=harness();
  assert.equal(app.isCourseComplete(),false);
  localStorage.setItem(app.getPillarScoresKey(),JSON.stringify({'score_m1_p0':{passed:true,score:5}}));
  assert.equal(app.isCourseComplete(),false);
  app.state.progress.completedLessons['m1-0']=true;
  assert.equal(app.isCourseComplete(),true);
});

test('Catálogo identifica de forma única 94 libros',()=>{
  const source=fs.readFileSync('js/coleccion_data.js','utf8');
  const context=vm.createContext({window:{}});
  vm.runInContext(source,context);
  const data=vm.runInContext('COLECCION_DATA',context);
  assert.equal(data.books.length,94);
  assert.equal(new Set(data.books.map(x=>x.id)).size,data.books.length);
  assert.equal(new Set(data.allItems.map(x=>x.id)).size,data.allItems.length);
});

test('No quedan inyecciones directas en burbujas de chat',()=>{
  const src=fs.readFileSync('js/app.js','utf8');
  assert.doesNotMatch(src,/\$\{msg\}<\/div>/);
  assert.doesNotMatch(src,/\$\{text\}<\/div>/);
  assert.match(src,/DOMPurify\.sanitize/);
  assert.doesNotMatch(src,/function toggleRapidReview\(/);
});
