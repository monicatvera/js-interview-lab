// Fundamentos complementarios de JavaScript para entrevistas.
window.COURSE.push(
  {
    id:'call-apply-bind',icon:'this',category:'Fundamentos',title:'call, apply y bind',subtitle:'Elige el objeto de this al llamar a una función.',minutes:7,level:'Muy preguntado',
    theory:'En una función normal, this depende de cómo la llamas. call ejecuta la función ahora y recibe los argumentos uno a uno. apply también la ejecuta ahora, pero recibe los argumentos en un array. bind crea otra función con this fijado para llamarla más tarde. Con una función flecha, estos métodos no cambian su this porque la flecha lo toma de donde se creó.',
    example:'function saluda(signo) { return this.nombre + signo; }\nconst ana = { nombre: "Ana" };\nsaluda.call(ana, "!");    // "Ana!"\nsaluda.apply(ana, ["?"]); // "Ana?"\nconst luego = saluda.bind(ana, "!");\nluego();                  // "Ana!"',
    takeaway:'Di si la función se ejecuta ahora o se prepara para después. Luego explica cómo recibe los argumentos.',
    source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply',
    questions:[
      {q:'¿Cuál crea una función nueva sin ejecutarla todavía?',choices:['call','apply','bind','Todas'],answer:2,why:'bind devuelve una función nueva con this fijado. call y apply hacen la llamada en ese momento.'},
      {q:'¿Qué diferencia hay entre call y apply al pasar argumentos?',choices:['call recibe valores separados; apply un array','apply devuelve una promesa','call solo funciona con clases','No hay ninguna'],answer:0,why:'Ambos ejecutan la función, pero call recibe cada argumento por separado y apply los recibe agrupados.'}
    ]
  },
  {
    id:'callbacks-hof',icon:'f()',category:'Fundamentos',title:'Callbacks y funciones de orden superior',subtitle:'Una función puede recibir otra función.',minutes:7,level:'Base sólida',
    theory:'Un callback es una función que entregas a otra para que la llame. Una función de orden superior recibe una función, devuelve una función o ambas cosas. map y filter reciben callbacks y los ejecutan mientras recorren el array: eso es síncrono. setTimeout también recibe un callback, pero lo ejecuta más tarde. Callback no significa automáticamente «asíncrono». Si pasas saludar() en vez de saludar, la estás ejecutando ya y pasas su resultado.',
    example:'const dobles = [1, 2].map(n => n * 2); // [2, 4]\nfunction ejecutar(fn) { fn(); }\nejecutar(() => console.log("hola"));',
    takeaway:'Identifica quién recibe la función, quién la invoca y en qué momento sucede.',
    source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
    questions:[
      {q:'¿Un callback siempre se ejecuta de forma asíncrona?',choices:['Sí','No, map usa callbacks de forma síncrona','Solo en React','Solo si es una flecha'],answer:1,why:'map llama al callback durante el recorrido del array, antes de devolver el nuevo array.'},
      {q:'Si ejecutar espera una función, ¿qué pasas para que saludar se ejecute dentro?',choices:['ejecutar(saludar)','ejecutar(saludar())','ejecutar("saludar")','ejecutar(undefined)'],answer:0,why:'Pasar saludar entrega la función. saludar() la ejecutaría antes de llamar a ejecutar.'}
    ]
  },
  {
    id:'event-propagation',icon:'↕',category:'Fundamentos',title:'Captura y burbujeo de eventos',subtitle:'Un clic puede pasar por padres e hijos.',minutes:8,level:'Muy preguntado',
    theory:'Si haces clic en un botón dentro de una tarjeta, el evento pasa por una fase de captura desde los ancestros hacia el objetivo, llega al botón y luego puede subir por burbujeo hacia los ancestros. addEventListener escucha por defecto en burbujeo; con {capture:true} escucha en captura. event.target es el elemento original del evento y event.currentTarget es el elemento cuyo listener se está ejecutando. Delegar eventos significa poner un listener en un contenedor para gestionar elementos internos. stopPropagation corta la propagación restante; úsalo cuando realmente necesitas impedir que actúe un padre.',
    example:'list.addEventListener("click", event => {\n  const button = event.target.closest("button[data-id]");\n  if (!button || !list.contains(button)) return;\n  console.log(button.dataset.id);\n});',
    takeaway:'Dibuja padre → objetivo → padre y distingue target de currentTarget antes de explicar el orden.',
    source:'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling',
    questions:[
      {q:'¿En qué fase escucha addEventListener normalmente?',choices:['Captura','Burbujeo','Solo en el objetivo','Ninguna'],answer:1,why:'Sin la opción capture:true, el listener escucha en la fase de burbujeo.'},
      {q:'Un listener en la lista recibe el clic de un botón hijo. ¿Qué señala event.currentTarget?',choices:['El botón siempre','La lista donde está el listener','El documento siempre','El último elemento bajo el puntero'],answer:1,why:'currentTarget es el elemento cuyo listener está ejecutándose; target indica el origen del evento.'}
    ]
  },
  {
    id:'debounce-throttle',icon:'⏱',category:'Asincronía',title:'Debounce y throttle',subtitle:'Controla cuántas veces responde un evento frecuente.',minutes:8,level:'Frontend real',
    theory:'Debounce espera a que dejen de llegar llamadas durante un intervalo: sirve, por ejemplo, para iniciar una búsqueda cuando la persona deja de escribir. Cada llamada nueva reinicia el temporizador. Throttle limita la frecuencia: permite como máximo una ejecución por intervalo y encaja para scroll o movimiento que debe actualizarse mientras continúa. Hay variantes de comienzo y final de intervalo, así que aclara el comportamiento pedido. Ninguna de las dos técnicas cancela por sí sola una petición HTTP que ya empezó.',
    example:'function debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}',
    takeaway:'Pregunta si quieres actuar tras la pausa (debounce) o seguir actuando con frecuencia limitada (throttle).',
    source:'https://developer.mozilla.org/en-US/docs/Glossary/Throttle',
    questions:[
      {q:'Buscas cuando la persona deja de escribir 300 ms. ¿Qué patrón encaja?',choices:['Debounce','Throttle','Promise.all','Captura de eventos'],answer:0,why:'Debounce reinicia la espera con cada tecla y ejecuta la búsqueda tras la pausa.'},
      {q:'Un indicador debe actualizarse mientras haces scroll, pero no en cada evento. ¿Qué patrón encaja?',choices:['Debounce al final siempre','Throttle','JSON.stringify','bind'],answer:1,why:'Throttle limita la frecuencia y permite actualizaciones durante el desplazamiento.'}
    ]
  },
  {
    id:'modern-syntax',icon:'...',category:'Fundamentos',title:'Sintaxis moderna de JavaScript',subtitle:'Desestructurar, extender y consultar sin errores.',minutes:8,level:'Base sólida',
    theory:'Desestructurar extrae propiedades o posiciones a variables. El spread (...) extiende valores para crear arrays u objetos nuevos; esa copia solo alcanza el primer nivel. Rest usa los mismos puntos para reunir argumentos o propiedades restantes. El encadenamiento opcional ?. devuelve undefined si lo anterior es null o undefined, en vez de fallar. Se suele combinar con ?? para poner un valor por defecto solo cuando falta el dato. Son herramientas de sintaxis; no hacen copias profundas ni sustituyen la validación de datos.',
    example:'const user = {name:"Ana", profile:{city:"Las Palmas"}};\nconst {name} = user;\nconst copy = {...user}; // profile sigue compartido\nconst city = user.profile?.city ?? "Sin ciudad";\nfunction sum(...nums) { return nums.reduce((a,b) => a+b, 0); }',
    takeaway:'Explica qué dato sale, qué se copia y qué ocurre cuando falta una propiedad.',
    source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring',
    questions:[
      {q:'¿Qué devuelve user.profile?.city si profile es null?',choices:['undefined','null','Lanza TypeError','Una cadena vacía'],answer:0,why:'?. corta la consulta cuando profile es null o undefined y devuelve undefined.'},
      {q:'const b = {...a} y a.nested es un objeto. ¿Qué ocurre?',choices:['b.nested === a.nested','Se copia todo en profundidad','b === a','El objeto se congela'],answer:0,why:'El spread crea un objeto superior nuevo, pero mantiene la referencia del objeto anidado.'}
    ]
  },
  {
    id:'memory-gc',icon:'RAM',category:'Fundamentos',title:'Memoria y recolección de basura',subtitle:'Qué datos permanecen y por qué.',minutes:8,level:'Intermedio',
    theory:'JavaScript reserva memoria para valores y objetos que usa. El motor puede recuperar la memoria de objetos a los que ya no se puede llegar desde las referencias activas. No tienes que liberar manualmente cada objeto, pero sí puedes conservar referencias sin querer: un listener que sigue registrado, un temporizador, un cache sin límite o una closure que retiene datos grandes. En una pantalla que se monta y desmonta, limpia listeners y temporizadores. No se puede predecir el instante exacto en que actuará el recolector; comprueba una sospecha de fuga midiendo con herramientas de memoria.',
    example:'const timer = setInterval(update, 1000);\nwindow.addEventListener("resize", onResize);\n// Al dejar la pantalla:\nclearInterval(timer);\nwindow.removeEventListener("resize", onResize);',
    takeaway:'Habla de referencias alcanzables y limpieza de recursos; mide antes de afirmar que hay una fuga.',
    source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management',
    questions:[
      {q:'¿Qué puede mantener un objeto en memoria tras cerrar una pantalla?',choices:['Un listener registrado que lo referencia','Un comentario en el código','Un color CSS','Una variable numérica local ya inaccesible'],answer:0,why:'Mientras el listener siga registrado y conserve referencias, esos datos pueden continuar alcanzables.'},
      {q:'¿Puedes elegir el momento exacto de la recolección de basura?',choices:['Sí, con delete','No, lo decide el motor','Sí, con setTimeout(0)','Sí, al terminar cada función'],answer:1,why:'El motor gestiona automáticamente la recolección; no hay un instante garantizado para cada objeto.'}
    ]
  }
);

