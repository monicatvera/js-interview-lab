// Contenido original: generadores, Next.js, sesiones y datos masivos.
window.COURSE.push(...[
  {
    "id": "generadores",
    "title": "Generadores: una función con pausa",
    "icon": "JS",
    "category": "Fundamentos",
    "subtitle": "Produce un valor, se pausa y continúa cuando le pides el siguiente.",
    "minutes": 12,
    "level": "Paso a paso",
    "theory": "Una función declarada con function* devuelve un generador. Su método next() entrega un objeto con value (el resultado) y done (si terminó). yield entrega un valor y pausa; return termina. Un for...of recoge los valores de yield, pero no el return final. Es útil para recorrer una secuencia sin crear antes un array completo. No convierte un cálculo pesado en trabajo en segundo plano: cada next() sigue ejecutándose en el mismo hilo. Un generador ya consumido no se reinicia; crea otro llamando de nuevo a la función. yield* delega en otro iterable. Como detalle avanzado, next(valor) envía ese valor a la expresión yield donde quedó pausado; el primer next no tiene una pausa previa a la que enviar nada.",
    "example": "function* turnos() {\n  yield 1;\n  yield 2;\n  return 99;\n}\nconst turno = turnos(); // todavía no ejecuta el cuerpo\nconsole.log(turno.next()); // { value: 1, done: false }\nconsole.log(turno.next()); // { value: 2, done: false }\nconsole.log(turno.next()); // { value: 99, done: true }\nconsole.log([...turnos()]); // [1, 2], no incluye el return",
    "takeaway": "Un generador permite pedir valores poco a poco. Ahorra crear toda una secuencia, pero no es un hilo paralelo.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*",
    "questions": [
      {
        "q": "¿Qué pasa al llamar a turnos() sin usar next()?",
        "choices": [
          "Se ejecutan todos los yield",
          "Se obtiene un generador sin ejecutar su cuerpo",
          "Se crea una Promise"
        ],
        "answer": 1,
        "why": "Llamar a la función crea el generador. next() empieza o reanuda la ejecución."
      },
      {
        "q": "¿Qué recoge [...turnos()] en el ejemplo?",
        "choices": [
          "[1, 2, 99]",
          "[99]",
          "[1, 2]"
        ],
        "answer": 2,
        "why": "La iteración recoge los valores con done: false; return termina con done: true."
      }
    ]
  },
  {
    "id": "next-routers",
    "title": "Next.js: dos formas de organizar las rutas",
    "icon": "↗",
    "category": "Arquitectura",
    "subtitle": "Pages Router usa pages; App Router usa app y separa páginas, layouts y estados de carga.",
    "minutes": 12,
    "level": "Paso a paso",
    "theory": "En Pages Router, pages/productos/index.js representa /productos. Se usan getServerSideProps para obtener datos por petición y getStaticProps para generación estática. En App Router, app/productos/page.js representa esa ruta; layout.js comparte estructura, loading.js presenta una espera y error.js define un límite de errores. Sus páginas y layouts son Server Components por defecto. Un componente que necesita estado interactivo o APIs del navegador establece una frontera con \"use client\". Eso no significa que todo su HTML se genere únicamente en el navegador. En App Router obtienes datos en componentes de servidor y controlas caché y revalidación según tu versión; no traslades getServerSideProps a app. Ambos routers pueden convivir durante una migración, sin definir la misma URL en ambos. No confundas router con estrategia de renderizado: app no significa automáticamente SSR en todas las rutas.",
    "example": "// Pages Router\n// pages/productos/index.jsx\nexport default function Productos() {\n  return <h1>Productos</h1>;\n}\n\n// App Router: alternativa, no la misma URL a la vez\n// app/productos/page.jsx\nexport default function Productos() {\n  return <h1>Productos</h1>;\n}\n// app/productos/layout.jsx comparte UI de esta sección.\n// app/productos/loading.jsx puede mostrar una espera.",
    "takeaway": "Primero identifico el router. En app separo servidor e interacción y uso layouts anidados; no mezclo las APIs de obtención de datos de pages.",
    "source": "https://nextjs.org/docs/app/guides/migrating/app-router-migration",
    "questions": [
      {
        "q": "¿Dónde colocarías /productos en App Router?",
        "choices": [
          "app/productos/page.jsx",
          "pages/productos/layout.jsx",
          "app/productos/getServerSideProps.js"
        ],
        "answer": 0,
        "why": "page.jsx define la página de esa ruta dentro de app."
      },
      {
        "q": "¿Un archivo con \"use client\" significa que ya protege los datos privados?",
        "choices": [
          "Sí, oculta el servidor",
          "No, la seguridad debe comprobarse en el servidor",
          "Sí, si el botón está oculto"
        ],
        "answer": 1,
        "why": "La frontera cliente/servidor organiza ejecución; no sustituye autenticación ni permisos."
      }
    ]
  },
  {
    "id": "next-sesion",
    "title": "Next.js: quién eres y qué puedes hacer",
    "icon": "↗",
    "category": "Arquitectura",
    "subtitle": "Iniciar sesión identifica a la persona. Comprobar permisos decide qué datos puede ver.",
    "minutes": 12,
    "level": "Paso a paso",
    "theory": "Autenticación responde quién eres; autorización responde qué puedes hacer. Usa una solución de autenticación mantenida para gestionar sesiones. En una sesión basada en cookie, HttpOnly impide leerla desde JavaScript y Secure exige HTTPS; SameSite ayuda contra peticiones entre sitios, junto con la protección CSRF adecuada. Un Route Handler o una Server Action debe verificar sesión y permisos antes de leer o modificar datos, aunque la página ya lo haya hecho. Ocultar el botón de borrar no protege su operación. Centraliza comprobaciones cerca del acceso a datos y devuelve solo los campos que necesita la pantalla. Evita cachés compartidas que mezclen datos privados entre usuarios. Al cerrar sesión, invalida la sesión del servidor y retira datos privados de la interfaz. Si una petición antigua termina después, no debe volver a mostrar el perfil anterior.",
    "example": "// Pseudocódigo de servidor: estas funciones las aporta tu app.\nasync function leerPedido(pedidoId) {\n  const session = await verificarSesion();\n  if (!session) throw new Error(\"No autenticado\");\n  // Buscar por pedido Y propietario evita leer el de otra persona.\n  const pedido = await buscarPedido({\n    id: pedidoId, propietarioId: session.userId\n  });\n  if (!pedido) throw new Error(\"No disponible\");\n  return { id: pedido.id, estado: pedido.estado };\n}\n// La operación de editar/borrar debe volver a verificar permisos.",
    "takeaway": "No confío en un userId recibido del navegador para decidir permisos. Verifico la sesión y la propiedad del recurso en cada operación del servidor.",
    "source": "https://nextjs.org/docs/app/guides/authentication",
    "questions": [
      {
        "q": "Una persona cambia /pedido/12 por /pedido/13. ¿Qué protege el dato?",
        "choices": [
          "Ocultar el enlace",
          "Comprobar en servidor si puede acceder al pedido 13",
          "Un estado isLoggedIn en React"
        ],
        "answer": 1,
        "why": "Estar autenticado no da permiso sobre todos los recursos."
      },
      {
        "q": "¿Basta con verificar sesión al mostrar la página?",
        "choices": [
          "Sí, para siempre",
          "Solo si hay Redux",
          "No: también en cada operación protegida"
        ],
        "answer": 2,
        "why": "Una operación se puede invocar directamente; su seguridad no depende de la pantalla."
      }
    ]
  },
  {
    "id": "redux-sesion",
    "title": "Redux: sesión, perfil y cierre de sesión",
    "icon": "JS",
    "category": "React",
    "subtitle": "El estado de la pantalla refleja la sesión; el servidor sigue siendo quien decide los permisos.",
    "minutes": 12,
    "level": "Paso a paso",
    "theory": "Un flujo claro empieza con sesión desconocida mientras consultas al servidor. Después muestra usuario autenticado, invitado o error recuperable. No enseñes por un instante datos del usuario anterior. RTK Query puede gestionar peticiones y caché de perfil y pedidos; un slice puede contener filtros o estado de interfaz. Evita copiar la misma lista en varias partes del store. Una acción describe lo que ocurrió; el reducer actualiza el estado y React vuelve a mostrarlo mediante selectores. Las peticiones van fuera de los reducers. Al salir, invalida sesión en servidor, desuscribe o cancela consultas privadas y limpia caché y slices del usuario. Si cambias de cuenta, usa identidad en las claves apropiadas y descarta respuestas antiguas. resetApiState limpia la caché de RTK Query, pero no revoca una sesión de servidor ni garantiza por sí solo que no se lancen nuevas consultas. No guardes contraseñas en Redux ni trates isAdmin del cliente como permiso real. En Next.js con renderizado de servidor, no compartas un store global entre peticiones de personas distintas.",
    "example": "// Esquema de flujo; no es un login listo para producción.\n// 1. Consultar sesión → loading / authenticated / guest / error.\n// 2. Cargar perfil solo si existe sesión.\n// 3. Al salir, bloquear consultas privadas y cancelar las pendientes.\nawait cerrarSesionEnServidor();\ndispatch(usuarioSalio());        // limpia slices privados\ndispatch(api.util.resetApiState()); // limpia caché de RTK Query\n// Además: descartar respuestas de la sesión antigua y tratar errores.\n// Un booleano en Redux no concede permisos en el backend.",
    "takeaway": "RTK Query conserva datos remotos y Redux puede organizar estado de interfaz. El logout debe limpiar ambos y cerrar la sesión real.",
    "source": "https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics",
    "questions": [
      {
        "q": "¿Dónde ejecutas una petición HTTP?",
        "choices": [
          "Dentro del reducer",
          "Fuera del reducer, por ejemplo con RTK Query",
          "En el selector"
        ],
        "answer": 1,
        "why": "Los reducers calculan estado de forma pura. La petición tiene efectos externos."
      },
      {
        "q": "Ana sale y entra Luis. Una respuesta pendiente de Ana termina después. ¿Qué haces?",
        "choices": [
          "Mostrarla porque es la más reciente en llegar",
          "Guardarla en localStorage",
          "Descartarla si pertenece a la sesión anterior"
        ],
        "answer": 2,
        "why": "La última respuesta en llegar puede corresponder a otra sesión. Cancelar y verificar identidad evita mezclar perfiles."
      }
    ]
  },
  {
    "id": "datos-masivos",
    "title": "300.000 filas sin bloquear la pantalla",
    "icon": "↗",
    "category": "Arquitectura",
    "subtitle": "Pide pocos datos y dibuja pocas filas: son dos problemas distintos.",
    "minutes": 12,
    "level": "Paso a paso",
    "theory": "Paginación limita cuántos registros recibes por petición. Virtualización mantiene en el DOM solo las filas visibles y un pequeño margen. La segunda no evita descargar 300.000 registros si tu API sigue devolviéndolos todos. Diseña la API con búsqueda, filtros, orden estable y límite máximo; un cursor ayuda a continuar grandes listas, según cómo cambien los datos. Al cambiar filtro u orden reinicia la paginación y descarta respuestas antiguas. No acumules infinitas páginas en memoria. Cargar componentes de forma diferida reduce JavaScript inicial, pero no sustituye paginar datos. Si solo puedes recibir un JSON enorme, reconoce el límite: un Worker puede ayudar con cálculos, pero no elimina transferencia ni memoria. Propón adaptar el contrato o una exportación del servidor para quien necesite todo. Mide en un dispositivo modesto y comprueba selección, foco, lector de pantalla y navegación entre páginas. Una tabla paginada sencilla puede ser mejor que una virtualización compleja.",
    "example": "// Contrato ilustrativo; requiere soporte del servidor.\nGET /api/pedidos?estado=pendiente&limit=50&cursor=abc\n// Respuesta:\n{ items: [/* hasta 50 pedidos */], nextCursor: \"def\" }\n\n// Si cambia estado u orden:\n// - cancelar/ignorar la petición anterior;\n// - borrar el cursor anterior;\n// - pedir la primera página del nuevo filtro.\n// Para exportar todo: generar el archivo en el servidor.",
    "takeaway": "Primero reduzco lo que viaja por la red. Después reduzco lo que React pinta. Mido ambas mejoras por separado.",
    "source": "https://web.dev/articles/virtualize-long-lists-react-window",
    "questions": [
      {
        "q": "Virtualizas una tabla pero descargas 300.000 filas. ¿Qué sigue pendiente?",
        "choices": [
          "Nada",
          "El coste de red y memoria de todos esos datos",
          "Añadir más div"
        ],
        "answer": 1,
        "why": "La virtualización reduce DOM, no el tamaño de la respuesta del servidor."
      },
      {
        "q": "Cambias un filtro mientras carga una página. ¿Cómo evitas mezclar resultados?",
        "choices": [
          "Reutilizar siempre el cursor",
          "Añadir todas las respuestas",
          "Reiniciar cursor e ignorar respuestas del filtro anterior"
        ],
        "answer": 2,
        "why": "Un cursor pertenece a una consulta concreta. No debes mezclar páginas de consultas diferentes."
      }
    ]
  },
  {
    "id": "api-cifrado",
    "title": "API segura: qué protege el cifrado",
    "icon": "↗",
    "category": "Arquitectura",
    "subtitle": "HTTPS protege el viaje de los datos. Los permisos protegen quién puede obtenerlos.",
    "minutes": 12,
    "level": "Paso a paso",
    "theory": "HTTPS cifra el tráfico entre los extremos de la conexión TLS y ayuda a autenticar al servidor. No oculta una respuesta a la persona que la recibe en su propio navegador. No envíes un campo secreto pensando que React lo esconderá. Una clave secreta incluida en el bundle del frontend puede ser recuperada: una variable de entorno pública no la protege. Base64 es una codificación reversible, no cifrado. El cifrado adicional de aplicación puede tener sentido por requisitos específicos, como un diseño de extremo a extremo, pero exige decidir quién posee las claves, cómo se verifican, rotan y recuperan. No inventes un protocolo criptográfico. Cifrar no sustituye validar entradas, autorizar cada recurso, limitar datos y evitar secretos en URL o logs. Para una API externa que exige una clave privada, mantenla en un servidor que valide las solicitudes; no la entregues al navegador.",
    "example": "// El navegador solo recibe los datos que puede conocer.\nconst response = await fetch(\"/api/mi-perfil\", {\n  credentials: \"same-origin\"\n});\nif (!response.ok) throw new Error(\"No se pudo cargar el perfil\");\nconst perfil = await response.json();\n// El servidor verifica sesión y devuelve campos permitidos.\n// NO: enviar contraseña y ocultarla con CSS.\n// NO: incluir una clave privada en código frontend.\n// NO: presentar btoa(texto) como cifrado.",
    "takeaway": "Pregunto contra qué amenaza queremos protegernos. Uso HTTPS y permisos en servidor; una clave dentro del frontend no es un secreto.",
    "source": "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html",
    "questions": [
      {
        "q": "¿Base64 protege un dato confidencial?",
        "choices": [
          "Sí, lo cifra",
          "No, es una codificación reversible",
          "Sí, si la cadena es larga"
        ],
        "answer": 1,
        "why": "No requiere una clave para recuperar el texto original."
      },
      {
        "q": "¿Dónde guardas una clave privada de una API externa?",
        "choices": [
          "En una variable pública del frontend",
          "En el HTML oculto",
          "En un servidor que controle su uso"
        ],
        "answer": 2,
        "why": "Todo secreto entregado al navegador debe considerarse accesible para su usuario."
      }
    ]
  }
]);
Object.assign(window.BEGINNER, {
  "generadores": {
    "plain": "Produce un valor, se pausa y continúa cuando le pides el siguiente.",
    "analogy": "Una máquina de turnos te da un número al pulsar el botón. No imprime de golpe todos los números del día.",
    "steps": "1. Crear el generador no ejecuta su cuerpo. 2. next() lo lleva hasta yield. 3. Otro next() continúa desde esa pausa. 4. return termina con done: true."
  },
  "next-routers": {
    "plain": "Pages Router usa pages; App Router usa app y separa páginas, layouts y estados de carga.",
    "analogy": "Las rutas son habitaciones de una casa. Un layout es la estructura compartida: por ejemplo, el menú que rodea varias habitaciones.",
    "steps": "1. Mira si el proyecto usa pages o app. 2. Localiza la página y su layout. 3. Decide qué necesita servidor y qué necesita interacción. 4. Usa las APIs de ese router."
  },
  "next-sesion": {
    "plain": "Iniciar sesión identifica a la persona. Comprobar permisos decide qué datos puede ver.",
    "analogy": "La recepción comprueba tu identidad; la llave solo abre tu habitación. Entrar al hotel no da permiso para entrar en todas.",
    "steps": "1. Verifica la sesión en servidor. 2. Comprueba acceso al recurso concreto. 3. Envía solo los campos necesarios. 4. Repite la comprobación al modificar datos."
  },
  "redux-sesion": {
    "plain": "El estado de la pantalla refleja la sesión; el servidor sigue siendo quien decide los permisos.",
    "analogy": "Redux es el panel de recepción: muestra quién está alojado. Cambiar el nombre del panel no crea una reserva real.",
    "steps": "1. Separa datos remotos de estado de interfaz. 2. Representa carga, éxito y error. 3. Al salir, invalida sesión y limpia datos privados. 4. Descarta respuestas de la sesión anterior."
  },
  "datos-masivos": {
    "plain": "Pide pocos datos y dibuja pocas filas: son dos problemas distintos.",
    "analogy": "En una biblioteca no llevas todos los libros a la mesa. Pides un lote y abres solo los que necesitas leer.",
    "steps": "1. Mide red, memoria y renderizado. 2. Filtra y ordena en servidor. 3. Pide páginas o cursores. 4. Virtualiza si aún hay muchas filas visibles. 5. Prueba carga, error y teclado."
  },
  "api-cifrado": {
    "plain": "HTTPS protege el viaje de los datos. Los permisos protegen quién puede obtenerlos.",
    "analogy": "Un sobre cerrado protege la carta durante el envío. Aun así, debes comprobar que se la entregas a la persona correcta.",
    "steps": "1. Define de quién quieres proteger el dato. 2. Usa HTTPS. 3. Comprueba permisos en servidor. 4. Reduce datos enviados y registros. 5. Añade cifrado de aplicación solo con un requisito concreto."
  }
});
window.OUTPUT_CHALLENGES.push(...[
  {
    "id": "generador-pausa",
    "topicId": "generadores",
    "title": "¿Cuándo empieza el generador?",
    "level": "Calentamiento",
    "code": "function* pasos() {\n  console.log(\"A\");\n  yield 7;\n  console.log(\"B\");\n}\nconst it = pasos();\nconsole.log(\"inicio\");\nconsole.log(it.next().value);\nconsole.log(it.next().done);",
    "output": [
      "inicio",
      "A",
      "7",
      "B",
      "true"
    ],
    "reasons": [
      "Crear it todavía no ejecutó el cuerpo.",
      "El primer next entra en la función.",
      "yield entrega 7 y pausa.",
      "El segundo next continúa tras yield.",
      "La función acaba y done pasa a true."
    ],
    "lesson": "Crear no es ejecutar. next avanza hasta la siguiente pausa o hasta el final."
  },
  {
    "id": "generador-return",
    "topicId": "generadores",
    "title": "yield y return no se recogen igual",
    "level": "Un paso más",
    "code": "function* numeros() {\n  yield 1;\n  yield* [2, 3];\n  return 4;\n}\nconsole.log([...numeros()].join(\",\"));\nconst it = numeros();\nit.next(); it.next(); it.next();\nconsole.log(it.next().value);\nconsole.log(it.next().done);",
    "output": [
      "1,2,3",
      "4",
      "true"
    ],
    "reasons": [
      "Spread recoge los yield, incluidos los delegados con yield*, pero excluye return.",
      "En este nuevo generador, el cuarto next llega al return 4.",
      "Después de terminar, done sigue siendo true."
    ],
    "lesson": "El return sí está en el resultado de next, pero no forma parte de los valores de un for...of o spread."
  }
]);
window.INTERVIEW_WORKSHOPS.push({
  "id": "sesiones-datos",
  "icon": "↗",
  "title": "Sesiones y grandes volúmenes",
  "summary": "Diseña una sesión segura, una tabla fluida y una API que no revele datos ajenos.",
  "cases": [
    {
      "id": "tabla-300k",
      "title": "La API devuelve 300.000 registros",
      "time": "15 min",
      "brief": "La lista tarda en cargar y el scroll se atasca. Te proponen añadir React.memo a todas las filas. Decide qué cambiarías y cómo lo comprobarías.",
      "before": "Descarga: 300.000 filas → JSON enorme → 300.000 nodos\nObjetivo: búsqueda, orden y navegación fluidos en móvil.",
      "steps": [
        {
          "q": "¿Por dónde empiezas?",
          "choices": [
            "Añadir memo sin medir",
            "Medir por separado transferencia, parseo, memoria y render",
            "Aumentar el z-index"
          ],
          "answer": 1,
          "why": "Necesitas saber dónde se pierde el tiempo. Puede haber más de un cuello de botella."
        },
        {
          "q": "La red descarga un JSON enorme. ¿Qué cambio ataca ese coste?",
          "choices": [
            "Virtualizar divs",
            "Cambiar la fuente",
            "Filtrar y paginar en servidor con un límite"
          ],
          "answer": 2,
          "why": "Reducir la respuesta ataca transferencia y memoria; virtualizar solo ataca el DOM."
        },
        {
          "q": "Ya llegan 50 filas. ¿Virtualizas obligatoriamente?",
          "choices": [
            "No; mediría si hace falta y preservaría accesibilidad",
            "Sí, por ser React",
            "Desactivo el teclado"
          ],
          "answer": 0,
          "why": "La paginación puede bastar. Cada optimización debe justificar su complejidad."
        },
        {
          "q": "Una búsqueda vieja llega después de una nueva. ¿Qué haces?",
          "choices": [
            "Mezclar ambas listas",
            "Ignorar la respuesta vieja y mantener el cursor de la consulta actual",
            "Mostrar siempre la última llegada"
          ],
          "answer": 1,
          "why": "El orden de llegada no es el orden de intención del usuario."
        }
      ],
      "checks": [
        "Mido red y renderizado por separado.",
        "Limito tamaño de página y memoria acumulada.",
        "Filtro y ordeno en servidor con orden estable.",
        "Reinicio cursor al cambiar la consulta.",
        "Pruebo red lenta, error, teclado y móvil."
      ],
      "answer": "Negociaría un contrato paginado con filtros y orden del servidor. La interfaz muestra carga, error, vacío y navegación. Cancelaría o descartaría peticiones viejas. Solo añadiría virtualización si pintar las filas sigue siendo caro. Para exportar todo pediría un archivo generado en servidor. Compararía tiempos y memoria antes/después con las mismas condiciones.",
      "after": "Red: solo la página solicitada\nMemoria: caché con límite\nDOM: filas de esa página, o ventana visible si hace falta\nExportación completa: trabajo de servidor",
      "source": "https://web.dev/articles/virtualize-long-lists-react-window"
    },
    {
      "id": "cambio-cuenta",
      "title": "Sale Ana, entra Luis… aparece Ana",
      "time": "15 min",
      "brief": "Tu app usa Redux y una API con sesión. Al cambiar de cuenta, durante un instante se ve el perfil anterior. Hay una petición pendiente.",
      "before": "t0: consultar perfil de Ana\nt1: cerrar sesión\nt2: entra Luis\nt3: llega la respuesta de Ana",
      "steps": [
        {
          "q": "¿Qué muestra este fallo?",
          "choices": [
            "Que Redux concede permisos",
            "Que limpiar la pantalla no basta si llegan respuestas antiguas",
            "Que hacen falta más animaciones"
          ],
          "answer": 1,
          "why": "Una respuesta vieja puede volver a rellenar datos después del logout."
        },
        {
          "q": "¿Cómo debería cerrarse la sesión?",
          "choices": [
            "Solo isLoggedIn = false",
            "Solo cambiar la ruta",
            "Invalidar sesión en servidor, parar consultas privadas y limpiar estado/caché"
          ],
          "answer": 2,
          "why": "Hay estado en el servidor y en el cliente. Ambos deben participar, tratando también posibles errores."
        },
        {
          "q": "¿Qué impide que Luis lea pedidos de Ana cambiando una URL?",
          "choices": [
            "Una verificación de permisos del servidor para ese pedido",
            "El selector de Redux",
            "Ocultar el botón"
          ],
          "answer": 0,
          "why": "La autorización del servidor es independiente del estado de la pantalla."
        }
      ],
      "checks": [
        "Distingo sesión real y estado visual.",
        "Descarto respuestas de identidades anteriores.",
        "Limpio datos privados y sus cachés.",
        "Compruebo permisos por recurso en servidor.",
        "Pruebo logout fallido, recarga, expiración y cambio de cuenta."
      ],
      "answer": "Bloquearía nuevas consultas privadas durante la salida. Cancelaría las pendientes o descartaría sus respuestas si pertenecen a otra sesión. Invalidaría la sesión real y limpiaría slices y caché, incluyendo perfil y pedidos. Un fallo de red al cerrar sesión debe mostrarse y tratarse: ocultar la pantalla no demuestra revocación. El backend vuelve a comprobar permisos en cada lectura o cambio.",
      "after": "Interfaz: loading / authenticated / guest / error\nIdentidad de petición: sesión que la inició\nRespuesta antigua: se descarta\nServidor: verifica sesión + permiso del recurso",
      "source": "https://nextjs.org/docs/app/guides/authentication"
    },
    {
      "id": "cifrar-payload",
      "title": "«Cifra el JSON en React»",
      "time": "10 min",
      "brief": "Te piden que nadie vea los precios privados de otros clientes. La propuesta es mandar todos los precios y cifrar el JSON con una clave incluida en React.",
      "before": "Propuesta: API envía todo → React descifra → oculta lo ajeno",
      "steps": [
        {
          "q": "¿Cuál es el primer error del diseño?",
          "choices": [
            "Usar JSON",
            "Enviar al navegador datos que no debería recibir",
            "No usar Redux"
          ],
          "answer": 1,
          "why": "La API debe filtrar y autorizar. No entregues datos privados para esconderlos después."
        },
        {
          "q": "¿La clave incluida en el bundle es secreta?",
          "choices": [
            "No, el usuario puede recuperarla",
            "Sí, al minificar",
            "Sí, en una variable NEXT_PUBLIC"
          ],
          "answer": 0,
          "why": "Minificar o usar una variable pública no convierte una clave entregada al cliente en secreta."
        },
        {
          "q": "¿Qué propones?",
          "choices": [
            "Base64 y CSS",
            "Desactivar DevTools",
            "HTTPS, autorización en servidor y respuesta mínima"
          ],
          "answer": 2,
          "why": "El transporte seguro y el control de acceso resuelven problemas distintos y complementarios."
        }
      ],
      "checks": [
        "Pregunto cuál es la amenaza.",
        "No envío precios ajenos al cliente.",
        "No guardo una clave privada en el bundle.",
        "Diferencio HTTPS, codificación y cifrado de aplicación."
      ],
      "answer": "El servidor identifica al usuario y devuelve únicamente los precios a los que tiene acceso, por HTTPS. No pondría una clave privada en React ni presentaría Base64 como cifrado. Si hay un requisito real de cifrado de extremo a extremo, diseñaría la gestión de claves y usaría protocolos revisados con ayuda especializada.",
      "after": "Sesión verificada → permisos → campos permitidos → HTTPS → interfaz",
      "source": "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"
    }
  ]
});
