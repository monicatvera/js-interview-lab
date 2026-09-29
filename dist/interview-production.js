// Ejercicios propios inspirados por situaciones frecuentes en entrevistas frontend.
window.CODE_PROBLEMS.push(
  {
    id:'peticion-vigente',title:'Actualiza el estado de una petición',level:'Medio',category:'React · async',minutes:18,
    statement:'Recibes un estado {id, estado, datos, error} y un evento {id, tipo, ...}. El id identifica la petición actual. Ignora los eventos de otra petición. Si tipo es "carga", devuelve estado "cargando", datos null y error null. Si es "exito", guarda evento.datos y limpia error. Si es "error", conserva los datos anteriores y guarda evento.error. Devuelve un objeto nuevo y no modifiques las entradas. Esta función es la parte de estado de un useFetch; la cancelación real se hace con AbortController en el Effect.',
    example:'actualizarPeticion({id:2,estado:"cargando",datos:null,error:null},{id:2,tipo:"exito",datos:[1]}) → {id:2,estado:"exito",datos:[1],error:null}',
    starter:'function actualizarPeticion(estado, evento) {\n  // ¿Pertenece este evento a la petición actual?\n}',
    hint:'Compara los id antes de hacer nada. Para cada tipo, usa {...estado, campo: nuevoValor}. En un error conserva estado.datos para poder mostrar contenido anterior.',
    explanation:'Cada petición tiene un identificador. Aunque una respuesta antigua llegue la última, no debe sobrescribir la vigente. AbortController cancela el trabajo cuando se puede; comprobar la vigencia protege el estado aunque la cancelación llegue tarde.',
    solution:'function actualizarPeticion(estado, evento) {\n  if (estado.id !== evento.id) return estado;\n  if (evento.tipo === "carga") return {...estado, estado:"cargando", datos:null, error:null};\n  if (evento.tipo === "exito") return {...estado, estado:"exito", datos:evento.datos, error:null};\n  if (evento.tipo === "error") return {...estado, estado:"error", error:evento.error};\n  return estado;\n}',
    tests:[
      {args:[{id:2,estado:'cargando',datos:null,error:null},{id:2,tipo:'exito',datos:[1]}],expected:{id:2,estado:'exito',datos:[1],error:null},preserveInput:true},
      {args:[{id:3,estado:'cargando',datos:null,error:null},{id:2,tipo:'exito',datos:['viejo']}],expected:{id:3,estado:'cargando',datos:null,error:null},preserveInput:true},
      {args:[{id:4,estado:'exito',datos:[7],error:null},{id:4,tipo:'error',error:'Sin conexión'}],expected:{id:4,estado:'error',datos:[7],error:'Sin conexión'},preserveInput:true},
      {args:[{id:1,estado:'error',datos:[9],error:'falló'},{id:1,tipo:'carga'}],expected:{id:1,estado:'cargando',datos:null,error:null}},
      {args:[{id:1,estado:'exito',datos:[],error:null},{id:1,tipo:'otro'}],expected:{id:1,estado:'exito',datos:[],error:null}}
    ]
  },
  {
    id:'ranking-dashboard',title:'Prepara el ranking del dashboard',level:'Medio',category:'React · datos',minutes:20,
    statement:'El servidor devuelve elementos {id, nombre, puntuacion}. Crea una función que quite los que no tengan puntuación numérica finita, ordene de mayor a menor y devuelva los primeros limite. Si empatan, respeta el orden en que llegaron. No cambies el array original. Esta transformación es una pieza del dashboard que actualiza sus datos periódicamente; el Effect se ocupa de las peticiones y de limpiar los temporizadores.',
    example:'mejoresElementos([{id:1,nombre:"A",puntuacion:2},{id:2,nombre:"B",puntuacion:8}],1) → [{id:2,nombre:"B",puntuacion:8}]',
    starter:'function mejoresElementos(elementos, limite) {\n  // Filtra, ordena una copia y devuelve los primeros.\n}',
    hint:'Usa Number.isFinite para validar. Guarda el índice original antes de ordenar; en un empate compara ese índice. slice(0, Math.max(0, limite)) limita el resultado.',
    explanation:'El cálculo del ranking se puede probar sin red ni React. El componente recibe datos nuevos cada vez que termina una consulta; la petición, el temporizador y la limpieza viven en un Effect separado.',
    solution:'function mejoresElementos(elementos, limite) {\n  return elementos.map((item,indice)=>({item,indice}))\n    .filter(({item})=>Number.isFinite(item.puntuacion))\n    .sort((a,b)=>b.item.puntuacion-a.item.puntuacion || a.indice-b.indice)\n    .slice(0,Math.max(0,limite))\n    .map(({item})=>item);\n}',
    tests:[
      {args:[[{id:1,nombre:'A',puntuacion:2},{id:2,nombre:'B',puntuacion:8}],1],expected:[{id:2,nombre:'B',puntuacion:8}],preserveInput:true},
      {args:[[{id:'a',puntuacion:5},{id:'b',puntuacion:5},{id:'c',puntuacion:7}],3],expected:[{id:'c',puntuacion:7},{id:'a',puntuacion:5},{id:'b',puntuacion:5}]},
      {args:[[{id:1,puntuacion:NaN},{id:2,puntuacion:Infinity},{id:3,puntuacion:0}],3],expected:[{id:3,puntuacion:0}]},
      {args:[[{id:1,puntuacion:3}],0],expected:[]},
      {args:[[],10],expected:[]}
    ]
  }
);

