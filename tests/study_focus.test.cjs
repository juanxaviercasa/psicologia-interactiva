const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){
 const panel={innerHTML:'',textContent:''};
 const document={addEventListener(){},getElementById(id){return id==='dashboardStudyFocus'?panel:null}};
 const context=vm.createContext({console,document,window:{location:{search:''},scrollTo(){}},localStorage:{getItem(){return null},setItem(){}},sessionStorage:{getItem(){return null}},URLSearchParams,Date,Math,JSON});
 vm.runInContext(fs.readFileSync('js/app.js','utf8'),context);
 const app=vm.runInContext('App',context);
 const data={modules:[{bookNumber:1,keyPillars:[{title:'Primer tema'},{title:'Siguiente tema'}]}],flashcards:[{id:'f1'},{id:'f2'}]};
 app.getLibrosData=()=>data;
 app.state.progress={unlockedLessons:{'m1-0':true},completedLessons:{},flashcardRatings:{},quizRewards:{}};
 return {app,panel,data};
}
test('El panel recomienda la próxima lección pendiente, no la siguiente desbloqueada por error',()=>{
 const {app}=setup();
 let s=app.getStudyFocus();
 assert.equal(s.next.id,'m1-0');assert.equal(s.total,2);assert.equal(s.dueCards,2);
 app.state.progress.unlockedLessons['m1-1']=true;app.state.progress.completedLessons['m1-0']=true;
 s=app.getStudyFocus();assert.equal(s.next.id,'m1-1');assert.equal(s.completed,1);
});
test('Tarjetas con intervalo futuro no se cuentan como vencidas',()=>{
 const {app}=setup();
 app.state.progress.flashcardRatings.f1={rating:'hard',dueAt:new Date(Date.now()+600000).toISOString()};
 const s=app.getStudyFocus();assert.equal(s.dueCards,1);
 app.renderStudyFocus();assert.match(app.getStudyFocus().next.title,/Primer/);
});
test('El panel ofrece botones de continuar y repasar con estado real',()=>{
 const {app,panel}=setup();app.renderStudyFocus();
 assert.match(panel.innerHTML,/Retomar lección/);assert.match(panel.innerHTML,/2 tarjetas/);
});
