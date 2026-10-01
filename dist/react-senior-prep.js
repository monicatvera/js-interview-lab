// Contenido original: preparación razonada de entrevistas senior de React.
window.COURSE.push(...[
  {
    "id": "react-render-causes",
    "icon": "⚛",
    "category": "React",
    "title": "¿Por qué se renderiza otra vez?",
    "subtitle": "Sigue la actualización hasta encontrar quién la provoca.",
    "minutes": 12,
    "level": "Senior",
    "theory": "Renderizar es llamar al componente para calcular la interfaz. Ocurre al montarlo y cuando se actualiza su estado o el de un antecesor. Normalmente, si el padre renderiza, también calcula a sus hijos aunque sus props tengan el mismo valor. React.memo puede evitar ese trabajo si las props no cambian, pero el estado propio y un Context que el hijo consume siguen pudiendo actualizarlo. Cambiar una ref no solicita un render. Render tampoco significa cambiar todo el DOM: React compara el resultado y aplica los cambios necesarios. Para aislar trabajo, coloca el estado cerca de quien lo usa y divide Contexts por responsabilidad. No mutar objetos ayuda a que React detecte cambios: crea la nueva versión. En desarrollo, Strict Mode puede repetir llamadas para detectar impurezas; mide rendimiento en condiciones representativas.",
    "example": "function Pagina() {\n  return <><Buscador /><Resumen /></>;\n}\nfunction Buscador() {\n  const [texto, setTexto] = useState(\"\");\n  return <input value={texto}\n    onChange={e => setTexto(e.target.value)} />;\n}\n// Escribir actualiza Buscador: ese estado ya no vive en Pagina.\n// Resumen no se recalcula por esta actualización local.",
    "takeaway": "En entrevista: localiza quién cambia estado, qué hijos alcanza y qué Context consumen. Optimiza solo si la medición muestra un coste.",
    "source": "https://react.dev/learn/render-and-commit",
    "questions": [
      {
        "q": "El padre se actualiza y el hijo no usa memo. Sus props son iguales. ¿Puede renderizarse el hijo?",
        "choices": [
          "Sí, normalmente el padre también vuelve a calcularlo",
          "No, solo si cambian las props",
          "Solo si tiene un Effect"
        ],
        "answer": 0,
        "why": "Las actualizaciones del padre pueden provocar renders del hijo aunque sus props sean iguales."
      },
      {
        "q": "Un componente con memo consume un Context cuyo valor cambia. ¿memo bloquea esa actualización?",
        "choices": [
          "Sí, siempre",
          "No: memo no impide actualizaciones del Context consumido",
          "Sí, si no tiene props"
        ],
        "answer": 1,
        "why": "memo optimiza la comparación de props; no congela el estado ni las suscripciones a Context."
      }
    ]
  },
  {
    "id": "react-server-state",
    "icon": "⚛",
    "category": "React",
    "title": "Estado local y datos del servidor",
    "subtitle": "Un modal abierto y una lista de pedidos necesitan cuidados distintos.",
    "minutes": 12,
    "level": "Senior",
    "theory": "Estado cliente es lo que decide la interfaz: abrir un modal, un borrador o una pestaña. Estado del servidor es una copia local de datos que otra persona puede cambiar: pedidos o existencias. Guardarlo con useState no resuelve por sí solo carga, error, caché y sincronización. Una query key identifica qué dato guardas: incluye usuario y filtros relevantes. La caché permite reutilizarlo; stale significa que podría estar desactualizado, no que se borre. staleTime establece cuánto se considera fresco. Refetch vuelve a pedirlo; invalidar marca lo guardado para actualizarlo según la configuración. La deduplicación puede compartir una petición en curso para la misma clave. TanStack Query o SWR reúnen estas tareas; no hace falta añadirlos a una página estática sin datos remotos. Tras una edición, actualiza o invalida las consultas afectadas. Una UI optimista muestra el cambio antes de la confirmación: si falla, recupera un estado coherente y avisa. En cambios simultáneos, un rollback ciego puede borrar una edición más reciente: serializa por elemento o controla versiones. Al cerrar sesión, elimina datos privados de la caché.",
    "example": "// TanStack Query, dentro de una app con QueryClientProvider.\nconst pedidos = useQuery({\n  queryKey: [\"pedidos\", usuarioId, filtro],\n  queryFn: async ({ signal }) => {\n    const r = await fetch(`/api/pedidos?usuario=${encodeURIComponent(usuarioId)}&filtro=${encodeURIComponent(filtro)}`, { signal });\n    if (!r.ok) throw new Error(\"No se pudieron cargar los pedidos\");\n    return r.json();\n  },\n  staleTime: 30_000\n});\n// Tras guardar con éxito:\nawait queryClient.invalidateQueries({ queryKey: [\"pedidos\", usuarioId] });\n// También representa carga inicial, error, vacío y actualización en segundo plano.",
    "takeaway": "Explica quién es dueño del dato, cómo identificas su copia y cuándo vuelves a consultar. La caché del navegador no reemplaza los permisos del servidor.",
    "source": "https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults",
    "questions": [
      {
        "q": "¿Qué es estado del servidor?",
        "choices": [
          "Si el modal está abierto",
          "La lista de pedidos obtenida de la API",
          "El foco del input"
        ],
        "answer": 1,
        "why": "Los pedidos viven fuera de la interfaz y pueden cambiar sin que esta lo sepa."
      },
      {
        "q": "Dos usuarios usan la misma query key para pedidos distintos. ¿Qué falta?",
        "choices": [
          "Una identidad del usuario en la clave y limpieza al salir",
          "Más useMemo",
          "Quitar el estado de carga"
        ],
        "answer": 0,
        "why": "La clave debe distinguir cada conjunto de datos. Además, el servidor siempre valida permisos."
      },
      {
        "q": "¿Qué significa que los datos estén stale?",
        "choices": [
          "Que la caché ya desapareció",
          "Que podrían necesitar una actualización",
          "Que la API ha fallado"
        ],
        "answer": 1,
        "why": "Pueden seguir visibles mientras se solicita una versión reciente; la política de recarga se configura."
      }
    ]
  },
  {
    "id": "react-effect-decisions",
    "icon": "⚛",
    "category": "React",
    "title": "useEffect sin bucles ni respuestas antiguas",
    "subtitle": "Sincroniza algo externo y limpia lo que hayas iniciado.",
    "minutes": 12,
    "level": "Senior",
    "theory": "Un Effect conecta React con algo externo: una suscripción, un temporizador o una petición. Si puedes calcular un valor a partir de props y estado, calcúlalo durante render; guardar ese resultado con otro setState añade trabajo y posibles desajustes. Una compra que nace de un clic suele pertenecer al manejador del clic. Las dependencias incluyen los valores reactivos que usa el Effect: no las ocultes para silenciar el linter. Un objeto o función nuevo en cada render cambia su identidad. Si el Effect depende de ese objeto y cambia estado, puedes crear un bucle. Mueve la construcción dentro del Effect y depende de los valores necesarios. La limpieza se ejecuta antes de volver a sincronizar por cambios y al desmontar. En desarrollo, Strict Mode puede hacer setup, cleanup y setup: el código debe soportarlo. Para red, cancela la petición anterior y evita aplicar resultados obsoletos. Una closure conserva los valores del render en que se creó: usa dependencias correctas o actualización funcional si necesitas el estado anterior.",
    "example": "useEffect(() => {\n  const controller = new AbortController();\n  let active = true;\n  setLoading(true);\n  setError(null);\n  setRows([]);\n  async function load() {\n    try {\n      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });\n      if (!r.ok) throw new Error(\"La búsqueda ha fallado\");\n      const rows = await r.json();\n      if (active) setRows(rows);\n    } catch (error) {\n      if (active && error.name !== \"AbortError\") setError(error.message);\n    } finally {\n      if (active) setLoading(false);\n    }\n  }\n  load();\n  return () => { active = false; controller.abort(); };\n}, [query]);\n// Fragmento dentro de un componente con query, rows, error y loading.\n// Una librería de datos evita repetir esta lógica en cada pantalla.",
    "takeaway": "Antes de escribir un Effect, nombra el sistema externo. Después explica dependencias, limpieza, carreras de respuestas y estados de error.",
    "source": "https://react.dev/reference/react/useEffect",
    "questions": [
      {
        "q": "Quieres mostrar nombre + apellido. ¿Necesitas un Effect que guarde nombreCompleto?",
        "choices": [
          "No, puedes calcularlo durante render",
          "Sí, siempre",
          "Solo si hay espacios"
        ],
        "answer": 0,
        "why": "Es un dato derivado de otros valores; guardar otra copia añade sincronización innecesaria."
      },
      {
        "q": "El Effect depende de options = {} creado en render y actualiza estado. ¿Qué puede ocurrir?",
        "choices": [
          "Un bucle por identidad nueva en cada render",
          "La caché HTTP lo evita",
          "Nunca volverá a ejecutarse"
        ],
        "answer": 0,
        "why": "El objeto nuevo cambia la dependencia; el Effect actualiza estado y puede reiniciar el ciclo."
      }
    ]
  },
  {
    "id": "react-state-choices",
    "icon": "⚛",
    "category": "React",
    "title": "Elegir dónde vive cada estado",
    "subtitle": "Local, Context, Redux, Zustand y caché remota con un motivo.",
    "minutes": 12,
    "level": "Senior",
    "theory": "Empieza por preguntar quién necesita el dato y quién lo cambia. Un input o modal suele usar estado local. Si dos hermanos comparten una selección, súbela al antecesor común más cercano. Context distribuye un valor sin pasarlo por todos los componentes intermedios; no es por sí solo una caché ni una forma automática de evitar renders. Para tema visual o dependencias compartidas suele bastar. Un valor de Provider nuevo actualiza a sus consumidores; separar contextos puede reducir el alcance. Redux Toolkit ofrece convenciones, herramientas de depuración y actualizaciones explícitas para estado compartido complejo. Zustand permite un store externo con una API pequeña y selectores; aun así hay que diseñar responsabilidades y suscripciones. Los selectores eligen la parte que necesita cada componente. TanStack Query, SWR o RTK Query gestionan datos remotos y su ciclo de vida. No copies automáticamente esos datos a un segundo store: mantener dos verdades causa errores. Elige con el equipo según complejidad, depuración y coste de mantenimiento, no por tamaño de la empresa.",
    "example": "// Reparto posible para una tienda:\n// Modal abierto -> useState en el componente que lo usa.\n// Filtro compartible -> URL (puedes enviar el enlace).\n// Tema visual -> Context.\n// Editor con muchos pasos y acciones -> reducer o store compartido.\n// Catálogo/precio/existencias -> caché de consultas remotas.\n// Total visible -> cálculo desde los datos; no otra copia de estado.",
    "takeaway": "En entrevista, dibuja los dueños de tres datos concretos y justifica cada elección. Una app grande puede combinar varias soluciones.",
    "source": "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
    "questions": [
      {
        "q": "Solo un formulario necesita su borrador. ¿Dónde empiezas?",
        "choices": [
          "En estado local",
          "Siempre en Redux",
          "Siempre en una caché HTTP"
        ],
        "answer": 0,
        "why": "El alcance local evita añadir dependencias y actualizaciones globales sin necesidad."
      },
      {
        "q": "Ya tienes pedidos en una caché de consultas. ¿Los copias siempre a Redux?",
        "choices": [
          "Sí, todo dato debe duplicarse",
          "No: duplicar exige sincronizar dos fuentes",
          "Sí, para que useEffect funcione"
        ],
        "answer": 1,
        "why": "Mantén un dueño claro; solo añade otra representación si existe una necesidad explícita y una estrategia de sincronización."
      }
    ]
  },
  {
    "id": "react-feature-architecture",
    "icon": "⚛",
    "category": "React",
    "title": "Organizar React por funcionalidades",
    "subtitle": "Encuentra dónde cambiar pedidos sin recorrer todo el proyecto.",
    "minutes": 12,
    "level": "Senior",
    "theory": "Agrupar por funcionalidad junta lo que cambia por el mismo motivo: pedidos, perfil o pagos. Dentro de cada área puedes separar interfaz, acceso a la API y lógica de dominio. Una capa API se ocupa de HTTP y transforma errores; un hook conecta datos y estados de carga; un componente presenta la información y recibe acciones. Shared contiene piezas realmente compartidas, como Button o Dialog, no toda pieza nueva. Define una interfaz pública para cada área y evita dependencias circulares. No conviertas un componente pequeño en diez archivos por obligación. Añade límites cuando ayuden a entender, probar o cambiar algo. Sitúa recuperación de errores cerca de la sección afectada y centraliza las políticas repetidas de peticiones. Prueba funciones de negocio con tests unitarios, colaboración de componentes con integración y los recorridos críticos con pruebas end-to-end. Incluye carga, vacío, fallo, teclado y permisos; no basta con una captura del caso feliz.",
    "example": "// Estructura de ejemplo; no es una regla universal.\nsrc/app/routes.jsx\nsrc/features/orders/api.js\nsrc/features/orders/useOrders.js\nsrc/features/orders/OrdersPage.jsx\nsrc/features/orders/OrdersPage.test.jsx\nsrc/features/orders/index.js\nsrc/shared/ui/Button.jsx\nsrc/shared/ui/Dialog.jsx\n// api.js: HTTP y errores.\n// useOrders.js: consultas y acciones del caso de uso.\n// OrdersPage: carga, error, vacío, lista e interacción.\n// index.js: lo que otras áreas pueden importar.",
    "takeaway": "Justifica la estructura con un cambio: añadir cancelación de pedidos debe tocar una zona predecible y tener una prueba del recorrido.",
    "source": "https://react.dev/learn/thinking-in-react",
    "questions": [
      {
        "q": "¿Qué pondrías en shared?",
        "choices": [
          "Todo componente recién creado",
          "Piezas reutilizadas con una responsabilidad clara",
          "El estado privado de pedidos"
        ],
        "answer": 1,
        "why": "Shared es para elementos realmente comunes; mover todo allí diluye los límites."
      },
      {
        "q": "¿Qué prueba cubre buscar un pedido y mostrar un error de API?",
        "choices": [
          "Una prueba de integración de la interacción y el fallo",
          "Solo una prueba del color del botón",
          "Solo comprobar el nombre del archivo"
        ],
        "answer": 0,
        "why": "El comportamiento depende de campo, petición y respuesta visible trabajando juntos."
      }
    ]
  },
  {
    "id": "react-scale-observability",
    "icon": "⚛",
    "category": "React",
    "title": "React rápido con muchos usuarios",
    "subtitle": "Elige cómo servir, guardar y medir cada parte.",
    "minutes": 12,
    "level": "Senior",
    "theory": "Primero aclara tráfico simultáneo, dispositivos, regiones, privacidad y cuánto pueden envejecer los datos. Un millón de visitas al mes no equivale a un millón al mismo tiempo. SSG prepara HTML antes de la visita: sirve bien contenido público que cambia poco, con una política de regeneración. SSR genera HTML en el servidor para la petición: facilita contenido inicial actualizado, pero añade trabajo y latencia de servidor. CSR calcula la interfaz en el navegador; puede encajar en paneles privados, vigilando cuánto JS hay que descargar. Puedes combinarlos. Una CDN acerca archivos o respuestas cacheables; nunca compartas datos privados entre usuarios con una clave de caché incorrecta. Usa nombres versionados para archivos y decide cómo invalidar contenido. Divide bundles por rutas, carga lo secundario bajo demanda y revisa dependencias pesadas con un analizador. Virtualiza listas grandes si el DOM es el cuello de botella, manteniendo accesibilidad. Optimiza APIs con paginación y evita cascadas de peticiones. Observa usuarios reales: LCP mide carga del contenido principal, INP respuesta a interacciones y CLS estabilidad visual. Revisa el percentil 75 por dispositivo y ruta; orientativamente, buenos valores son LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1. Combina estas señales con errores, latencia de API y versión desplegada. Compara antes y después y prepara cómo revertir una regresión.",
    "example": "// Plan para una tienda:\n// Guía pública -> HTML estático + CDN + actualización al publicar.\n// Ficha de producto -> estrategia según frescura; stock final validado por API.\n// Mi cuenta -> datos privados, autenticación y permisos del servidor.\n// Informe pesado -> módulo bajo demanda.\n// Medición -> LCP/INP/CLS por ruta, móvil y versión + errores y API.\n// Prueba -> red lenta, móvil modesto, caché fría/caliente y fallo del backend.",
    "takeaway": "No prometas escalar por usar React.memo: relaciona cada cuello de botella con una medida, una solución, su coste y una forma de revertirla.",
    "source": "https://web.dev/articles/vitals",
    "questions": [
      {
        "q": "¿Qué contenido es buen candidato para HTML estático con CDN?",
        "choices": [
          "Una guía pública que cambia poco",
          "El saldo privado de todos con la misma caché",
          "Cualquier dato sin revisar permisos"
        ],
        "answer": 0,
        "why": "El contenido público reutilizable aprovecha la caché; define cómo actualizarlo al cambiar."
      },
      {
        "q": "Lighthouse local va bien pero usuarios móviles sufren. ¿Qué añades?",
        "choices": [
          "Medición de usuarios reales por ruta y dispositivo",
          "Solo más useMemo",
          "Quitar los logs de errores"
        ],
        "answer": 0,
        "why": "El laboratorio no representa todas las redes y equipos; necesitas señales de producción para encontrar el segmento afectado."
      }
    ]
  }
]);
Object.assign(window.BEGINNER, {
  "react-render-causes": {
    "plain": "Un render vuelve a calcular cómo debe verse una parte de la pantalla. No siempre cambia lo que ves.",
    "analogy": "Si corriges una línea de un plano, primero revisas el dibujo y luego construyes solo lo que cambió.",
    "steps": "Localiza el setState. Sigue padres e hijos. Revisa Context. Mide antes y después de mover estado o memoizar."
  },
  "react-server-state": {
    "plain": "Un modal lo controlas tú. Los pedidos viven en el servidor y tu pantalla muestra una copia que puede quedarse antigua.",
    "analogy": "La caché es una foto de la carta del restaurante: puedes consultarla rápido, pero debes comprobar si cambiaron los precios.",
    "steps": "Separa datos remotos de controles de pantalla. Define claves. Decide frescura. Tras guardar, actualiza la copia o pide otra. Prueba errores."
  },
  "react-effect-decisions": {
    "plain": "El Effect mantiene una conexión con algo de fuera de React. Cuando ya no sirve, hay que cerrarla.",
    "analogy": "Al cambiar de emisora, dejas de escuchar la anterior. Si sigue sonando, oirás dos canciones mezcladas.",
    "steps": "Comprueba si necesitas el Effect. Declara las dependencias. Limpia la conexión anterior. Prueba respuestas en orden inverso."
  },
  "react-state-choices": {
    "plain": "No todas las cosas deben guardarse en el mismo cajón: cada dato necesita vivir donde se use y se mantenga bien.",
    "analogy": "Un borrador va en tu mesa; un calendario compartido, en la pared; la cuenta bancaria se consulta al banco.",
    "steps": "Lista los datos. Señala quién los lee, quién los cambia y si vienen del servidor. Elige la solución más sencilla que cubra cada caso."
  },
  "react-feature-architecture": {
    "plain": "Organiza juntas las piezas de una misma función de la app y separa tareas cuando eso facilite entenderlas.",
    "analogy": "En una cocina, los utensilios para preparar café están cerca. No buscas cada pieza en un edificio distinto.",
    "steps": "Elige una funcionalidad. Separa red, lógica y presentación cuando ayude. Define cómo se usa desde fuera. Prueba un cambio completo."
  },
  "react-scale-observability": {
    "plain": "La rapidez depende del viaje completo: servidor, red, código descargado y trabajo para dibujar.",
    "analogy": "Un restaurante lleno necesita cocina, reparto y mesas bien organizados; cambiar solo las sillas no arregla las colas.",
    "steps": "Define la carga y frescura. Elige renderizado y caché por pantalla. Mide usuarios reales. Cambia un cuello de botella y compara."
  }
});
window.INTERVIEW_WORKSHOPS.push({
  "id": "react-senior-practice",
  "icon": "⚛",
  "title": "Detectives de React",
  "summary": "Renders, efectos y caché: diagnostica el fallo, elige una solución y explica sus límites.",
  "cases": [
    {
      "id": "favorito-cache",
      "title": "El favorito que falla al guardar",
      "time": "15 min",
      "brief": "La estrella cambia al pulsar, pero la API falla. Dos pantallas muestran el mismo pedido. Diseña una recuperación coherente y evita que un doble clic deshaga el cambio más reciente.",
      "before": "// Problema: cada pantalla mantiene su copia y el error no se recupera.\nsetFavorite(true);\nawait guardarFavorito(id);",
      "checks": [
        "Identifico un dueño para la copia del servidor.",
        "Guardo el valor anterior y muestro el error.",
        "Impido cambios simultáneos por pedido o controlo versiones.",
        "Revalido las consultas afectadas."
      ],
      "steps": [
        {
          "q": "¿Dónde deben leer las dos pantallas?",
          "choices": [
            "De una caché compartida con la misma identidad del pedido",
            "De dos copias independientes sin sincronizar",
            "De un booleano global para todos los pedidos"
          ],
          "answer": 0,
          "why": "La identidad compartida permite mostrar una actualización consistente."
        },
        {
          "q": "Si falla la operación, ¿qué necesitas?",
          "choices": [
            "Recuperar un estado coherente y explicar el error",
            "Ocultar el fallo",
            "Dejar la estrella confirmada"
          ],
          "answer": 0,
          "why": "Una actualización optimista es provisional: el fallo debe reflejarse."
        },
        {
          "q": "¿Qué evita que un rollback antiguo pise un clic más reciente?",
          "choices": [
            "Bloquear temporalmente esa acción por pedido o controlar versiones",
            "Guardar cualquier snapshot sin comprobar nada",
            "Usar key aleatoria"
          ],
          "answer": 0,
          "why": "Serializar simplifica el caso; permitir concurrencia exige reconciliar qué operación sigue vigente."
        }
      ],
      "answer": "Usaría una caché compartida, cancelaría recargas que puedan pisar la actualización, guardaría el valor anterior y aplicaría la estrella provisional. Para este reto deshabilitaría nuevos cambios del mismo pedido hasta terminar. Si falla, restauraría y mostraría un aviso; al terminar, revalidaría. Probaría éxito, fallo, doble clic y dos pantallas abiertas.",
      "after": "// Pseudocódigo: una operación a la vez por pedido.\nsi hay operación pendiente: no iniciar otra\ncancelar recargas del pedido\nguardar snapshot\naplicar favorito provisional\nintentar guardar en servidor\nsi falla: restaurar snapshot y mostrar error\nal terminar: revalidar pedido/listas y desbloquear",
      "source": "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates"
    },
    {
      "id": "render-detective",
      "title": "Escribir vuelve a calcular toda la página",
      "time": "15 min",
      "brief": "El input vive en la página principal. Cada tecla vuelve a calcular un informe caro y un Context reparte un objeto nuevo. Razona qué optimizarías primero.",
      "before": "function Page() {\n  const [text, setText] = useState(\"\");\n  return <Settings.Provider value={{theme: \"dark\"}}>\n    <input value={text} onChange={e => setText(e.target.value)} />\n    <ExpensiveReport />\n  </Settings.Provider>;\n}",
      "checks": [
        "Distingo render de cambio en DOM.",
        "Localizo estado y consumidores del Context.",
        "Mido el informe antes y después."
      ],
      "steps": [
        {
          "q": "¿Qué inicia el recorrido en este caso?",
          "choices": [
            "setText en Page",
            "El CSS del input",
            "Una key estable"
          ],
          "answer": 0,
          "why": "Cada tecla actualiza al padre y normalmente su subárbol."
        },
        {
          "q": "Solo el buscador necesita text. ¿Qué cambio ayuda a aislarlo?",
          "choices": [
            "Mover text a un componente Buscador",
            "Subirlo a otro Context global",
            "Guardar las teclas en una ref sin actualizar el input"
          ],
          "answer": 0,
          "why": "La actualización local deja de empezar en Page."
        },
        {
          "q": "Si el informe usa Context, ¿memo basta para ignorar cambios de su valor?",
          "choices": [
            "No, revisa Provider y qué datos consume",
            "Sí, congela cualquier actualización",
            "Sí, con cualquier objeto nuevo"
          ],
          "answer": 0,
          "why": "Las suscripciones a Context pueden actualizar al consumidor aunque esté memorizado."
        }
      ],
      "answer": "Perfilaría una pulsación, movería el estado del input a Buscador y revisaría el alcance e identidad del Provider. Si sigue habiendo trabajo caro, optimizaría el informe con datos estables y mediría el mismo recorrido. No necesito impedir todos los renders, sino resolver el retraso.",
      "after": "function Page() {\n  return <><Buscador /><ExpensiveReport /></>;\n}\n// Buscador conserva su propio estado.\n// Settings vive en un límite adecuado; su valor solo cambia cuando corresponde.",
      "source": "https://react.dev/reference/react/memo"
    },
    {
      "id": "effect-detective",
      "title": "La búsqueda entra en bucle",
      "time": "15 min",
      "brief": "El componente crea options en cada render. El Effect descarga resultados y los guarda en estado. A veces nunca deja de pedir datos; al cambiar la búsqueda, llega una respuesta vieja.",
      "before": "const options = { query };\nuseEffect(() => {\n  fetch(\"/api/search?q=\" + options.query)\n    .then(r => r.json()).then(setRows);\n}, [options]);",
      "checks": [
        "Identifico la nueva referencia y el setState que cierra el bucle.",
        "Mantengo la dependencia query.",
        "Limpio y cancelo, sin mostrar AbortError como fallo.",
        "Pruebo error HTTP y respuestas invertidas."
      ],
      "steps": [
        {
          "q": "¿Por qué options vuelve a activar el Effect?",
          "choices": [
            "Es un objeto nuevo en cada render",
            "Los objetos son siempre iguales",
            "fetch cambia query automáticamente"
          ],
          "answer": 0,
          "why": "La identidad de la dependencia cambia aunque su contenido sea igual."
        },
        {
          "q": "¿Cuál es una reparación apropiada?",
          "choices": [
            "Usar query dentro del Effect y depender de query",
            "Eliminar todas las dependencias",
            "Cambiar useEffect por useMemo para hacer fetch"
          ],
          "answer": 0,
          "why": "Mantienes la sincronización con el dato real sin depender de un contenedor nuevo."
        },
        {
          "q": "¿Cómo verificas la carrera de respuestas?",
          "choices": [
            "Hacer que la primera búsqueda termine después de la segunda",
            "Probar solo una búsqueda rápida",
            "Contar líneas del componente"
          ],
          "answer": 0,
          "why": "Ese orden reproduce el fallo que puede sobrescribir resultados recientes."
        }
      ],
      "answer": "Dependería de query y construiría la URL dentro del Effect. Añadiría AbortController, una marca de vigencia, validación de r.ok y estados de carga/error. La limpieza invalida el resultado anterior. La lección useEffect sin bucles contiene el ejemplo completo.",
      "after": "// Esquema; completa con carga, r.ok y catch de la lección.\nuseEffect(() => {\n  // iniciar búsqueda con query y AbortController\n  // aplicar resultado solo si sigue vigente\n  return () => { /* invalidar y abortar */ };\n}, [query]);",
      "source": "https://react.dev/reference/react/useEffect"
    }
  ]
});
window.REACT_ORAL_INTERVIEW = [
  {
    "topic": "Renders",
    "prompt": "Un hijo renderiza aunque sus props no cambien. ¿Por qué y cuándo actuarías?",
    "answer": "Puede seguir al render de su padre, actualizar estado propio o recibir un nuevo valor de Context. Render calcula la interfaz; no implica rehacer todo el DOM. Mediría la interacción y acercaría el estado a quien lo usa. Solo añadiría memo si evita trabajo significativo; tiene coste y no bloquea Context ni estado propio. En un buscador aislaría el input del informe caro.",
    "lesson": "react-render-causes",
    "check": [
      "Distinguí padre, estado y Context.",
      "Separé render y DOM.",
      "Expliqué un cambio medible y cuándo no optimizar."
    ]
  },
  {
    "topic": "Memoización",
    "prompt": "Compara useMemo, useCallback y React.memo. ¿Cuándo pueden empeorar el código?",
    "answer": "useMemo conserva un resultado de cálculo, useCallback una referencia a función y memo puede saltar el render de un componente con props iguales. Ayudan cuando evitan trabajo medido; comparar y conservar resultados cuesta. Una dependencia objeto nueva anula la reutilización. No los usaría por rutina en cálculos baratos. En una tabla mediría el filtro y el render antes y después.",
    "lesson": "memo-cost",
    "check": [
      "Diferencié las tres herramientas.",
      "Mencioné identidad de dependencias y coste.",
      "Propuse un caso concreto y una medición."
    ]
  },
  {
    "topic": "Reconciliación",
    "prompt": "¿Cómo decide React qué cambia y qué estado conserva?",
    "answer": "Calcula el siguiente árbol y compara su estructura con la anterior. La identidad depende del tipo y de la posición, con keys para distinguir hermanos. Aplica al DOM los cambios necesarios. Cambiar tipo o key puede reiniciar estado; no cambiaría keys para forzar rendimiento. Usaría una key de persona al reiniciar intencionalmente un formulario al cambiar de cuenta.",
    "lesson": "react-identity",
    "check": [
      "Expliqué cálculo y cambios en DOM.",
      "Relacioné tipo, posición y key con estado.",
      "Di un caso donde reiniciar es intencional."
    ]
  },
  {
    "topic": "Keys",
    "prompt": "Editas una fila y al borrar la anterior el texto aparece en otra. ¿Qué pasó?",
    "answer": "Probablemente las filas usan el índice como key. Tras borrar, la misma posición identifica otro dato y React puede conservar el estado del componente equivocado. Usaría un id estable, no Math.random. El índice solo sería razonable si la lista nunca cambia de orden ni se inserta o borra. Probaría escribir, insertar, borrar y ordenar.",
    "lesson": "react-identity",
    "check": [
      "Expliqué el vínculo entre key y estado.",
      "Elegí una identidad estable.",
      "Probé cambios de la lista y expliqué el límite del índice."
    ]
  },
  {
    "topic": "Diagnóstico de rendimiento",
    "prompt": "La app tarda ocho segundos. ¿Por dónde empiezas y cómo eliges una solución?",
    "answer": "Reproduciría en un equipo y red representativos. Separaría Network, tareas de JS y dibujo con Performance, y renders de React con Profiler. Revisaría bundles y cascadas de API. Según el cuello elegiría paginación, virtualización, dividir código o memoización. Cada una tiene costes; no virtualizaría una lista pequeña. Compararía el mismo recorrido y las métricas de usuarios reales.",
    "lesson": "react-debug-tests",
    "check": [
      "Medí antes de proponer cambios.",
      "Separé red, JS y render.",
      "Relacioné una solución con su coste y verificación."
    ]
  },
  {
    "topic": "Elegir estado",
    "prompt": "Diseña el estado de una app grande con formularios, tema visual y pedidos remotos.",
    "answer": "Dejaría borradores y modales locales, elevaría solo lo compartido y usaría Context para el tema. Consideraría Redux Toolkit o Zustand para estado cliente compartido complejo según convenciones y depuración del equipo. Los pedidos irían en una caché de servidor como TanStack Query o RTK Query. Evitaría copiar todo a varios stores. Una app pequeña puede no necesitar un store externo.",
    "lesson": "react-state-choices",
    "check": [
      "Asigné dueño a cada dato.",
      "Diferencié distribución y caché remota.",
      "Justifiqué cuándo no añadir una librería."
    ]
  },
  {
    "topic": "Datos del servidor",
    "prompt": "Dos vistas muestran pedidos. ¿Cómo coordinas caché, frescura y un favorito optimista que falla?",
    "answer": "Usaría claves que incluyan usuario y filtros, y una caché compartida. Configuraría frescura y recargas; stale no significa borrar. La deduplicación puede compartir peticiones en curso con la misma clave. Para el favorito guardaría snapshot, evitaría carreras, aplicaría el cambio y recuperaría ante fallo con aviso. Revalidaría al terminar. En operaciones sensibles preferiría esperar confirmación y no mostrar éxito provisional.",
    "lesson": "react-server-state",
    "check": [
      "Expliqué claves, frescura y peticiones compartidas.",
      "Incluí recuperación y cambios simultáneos.",
      "Expliqué cuándo evitar actualización optimista."
    ]
  },
  {
    "topic": "Effects",
    "prompt": "Un Effect pide datos sin parar y a veces muestra la búsqueda anterior. ¿Cómo lo arreglas?",
    "answer": "Buscaría una dependencia creada de nuevo y un setState que vuelva a activar el ciclo. Usaría dependencias reales, construiría objetos dentro del Effect cuando corresponda y limpiaría cada sincronización. Cancelaría la petición anterior y descartaría respuestas obsoletas; manejaría errores HTTP. No usaría un Effect para calcular un filtro local. Probaría respuestas invertidas y setup/cleanup repetido en desarrollo.",
    "lesson": "react-effect-decisions",
    "check": [
      "Diagnostiqué identidad y ciclo de estado.",
      "Mantuve dependencias y limpieza.",
      "Distinguí efectos necesarios de datos derivados."
    ]
  },
  {
    "topic": "Arquitectura",
    "prompt": "¿Cómo organizarías un proyecto donde varios equipos añaden funcionalidades?",
    "answer": "Agruparía por funcionalidades y definiría interfaces públicas. Separaría red, lógica y presentación donde facilite el cambio, sin fragmentar componentes triviales. Shared tendría piezas realmente comunes. Añadiría recuperación de errores y pruebas unitarias, de integración y de recorridos críticos. Por ejemplo, cancelar un pedido debería concentrarse en pedidos y probar éxito, fallo, permisos y teclado.",
    "lesson": "react-feature-architecture",
    "check": [
      "Propuse límites e interfaces claras.",
      "Expliqué cuándo no abstraer más.",
      "Conecté una modificación real con sus pruebas."
    ]
  },
  {
    "topic": "Escala y producción",
    "prompt": "Tu app debe servir a millones de usuarios. ¿Qué necesitas saber y qué diseñarías?",
    "answer": "Preguntaría concurrencia, regiones, dispositivos, privacidad y frescura. Combinaría SSG para contenido público estable, SSR cuando lo requiera el contenido inicial y CSR para interacciones apropiadas. Definiría CDN, invalidación y protección de datos privados. Mediría bundles, API y LCP/INP/CLS por segmento real, además de errores. Una optimización añade complejidad: la justificaría con un cuello observado y prepararía rollback.",
    "lesson": "react-scale-observability",
    "check": [
      "Aclaré requisitos y carga real.",
      "Relacioné renderizado, CDN y privacidad.",
      "Incluí métricas reales, costes y reversión."
    ]
  }
];
