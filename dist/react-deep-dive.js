// Lecciones originales de React avanzado. Cada tema tiene explicación, ejemplo y práctica.
const reactLesson = (id, icon, title, subtitle, theory, example, takeaway, source, questions, beginner) => {
  window.COURSE.push({id, icon, category:'React', title, subtitle, minutes:9, level:'Senior', theory, example, takeaway, source,
    questions:questions.map(([q,choices,answer,why])=>({q,choices,answer,why}))});
  window.BEGINNER[id] = beginner;
};

reactLesson('react-identity','key','Reconciliación, identidad y keys','Por qué una fila conserva o pierde su estado.',
  'Tras un cambio, React calcula cómo debería quedar la interfaz y aplica al DOM los cambios necesarios. Para conservar el estado de un componente tiene que reconocerlo: importan su tipo y su posición en el árbol. En una lista, la key identifica a cada elemento entre sus hermanos. Si usas el índice y luego ordenas o borras filas, el estado de una puede pasar a otra. Usa un id estable del dato. Cambiar la key a propósito puede reiniciar un formulario. Un render no implica volver a crear todos los nodos del DOM.',
  'items.map(item => <Fila key={item.id} item={item} />)\n<Formulario key={persona.id} persona={persona} /> // Reinicia al cambiar persona.',
  'Pregunta qué identidad quieres conservar y elige una key estable para esa identidad.',
  'https://react.dev/learn/preserving-and-resetting-state',[
    ['Borras la primera fila con key={indice}. ¿Qué puede pasar?',['El estado local queda en otra fila','React ordena alfabéticamente','La app deja de cargar'],0,'El índice cambia de significado y React puede reutilizar el estado para otro dato.'],
    ['Quieres reiniciar un formulario al cambiar de usuario. ¿Qué key elegirías?',['El id de usuario','Math.random() en cada render','La fecha de hoy'],0,'Una key distinta crea una nueva identidad. Un valor aleatorio en cada render borraría el estado continuamente.']
  ],{plain:'React intenta reconocer qué pieza sigue siendo la misma; la key es su nombre dentro de una lista.',analogy:'Si llamas a tus contactos por su posición, al borrar el primero llamarás a otra persona.',steps:'Dibuja la lista antes y después. Comprueba si cada fila conserva su id y decide si el estado debe sobrevivir.'});

reactLesson('react-fiber','⚙','Fiber: render y commit','Preparar una pantalla no es lo mismo que mostrarla.',
  'Fiber es la estructura interna con la que React organiza el trabajo. En entrevista basta entender dos fases: render calcula el resultado siguiente; commit aplica los cambios necesarios al DOM. Algunas actualizaciones de menor prioridad pueden pausarse, reiniciarse o descartarse si llega trabajo más urgente. Por eso el cuerpo del componente debe ser puro: puede ejecutarse sin que ese resultado llegue a mostrarse. Los efectos y los manejadores son los lugares adecuados para sincronizar sistemas externos.',
  'function Total({items}) {\n  const suma = items.reduce((n, x) => n + x.valor, 0);\n  return <p>{suma}</p>;\n}\n// No hagas fetch() directamente en el cuerpo del componente.',
  'Render prepara; commit aplica. No dependas de que un render se ejecute una sola vez.',
  'https://react.dev/learn/render-and-commit',[
    ['¿Cuándo se aplican al DOM los cambios calculados?',['Durante commit','Al declarar una variable','Antes del render'],0,'React prepara el resultado en render y aplica cambios durante commit.'],
    ['¿Por qué no lanzar fetch en el cuerpo de un componente?',['Porque render puede repetirse o descartarse','Porque fetch no funciona en React','Porque JSX ya hace fetch'],0,'Una operación externa durante render podría repetirse aunque esa interfaz nunca se confirme.']
  ],{plain:'React prepara un dibujo y después aplica los cambios visibles.',analogy:'Un arquitecto puede rehacer el plano antes de que el albañil toque la pared.',steps:'Separa calcular JSX de cambiar el DOM. Mantén el cálculo libre de peticiones y efectos externos.'});