Object.assign(window.BEGINNER,{
  'call-apply-bind':{plain:'call y apply llaman ya a una función indicando quién es this. bind crea una versión para llamarla luego.',analogy:'call y apply hacen la llamada telefónica ahora; bind guarda el número y prepara la llamada para más tarde.',steps:'Comprueba si la función se ejecuta enseguida. Mira cómo se pasan los argumentos y qué objeto se usa como this.'},
  'callbacks-hof':{plain:'Un callback es una función que entregas a otra función. La segunda decide cuándo llamarla.',analogy:'Dejas tu número para que te llamen: entregas cómo contactarte, pero la otra persona decide cuándo usarlo.',steps:'Señala la función que se entrega y la que la recibe. Pregunta si se llama ahora o más tarde.'},
  'event-propagation':{plain:'Un clic dentro de un elemento puede activar listeners del elemento y de sus padres.',analogy:'Un mensaje baja por la cadena hasta su destinatario y luego la respuesta sube por la cadena.',steps:'Dibuja contenedor y botón. Sigue captura hacia dentro, objetivo y burbujeo hacia fuera. Distingue target y currentTarget.'},
  'debounce-throttle':{plain:'Debounce espera una pausa. Throttle deja pasar llamadas durante la actividad, pero con un límite.',analogy:'Debounce espera a que termines de hablar; throttle te deja hablar una vez cada cierto tiempo.',steps:'Pregunta si el trabajo debe hacerse después de la última llamada o también mientras siguen llegando llamadas.'},
  'modern-syntax':{plain:'Esta sintaxis permite sacar datos de objetos, crear copias superficiales y consultar propiedades que quizá no existan.',analogy:'Spread copia la portada de una carpeta, pero los documentos dentro pueden ser los mismos.',steps:'Comprueba qué variable se extrae, qué referencias siguen compartidas y qué devuelve ?. si falta algo.'},
  'memory-gc':{plain:'El motor recupera memoria cuando un dato ya no puede alcanzarse. Si sigues guardando una referencia, puede permanecer.',analogy:'No puedes tirar una caja si todavía figura en el inventario de alguien que la usa.',steps:'Busca quién conserva referencias: listeners, timers, caches y closures. Limpia recursos al salir y mide si la memoria sigue creciendo.'}
});
