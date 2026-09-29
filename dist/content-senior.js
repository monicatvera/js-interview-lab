// Preguntas de entrevistas senior React/Next.js, explicadas desde cero.
// Las fuentes enlazan a documentación original. Los ejercicios son propios.
window.COURSE.push(
  {
    id:'nullish', icon:'??', category:'Fundamentos', title:'|| frente a ??',
    subtitle:'No conviertas un cero válido en un valor por defecto.', minutes:6, level:'Muy preguntado',
    theory:'Los dos operadores pueden dar un valor alternativo. || lo usa si el primero es falsy: false, 0, una cadena vacía, null, undefined o NaN. ?? solo lo usa si el primero es null o undefined. Si cero es un precio válido o la cadena vacía es una respuesta válida, normalmente necesitas ?? para conservarlos. Para mezclar ?? con || o &&, pon paréntesis.',
    example:'0 || 10       // 10\n0 ?? 10       // 0\n"" || "sin nombre" // "sin nombre"\n"" ?? "sin nombre" // ""',
    takeaway:'Pregunta si 0, false o una cadena vacía significan «dato válido» o «dato ausente».',
    source:'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing',
    questions:[
      {q:'El descuento puede ser 0. ¿Qué conserva ese cero?',choices:['descuento || 20','descuento ?? 20','Boolean(descuento) || 20','Ambos operadores'],answer:1,why:'?? solo usa 20 si descuento es null o undefined. || trata 0 como falsy y lo sustituye.'},
      {q:'¿Qué devuelve false ?? true?',choices:['true','false','undefined','Lanza un error'],answer:1,why:'false es un valor existente; ?? no lo reemplaza.'}
    ]
  },
  {
    id:'controlled', icon:'⌨', category:'React', title:'Formularios controlados',
    subtitle:'Quién guarda el valor de un campo: React o el navegador.', minutes:8, level:'Muy preguntado',
    theory:'En un input controlado, React guarda el valor en el estado y se lo pasa al campo mediante value. onChange actualiza ese estado cuando escribes. Así puedes validar o mostrar el mismo dato en otra parte. En uno no controlado, el propio elemento guarda su valor; puedes leerlo con una ref o al enviar el formulario. defaultValue da solo el valor inicial. No hace falta convertir todos los campos en controlados: elige según lo que necesita la pantalla.',
    example:'const [name, setName] = useState("");\n<input value={name} onChange={e => setName(e.target.value)} />\n// No controlado: <input defaultValue="Ada" ref={nameRef} />',
    takeaway:'Si la pantalla necesita reaccionar a cada tecla, controla el campo. Si basta leerlo al enviar, el navegador puede guardarlo.',
    source:'https://react.dev/reference/react-dom/components/input',
    questions:[
      {q:'Un input recibe value={name}, pero no hay onChange. ¿Qué pasa al escribir?',choices:['React actualiza name solo','El campo queda de solo lectura','Se vuelve no controlado','Se envía automáticamente'],answer:1,why:'React fija el valor desde el estado; sin actualizarlo mediante onChange, lo escrito no puede quedar reflejado.'},
      {q:'¿Qué hace defaultValue en un input no controlado?',choices:['Fija el valor en cada render','Da un valor inicial','Valida el campo','Crea una ref'],answer:1,why:'defaultValue establece el valor inicial; después el elemento puede conservar sus cambios por sí mismo.'}
    ]
  },
  {
    id:'context-redux', icon:'↔', category:'React', title:'Context o Redux Toolkit',
    subtitle:'Comparte datos sin añadir más maquinaria de la necesaria.', minutes:9, level:'Senior',
    theory:'Context permite pasar un dato a componentes lejanos sin encadenar props por todos los niveles; suele encajar para tema, idioma o datos de sesión. Redux Toolkit organiza un estado compartido que cambia por acciones: dispatch envía la acción, un reducer calcula el estado siguiente y los componentes lo leen mediante selectores. Puede convenir si muchas zonas de una app comparten lógica compleja y necesitas herramientas para depurarla. Context no es automáticamente un gestor de todo el estado: si su valor cambia, los consumidores de ese contexto pueden volver a renderizarse. Antes de elegir, pregunta quién necesita el dato y cada cuánto cambia.',
    example:'// Context: <ThemeContext.Provider value="dark">...</ThemeContext.Provider>\n// Redux Toolkit: dispatch(cartActions.addItem(product));\n// Un selector lee solo la parte del store que interesa.',
    takeaway:'Empieza por estado local. Sube el estado o usa Context cuando compartirlo lo justifique; elige Redux Toolkit si el estado global y sus reglas necesitan una estructura común.',
    source:'https://react.dev/learn/passing-data-deeply-with-context',
    questions:[
      {q:'Toda la app lee el tema claro/oscuro y cambia pocas veces. ¿Qué opción sencilla encaja?',choices:['Context','Un store Redux obligatorio','Guardar el tema en cada botón','Un temporizador'],answer:0,why:'Context evita pasar la preferencia por cada componente intermedio; aquí no hay lógica global compleja.'},
      {q:'En Redux, ¿qué expresa normalmente un dispatch?',choices:['Una acción que describe qué ocurrió','Una mutación directa del DOM','Un render manual','Una petición HTTP obligatoria'],answer:0,why:'dispatch envía una acción. La lógica de reducción calcula el estado siguiente a partir del anterior y esa acción.'}
    ]
  },
  {
    id:'a11y-senior', icon:'Tab', category:'Calidad', title:'HTML semántico y teclado',
    subtitle:'Un botón de verdad ya trae comportamientos útiles.', minutes:8, level:'Senior',
    theory:'HTML semántico usa el elemento que corresponde a la acción: button para actuar, a para navegar, label para nombrar un campo. Un div con role="button" anuncia un rol a tecnologías de apoyo, pero no adquiere por arte de magia el foco, la activación con Enter y Espacio ni el estado disabled de un button nativo. Prueba con teclado: Tab para moverte, Enter o Espacio para activar, Escape para cerrar un diálogo. Al cerrar un modal, devuelve el foco al control que lo abrió; mientras esté abierto, gestiona el foco dentro de él.',
    example:'<button type="button" onClick={openModal}>Abrir</button>\n// Mejor que <div role="button" onClick={openModal}>Abrir</div>',
    takeaway:'Primero usa el elemento HTML correcto. Después prueba el flujo completo sin ratón.',
    source:'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/button_role',
    questions:[
      {q:'¿role="button" en un div añade automáticamente activación con teclado?',choices:['Sí, Enter y Espacio','No, hay que implementarla','Solo en React','Solo si lleva CSS'],answer:1,why:'El rol informa sobre el significado, pero no añade el comportamiento del botón nativo.'},
      {q:'Tras cerrar un modal, ¿dónde debería quedar normalmente el foco?',choices:['En cualquier lugar','En el botón que lo abrió','Siempre en el encabezado','Fuera de la ventana'],answer:1,why:'Devolver el foco al control de origen permite continuar donde se quedó la persona.'}
    ]
  },
  {
    id:'web-vitals', icon:'⚡', category:'Calidad', title:'Web Vitals y carga lenta',
    subtitle:'Mide qué duele antes de optimizar.', minutes:9, level:'Senior',
    theory:'Si una página tarda ocho segundos, primero reproduce el problema y mide si el tiempo se va en red, JavaScript o renderizado. Los Core Web Vitals describen tres experiencias: LCP mide cuándo aparece el contenido principal; INP mide la respuesta a interacciones; CLS mide cuánto salta el diseño. DevTools y PageSpeed Insights ayudan a encontrar causas. Reducir o dividir el JavaScript puede acelerar la carga inicial; lazy loading retrasa recursos que aún no hacen falta. Para tablas enormes, la virtualización dibuja solo filas cercanas a la zona visible. Eso reduce nodos, pero complica foco, búsqueda, altura variable y accesibilidad; no la uses sin medir.',
    example:'// Idea: carga la sección de informes solo al abrirla.\nconst Reports = lazy(() => import("./Reports"));\n// En una tabla larga, mide filas dibujadas y tiempo de interacción.',
    takeaway:'Cuenta qué métrica empeoró, qué trabajo sobra, qué cambio propones y cómo comprobarás la mejora.',
    source:'https://web.dev/articles/vitals',
    questions:[
      {q:'Al pulsar un botón, la página responde tarde. ¿Qué métrica investigarías primero?',choices:['INP','CLS','Número de archivos CSS','Solo LCP'],answer:0,why:'INP se relaciona con la capacidad de responder a las interacciones de la persona.'},
      {q:'Una tabla crea 20 000 filas en el DOM pero solo ves 20. ¿Qué técnica merece probar?',choices:['Aumentar z-index','Virtualización de filas','Repetir la petición','Añadir más sombras'],answer:1,why:'Dibujar únicamente filas cercanas a la vista puede reducir el trabajo del navegador. Hay que medir y cuidar el teclado.'}
    ]
  },
  {
    id:'cross-browser', icon:'🌐', category:'Calidad', title:'Probar en distintos navegadores',
    subtitle:'Comprueba la misma tarea, no solo la misma captura.', minutes:7, level:'Frontend real',
    theory:'Una web puede funcionar en tu navegador y fallar en otro, especialmente con estilos, formularios o funciones recientes. Define qué navegadores y dispositivos usa tu audiencia. Prueba allí los flujos importantes: abrir un modal, rellenar y enviar un formulario, navegar con teclado. Si algo falla, crea un ejemplo pequeño, comprueba compatibilidad de la función y corrige la causa. Los tests automatizados ayudan a repetir recorridos, pero una revisión manual de teclado y lector de pantalla sigue siendo útil. Lighthouse o axe señalan problemas; no demuestran por sí solos que toda la web sea accesible.',
    example:'// Caso de prueba: abrir modal → Tab → Escape → comprobar foco.\n// Repite el recorrido en los navegadores que soporta tu producto.',
    takeaway:'Di qué navegadores soportas, qué recorrido pruebas y cómo aíslas una diferencia.',
    source:'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing',
    questions:[
      {q:'Un modal se ve bien en Chrome. ¿Qué verificarías además?',choices:['Solo una captura en Chrome','Teclado y cierre en los navegadores soportados','El color del editor','Solo el tamaño del bundle'],answer:1,why:'El comportamiento, foco y teclado pueden diferir aunque la captura se vea igual.'},
      {q:'¿Una puntuación perfecta de una herramienta automática garantiza accesibilidad completa?',choices:['Sí','No, también hacen falta pruebas de uso','Solo en móvil','Solo en React'],answer:1,why:'Las herramientas detectan parte de los problemas; hay barreras de interacción que requieren pruebas manuales.'}
    ]
  }
);