reactLesson('react-batching','∑','Batching: cambios agrupados','Dos setState no implican dos renders.',
  'React puede agrupar varias actualizaciones antes de volver a renderizar. Desde React 18 con createRoot, también agrupa por defecto cambios en promesas, temporizadores y eventos nativos. Eso ahorra trabajo, pero la variable count del render actual no cambia justo después de setCount. Si el valor nuevo depende del anterior, usa setCount(c => c + 1). No prometas un número exacto de renders sin saber si interviene Strict Mode u otra configuración.',
  'setCount(c => c + 1);\nsetCount(c => c + 1); // Incrementa dos veces.\n// setCount(count + 1) dos veces solicita el mismo valor.',
  'Agrupar cambios no vuelve inmediata una variable. Usa la actualización funcional cuando dependas del estado previo.',
  'https://react.dev/learn/queueing-a-series-of-state-updates',[
    ['count es 0. Dos llamadas a setCount(count + 1) en el mismo evento dejan…',['1','2','0 siempre'],0,'Ambas leen el count = 0 del render actual y solicitan el valor 1.'],
    ['¿Cómo acumulas dos incrementos dependientes del anterior?',['Dos veces setCount(c => c + 1)','Dos veces setCount(count + 1)','Mutando count++'],0,'React pasa a cada función el valor pendiente más reciente.']
  ],{plain:'React puede apuntar varios cambios y pintar una vez; tu variable actual no cambia al instante.',analogy:'Escribes dos encargos en una lista y los ejecutas juntos.',steps:'Si el cambio depende del anterior, usa setValor(valorAnterior => ...).'});

reactLesson('react-refs','ref','useRef más allá del DOM','Guarda algo entre renders sin dibujarlo.',
  'useRef devuelve un objeto estable con current. Puede guardar un temporizador, una conexión o un valor anterior que no debe aparecer en la pantalla. Cambiar current no pide un nuevo render: para mostrar un valor actualizado necesitas estado. Evita leer o escribir refs durante render para decidir la interfaz, salvo una inicialización predecible. Usa el efecto o el manejador y limpia los recursos al desmontar.',
  'const timerRef = useRef(null);\nfunction programar() {\n  clearTimeout(timerRef.current);\n  timerRef.current = setTimeout(guardar, 300);\n}\nuseEffect(() => () => clearTimeout(timerRef.current), []);',
  'Ref guarda un recurso persistente; state guarda lo que debe repintarse.',
  'https://react.dev/learn/referencing-values-with-refs',[
    ['Cambias ref.current de 1 a 2. ¿Qué ocurre automáticamente?',['No se vuelve a renderizar','Se vuelve a renderizar siempre','Se borra la ref'],0,'Cambiar una ref no avisa a React de que haya que repintar.'],
    ['Quieres mostrar un contador actualizado. ¿Qué usarías?',['Estado','Solo una ref','Una variable local'],0,'El estado solicita un render; la ref por sí sola no actualiza la interfaz.']
  ],{plain:'Una ref recuerda un dato entre renders sin actualizar la pantalla.',analogy:'Es un bolsillo privado, no el cartel que ve el público.',steps:'Pregunta si el dato debe verse. Si sí, estado; si no, una ref puede conservarlo.'});

reactLesson('react-hooks-rules','use','Reglas de Hooks y useDebounce','React necesita encontrar cada hook en el mismo orden.',
  'Llama a los Hooks arriba del todo en un componente o custom hook, antes de cualquier retorno condicional. Si pones useState dentro de un if, el orden puede cambiar entre renders y React ya no sabrá a qué estado corresponde. Un custom hook reutiliza lógica, pero cada componente que lo usa tiene su propio estado. useDebounce puede devolver un valor cuando deja de cambiar durante un tiempo; su efecto limpia el temporizador anterior al cambiar el valor o desmontarse.',
  'function useDebounce(valor, ms) {\n  const [estable, setEstable] = useState(valor);\n  useEffect(() => {\n    const timer = setTimeout(() => setEstable(valor), ms);\n    return () => clearTimeout(timer);\n  }, [valor, ms]);\n  return estable;\n}',
  'Hooks al mismo nivel y orden. Las condiciones van dentro de su lógica, no alrededor de su llamada.',
  'https://react.dev/reference/rules/rules-of-hooks',[
    ['¿Dónde puedes llamar a useState?',['Arriba en un componente o custom hook','Dentro de un if variable','Dentro de onClick'],0,'El orden de llamadas debe ser el mismo en cada render.'],
    ['Dos componentes usan useDebounce. ¿Comparten estado automáticamente?',['No, cada llamada tiene el suyo','Sí, por el nombre del hook','Sí, si ms coincide'],0,'El hook comparte la lógica, no una única instancia de estado.']
  ],{plain:'React espera encontrar sus hooks en el mismo orden cada vez.',analogy:'Si cambias de orden los cajones, React guardará cosas en el lugar equivocado.',steps:'Saca los hooks de if, bucles y callbacks. Limpia los temporizadores en el efecto.'});

