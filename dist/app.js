(() => {
  const lessons = window.COURSE;
  const KEY = 'js-interview-lab-v1';
  const getSaved = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const saved = getSaved();
  const progress = {read: saved.read || {}, correct: saved.correct || {}, missed: saved.missed || {}, days: saved.days || {}, outputCorrect: saved.outputCorrect || {}, codeSolved: saved.codeSolved || {}, workshops: saved.workshops || {}};
  const outputChallenges = window.OUTPUT_CHALLENGES || [];
  const codeProblems = window.CODE_PROBLEMS || [];
  const patterns = window.SOLUTION_PATTERNS || [];
  const workshops = window.INTERVIEW_WORKSHOPS || [];
  const allQuestions = lessons.flatMap(topic => topic.questions.map((question, index) => ({...question,topicId:topic.id,topicTitle:topic.title,key:`${topic.id}-${index}`})));
  const app = document.querySelector('#app');
  let filter = 'Todos';
  let session = null;
  let codeFilter = 'Todos';
  const TIMED_KEY = 'js-interview-lab-timed-v1';
  const RESULT_KEY = 'js-interview-lab-timed-result-v1';
  const readSession = key => {try{return JSON.parse(sessionStorage.getItem(key))}catch{return null}};
  let timed = readSession(TIMED_KEY);
  const persistTimed = () => {try{sessionStorage.setItem(TIMED_KEY,JSON.stringify(timed))}catch{}};
  const timeLeft = () => Math.max(0, Math.ceil((timed.deadline-Date.now())/1000));
  const clockText = seconds => `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
  function startTimed(){
    const pick = level => shuffle(codeProblems.filter(p=>p.level===level))[0].id;
    timed={ids:[pick('Fácil'),pick('Medio'),pick('Difícil')],startedAt:Date.now(),deadline:Date.now()+35*60*1000,solved:{}};
    persistTimed();navigate(`codigo/${timed.ids[0]}`);
  }
  function finishTimed(reason){
    if(!timed)return;
    const result={...timed,reason,endedAt:Date.now()};
    try{sessionStorage.setItem(RESULT_KEY,JSON.stringify(result));sessionStorage.removeItem(TIMED_KEY)}catch{}
    timed=null;navigate('entrevista-resultado');
  }
  function updateClock(){
    if(!timed)return;
    const left=timeLeft();
    if(left<=0){finishTimed('time');return}
    const el=app.querySelector('#timedClock');if(el)el.textContent=clockText(left);
  }
  setInterval(updateClock,1000);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch {} updateXp(); };
  const xp = () => Object.keys(progress.correct).length * 10 + Object.keys(progress.read).length * 5 + Object.keys(progress.outputCorrect).length * 15 + Object.keys(progress.codeSolved).length * 25 + Object.keys(progress.workshops).length * 15;
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
    app.innerHTML = `<section class="dashboard"><div class="eyebrow">Aprende · razona · responde</div><h1>Entiende JavaScript.<br><em>Practica para tu entrevista.</em></h1><p class="intro">Explicaciones desde cero, ejemplos reales y ${allQuestions.length} preguntas explicadas. Elige un tema, lee un ejemplo y comprueba lo que has entendido.</p><div class="stats"><div class="stat"><strong>${completed}/${lessons.length}</strong> temas leídos</div><div class="stat"><strong>${mastered}</strong> dominados</div><div class="stat"><strong>${streak()}</strong> días de racha</div><div class="stat"><strong>${Object.keys(progress.outputCorrect).length}/${outputChallenges.length}</strong> salidas resueltas</div><div class="stat"><strong>${Object.keys(progress.codeSolved).length}/${codeProblems.length}</strong> retos de código</div></div></section>
    <div class="layout"><section><div class="section-heading"><div><h2>Temas para estudiar</h2><p>Elige un concepto, entiende la regla y ponte a prueba.</p></div><span class="chip">${lessons.length} temas</span></div><div class="controls" role="group" aria-label="Filtrar temas">${categories.map(c=>`<button class="filter" data-filter="${c}" aria-pressed="${filter===c}">${c}</button>`).join('')}</div><div class="topic-grid">${visible.map(t => {const done=t.questions.every((_,i)=>progress.correct[`${t.id}-${i}`]);return `<a class="topic" href="temas/${encodeURIComponent(t.id)}.html" data-topic="${t.id}"><span class="topic-top"><span class="topic-icon">${t.icon}</span><span class="topic-status">${done?'✓ Dominado':progress.read[t.id]?'En progreso':t.level}</span></span><h3>${t.title}</h3><p>${t.subtitle}</p><span class="topic-bottom"><span>${t.minutes} min · ${t.questions.length} retos</span><b>Explorar ↗</b></span></a>`}).join('')}</div></section>
    <aside class="side"><div class="panel pattern-panel"><div class="panel-kicker">🧭 Aprende a resolver</div><h3>Reconoce el patrón</h3><p>Cuatro ideas para saber por dónde empezar: dos punteros, ventanas, mapas y pilas. Muévelas paso a paso antes de ir al editor.</p><button class="primary wide" id="patternsBtn">Ver patrones →</button></div><div class="panel arena-panel"><div class="panel-kicker">⌘ Practica escribiendo código</div><h3>Retos de JavaScript</h3><p>${codeProblems.length} problemas con editor, tests automáticos, pistas y tutora IA local opcional. Empieza fácil y sube de nivel.</p><button class="primary wide" id="arenaBtn">Entrar al laboratorio →</button></div><div class="panel output-panel"><div class="panel-kicker">⌨️ Escribe la respuesta</div><h3>¿Qué imprime este código?</h3><p>Sin opciones: escribe la salida y descubre por qué aparece cada línea. Hay ${outputChallenges.length} retos.</p><button class="primary wide" id="outputBtn">Practicar salidas</button></div><div class="panel starter"><div class="panel-kicker">🌱 ¿Por dónde empiezo?</div><h3>Empieza por aquí</h3><p>1. Tipos y variables<br>2. Closures<br>3. Event loop<br>4. Promises<br>5. React y componentes</p><button class="secondary wide" id="startBtn">Empezar desde cero</button></div><div class="panel case-panel"><div class="panel-kicker">🧩 Entrevista práctica</div><h3>Practica una situación real</h3><p>Practica ${window.SCENARIOS.length} situaciones: componentes, búsquedas y ejercicios de JavaScript. Pide una pista y compara tu respuesta.</p><button class="secondary wide" id="caseBtn">Practicar un caso</button></div><div class="panel challenge"><div class="panel-kicker">⚡ Reto del día</div><h3>${dailyDone?'¡Reto completado!':'Una pregunta para calentar'}</h3><p>${dailyDone?'Vuelve mañana para una pregunta nueva o continúa con el simulacro.':`Hoy toca ${daily().topicTitle.toLowerCase()}. ¿Te atreves a responder sin mirar?`}</p><button class="primary wide" id="dailyBtn">${dailyDone?'Repetir reto':'Jugar ahora'}</button></div><div class="panel"><div class="panel-kicker">Modo entrevista</div><h3>12 preguntas. Sin apuntes.</h3><p>Una mezcla de JavaScript, React, CSS, TypeScript y arquitectura. Al responder, verás por qué la opción es correcta.</p><button class="secondary wide" id="mockBtn">Empezar simulacro</button>${Object.keys(progress.missed).length?`<button class="secondary wide" id="missedBtn" style="margin-top:9px">Repasar mis fallos (${Object.keys(progress.missed).length})</button>`:''}</div><div class="panel"><div class="panel-kicker">Tu avance</div><h3>${Math.round(Object.keys(progress.correct).length/allQuestions.length*100)}% de preguntas dominadas</h3><div class="progress-track"><div class="progress-fill" style="width:${Object.keys(progress.correct).length/allQuestions.length*100}%"></div></div><p class="small">${Object.keys(progress.correct).length} de ${allQuestions.length} aciertos únicos · ${xp()} XP</p></div></aside></div>`;
    app.querySelector('.dashboard .intro').insertAdjacentHTML('afterend',`<div class="dashboard-actions"><button class="primary" id="workshopsTopBtn">Practicar entrevistas reales →</button></div>`);
    app.querySelector('#workshopsTopBtn').onclick=()=>navigate('talleres');
    app.querySelector('.side').insertAdjacentHTML('afterbegin',`<div class="panel workshop-panel"><div class="panel-kicker">🎯 Nuevas entrevistas guiadas</div><h3>React, arquitectura y equipo</h3><p>Decide qué harías ante situaciones reales. Hay ${workshops.reduce((sum,group)=>sum+group.cases.length,0)} casos con explicación, criterios de comprobación y retos de código.</p><button class="primary wide" id="workshopsBtn">Entrenar entrevistas →</button></div>`);
    app.querySelector('#workshopsBtn').onclick=()=>navigate('talleres');
    app.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;dashboard()});
    app.querySelectorAll('[data-topic]').forEach(link=>link.onclick=event=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate(`tema/${link.dataset.topic}`)});
    app.querySelector('#dailyBtn').onclick=()=>startQuiz([daily()],'daily');
    app.querySelector('#outputBtn').onclick=()=>navigate('salidas');
    app.querySelector('#arenaBtn').onclick=()=>navigate('laboratorio');
    app.querySelector('#patternsBtn').onclick=()=>navigate('patrones');
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
  function workshopHub(){
    app.innerHTML=`<div class="view arena-view"><button class="back" id="back">← Volver al mapa</button><div class="eyebrow">Entrevistas guiadas</div><h1>Piensa como en una<br><em>entrevista real.</em></h1><p class="output-intro">Lee el caso, decide qué harías y descubre el motivo. Puedes repetirlo; tu mejor resultado se guarda en este navegador.</p><div class="workshop-groups">${workshops.map(group=>`<section class="workshop-group"><div class="workshop-group-head"><span class="pattern-icon" aria-hidden="true">${group.icon}</span><div><h2>${group.title}</h2><p>${group.summary}</p></div></div><div class="workshop-cases">${group.cases.map(item=>{const key=`${group.id}/${item.id}`,result=progress.workshops[key];return `<button class="workshop-case" data-workshop="${key}"><span class="pill">${item.time}</span><strong>${item.title}</strong><span>${Object.hasOwn(progress.workshops,key)?`Mejor resultado: ${result}/${item.steps.length}`:'Empezar →'}</span></button>`}).join('')}</div></section>`).join('')}</div></div>`;
    app.querySelector('#back').onclick=()=>navigate('inicio');
    app.querySelectorAll('[data-workshop]').forEach(b=>b.onclick=()=>navigate(`taller/${b.dataset.workshop}`));
  }
  function workshopCase(groupId,caseId){
    const group=workshops.find(g=>g.id===groupId),item=group?.cases.find(c=>c.id===caseId);
    if(!item){navigate('talleres');return}
    let index=0,answered=null,score=0;
    const draw=()=>{
      const q=item.steps[index];
      app.innerHTML=`<div class="view workshop-view"><button class="back" id="back">← Todos los casos</button><div class="eyebrow">${group.title} · ${item.time}</div><h1>${item.title}</h1><p class="output-intro">${item.brief}</p>${item.before?`<pre class="code workshop-before"><code>${escapeHTML(item.before)}</code></pre>`:''}<div class="quiz-progress">Decisión ${index+1} de ${item.steps.length} · ${score} ${score===1?'acierto':'aciertos'}</div><div class="quiz-progress-track"><div style="width:${(index+1)/item.steps.length*100}%"></div></div><div class="question-card"><span class="pill">¿Qué harías tú?</span><h2>${q.q}</h2><div class="choices">${q.choices.map((c,i)=>`<button class="choice ${answered!==null?(i===q.answer?'correct':i===answered?'incorrect':''):''}" data-workshop-answer="${i}" ${answered!==null?'disabled':''}>${String.fromCharCode(65+i)} · ${escapeHTML(c)}</button>`).join('')}</div>${answered!==null?`<div class="explanation" role="status"><strong>${answered===q.answer?'Bien razonado.':'Esta opción encaja mejor:'}</strong><p>${q.why}</p></div><div class="quiz-controls"><button class="primary" id="nextWorkshop">${index===item.steps.length-1?'Ver resumen':'Siguiente decisión'}</button></div>`:''}</div>${item.id==='modal'?`<div class="modal-demo"><h2>Prueba un modal de referencia</h2><p>Ábrelo con el teclado, ciérralo con Escape y comprueba dónde queda el foco.</p><button class="secondary" id="openDemo">Abrir modal</button><dialog id="referenceDialog" aria-labelledby="referenceTitle"><h2 id="referenceTitle">Confirmar acción</h2><p>Este es un diálogo modal nativo.</p><button class="primary" id="closeDemo" autofocus>Cerrar modal</button></dialog></div>`:''}</div>`;
      app.querySelector('#back').onclick=()=>navigate('talleres');
      app.querySelectorAll('[data-workshop-answer]').forEach(b=>b.onclick=()=>{answered=Number(b.dataset.workshopAnswer);if(answered===q.answer)score++;draw()});
      app.querySelector('#nextWorkshop')?.addEventListener('click',()=>{index++;answered=null;if(index===item.steps.length)summary();else draw();window.scrollTo({top:0,behavior:'instant'})});
      const opener=app.querySelector('#openDemo'),dialog=app.querySelector('#referenceDialog');
      if(opener&&dialog){opener.onclick=()=>dialog.showModal();app.querySelector('#closeDemo').onclick=()=>dialog.close();dialog.addEventListener('close',()=>opener.focus());dialog.addEventListener('cancel',()=>requestAnimationFrame(()=>opener.focus()))}
    };
    const summary=()=>{
      const key=`${group.id}/${item.id}`;progress.workshops[key]=Math.max(progress.workshops[key]||0,score);save();
      app.innerHTML=`<div class="view workshop-view"><button class="back" id="back">← Todos los casos</button><div class="eyebrow">Caso completado · ${group.title}</div><div class="result-number">${score}/${item.steps.length}</div><h1>${score===item.steps.length?'¡Lo has razonado muy bien!':'Ya sabes qué mejorar.'}</h1><div class="question-card">${item.practicePrompt?`<h2>Ahora practica tu respuesta</h2><p>${item.practicePrompt}</p><label class="output-label" for="projectAnswer">Tu historia de proyecto</label><textarea id="projectAnswer" class="output-input" rows="9" placeholder="El problema era… Mi responsabilidad fue…" aria-describedby="projectHelp"></textarea><p id="projectHelp" class="small">Este borrador solo se guarda en este navegador. No se envía a ningún servidor.</p><button class="secondary" id="revealProject">Comparar con un ejemplo</button><div id="projectExample" hidden>`:''}<h2>Una respuesta para la entrevista</h2><p>${item.answer}</p>${item.after?`<h2>Así podría quedar</h2><pre class="code workshop-before"><code>${escapeHTML(item.after)}</code></pre>`:''}<h2>Criterios para comprobar tu implementación</h2><ul class="workshop-checks">${item.checks.map(c=>`<li>${c}</li>`).join('')}</ul>${item.practicePrompt?'</div>':''}<p class="small">Estas decisiones practican el criterio. En los retos de código, los tests sí ejecutan tu función.</p><div class="quiz-controls">${item.codeId?`<button class="primary" id="practiceCode">Escribir código y pasar tests →</button>`:''}<button class="secondary" id="retryWorkshop">Repetir el caso</button><a class="source-link" href="${item.source}" target="_blank" rel="noopener noreferrer">Consultar referencia ↗</a></div></div></div>`;
      app.querySelector('#back').onclick=()=>navigate('talleres');
      app.querySelector('#retryWorkshop').onclick=()=>workshopCase(groupId,caseId);
      app.querySelector('#practiceCode')?.addEventListener('click',()=>navigate(`codigo/${item.codeId}`));
      if(item.practicePrompt){
        const editor=app.querySelector('#projectAnswer'),key=`js-interview-lab-story-${groupId}-${caseId}`;
        try{editor.value=localStorage.getItem(key)||''}catch{}
        editor.addEventListener('input',()=>{try{localStorage.setItem(key,editor.value)}catch{}});
        app.querySelector('#revealProject').onclick=()=>{app.querySelector('#projectExample').hidden=false;app.querySelector('#revealProject').disabled=true};
      }
    };
    draw();
  }
  function patternHub(){
    app.innerHTML=`<div class="view arena-view"><button class="back" id="back">← Volver al mapa</button><div class="eyebrow">Aprende a resolver</div><h1>Una pista para empezar<br><em>antes de escribir código.</em></h1><p class="output-intro">Un patrón es una forma de reconocer problemas parecidos. Mira cómo se mueve cada ejemplo y luego prueba un reto. No hace falta memorizar el código.</p><div class="pattern-grid">${patterns.map(p=>`<button class="pattern-card" data-pattern="${p.id}"><span class="pattern-icon" aria-hidden="true">${p.icon}</span><strong>${p.title}</strong><span>${p.summary}</span><small>${p.challenges.length} ${p.challenges.length===1?'reto relacionado':'retos relacionados'} →</small></button>`).join('')}</div></div>`;
    app.querySelector('#back').onclick=()=>navigate('inicio');
    app.querySelectorAll('[data-pattern]').forEach(b=>b.onclick=()=>navigate(`patron/${b.dataset.pattern}`));
  }
  function patternDetail(id){
    const p=patterns.find(item=>item.id===id);if(!p){navigate('patrones');return}
    let stepIndex=0;
    app.innerHTML=`<div class="view arena-view"><button class="back" id="back">← Todos los patrones</button><div class="eyebrow">Patrón de resolución</div><h1>${p.title}</h1><p class="output-intro">${p.summary}</p><div class="pattern-layout"><section class="question-card"><div class="simple-box"><span class="panel-kicker">La idea, sin tecnicismos</span><p class="simple-main">${p.analogy}</p></div><h2>Cuándo te puede ayudar</h2><p>${p.when}</p><p class="takeaway"><strong>Pregunta que debes hacerte:</strong> ${p.question}</p><h2>Míralo paso a paso</h2><p>${p.example}</p><div class="pattern-visual" id="patternVisual" aria-hidden="true"></div><div class="pattern-memory" id="patternMemory"></div><p class="pattern-step" id="patternStep" aria-live="polite"></p><div class="quiz-controls"><button class="secondary" id="prevStep">← Paso anterior</button><span id="stepCounter" class="chip"></span><button class="primary" id="nextStep">Siguiente paso →</button></div><details class="pattern-code"><summary>Ver un ejemplo de código</summary><pre class="code"><code>${escapeHTML(p.code)}</code></pre></details><p class="takeaway"><strong>Coste aproximado:</strong> ${p.complexity}</p><p class="steps-box"><strong>Cómo decirlo en entrevista</strong><br>${p.interview}</p></section><aside class="arena-side"><div class="panel"><span class="panel-kicker">Ahora te toca</span><h3>Practica esta idea</h3><p>Intenta los retos sin abrir la solución. Si te atascas, vuelve a los pasos.</p><div class="pattern-challenges">${p.challenges.map(cid=>{const c=codeProblems.find(item=>item.id===cid);return c?`<button class="pattern-challenge" data-code="${cid}"><strong>${escapeHTML(c.title)}</strong><span>${c.level} · ${progress.codeSolved[c.id]?'✓ Resuelto':'Practicar →'}</span></button>`:''}).join('')}</div></div></aside></div></div>`;
    const showStep=()=>{const step=p.steps[stepIndex];app.querySelector('#patternVisual').innerHTML=p.values.map((value,i)=>`<span class="pattern-value ${step.active.includes(i)?'is-active':''}"><small>${i}</small><strong>${escapeHTML(value)}</strong></span>`).join('');app.querySelector('#patternMemory').textContent=step.memory;app.querySelector('#patternStep').textContent=step.text;app.querySelector('#stepCounter').textContent=`${stepIndex+1} / ${p.steps.length}`;app.querySelector('#prevStep').disabled=stepIndex===0;app.querySelector('#nextStep').disabled=stepIndex===p.steps.length-1};
    app.querySelector('#back').onclick=()=>navigate('patrones');
    app.querySelector('#prevStep').onclick=()=>{stepIndex--;showStep()};
    app.querySelector('#nextStep').onclick=()=>{stepIndex++;showStep()};
    app.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>navigate(`codigo/${b.dataset.code}`));
    showStep();
  }
  function codeHub(){
    const solved = codeProblems.filter(p=>progress.codeSolved[p.id]).length;
    const categories=['Todos','Fácil','Medio','Difícil'];
    const visible=codeProblems.filter(p=>codeFilter==='Todos'||p.level===codeFilter);
    app.innerHTML=`<div class="view arena-view"><button class="back" id="back">← Volver al mapa</button><div class="eyebrow">Laboratorio de código</div><h1>Resuelve un problema.<br><em>Entiende cada fallo.</em></h1><p class="output-intro">Escribe una función, ejecútala contra casos de prueba y mejora tu solución. ${solved} de ${codeProblems.length} resueltos.</p><section class="pattern-cta"><div><span class="panel-kicker">¿No sabes por dónde empezar?</span><h2>Aprende a reconocer el patrón</h2><p>Dos punteros, ventanas, mapas y pilas explicados paso a paso.</p></div><button class="secondary" id="patternsBtn">Ver patrones →</button></section><section class="timed-intro"><div><span class="panel-kicker">Simulacro de código</span><h2>3 retos · 35 minutos</h2><p>Un problema fácil, uno medio y uno difícil. El reloj continúa si recargas o sales de esta pantalla. Tu puntuación cuenta los retos que superes durante el simulacro.</p></div><button class="primary" id="startTimed">${timed?'Continuar simulacro →':'Empezar simulacro →'}</button></section><div class="section-heading"><h2>Elige un nivel</h2><span class="chip">${codeProblems.length} retos</span></div><div class="controls" role="group" aria-label="Filtrar retos por dificultad">${categories.map(c=>`<button class="filter" data-code-filter="${c}" aria-pressed="${codeFilter===c}">${c} (${c==='Todos'?codeProblems.length:codeProblems.filter(p=>p.level===c).length})</button>`).join('')}</div><div class="arena-grid">${visible.map(p=>`<button class="arena-card" data-code="${p.id}"><span class="pill">${p.level} · ${p.category} · ${p.minutes} min</span><strong>${escapeHTML(p.title)}</strong><span>${progress.codeSolved[p.id]?'✓ Resuelto':'Resolver →'}</span></button>`).join('')}</div><p class="small">El código se ejecuta en un proceso separado del navegador con límite de tiempo. Los tests comprueban ejemplos, pero no garantizan que una solución funcione para todos los casos posibles.</p></div>`;
    app.querySelector('#back').onclick=()=>navigate('inicio');
    app.querySelector('#patternsBtn').onclick=()=>navigate('patrones');
    app.querySelector('#startTimed').onclick=()=>timed?navigate(`codigo/${timed.ids.find(id=>!timed.solved[id])||timed.ids[0]}`):startTimed();
    app.querySelectorAll('[data-code-filter]').forEach(b=>b.onclick=()=>{codeFilter=b.dataset.codeFilter;codeHub()});
    app.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>navigate(`codigo/${b.dataset.code}`));
  }
  function timedResult(){
    const result=readSession(RESULT_KEY);
    if(!result){navigate('laboratorio');return}
    const passed=result.ids.filter(id=>result.solved[id]).length;
    const used=Math.min(35,Math.ceil((result.endedAt-result.startedAt)/60000));
    app.innerHTML=`<div class="view result-card"><div class="eyebrow">Simulacro de código ${result.reason==='time'?'· Tiempo agotado':'· Terminado'}</div><div class="result-number">${passed}/3</div><h1>${passed===3?'¡Los tres retos superados!':passed?'Buen trabajo: ya sabes qué practicar.':'Un punto de partida para mejorar.'}</h1><p>Tiempo empleado: ${used} min de 35. Solo cuentan los retos resueltos durante esta sesión. Puedes seguir practicando cada problema con calma.</p><div class="timed-summary">${result.ids.map(id=>{const p=codeProblems.find(x=>x.id===id);return `<button class="arena-card" data-code="${id}"><span class="pill">${p.level}</span><strong>${escapeHTML(p.title)}</strong><span>${result.solved[id]?'✓ Superado':'Practicar →'}</span></button>`}).join('')}</div><div class="quiz-controls"><button class="primary" id="retryTimed">Nuevo simulacro</button><button class="secondary" id="hub">Todos los retos</button></div></div>`;
    app.querySelector('#retryTimed').onclick=startTimed;
    app.querySelector('#hub').onclick=()=>navigate('laboratorio');
    app.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>navigate(`codigo/${b.dataset.code}`));
  }
  function codeChallenge(id){
    const p=codeProblems.find(x=>x.id===id); if(!p){navigate('laboratorio');return}
    const index=codeProblems.indexOf(p);
    const relatedPattern=patterns.find(pattern=>pattern.challenges.includes(id));
    const inTimed=!!timed && timed.ids.includes(id);
    const timedIndex=inTimed?timed.ids.indexOf(id):-1;
    app.innerHTML=`<div class="view arena-view"><button class="back" id="back">← Todos los retos</button><div class="eyebrow">${inTimed?`Simulacro · reto ${timedIndex+1} de 3`:`Reto ${index+1} de ${codeProblems.length}`} · ${p.level} · ${p.category}</div>${inTimed?`<div class="timed-bar"><span>⏱ Tiempo restante: <strong id="timedClock">${clockText(timeLeft())}</strong></span><span>${Object.keys(timed.solved).length}/3 superados</span><button class="secondary" id="finishTimed">Terminar simulacro</button></div>`:``}<h1>${escapeHTML(p.title)}</h1><p class="output-intro">${escapeHTML(p.statement)}</p><div class="arena-example"><strong>Ejemplo</strong><code>${escapeHTML(p.example)}</code></div><div class="arena-workspace"><section class="question-card"><label class="output-label" for="codeEditor">Tu solución en JavaScript</label><textarea id="codeEditor" class="output-input code-editor" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="editorHelp">${escapeHTML(p.starter)}</textarea><p class="small" id="editorHelp">Escribe una función con el mismo nombre y parámetros del ejemplo. Se conserva en este navegador.</p><div class="quiz-controls"><button class="primary" id="runCode">▶ Ejecutar tests</button><button class="secondary" id="resetCode">Reiniciar código</button></div><div id="codeFeedback" aria-live="polite"></div></section><aside class="arena-side"><div class="panel"><span class="panel-kicker">Pistas progresivas</span><h3>¿Te has atascado?</h3><p>Prueba primero los tests y busca qué caso falla.</p><button class="secondary wide" id="hintCode">Ver pista</button><div class="reveal" id="hintText" hidden></div><button class="secondary wide arena-gap" id="solutionCode">Ver una solución</button><div class="reveal" id="solutionText" hidden></div></div><div class="panel tutor-panel"><span class="panel-kicker">IA gratis en tu dispositivo</span><h3>Pide una pista a la tutora</h3><p>Opcional: al pulsar se descarga un modelo pequeño (varios cientos de MB). Necesita WebGPU; puede tardar y equivocarse. Tu código se procesa en este dispositivo. Los tests y pistas funcionan sin IA.</p><button class="secondary wide" id="askTutor">Activar y pedir pista IA</button><p class="small" id="tutorStatus" role="status"></p><div class="tutor-answer" id="tutorAnswer" aria-live="polite"></div></div></aside></div><div class="quiz-controls"><button class="secondary" id="prevCode" ${(inTimed?timedIndex===0:index===0)?'disabled':''}>← Anterior</button><button class="secondary" id="nextCode" ${(inTimed?timedIndex===2:index===codeProblems.length-1)?'disabled':''}>Siguiente →</button></div></div>`;
    if(relatedPattern){
      app.querySelector('.arena-workspace').insertAdjacentHTML('beforebegin',`<div class="pattern-nudge"><span>¿Te has atascado? Este reto se puede razonar con <strong>${relatedPattern.title.toLowerCase()}</strong>.</span><button class="secondary" id="relatedPattern">Verlo paso a paso →</button></div>`);
      app.querySelector('#relatedPattern').onclick=()=>navigate(`patron/${relatedPattern.id}`);
    }
    app.querySelector('#back').onclick=()=>navigate('laboratorio');
    app.querySelector('#prevCode').onclick=()=>navigate(`codigo/${inTimed?timed.ids[timedIndex-1]:codeProblems[index-1].id}`);
    app.querySelector('#nextCode').onclick=()=>navigate(`codigo/${inTimed?timed.ids[timedIndex+1]:codeProblems[index+1].id}`);
    app.querySelector('#finishTimed')?.addEventListener('click',()=>finishTimed('manual'));
    const editor=app.querySelector('#codeEditor');
    const draftKey=`js-interview-lab-code-${id}`;
    try { editor.value=localStorage.getItem(draftKey) || p.starter; } catch {}
    editor.addEventListener('input',()=>{try{localStorage.setItem(draftKey,editor.value)}catch{}});
    editor.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const start=editor.selectionStart;editor.setRangeText('  ',start,editor.selectionEnd,'end');editor.dispatchEvent(new Event('input'))}});
    app.querySelector('#resetCode').onclick=()=>{if(editor.value!==p.starter && !confirm('¿Borrar tu solución de este reto y volver al inicio?'))return;editor.value=p.starter;editor.dispatchEvent(new Event('input'));app.querySelector('#codeFeedback').innerHTML=''};
    app.querySelector('#hintCode').onclick=()=>{const el=app.querySelector('#hintText');el.hidden=false;el.textContent=p.hint};
    app.querySelector('#solutionCode').onclick=()=>{const el=app.querySelector('#solutionText');el.hidden=false;el.innerHTML=`<p>${escapeHTML(p.explanation)}</p><pre class="code"><code>${escapeHTML(p.solution)}</code></pre>`};
    let latestResult='Aún no se han ejecutado tests.';
    app.querySelector('#runCode').onclick=()=>{
      const button=app.querySelector('#runCode'), feedback=app.querySelector('#codeFeedback');
      button.disabled=true;feedback.innerHTML='<p class="output-message" role="status">Ejecutando tests…</p>';
      const worker=new Worker('code-runner.js'); let finished=false;
      const finish=data=>{
        if(finished)return;finished=true;clearTimeout(timer);worker.terminate();button.disabled=false;
        if(data.error){latestResult=`Error de sintaxis: ${data.error}`;feedback.innerHTML=`<div class="output-feedback"><h2>Revisa el código</h2><p>${escapeHTML(data.error)}</p></div>`;return}
        const passed=data.results.filter(r=>r.ok).length;
        latestResult=`${passed}/${p.tests.length} tests correctos. `+data.results.map((r,i)=>`Caso ${i+1}: ${r.ok?'bien':r.error||'esperado '+JSON.stringify(p.tests[i].expected)+', recibido '+r.actual}`).join('; ');
        if(passed===p.tests.length){
          progress.codeSolved[p.id]=true;save();
          if(inTimed && timed && timeLeft()>0){timed.solved[id]=true;persistTimed();const count=app.querySelector('.timed-bar span:nth-child(2)');if(count)count.textContent=`${Object.keys(timed.solved).length}/3 superados`}
        }
        feedback.innerHTML=`<div class="output-feedback"><h2>${passed===p.tests.length?'¡Todos los tests pasan! +25 XP si era nuevo':`${passed} de ${p.tests.length} tests superados`}</h2><ol>${data.results.map((r,i)=>`<li class="${r.ok?'output-right':'output-wrong'}"><strong>Caso ${i+1}: ${r.ok?'bien':'revisa este caso'}</strong><p>Entrada: <code>${escapeHTML(JSON.stringify(p.tests[i].args))}</code></p>${r.ok?'':`<p>Esperado: <code>${escapeHTML(JSON.stringify(p.tests[i].expected))}</code> · Tu resultado: <code>${escapeHTML(r.error||r.actual)}</code></p>`}</li>`).join('')}</ol>${passed===p.tests.length?`<p class="output-lesson">${escapeHTML(p.explanation)}</p>`:''}</div>`;
      };
      const timer=setTimeout(()=>finish({error:'Tu código tardó más de 2 segundos. Comprueba si hay un bucle que no termina.'}),2000);
      worker.onmessage=e=>finish(e.data);worker.onerror=()=>finish({error:'No se pudo ejecutar el código. Comprueba la sintaxis.'});
      worker.postMessage({code:editor.value,tests:p.tests});
    };
    app.querySelector('#askTutor').onclick=async()=>{
      const button=app.querySelector('#askTutor'),status=app.querySelector('#tutorStatus'),answer=app.querySelector('#tutorAnswer');
      button.disabled=true;status.textContent='Preparando la tutora local…';answer.textContent='';
      try {const response=await window.LOCAL_TUTOR.ask(p,editor.value,latestResult,text=>{if(status.isConnected)status.textContent=text});if(answer.isConnected){answer.textContent=response;status.textContent='Pista generada en tu dispositivo.'}}
      catch(error){if(status.isConnected)status.textContent=`No se pudo iniciar la IA: ${error.message}. Usa la pista guiada.`}
      finally{if(button.isConnected)button.disabled=false}
    };
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
  function render(){updateXp();if(timed && timeLeft()<=0){finishTimed('time');return}const route=hash();if(route==='entrevista-resultado'){timedResult();return}if(route==='reto'){quiz();return}if(route==='salidas'){outputHub();return}if(route==='talleres'){workshopHub();return}if(route.startsWith('taller/')){const [,groupId,caseId]=route.split('/');workshopCase(groupId,caseId);return}if(route==='patrones'){patternHub();return}if(route.startsWith('patron/')){patternDetail(route.split('/')[1]);return}if(route==='laboratorio'){codeHub();return}if(route.startsWith('codigo/')){codeChallenge(route.split('/')[1]);return}if(route.startsWith('salida/')){outputChallenge(route.split('/')[1]);return}if(route.startsWith('tema/')){lesson(route.split('/')[1]);return}if(route.startsWith('caso/')){scenario(Number(route.split('/')[1]));return}dashboard()}
  window.addEventListener('hashchange',render);render();
  if(document.modelContext?.registerTool){try{
    const register=(tool)=>Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{});
    register({name:'list_interview_topics',title:'Listar temas',description:'Lista los temas y el progreso local de preparación de entrevistas.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>lessons.map(t=>({id:t.id,title:t.title,category:t.category,read:!!progress.read[t.id]}))});
    register({name:'start_interview_topic',title:'Abrir tema',description:'Abre una lección existente de JavaScript o React en la página visible.',inputSchema:{type:'object',properties:{topicId:{type:'string'}},required:['topicId'],additionalProperties:false},execute:({topicId})=>{if(!lessons.some(t=>t.id===topicId))throw Error('Tema desconocido');navigate(`tema/${topicId}`);return {topicId,opened:true}}});
  }catch{}}
})();
