/**
 * Respaldo local por libro. No exporta claves de API ni certificaciones oficiales.
 * Importación con lista blanca y comprobación del ID del curso.
 */
const ProgressBackup = {
  snapshot(app){
    const keep=['progress','xp','level','quizScore','quizAnswered','userNotes','certName'];
    const state={};
    for(const field of keep)state[field]=app.state[field];
    let badges={};
    try{badges=JSON.parse(localStorage.getItem(`userTacticalBadges:${app.getBookScope()}`)||'{}')}catch{}
    return {
      format:'zenit-progress-backup',schemaVersion:1,bookId:app.getBookScope(),
      createdAt:new Date().toISOString(),
      data:{state,grades:app.getPillarScores(),badges}
    };
  },
  parse(app,payload){
    const object=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    if(!payload||payload.format!=='zenit-progress-backup'||payload.schemaVersion!==1||payload.bookId!==app.getBookScope())
      throw new Error('La copia no corresponde a este libro o a una versión compatible.');
    const data=app.getLibrosData(),input=object(payload.data),raw=object(input.state),rawProgress=object(raw.progress);
    if(!data?.modules?.length||!raw.progress||typeof raw.progress!=='object')throw new Error('El contenido de la copia es incompleto.');
    const order=data.modules.flatMap(m=>(m.keyPillars||[]).map((_,i)=>({id:`m${m.bookNumber}-${i}`,gradeKey:`score_m${m.bookNumber}_p${i}`,challengeKey:`challenge:${m.bookNumber}:${i}`})));
    const grades={},gradeInputs=object(input.grades);
    for(const lesson of order){
      const candidate=gradeInputs[lesson.gradeKey];
      if(!candidate||typeof candidate!=='object'||!Number.isInteger(candidate.score)||candidate.score<0||candidate.score>5)continue;
      const score=candidate.score;
      grades[lesson.gradeKey]={score,total:5,percentage:score*20,passed:score>=4,tier:score===5?'Oro':score===4?'Plata':'Sin calificar',
        timestamp:typeof candidate.timestamp==='string'?candidate.timestamp.slice(0,30):new Date().toISOString()};
    }
    const unlocked={},completed={},rewardAllowed=new Set();
    let canContinue=true;
    for(const [i,lesson] of order.entries()){
      if(canContinue)unlocked[lesson.id]=true;
      if(canContinue&&object(rawProgress.completedLessons)[lesson.id]===true&&grades[lesson.gradeKey]?.passed){
        completed[lesson.id]=true;
      }else canContinue=false;
      rewardAllowed.add(lesson.gradeKey);
      rewardAllowed.add(lesson.challengeKey);
    }
    const ratings={},flashIds=new Set((data.flashcards||[]).map(c=>String(c.id)));
    for(const [id,value] of Object.entries(object(rawProgress.flashcardRatings))){
      if(!flashIds.has(id)||!value||typeof value!=='object'||!['hard','medium','easy'].includes(value.rating))continue;
      ratings[id]={
        rating:value.rating,
        repetitions:Number.isInteger(value.repetitions)?Math.max(0,Math.min(value.repetitions,1000)):0,
        ease:Number.isFinite(value.ease)?Math.max(1.3,Math.min(value.ease,4)):2.5,
        intervalDays:Number.isFinite(value.intervalDays)?Math.max(0,Math.min(value.intervalDays,3650)):0,
        dueAt:typeof value.dueAt==='string'&&Number.isFinite(Date.parse(value.dueAt))?value.dueAt:new Date().toISOString(),
        lastReviewed:typeof value.lastReviewed==='string'?value.lastReviewed.slice(0,35):'',
        rewarded:value.rewarded===true
      };
    }
    const caseIds=new Set((data.caseScenarios||[]).map(c=>String(c.id))),solvedCaseIds={};
    for(const [id,value] of Object.entries(object(rawProgress.solvedCaseIds)))if(caseIds.has(id)&&value===true)solvedCaseIds[id]=true;
    const quizAnswered={};
    for(const q of data.quizzes||[]){
      const id=`quiz-${q.id}`,answer=object(raw.quizAnswered)[id];
      if(!answer||!Number.isInteger(answer.selectedIndex)||answer.selectedIndex<0||answer.selectedIndex>=q.options.length)continue;
      quizAnswered[id]={selectedIndex:answer.selectedIndex,correct:answer.selectedIndex===q.correctIndex};
      rewardAllowed.add(`general:${q.id}`);
    }
    const quizRewards={};
    for(const [key,value] of Object.entries(object(rawProgress.quizRewards)))if(rewardAllowed.has(key)&&value===true)quizRewards[key]=true;
    for(const q of data.quizzes||[])if(quizAnswered[`quiz-${q.id}`]?.correct)quizRewards[`general:${q.id}`]=true;
    for(const lesson of order)if(grades[lesson.gradeKey]?.passed)quizRewards[lesson.gradeKey]=true;
    const notes={};
    for(const lesson of order){
      const value=object(raw.userNotes)[lesson.id];
      if(typeof value==='string')notes[lesson.id]=value.slice(0,10000);
    }
    const badges={};
    for(const lesson of order){
      const key=lesson.gradeKey.replace('score_','badge_'),candidate=object(input.badges)[key];
      if(grades[lesson.gradeKey]?.passed&&candidate&&typeof candidate==='object'){
        badges[key]={tier:grades[lesson.gradeKey].tier,score:grades[lesson.gradeKey].score,
          pillarTitle:String(candidate.pillarTitle||'Lección').slice(0,150),timestamp:grades[lesson.gradeKey].timestamp};
      }
    }
    return {
      state:{
        progress:{unlockedLessons:unlocked,completedLessons:completed,flashcardRatings:ratings,solvedCaseIds,quizRewards},
        quizAnswered,quizScore:Object.values(quizAnswered).filter(x=>x.correct).length,userNotes:notes,
        xp:Number.isFinite(raw.xp)?Math.max(0,Math.min(Math.floor(raw.xp),10000000)):0,
        level:Number.isInteger(raw.level)?Math.max(1,Math.min(raw.level,9999)):1,
        certName:typeof raw.certName==='string'?raw.certName.slice(0,120):''
      },grades,badges
    };
  },
  apply(app,restored){
    app.state={...app.state,...restored.state};
    localStorage.setItem(app.getPillarScoresKey(),JSON.stringify(restored.grades));
    localStorage.setItem(`userTacticalBadges:${app.getBookScope()}`,JSON.stringify(restored.badges));
    app.saveProgress();
    app.state.filteredFlashcards=null;
    app.loadFlashcards();
    app.renderDashboard();
    app.renderLearningPath();
    app.renderQuizzes();
    if(app.state.activeTab==='certificate')app.renderCertificateView();
    return {completed:Object.keys(restored.state.progress.completedLessons).length,notes:Object.keys(restored.state.userNotes).length};
  },
  download(app){
    const payload=JSON.stringify(this.snapshot(app),null,2);
    const url=URL.createObjectURL(new Blob([payload],{type:'application/json;charset=utf-8'}));
    const link=document.createElement('a');
    link.href=url;link.download=`zenit-respaldo-${app.getBookScope().replace(/[^a-zA-Z0-9_-]/g,'').slice(0,110)}.json`;
    link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    app.showToast('Respaldo descargado: contiene notas personales, no claves de IA.','success');
  },
  async importFile(app,file){
    if(!file)return;
    if(file.size>2*1024*1024){app.showToast('El respaldo no puede superar los 2 MB.','error');return}
    try{
      const source=await file.text();
      if(source.length>2*1024*1024)throw new Error('Archivo demasiado grande.');
      const restored=this.parse(app,JSON.parse(source));
      if(!window.confirm('Se reemplazará el progreso guardado de este libro en este navegador. ¿Continuar?'))return;
      const summary=this.apply(app,restored);
      app.showToast(`Restaurado: ${summary.completed} lecciones y ${summary.notes} notas.`,'success');
    }catch(error){app.showToast('No se pudo restaurar la copia: '+error.message,'error')}
  }
};
if (typeof window !== 'undefined') window.ProgressBackup = ProgressBackup;