Object.assign(window.BEGINNER, {
  nullish:{plain:'|| y ?? eligen un valor alternativo, pero no consideran «vacío» lo mismo.',analogy:'Si pides una talla y eliges 0, ¿quieres conservar ese 0 o sustituirlo? ?? lo conserva.',steps:'Mira si el valor es null/undefined. Después decide si 0, false o texto vacío también deben reemplazarse.'},
  controlled:{plain:'Un campo controlado guarda lo escrito en React. Uno no controlado lo guarda en el propio campo del navegador.',analogy:'El controlado es una libreta que React actualiza con cada tecla; el otro es un papel que consultas cuando lo necesitas.',steps:'Pregunta cuándo necesitas conocer el valor. Si debe reflejarse en pantalla al instante, usa estado y onChange.'},
  'context-redux':{plain:'Context reparte un dato entre componentes. Redux Toolkit organiza cambios de datos compartidos cuando hay más reglas y lugares implicados.',analogy:'Context es repartir una misma hoja a varias mesas; Redux es llevar un registro común de acciones y cambios.',steps:'Empieza por quién usa el dato. Si vive en una pantalla, mantenlo local. Si lo leen muchos, valora Context; si hay reglas globales complejas, valora Redux.'},
  'a11y-senior':{plain:'El HTML correcto ya sabe comportarse de manera útil con el teclado y las herramientas de accesibilidad.',analogy:'Un botón real es una puerta con manilla y cerradura; un div con una etiqueta de puerta aún necesita que le construyas todo lo demás.',steps:'Usa button para acciones y a para enlaces. Recorre la pantalla con Tab, Enter, Espacio y Escape. Comprueba dónde queda el foco.'},
  'web-vitals':{plain:'Rendimiento significa que el contenido aparezca pronto, que los controles respondan y que la página no salte.',analogy:'Una tienda debe abrir pronto (LCP), atenderte rápido (INP) y no mover las estanterías mientras caminas (CLS).',steps:'Reproduce el retraso. Mide qué parte tarda. Cambia una causa y vuelve a medir.'},
  'cross-browser':{plain:'Una web debe completar las tareas importantes en los navegadores que usan las personas.',analogy:'No basta con que una llave funcione en una puerta: comprueba todas las puertas que prometiste abrir.',steps:'Elige un recorrido real. Repítelo en navegadores soportados y con teclado. Aísla la diferencia antes de cambiar código.'}
});

