const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(){
  const storage=new Map();
  const localStorage={
    getItem:k=>storage.get(k)??null,
    setItem:(k,v)=>storage.set(k,String(v)),
    removeItem:k=>storage.delete(k)
  };
  const context=vm.createContext({window:{},localStorage,console,Date,Math,JSON});
  vm.runInContext(fs.readFileSync('js/progress_backup.js','utf8'),context);
  const backup=vm.runInContext('ProgressBackup',context);
  const data={
    modules:[{bookNumber:1,keyPillars:[{},{}]}],
    quizzes:[{id:'q1',options:['a','b'],correctIndex:0}],
    flashcards:[{id:'f1'}],caseScenarios:[{id:'c1'}]
  };
  const app={
    state:{progress:{completedLessons:{'m1-0':true},unlockedLessons:{'m1-0':true},quizRewards:{}},quizAnswered:{},userNotes:{'m1-0':'Mi nota'},xp:20,level:1,certName:'Prueba'},
    getBookScope:()=> 'book-demo',
    getLibrosData:()=>data,
    getPillarScoresKey:()=> 'scores:book-demo',
    getPillarScores:()=>({score_m1_p0:{score:4,passed:true}}),
    saveProgress(){localStorage.setItem('progress:book-demo',JSON.stringify(this.state.progress))},
    loadFlashcards(){},renderDashboard(){},renderLearningPath(){},renderQuizzes(){},showToast(){}
  };
  return {backup,app,localStorage,storage};
}
test('Un respaldo tiene ID de libro y no exporta secretos',()=>{
  const {backup,app,localStorage}=setup();
  localStorage.setItem('userAIKey_google','VERY_PRIVATE_TOKEN');
  const result=backup.snapshot(app);
  assert.equal(result.bookId,'book-demo');
  assert.equal(result.schemaVersion,1);
  assert.doesNotMatch(JSON.stringify(result),/VERY_PRIVATE_TOKEN/);
});
test('No se permite importar un respaldo de otro libro o versión',()=>{
  const {backup,app}=setup();
  const payload=backup.snapshot(app);
  payload.bookId='different';
  assert.throws(()=>backup.parse(app,payload),/no corresponde/);
  payload.bookId='book-demo';payload.schemaVersion=2;
  assert.throws(()=>backup.parse(app,payload),/compatible/);
});
test('Se descartan IDs falsos y se valida la aprobación para completar una lección',()=>{
  const {backup,app}=setup();
  const payload=backup.snapshot(app);
  payload.data.state.progress.completedLessons={'m1-0':true,'m1-1':true,'m200-1':true};
  payload.data.state.userNotes={'m1-0':'Legítima','__proto__':'inyección','m200-1':'Falsa'};
  payload.data.state.quizAnswered={'quiz-q1':{selectedIndex:1,correct:true},'quiz-fake':{selectedIndex:0}};
  const value=backup.parse(app,payload);
  assert.equal(value.state.progress.completedLessons['m1-0'],true);
  assert.equal(value.state.progress.completedLessons['m1-1'],undefined);
  assert.equal(value.state.progress.completedLessons['m200-1'],undefined);
  assert.equal(value.state.quizAnswered['quiz-q1'].correct,false);
  assert.equal(value.state.quizAnswered['quiz-fake'],undefined);
  assert.equal(value.state.userNotes['m200-1'],undefined);
  assert.equal(value.state.progress.unlockedLessons['m1-1'],true);
});
test('El respaldo restaura puntuaciones válidas sin exportar claves',()=>{
  const {backup,app,localStorage}=setup();
  const payload=backup.snapshot(app);
  payload.data.state.quizAnswered={'quiz-q1':{selectedIndex:0,correct:false}};
  const parsed=backup.parse(app,payload);
  const stats=backup.apply(app,parsed);
  assert.equal(stats.completed,1);
  assert.equal(app.state.quizScore,1);
  assert.equal(app.state.quizAnswered['quiz-q1'].correct,true);
  assert.equal(JSON.parse(localStorage.getItem('scores:book-demo')).score_m1_p0.passed,true);
});