reactLesson('react-priority','↝','useTransition y useDeferredValue','Deja que lo urgente responda primero.',
  'Si escribir en un input provoca un render lento de una lista, separa lo urgente de lo que puede esperar. useTransition marca ciertas actualizaciones de estado como menos urgentes y ofrece isPending. No uses una transición para controlar directamente el valor de un input. useDeferredValue permite entregar a la lista una versión que puede ir algo por detrás. Estas APIs cambian la prioridad del render: no hacen más rápido un cálculo pesado ni sustituyen debounce para reducir llamadas HTTP.',
  'const [query, setQuery] = useState(\"\");\nconst deferredQuery = useDeferredValue(query);\n<input value={query} onChange={e => setQuery(e.target.value)} />\n<ListaLenta query={deferredQuery} />',
  'Mantén el input inmediato y retrasa solo la zona costosa cuando la medición lo justifique.',
  'https://react.dev/reference/react/useDeferredValue',[
    ['La lista tarda, pero el input debe responder. ¿Qué valor puedes diferir?',['El que recibe la lista','El value del input con una transición','El evento del teclado'],0,'El input usa query actual; la lista puede ir temporalmente un paso por detrás.'],
    ['¿useTransition reduce por sí solo el número de peticiones HTTP?',['No','Sí, cancela fetch','Sí, espera 300 ms'],0,'Prioridad de render y frecuencia de red son problemas distintos.']
  ],{plain:'Puedes dejar que el texto aparezca antes que una lista pesada.',analogy:'Atiende primero a quien te habla y ordena el archivo después.',steps:'Mide la lista. Mantén el input inmediato y difiere el valor que recibe la zona lenta.'});

reactLesson('react-suspense','…','React.lazy y Suspense','Espera por una parte del código, sin ocultarlo todo.',
  'React.lazy descarga el código de un componente cuando se necesita. Suspense muestra un fallback mientras esa parte está suspendida. Sitúa el límite alrededor de la sección que tarda para que el resto siga visible. Si falla la descarga, hay un error, no una espera eterna: un error boundary puede mostrar una recuperación. Suspense no detecta automáticamente cualquier fetch iniciado en un Effect; la fuente de datos debe integrarse con APIs compatibles.',
  'const Informes = lazy(() => import(\"./Informes\"));\n<Suspense fallback={<p>Cargando informes…</p>}>\n  <Informes />\n</Suspense>',
  'Prueba por separado módulo lento y módulo fallido. Espera y error necesitan salidas distintas.',
  'https://react.dev/reference/react/Suspense',[
    ['lazy tarda en descargar un módulo. ¿Qué muestra Suspense?',['Su fallback','Un error 404 automático','El componente sin código'],0,'El fallback cubre la espera mientras el módulo no está listo.'],
    ['La descarga falla. ¿Basta el fallback para recuperarse?',['No, añade tratamiento de error','Sí, reintenta siempre','Sí, es lo mismo que esperar'],0,'Un rechazo necesita una salida de error, no solo la interfaz de espera.']
  ],{plain:'Suspense muestra una espera mientras llega una parte compatible de la interfaz.',analogy:'El cartel dice «preparando sala»; si no llega el mobiliario, hace falta otro aviso.',steps:'Coloca el fallback cerca de la zona lenta. Prueba espera y fallo.'});

reactLesson('react-error-boundaries','!','Error boundaries','Un error de render no tiene por qué tumbar la app.',
  'Un error boundary rodea un subárbol y muestra una alternativa si un hijo falla durante render. Se puede colocar por sección para conservar el resto de la interfaz. En general no captura errores de onClick, fallos del servidor ni callbacks asíncronos como setTimeout; manéjalos donde ocurren. Suspense cubre espera, no errores. La implementación clásica usa una clase con getDerivedStateFromError y puede registrar con componentDidCatch.',
  'class LimiteError extends React.Component {\n  state = {fallo:false};\n  static getDerivedStateFromError() { return {fallo:true}; }\n  render() { return this.state.fallo ? <p>Sección no disponible</p> : this.props.children; }\n}\n<LimiteError><Informes /></LimiteError>',
  'Elige qué sección aislar y cómo recuperarla; trata eventos y promesas en su propio lugar.',
  'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',[
    ['Un hijo falla durante render. ¿Qué puede hacer un boundary cercano?',['Mostrar una alternativa para esa sección','Reparar el servidor','Capturar todos los errores de la web'],0,'Sustituye el subárbol fallido por una interfaz de recuperación.'],
    ['Un onClick lanza una promesa que rechaza. ¿Lo captura normalmente el boundary?',['No, se maneja en la acción','Sí, siempre','Solo si hay Suspense'],0,'Los manejadores y tareas asíncronas no son fallos del render de un hijo.']
  ],{plain:'Un límite de error sustituye una sección que falló al dibujarse.',analogy:'Un fusible protege una habitación, pero no arregla cualquier aparato de la casa.',steps:'Distingue error de render, de evento y de promesa. Aísla la sección apropiada.'});

