(() => {
  const lessons = window.COURSE;
  const KEY = 'js-interview-lab-v1';
  const getSaved = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const saved = getSaved();
  const progress = {read: saved.read || {}, correct: saved.correct || {}, missed: saved.missed || {}, days: saved.days || {}, outputCorrect: saved.outputCorrect || {}};
  const outputChallenges = window.OUTPUT_CHALLENGES || [];
  const allQuestions = lessons.flatMap(topic => topic.questions.map((question, index) => ({...question,topicId:topic.id,topicTitle:topic.title,key:`${topic.id}-${index}`})));
  const app = document.querySelector('#app');
  let filter = 'Todos';
  let session = null;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch {} updateXp(); };
  const xp = () => Object.keys(progress.correct).length * 10 + Object.keys(progress.read).length * 5 + Object.keys(progress.outputCorrect).length * 15;
  const updateXp = () => document.querySelector('#topXp').textContent = `✦ ${xp()} XP`;
  const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hash = () => decodeURIComponent(location.hash.slice(1) || 'inicio');
  const todayIndex = () => [...dateKey()].reduce((sum,char)=>sum+char.charCodeAt(0),0) % allQuestions.length;
  const daily = () => allQuestions[todayIndex()];
  const dateKey = () => new Date().toLocaleDateString('en-CA');
  const streak = () => { let count = 0; const date = new Date(); if (!progress.days[date.toLocaleDateString('en-CA')]) date.setDate(date.getDate()-1); for(let i=0;i<365;i++){const key=date.toLocaleDateString('en-CA');if(!progress.days[key]) break;count++;date.setDate(date.getDate()-1)} return count; };
  const navigate = route => {location.hash = route; window.scrollTo({top:0,behavior:'instant'}); render();};
  function dashboard(){
    const mastered = lessons.filter(t => t.questions.every((_,i) => progress.correct[`${t.id}-${i}`])).length;
    const completed = Object.keys(progress.read).length;
    const dailyDone = !!progress.days[dateKey()];
    const categories = ['Todos','Fundamentos','Asincronía','Datos','Algoritmos','React','TypeScript','CSS','Arquitectura','Calidad'];
    const visible = lessons.filter(t => filter === 'Todos' || t.category === filter);
    app.innerHTML = `<section class="dashboard"><div class="eyebrow">Aprende · razona · responde</div><h1>Entiende JavaScript.<br><em>Practica para tu entrevista.</em></h1><p class="intro">Explicaciones desde cero, ejemplos reales y ${allQuestions.length} preguntas explicadas. Elige un tema, lee un ejemplo y comprueba lo que has entendido.</p><div class="stats"><div class="stat"><strong>${completed}/${lessons.length}</strong> temas leídos</div><div class="stat"><strong>${mastered}</strong> dominados</div><div class="stat"><strong>${streak()}</strong> días de racha</div><div class="stat"><strong>${Object.keys(progress.outputCorrect).length}/${outputChallenges.length}</strong> salidas resueltas</div></div></section>
    <div class="layout"><section><div class="section-heading"><div><h2>Temas para estudiar</h2><p>Elige un concepto, entiende la regla y ponte a prueba.</p></div><span class="chip">${lessons.length} temas</span></div><div class="controls" role="group" aria-label="Filtrar temas">${categories.map(c=>`<button class="filter" data-filter="${c}" aria-pressed="${filter===c}">${c}</button>`).join('')}</div><div class="topic-grid">${visible.map(t => {const done=t.questions.every((_,i)=>progress.correct[`${t.id}-${i}`]);return `<button class="topic" data-topic="${t.id}"><span class="topic-top"><span class="topic-icon">${t.icon}</span><span class="topic-status">${done?'✓ Dominado':progress.read[t.id]?'En progreso':t.level}</span></span><h3>${t.title}</h3><p>${t.subtitle}</p><span class="topic-bottom"><span>${t.minutes} min · ${t.questions.length} retos</span><b>Explorar ↗</b></span></button>`}).join('')}</div></section>
    <aside class="side"><div class="panel output-panel"><div class="panel-kicker">⌨️ Escribe la respuesta</div><h3>¿Qué imprime este código?</h3><p>Sin opciones: escribe la salida y descubre por qué aparece cada línea. Hay ${outputChallenges.length} retos.</p><button class="primary wide" id="outputBtn">Practicar salidas</button></div><div class="panel starter"><div class="panel-kicker">🌱 ¿Por dónde empiezo?</div><h3>Empieza por aquí</h3><p>1. Tipos y variables<br>2. Closures<br>3. Event loop<br>4. Promises<br>5. React y componentes</p><button class="secondary wide" id="startBtn">Empezar desde cero</button></div><div class="panel case-panel"><div class="panel-kicker">🧩 Entrevista práctica</div><h3>Practica una situación real</h3><p>Diseña una tabla, un modal o una búsqueda. Pide una pista cuando te atasques y compara tu respuesta.</p><button class="secondary wide" id="caseBtn">Practicar un caso</button></div><div class="panel challenge"><div class="panel-kicker">⚡ Reto del día</div><h3>${dailyDone?'¡Reto completado!':'Una pregunta para calentar'}</h3><p>${dailyDone?'Vuelve mañana para una pregunta nueva o continúa con el simulacro.':`Hoy toca ${daily().topicTitle.toLowerCase()}. ¿Te atreves a responder sin mirar?`}</p><button class="primary wide" id="dailyBtn">${dailyDone?'Repetir reto':'Jugar ahora'}</button></div><div class="panel"><div class="panel-kicker">Modo entrevista</div><h3>12 preguntas. Sin apuntes.</h3><p>Una mezcla de JavaScript, React, CSS, TypeScript y arquitectura. Al responder, verás por qué la opción es correcta.</p><button class="secondary wide" id="mockBtn">Empezar simulacro</button>${Object.keys(progress.missed).length?`<button class="secondary wide" id="missedBtn" style="margin-top:9px">Repasar mis fallos (${Object.keys(progress.missed).length})</button>`:''}</div><div class="panel"><div class="panel-kicker">Tu avance</div><h3>${Math.round(Object.keys(progress.correct).length/allQuestions.length*100)}% de preguntas dominadas</h3><div class="progress-track"><div class="progress-fill" style="width:${Object.keys(progress.correct).length/allQuestions.length*100}%"></div></div><p class="small">${Object.keys(progress.correct).length} de ${allQuestions.length} aciertos únicos · ${xp()} XP</p></div></aside></div>`;
    app.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;dashboard()});
    app.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>navigate(`tema/${b.dataset.topic}`));
    app.querySelector('#dailyBtn').onclick=()=>startQuiz([daily()],'daily');
    app.querySelector('#outputBtn').onclick=()=>navigate('salidas');
    app.querySelector('#startBtn').onclick=()=>navigate('tema/tipos');
    app.querySelector('#caseBtn').onclick=()=>navigate('caso/0');
    app.querySelector('#mockBtn').onclick=()=>startQuiz(shuffle(allQuestions).slice(0,12),'mock');
    app.querySelector('#missedBtn')?.addEventListener('click',()=>startQuiz(shuffle(allQuestions.filter(q=>progress.missed[q.key])),'missed'));
  }
  function lesson(id){
    const t=lessons.find(x=>x.id===id); if(!t){navigate('inicio');return;}
    const b=window.BEGINNER?.[id];
    app.innerHTML=`<div class="view"><button class="back" id="back">← Volver al mapa</button><div class="lesson-head"><span class="topic-icon">${t.icon}</span><div><span class="eyebrow">${t.category} · ${t.minutes} min</span><h1>${t.title}</h1><p>${t.subtitle}</p></div></div><div class="lesson-grid"><article class="lesson-card">${b?`<div class="simple-box"><span class="panel-kicker">La idea, en pocas palabras</span><p class="simple-main">${b.plain}</p><p><strong>Piensa en este caso:</strong> ${b.analogy}</p></div>`:''}<h2>Cómo funciona</h2><p>${t.theory}</p><h2>Un ejemplo</h2><pre class="code"><code>${escapeHTML(t.example)}</code></pre>${b?`<div class="steps-box"><strong>Cómo razonarlo</strong><p>${b.steps}</p></div>`:''}<p class="takeaway"><strong>Cómo explicarlo en una entrevista:</strong> ${t.takeaway}</p><div class="lesson-actions"><button class="primary" id="practice">Practicar ${t.questions.length} preguntas</button>${outputChallenges.some(c=>c.topicId===id)?`<button class="secondary" id="outputLesson">Practicar «¿qué imprime?»</button>`:''}<button class="secondary" id="markRead">${progress.read[id]?'✓ Leído':'Marcar como leído'}</button></div></article><aside class="lesson-card"><span class="pill">Fuente de referencia</span><h2 style="margin-top:18px">Si quieres saber más</h2><p>Aquí tienes la documentación original para consultar detalles y casos menos habituales.</p><a class="source-link" href="${t.source}" target="_blank" rel="noopener noreferrer">Abrir documentación de referencia ↗</a><p class="small" style="margin-top:22px">Prueba a explicar el ejemplo en voz alta antes de mirar las respuestas.</p></aside></div></div>`;
    app.querySelector('#back').onclick=()=>navigate('inicio');
    app.querySelector('#practice').onclick=()=>startQuiz(allQuestions.filter(q=>q.topicId===id),'topic');
    app.querySelector('#outputLesson')?.addEventListener('click',()=>navigate(`salida/${outputChallenges.find(c=>c.topicId===id).id}`));
    app.querySelector('#markRead').onclick=()=>{progress.read[id]=true;save();app.querySelector('#markRead').textContent='✓ Leído'};
  }
  function shuffle(array){return [...array].sort(()=>Math.random()-.5)}
  function startQuiz(questions,mode){if(!questions.length){navigate('inicio');return}session={questions,index:0,answered:null,score:0,mode};location.hash='reto';window.scrollTo({top:0,behavior:'instant'});quiz();}
  function answer(index){if(!session || session.answered!==null)return;const q=session.questions[session.index];session.answered=index;if(index===q.answer){session.score++;progress.correct[q.key]=true;delete progress.missed[q.key]}else progress.missed[q.key]=true;if(session.mode==='daily')progress.days[dateKey()]=true;save();quiz();}
  function quiz(){if(!session){navigate('inicio');return}const {questions,index,answered,score}=session;if(index>=questions.length){result();return}const q=questions[index];app.innerHTML=`<div class="view quiz-wrap"><button class="back" id="exit">← Salir del reto</button><div class="eyebrow">${session.mode==='mock'?'Simulacro':session.mode==='daily'?'Reto del día':session.mode==='missed'?'Repaso de fallos':'Práctica de tema'} · ${q.topicTitle}</div><div class="quiz-progress">Pregunta ${index+1} de ${questions.length} · ${score} ${score===1?'acierto':'aciertos'}</div><div class="quiz-progress-track"><div style="width:${(index+1)/questions.length*100}%"></div></div><div class="question-card"><span class="pill">Piensa antes de pulsar</span><h1>${escapeHTML(q.q)}</h1><div class="choices" role="group" aria-label="Opciones de respuesta">${q.choices.map((c,i)=>`<button class="choice ${answered!==null?(i===q.answer?'correct':i===answered?'incorrect':''):''}" data-answer="${i}" ${answered!==null?'disabled':''}>${String.fromCharCode(65+i)} · ${escapeHTML(c)}</button>`).join('')}</div>${answered!==null?`<div class="explanation" role="status"><strong>${answered===q.answer?'¡Exacto! +10 XP si era nueva':'Casi. Esta es la regla:'}</strong><p>${q.why}</p></div><div class="quiz-controls"><button class="primary" id="next">${index===questions.length-1?'Ver resultado':'Siguiente pregunta'}</button><button class="secondary" id="source">Consultar fuente</button></div>`:''}</div></div>`;
    app.querySelector('#exit').onclick=()=>{session=null;navigate('inicio')};
    app.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.answer)));
    app.querySelector('#next')?.addEventListener('click',()=>{session.index++;session.answered=null;quiz();window.scrollTo({top:0,behavior:'instant'})});
    app.querySelector('#source')?.addEventListener('click',()=>window.open(lessons.find(t=>t.id===q.topicId).source,'_blank','noopener'));
  }
  function result(){const {score,questions,mode}=session;app.innerHTML=`<div class="view result-card"><div class="eyebrow">Sesión completada</div><div class="result-number">${score}/${questions.length}</div><h1>${score===questions.length?'¡Ronda perfecta!':score>=questions.length*.7?'Vas por buen camino.':'Ya sabes qué repasar.'}</h1><p>${score===questions.length?'Has acertado todas. Prueba otra ronda para practicar más temas.':'Cada respuesta ya tiene una explicación y tus fallos quedan guardados para repasarlos. Repite los conceptos que más cuestan.'}</p><div class="quiz-controls"><button class="primary" id="retry">Repetir esta ronda</button><button class="secondary" id="home">Volver al mapa</button></div></div>`;app.querySelector('#retry').onclick=()=>startQuiz(shuffle(questions),mode);app.querySelector('#home').onclick=()=>{session=null;navigate('inicio')};}

  function outputHub(){
    const done=outputChallenges.filter(c=>progress.outputCorrect[c.id]).length;
    app.innerHTML=`<div class="view quiz-wrap"><button class="back" id="back">← Volver al mapa</button><div class="eyebrow">Práctica de código</div><h1 class="output-title">¿Qué imprime?</h1><p class="output-intro">Lee el código y escribe lo que aparece en la consola, una salida por línea. No necesitas escribir <code>console.log</code>. Puedes poner comillas en los textos o dejarlos sin ellas.</p><p class="quiz-progress">${done} de ${outputChallenges.length} resueltos sin ver la solución</p><div class="output-grid">${outputChallenges.map((c,i)=>`<button class="output-card" data-output="${c.id}"><span class="panel-kicker">${lessons.find(t=>t.id===c.topicId).title} · ${c.level}</span><strong>${i+1}. ${c.title}</strong><span>${progress.outputCorrect[c.id]?'✓ Resuelto':'Empezar →'}</span></button>`).join('')}</div></div>`;
    app.querySelector('#back').onclick=()=>navigate('inicio');
    app.querySelectorAll('[data-output]').forEach(button=>button.onclick=()=>navigate(`salida/${button.dataset.output}`));
  }
  function normalizeOutput(line){
    const text=line.trim().replace(/;$/, '').trim();
    return text.length>=2 && ((text.startsWith('"')&&text.endsWith('"'))||(text.startsWith("'")&&text.endsWith("'"))) ? text.slice(1,-1) : text;
  }
  function outputChallenge(id){
    const c=outputChallenges.find(item=>item.id===id);
    if(!c){navigate('salidas');return}
    const index=outputChallenges.indexOf(c);
    app.innerHTML=`<div class="view quiz-wrap"><button class="back" id="back">← Todos los retos</button><div class="eyebrow">¿Qué imprime? · ${lessons.find(t=>t.id===c.topicId).title}</div><div class="quiz-progress">Reto ${index+1} de ${outputChallenges.length} · ${c.level}</div><div class="question-card"><h1>${c.title}</h1><p class="output-intro">Escribe la salida en orden: una línea por cada resultado que aparece en la consola.</p><pre class="code"><code>${escapeHTML(c.code)}</code></pre><label class="output-label" for="outputAnswer">Tu respuesta</label><textarea id="outputAnswer" class="output-input" rows="${Math.max(3,c.output.length)}" placeholder="Una salida por línea…" spellcheck="false" aria-describedby="outputHelp"></textarea><p id="outputHelp" class="small">Ejemplo: si se imprime A y luego 2, escribe A en la primera línea y 2 en la segunda.</p><div class="quiz-controls"><button class="primary" id="checkOutput">Comprobar respuesta</button><button class="secondary" id="showOutput">Ver solución</button></div><div id="outputFeedback" aria-live="polite"></div></div><div class="quiz-controls"><button class="secondary" id="lesson">Repasar el concepto</button>${index<outputChallenges.length-1?'<button class="secondary" id="nextOutput">Siguiente reto →</button>':''}</div></div>`;
    app.querySelector('#back').onclick=()=>navigate('salidas');
    app.querySelector('#lesson').onclick=()=>navigate(`tema/${c.topicId}`);
    app.querySelector('#nextOutput')?.addEventListener('click',()=>navigate(`salida/${outputChallenges[index+1].id}`));
    const feedback=app.querySelector('#outputFeedback');
    let revealed=false;
    const show=(revealOnly=false)=>{
      if(revealOnly) revealed=true;
      const raw=app.querySelector('#outputAnswer').value.trim();
      if(!raw&&!revealOnly){feedback.innerHTML='<p class="output-message" role="status">Escribe primero tu respuesta; una salida por línea.</p>';return}
      const lines=raw?raw.split(/\r?\n/).map(normalizeOutput).filter(Boolean):[];
      const right=c.output.map((expected,i)=>lines[i]===expected);
      const complete=!revealOnly && lines.length===c.output.length && right.every(Boolean);
      const earned=complete && !revealed;
      if(earned){progress.outputCorrect[c.id]=true;save()}
      if(!complete) revealed=true;
      feedback.innerHTML=`<div class="output-feedback"><h2>${complete?(earned?'¡Lo has clavado! +15 XP si era nuevo':'¡Correcto! Abre el reto de nuevo y acierta antes de ver la solución para marcarlo como resuelto.'):revealOnly?'Solución paso a paso':`Has acertado ${right.filter(Boolean).length} de ${c.output.length} líneas. Revisa el orden y vuelve a probar. Para marcarlo como resuelto, empieza otra vez sin ver la solución.`}</h2>${lines.length!==c.output.length&&!revealOnly?`<p>Hay ${c.output.length} salidas en total; escribiste ${lines.length}.</p>`:''}<ol>${c.output.map((expected,i)=>`<li class="${revealOnly?'output-neutral':right[i]?'output-right':'output-wrong'}"><strong>Línea ${i+1}: ${escapeHTML(expected)}</strong>${!revealOnly&&lines[i]!==expected?`<span> Tu respuesta: ${escapeHTML(lines[i]??'sin respuesta')}</span>`:''}<p>${escapeHTML(c.reasons[i])}</p></li>`).join('')}</ol><p class="output-lesson">${escapeHTML(c.lesson)}</p></div>`;
    };
    app.querySelector('#checkOutput').onclick=()=>show(false);
    app.querySelector('#showOutput').onclick=()=>show(true);
  }
  function scenario(index){
    const cases=window.SCENARIOS||[];const item=cases[index];if(!item){navigate('inicio');return}
    app.innerHTML=`<div class="view quiz-wrap"><button class="back" id="back">← Volver al mapa</button><div class="eyebrow">Caso ${index+1} de ${cases.length} · ${item.tag} · ${item.time}</div><div class="question-card"><span class="pill">Explica tu idea en voz alta antes de pedir ayuda</span><h1>${item.title}</h1><p class="scenario-prompt">${item.prompt}</p><div class="quiz-controls"><button class="secondary" id="hintBtn">Necesito una pista</button><button class="primary" id="solutionBtn">Comparar mi respuesta</button></div><div class="reveal" id="hint" hidden><strong>Pista</strong><p>${item.hint}</p></div><div class="reveal" id="solution" hidden><strong>Una buena forma de responder</strong><p>${item.solution}</p><h2>Comprueba tu respuesta</h2>${item.check.map((c,i)=>`<label class="check-row"><input type="checkbox" id="check-${i}"><span>${c}</span></label>`).join('')}</div></div><div class="quiz-controls"><button class="secondary" id="prev" ${index===0?'disabled':''}>Caso anterior</button><button class="secondary" id="next" ${index===cases.length-1?'disabled':''}>Siguiente caso</button></div></div>`;
    app.querySelector('#back').onclick=()=>navigate('inicio');
    app.querySelector('#hintBtn').onclick=()=>{app.querySelector('#hint').hidden=false;app.querySelector('#hintBtn').disabled=true};
    app.querySelector('#solutionBtn').onclick=()=>{app.querySelector('#solution').hidden=false;app.querySelector('#solutionBtn').disabled=true};
    app.querySelector('#prev').onclick=()=>navigate(`caso/${index-1}`);
    app.querySelector('#next').onclick=()=>navigate(`caso/${index+1}`);
  }
  function render(){updateXp();const route=hash();if(route==='reto'){quiz();return}if(route==='salidas'){outputHub();return}if(route.startsWith('salida/')){outputChallenge(route.split('/')[1]);return}if(route.startsWith('tema/')){lesson(route.split('/')[1]);return}if(route.startsWith('caso/')){scenario(Number(route.split('/')[1]));return}dashboard()}
  window.addEventListener('hashchange',render);render();
  if(document.modelContext?.registerTool){try{
    const register=(tool)=>Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{});
    register({name:'list_interview_topics',title:'Listar temas',description:'Lista los temas y el progreso local de preparación de entrevistas.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>lessons.map(t=>({id:t.id,title:t.title,category:t.category,read:!!progress.read[t.id]}))});
    register({name:'start_interview_topic',title:'Abrir tema',description:'Abre una lección existente de JavaScript o React en la página visible.',inputSchema:{type:'object',properties:{topicId:{type:'string'}},required:['topicId'],additionalProperties:false},execute:({topicId})=>{if(!lessons.some(t=>t.id===topicId))throw Error('Tema desconocido');navigate(`tema/${topicId}`);return {topicId,opened:true}}});
  }catch{}}
})();