window.SCENARIOS.push(
  {title:'Filtra usuarios activos mayores de 18',tag:'JavaScript · arrays',time:'10–15 min',prompt:'Recibes usuarios con active y age. Devuelve solo los activos mayores de 18 (18 exactos no entra). ¿Qué haces con una lista vacía?',hint:'filter conserva elementos si la condición devuelve true. Revisa el operador >.',solution:'const adults = users.filter(user => user.active && user.age > 18); Con [] devuelve []. Aclara si age puede faltar y cómo tratarlo.',check:['Uso > 18, no >= 18.','Mantengo el orden original.','Pruebo vacío, 18 exactos e inactivos.']},
  {title:'Dos selectores desde un array y un objeto',tag:'React · formularios',time:'15–20 min',prompt:'Tienes una lista de países y un objeto que relaciona cada país con sus ciudades. Muestra dos selectores: al cambiar país, las ciudades disponibles cambian. ¿Qué ocurre si la ciudad anterior ya no existe?',hint:'Guarda el país seleccionado. Deriva las opciones del segundo selector. Decide si debes limpiar la selección anterior.',solution:'Guarda country en estado y calcula cities = citiesByCountry[country] ?? []. Al cambiar país, limpia city o elige una ciudad válida. Usa label y value en los selectores; no guardes otra copia de cities si puedes derivarla.',check:['El segundo selector depende del país.','No queda una ciudad inválida seleccionada.','Ambos selectores tienen una etiqueta accesible.']},
  {title:'Escribe debounce',tag:'JavaScript · temporizadores',time:'15–20 min',prompt:'Una búsqueda llama al servidor en cada pulsación. Escribe una función debounce que espere 300 ms desde la última llamada antes de ejecutar la búsqueda.',hint:'Conserva un identificador de temporizador en un closure. En cada llamada cancela el anterior y crea otro.',solution:'function debounce(fn, delay) { let timer; return function (...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); }; } Esto retrasa la llamada; para búsquedas asíncronas también debes impedir que una respuesta antigua reemplace a una nueva.',check:['Cancelo el temporizador previo.','Conservo los últimos argumentos.','Distingo debounce de cancelar una petición ya iniciada.']},
  {title:'Encuentra repetidos y aplana un array',tag:'JavaScript · arrays',time:'15–20 min',prompt:'Primero devuelve qué valores aparecen más de una vez en [2, 3, 2, 4, 3]. Después convierte [1, [2, [3]]] en [1, 2, 3]. ¿Qué pasa si hay objetos?',hint:'Set ayuda a recordar lo visto; flat(Infinity) recorre los niveles anidados.',solution:'Para primitivos: const seen = new Set(); const repeated = new Set(); for (const value of values) { if (seen.has(value)) repeated.add(value); else seen.add(value); } Resultado: [...repeated] = [2,3]. Para el otro: nested.flat(Infinity). Dos objetos con igual contenido no son iguales por referencia.',check:['Devuelvo cada repetido una sola vez.','Aclaro si el orden importa.','Sé que Set compara objetos por referencia.']}
);