reactLesson('react-hydration','SSR','Hidratación y HTML del servidor','El primer dibujo del navegador debe coincidir.',
  'Con SSR llega HTML ya construido y React lo conecta para activar la interacción. El primer render del cliente debe producir el mismo contenido que el servidor. Date.now(), Math.random(), localStorage o condiciones basadas en window durante render pueden crear diferencias. Da un primer resultado estable y consulta datos exclusivos del navegador después, por ejemplo en un Effect, o usa la estrategia del framework. No tapes un desajuste con suppressHydrationWarning sin entender su causa.',
  'function Reloj() {\n  const [hora, setHora] = useState(null);\n  useEffect(() => setHora(new Date().toLocaleTimeString()), []);\n  return <time>{hora ?? \"Cargando hora…\"}</time>;\n}',
  'Compara el HTML del servidor con el primer render cliente y busca datos que solo existen en el navegador.',
  'https://react.dev/reference/react-dom/client/hydrateRoot',[
    ['Servidor y cliente muestran horas distintas en el primer render. ¿Qué puede pasar?',['Desajuste de hidratación','Sincronización automática de relojes','Se cancela todo JS'],0,'El contenido inicial no coincide y hay que corregir la fuente de variación.'],
    ['¿Dónde leer localStorage para mostrarlo sin romper el primer render SSR?',['Tras montar, en un Effect o solución del framework','Siempre directamente en render','En CSS'],0,'localStorage solo existe en el navegador y puede cambiar el HTML inicial.']
  ],{plain:'Hidratar conecta el HTML que llegó del servidor con React en el navegador.',analogy:'Dos personas empiezan con el mismo plano; si una cambia la puerta, las piezas no encajan.',steps:'Busca fechas, números aleatorios y datos del navegador que cambien el primer resultado.'});

reactLesson('react-debug-tests','🔎','Perfilar renders y elegir pruebas','Mide el problema y prueba el comportamiento.',
  'Ante renders lentos, reproduce una interacción y usa React DevTools Profiler para ver qué se renderiza y cuánto tarda. Una prop objeto o función creada otra vez puede impedir que React.memo salte un render, pero no justifica poner useCallback en todas partes: mide. Un test unitario prueba una función aislada; uno de integración comprueba cómo colaboran input, estado y lista. Para una tabla, prueba el filtro puro y también el flujo de búsqueda, carga, error y teclado.',
  '// Unitario: filtrar([{nombre:\"Ana\"}], \"an\") devuelve Ana.\n// Integración: escribir \"an\" y comprobar las filas visibles.\n// Profiler: comparar la misma interacción antes y después.',
  'Describe síntoma, medición, causa, cambio y verificación. No optimices solo por la forma del código.',
  'https://react.dev/reference/react/Profiler',[
    ['Una tabla va lenta al escribir. ¿Qué haces primero?',['Perfilo la interacción y separo cálculo de render','Memorizo todas las funciones','Quito los tests'],0,'La medición indica dónde está el coste real.'],
    ['¿Qué test prueba que escribir cambia las filas visibles?',['Una prueba de integración de la interfaz','Solo una prueba de la función filtrar','Una captura sin interacción'],0,'Comprueba la colaboración entre campo, estado y lista.']
  ],{plain:'Primero encuentra qué tarda; luego comprueba la función pequeña y el recorrido completo.',analogy:'No cambies todas las ruedas porque vibra el coche: mide cuál falla.',steps:'Reproduce, perfila, cambia una causa y compara antes y después.'});

