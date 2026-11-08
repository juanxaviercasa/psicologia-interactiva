/**
 * Autoevaluaciones basadas en contenido de cada pilar.
 * Preguntas específicas redactadas pueden definirse en pillar.quizQuestions.
 * Las preguntas generadas son formativas, no pruebas clínicas validadas.
 */
const QuizFactory = {
  clean(value,limit=185){
    const plain=String(value||'').replace(/<[^>]*>/g,' ').replace(/[`*_#]+/g,' ').replace(/\s+/g,' ').trim();
    return plain.length>limit?plain.slice(0,limit).replace(/\s+\S*$/,'')+'…':plain;
  },
  valid(question){
    return !!question&&typeof question.question==='string'&&Array.isArray(question.options)&&question.options.length===4&&question.options.every(x=>typeof x==='string'&&x.trim())&&Number.isInteger(question.correctIndex)&&question.correctIndex>=0&&question.correctIndex<4;
  },
  create(pillar){
    const p=pillar||{};
    const title=this.clean(p.title||'el concepto del módulo',110);
    const concept=this.clean(p.storytellingConcept||p.concept||'Identificar datos, reconocer incertidumbres y contrastar interpretaciones.',185);
    const shield=this.clean(p.tacticalShield||p.tacticalRule||'Pedir tiempo, examinar evidencia y establecer límites claros.',175);
    const scenario=this.clean(p.realExample||p.clinicalCase||p.dialogueBreakdown?.[0]?.text||'Alguien te presiona para decidir antes de disponer de información suficiente.',185);
    const first=this.valid(p.interactiveChallenge)?{
      badge:'📚 CASO DEL MATERIAL',
      question:p.interactiveChallenge.question,
      options:[...p.interactiveChallenge.options],
      correctIndex:p.interactiveChallenge.correctIndex,
      explanation:this.clean(p.interactiveChallenge.successMessage||'Contrasta la respuesta con el contexto completo.',350)
    }:{
      badge:'📚 CASO CONTEXTUAL',
      question:`Situación del módulo «${title}»: ${scenario} ¿Qué conviene evaluar antes de sacar una conclusión?`,
      options:['Hechos observables, alternativas y contexto de la situación.','La intención oculta de la persona sin preguntarle.','Un diagnóstico clínico a partir de una frase.','La apariencia física de quien habla.'],
      correctIndex:0,
      explanation:'Una observación aislada no permite concluir intenciones ni establecer diagnósticos.'
    };
    const questions=[
      first,
      {badge:'🧠 RECUERDO CONCEPTUAL',question:`¿Cuál de las siguientes ideas se trabaja en el módulo «${title}»?`,
       options:[concept,'Que un gesto aislado demuestra siempre engaño.','Que las interpretaciones no requieren evidencia.','Que la conducta humana puede juzgarse sin contexto.'],
       correctIndex:0,explanation:`Este es un resumen del material del curso, no un diagnóstico ni una ley universal: ${concept}`},
      {badge:'🔎 DIFERENCIAR DATOS E INFERENCIAS',question:`Ante el siguiente ejemplo: ${scenario} ¿Cuál es la primera pregunta útil?`,
       options:['¿Qué hechos puedo verificar y qué podría estar interpretando?','¿Qué trastorno tiene la otra persona?','¿Qué intención puedo dar por demostrada sin preguntar?','¿Cómo puedo forzar una respuesta inmediata?'],
       correctIndex:0,explanation:'Distinguir observación de interpretación reduce conclusiones precipitadas.'},
      {badge:'🛡️ LÍMITES Y RESPUESTA',question:`Según el módulo «${title}», ¿qué pauta defensiva se propone explorar?`,
       options:[shield,'Responder con amenazas para ganar la discusión.','Aceptar todas las exigencias sin revisar información.','Usar etiquetas clínicas para desacreditar a la otra persona.'],
       correctIndex:0,explanation:`Pauta recogida del material: ${shield}. Adáptala a tu seguridad y contexto real.`},
      {badge:'🌱 TRANSFERENCIA REFLEXIVA',question:`Después de estudiar «${title}», ¿qué conducta es más responsable al aplicar el aprendizaje fuera del aula?`,
       options:['Verificar información, considerar explicaciones alternativas y comunicar límites con respeto.','Concluir que conozco con certeza los pensamientos de otras personas.','Tratar mis resultados del cuestionario como un diagnóstico profesional.','Manipular la reacción emocional de otra persona para ganar.'],
       correctIndex:0,explanation:'Aplicar lo aprendido requiere respeto, cautela y reconocimiento de los límites de la información.'}
    ];
    if(Array.isArray(p.quizQuestions)){
      const authored=p.quizQuestions.filter(q=>this.valid(q)).map(q=>({...q,badge:q.badge||'📚 PREGUNTA DEL AUTOR'}));
      if(authored.length>=5)return authored.slice(0,5);
    }
    return questions;
  }
};
if (typeof window !== 'undefined') window.QuizFactory=QuizFactory;