window.INTERVIEW_WORKSHOPS.push({
  id:'produccion',icon:'⚙',title:'Del ejercicio a producción',
  summary:'Peticiones cancelables, datos que se actualizan y una historia de proyecto que puedes defender.',
  cases:[
    {
      id:'use-fetch',title:'Construye un useFetch que no se quede atrás',time:'15 min',
      brief:'Dos pantallas piden datos. Mientras una petición sigue en curso, cambia la URL o sales de la pantalla. Diseña un hook que muestre carga, éxito y error sin aceptar una respuesta antigua.',
      before:'function useFetch(url) {\n  // ¿Qué estado devuelves?\n  // ¿Cómo cancelas al cambiar la URL?\n}',
      checks:['El hook distingue carga, éxito y error.','Comprueba response.ok: fetch no rechaza por un HTTP 404 o 500.','El Effect cancela la petición anterior al cambiar URL o desmontar.','Un error causado por abortar no se muestra como fallo al usuario.','Se puede volver a intentar sin crear peticiones duplicadas.'],
      steps:[
        {q:'¿Qué necesita saber la pantalla mientras espera?',choices:['Solo un array vacío','Si carga, si hubo error y qué datos llegaron','El número de renders'],answer:1,why:'Un array vacío puede significar «sin resultados» o «todavía cargando». Estados separados permiten explicarlo en la interfaz.'},
        {q:'El servidor responde HTTP 500. ¿Basta con poner .catch?',choices:['Sí, fetch rechaza cualquier HTTP 500','No: compruebo response.ok y lanzo un error si es falso','Repito la llamada sin límite'],answer:1,why:'fetch suele resolver la promesa al recibir una respuesta HTTP, incluso si el estado es 500. El error de red sí provoca rechazo.'},
        {q:'Cambia la URL antes de terminar la primera petición. ¿Qué haces?',choices:['Dejo que ambas escriban en el estado','En la limpieza del Effect aborto la anterior y evito actualizar desde ella','Guardo las respuestas en una variable global'],answer:1,why:'La limpieza se ejecuta antes del nuevo Effect y al desmontar. La petición anterior ya no debe controlar la pantalla.'},
        {q:'La persona pulsa «Reintentar». ¿Cómo lo harías?',choices:['Cambio una clave de reintento que depende el Effect','Llamo al hook dentro del onClick','Lanzo fetch en cada render'],answer:0,why:'Los hooks se llaman siempre en el mismo orden. Una dependencia explícita vuelve a ejecutar el Effect de forma controlada.'}
      ],
      answer:'Explicaría primero el contrato del hook: {datos, estado, error, reintentar}. El Effect hace una petición por URL y clave de reintento, comprueba response.ok, y aborta en la limpieza. Así el componente solo decide qué mostrar.',
      after:'function useFetch(url) {\n  const [intento, reintentar] = useReducer(n => n + 1, 0);\n  const [resultado, setResultado] = useState({estado:"cargando", datos:null, error:null});\n  useEffect(() => {\n    const controller = new AbortController();\n    let vigente = true;\n    setResultado({estado:"cargando", datos:null, error:null});\n    fetch(url, {signal:controller.signal})\n      .then(res => { if (!res.ok) throw Error(`HTTP ${res.status}`); return res.json(); })\n      .then(datos => { if (vigente) setResultado({estado:"exito", datos, error:null}); })\n      .catch(error => { if (vigente && error.name !== "AbortError")\n        setResultado({estado:"error", datos:null, error:error.message}); });\n    return () => { vigente = false; controller.abort(); };\n  }, [url, intento]);\n  return {...resultado, reintentar};\n}',
      codeId:'peticion-vigente',source:'https://react.dev/learn/synchronizing-with-effects'
    },
    {
      id:'dashboard',title:'Un dashboard que se actualiza sin parar',time:'15 min',
      brief:'Muestra los elementos con mayor puntuación. El servidor cambia con el tiempo: consulta cada 10 segundos, deja reintentar si falla y detén el trabajo al salir de la pantalla.',
      before:'useEffect(() => {\n  setInterval(() => fetch("/api/ranking").then(...), 10000);\n}, []);',
      checks:['Se ve carga inicial, última actualización y un error recuperable.','Una petición lenta no se solapa con la siguiente.','El temporizador se limpia y la petición en curso se aborta al desmontar.','Tras un error, el reintento tiene un límite y no crea una tormenta de llamadas.','El ranking conserva el orden de los empates y no modifica los datos recibidos.'],
      steps:[
        {q:'¿Qué falla en ese setInterval?',choices:['Puede iniciar otra petición aunque la anterior no haya terminado','Ordena los datos automáticamente','Detiene las peticiones al desmontar'],answer:0,why:'Si la red tarda más que el intervalo, tendrás peticiones solapadas y respuestas que llegan fuera de orden.'},
        {q:'¿Cuándo programarías la siguiente consulta?',choices:['Al terminar la anterior, con setTimeout y limpieza','En cada render','Con un intervalo nuevo por cada respuesta sin limpiar'],answer:0,why:'Programar después de terminar evita solapamientos; la limpieza cancela el temporizador pendiente.'},
        {q:'La red falla varias veces. ¿Qué reintento elegirías?',choices:['Cada milisegundo sin límite','Una espera creciente con máximo, y opción manual de reintentar','Ocultar el error para siempre'],answer:1,why:'Esperar más tras fallos repetidos reduce carga al servidor; el usuario debe entender qué ocurre.'},
        {q:'La pantalla desaparece mientras llega la respuesta. ¿Qué haces?',choices:['Abortar petición y cancelar temporizador en la limpieza','Mantenerlo para siempre','Ignorar todos los errores con un catch vacío'],answer:0,why:'La pantalla ya no necesita el trabajo. La limpieza evita tráfico y actualizaciones innecesarias.'}
      ],
      answer:'Separaría la transformación del ranking de las peticiones. Consultaría, actualizaría datos o error y solo entonces programaría el siguiente setTimeout. Ante errores aumentaría la espera hasta un máximo. En la limpieza cancelaría temporizador y petición.',
      after:'useEffect(() => {\n  let activo = true, timer, controller;\n  let fallos = 0;\n  async function consultar() {\n    controller = new AbortController();\n    try {\n      const respuesta = await fetch("/api/ranking", {signal:controller.signal});\n      if (!respuesta.ok) throw Error(`HTTP ${respuesta.status}`);\n      const datos = await respuesta.json();\n      if (!activo) return;\n      setElementos(datos); setError(null); fallos = 0;\n    } catch (error) {\n      if (!activo) return;\n      setError(error.message); fallos++;\n    } finally {\n      if (activo) timer = setTimeout(consultar,\n        fallos ? Math.min(30000, 1000 * 2 ** fallos) : 10000);\n    }\n  }\n  consultar();\n  return () => { activo = false; clearTimeout(timer); controller?.abort(); };\n}, []);\n// Calcula el ranking a partir de elementos, sin guardarlo como otro estado.',
      codeId:'ranking-dashboard',source:'https://react.dev/learn/synchronizing-with-effects'
    },
    {
      id:'proyecto',title:'Cuenta un proyecto como candidata senior',time:'15 min',
      brief:'Te preguntan por una interfaz compleja que construiste. Elige un proyecto que conozcas bien y cuenta el problema, tu responsabilidad, las decisiones que tomaste y cómo comprobaste el resultado. Usa datos reales solo si puedes compartirlos.',
      checks:['Explico el problema y qué parte hice yo sin exagerar.','Digo por qué elegí esa estructura de componentes y estado.','Cuento cómo traté API, carga, errores y pruebas.','Incluyo una decisión difícil y una alternativa que valoré.','Explico qué medí o comprobé y qué mejoraría hoy.'],
      steps:[
        {q:'¿Con qué empiezas la historia?',choices:['Con una lista de todas las librerías','Con el problema, las personas usuarias y mi responsabilidad concreta','Con 20 minutos de contexto interno'],answer:1,why:'Quien entrevista necesita entender qué había que conseguir y qué parte dependía de ti antes de escuchar detalles técnicos.'},
        {q:'Te preguntan por el estado global. ¿Qué respondes?',choices:['Usamos una herramienta porque es la mejor','Qué datos compartíamos, qué dejamos local y por qué','No recuerdo nada del estado'],answer:1,why:'Una decisión se defiende con necesidades y costes: quién usa el dato, cuánto cambia y qué complejidad añade compartirlo.'},
        {q:'Algo salió mal durante el proyecto. ¿Cómo lo cuentas?',choices:['Lo escondo','Describo el problema, cómo lo detecté, la solución y lo que aprendí','Culpo a otro equipo'],answer:1,why:'Resolver un problema real con claridad demuestra criterio y colaboración.'},
        {q:'¿Qué hace creíble tu impacto?',choices:['Una comprobación concreta: tests, rendimiento, accesibilidad o menos incidencias','Decir que todo fue perfecto','Atribuirme todo el trabajo del equipo'],answer:0,why:'Si no tienes métricas, cuenta qué pruebas hiciste y cuál fue el resultado observado. No inventes cifras.'}
      ],
      answer:'En un proyecto de interfaz, el reto era que una persona completara una tarea sin perderse cuando la red fallara. Yo diseñé la estructura de pantalla y el flujo de datos. Dejé el estado del formulario cerca del componente y compartí solo lo que otras pantallas necesitaban. Separé la llamada a la API, añadí carga y error, y probé el flujo principal con tests de interfaz. Una respuesta antigua nos dio problemas: la invalidé al cambiar la selección. Verifiqué el resultado con los tests y una revisión con diseño y QA. Hoy mediría antes el tiempo de respuesta de la pantalla. Sustituye cada detalle por tu experiencia real.',
      practicePrompt:'Escribe tu respuesta en 6–10 frases: problema → tu papel → decisiones de componentes, estado y API → una dificultad → cómo comprobaste el resultado → qué mejorarías. No incluyas datos internos de empresa.',
      source:'https://react.dev/learn/thinking-in-react'
    }
  ]
});