window.INTERVIEW_WORKSHOPS.push({
  id:'react-profundo',icon:'⚛',title:'React senior sin memorizar',
  summary:'Identidad, renders, carga diferida y errores con decisiones de producción.',
  cases:[
    {id:'filas-estado',title:'Una tabla cambia datos de fila',time:'12 min',
      brief:'Cada fila tiene un input para editar su nombre. Ordenas la tabla y el texto que estabas escribiendo aparece en otra fila. Explica qué pasó y cómo lo arreglas.',
      before:'filas.map((fila, indice) => <Fila key={indice} fila={fila} />)',
      checks:['Relaciono el fallo con identidad y estado local.','Uso una key estable del dato.','Pruebo inserciones, borrados y orden.'],
      steps:[
        {q:'¿Cuál es la causa más probable?',choices:['El índice cambia de significado al ordenar','Los inputs no admiten estado','El navegador mezcla los textos al azar'],answer:0,why:'La key por posición ya no representa al mismo dato cuando cambia el orden.'},
        {q:'¿Qué key elegirías?',choices:['fila.id estable','Math.random() en cada render','El índice multiplicado por dos'],answer:0,why:'Un id estable sigue identificando a la misma fila aunque se mueva.'},
        {q:'¿Cómo compruebas el arreglo?',choices:['Escribo, ordeno, inserto y borro; verifico qué fila conserva el texto','Solo busco warnings','Quito el input'],answer:0,why:'Hay que reproducir el comportamiento que fallaba.'}
      ],answer:'Usaría fila.id como key y probaría la tabla con un input a medio editar al reordenar e insertar.',after:'filas.map(fila => <Fila key={fila.id} fila={fila} />)',source:'https://react.dev/learn/rendering-lists'},
    {id:'busqueda-lenta',title:'El buscador escribe con retraso',time:'15 min',
      brief:'Un input controlado filtra miles de elementos. Las letras tardan en verse. Mejora la experiencia sin disparar una petición innecesaria en cada pulsación.',
      before:'const [query, setQuery] = useState(\"\");\n<input value={query} onChange={e => setQuery(e.target.value)} />\n<ListaLenta query={query} />',
      checks:['Mido cálculo y render antes de optimizar.','El input refleja cada tecla.','Distingo prioridad de render y frecuencia de red.'],
      steps:[
        {q:'¿Qué haces primero?',choices:['Perfilo la interacción','Pongo useMemo en todas las variables','Paso el input a una transición'],answer:0,why:'Hay que saber qué parte cuesta: filtro, DOM o algo externo.'},
        {q:'Si la lista es lenta, ¿qué puede recibir?',choices:['useDeferredValue(query)','Un query viejo para siempre','El value del input solo al desmontar'],answer:0,why:'La lista puede ir un paso por detrás sin retrasar el texto visible del input.'},
        {q:'¿Cómo evitas un fetch por cada tecla?',choices:['Debounce o estrategia de red apropiada','Solo useTransition','Solo React.memo'],answer:0,why:'Diferir render no controla la cantidad de peticiones HTTP.'}
      ],answer:'Perfilaría, diferiría el valor de la lista si es el cuello y controlaría la red por separado.',after:'const deferredQuery = useDeferredValue(query);\n<input value={query} onChange={e => setQuery(e.target.value)} />\n<ListaLenta query={deferredQuery} />',source:'https://react.dev/reference/react/useDeferredValue'},
    {id:'informe-falla',title:'Un informe tarda o falla al abrir',time:'15 min',
      brief:'Informes se carga bajo demanda. A veces tarda y, tras un despliegue, una pestaña antigua no consigue descargar el módulo. Mantén el resto del sitio usable.',
      before:'const Informes = lazy(() => import(\"./Informes\"));\nreturn <Informes />;',
      checks:['Suspense limita la espera a Informes.','Un error boundary muestra un fallo recuperable.','Pruebo red lenta y descarga fallida.'],
      steps:[
        {q:'¿Qué muestras mientras se descarga?',choices:['Fallback de Suspense cerca de Informes','Solo un ErrorBoundary','Toda la página vacía'],answer:0,why:'Suspense puede mostrar espera para esa sección sin ocultar el resto.'},
        {q:'¿Y si la descarga rechaza?',choices:['Un error boundary con una recuperación','Suspense convierte el error en datos','No puede fallar'],answer:0,why:'Un fallo necesita una salida distinta del estado de espera.'},
        {q:'¿Qué pruebas?',choices:['Red lenta, fallo de chunk y resto usable','Solo la carga rápida','Solo una captura del spinner'],answer:0,why:'Hay que probar las tres experiencias que puede encontrar la persona.'}
      ],answer:'Pondría un Suspense y un límite de error locales, con una espera y una recuperación visibles.',after:'<LimiteError>\n  <Suspense fallback={<p>Cargando informes…</p>}>\n    <Informes />\n  </Suspense>\n</LimiteError>',source:'https://react.dev/reference/react/lazy'}
  ]
});
