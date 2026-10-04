// Lecciones y ejercicios originales sobre tiempo real, medición y navegador.
window.COURSE.push(...[
  {
    "id": "websocket-basics",
    "title": "WebSockets desde cero",
    "icon": "↔",
    "category": "Arquitectura",
    "subtitle": "Recibe novedades sin preguntar continuamente al servidor.",
    "minutes": 10,
    "level": "Frontend real",
    "theory": "WebSocket mantiene un canal bidireccional: cliente y servidor pueden enviar mensajes. Encaja en chat, colaboración y actualizaciones frecuentes. Espera al evento open antes de enviar; escucha message, error y close. Usa wss en producción para proteger el transporte. Una desconexión no se arregla sola con la API nativa: diseña reintentos con espera creciente y algo de variación aleatoria, y detenlos al salir o perder autorización. Tras reconectar, recupera lo perdido mediante historial o un cursor acordado con el servidor. WebSocket no garantiza por sí solo que tu aplicación procese cada evento exactamente una vez. Polling es más sencillo si unos segundos de retraso son aceptables. SSE sirve para recibir eventos del servidor por HTTP; el cliente puede enviar acciones por peticiones normales. Elige según dirección, frecuencia y necesidades reales. Valida los mensajes y limita colas: si llegan más rápido de lo que pintas, agrupa actualizaciones y evita memoria sin límite.",
    "example": "// Ejemplo mínimo, necesita un servidor WebSocket real.\nconst ws = new WebSocket(\"wss://ejemplo.test/events\");\nws.addEventListener(\"open\", () => ws.send(JSON.stringify({type: \"subscribe\", topic: \"avisos\"})));\nws.addEventListener(\"message\", event => {\n  try {\n    const data = JSON.parse(event.data);\n    if (data && typeof data.id === \"string\") console.log(data.id);\n  } catch { console.warn(\"Mensaje no válido\"); }\n});\nws.addEventListener(\"error\", () => console.warn(\"Error de conexión\"));\nws.addEventListener(\"close\", () => console.log(\"Desconectado\"));\n// Cuando el dueño del canal termine: ws.close().\n// Reintentos, autorización e historial requieren lógica adicional.",
    "takeaway": "En entrevista explica la decisión, sus límites y cómo comprobarías que funciona.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications",
    "questions": [
      {
        "q": "Solo necesitas consultar un estado cada minuto. ¿WebSocket es obligatorio?",
        "choices": [
          "Sí",
          "No, polling puede bastar",
          "Solo con React"
        ],
        "answer": 1,
        "why": "Elige la complejidad que justifiquen la frecuencia y la experiencia requerida."
      },
      {
        "q": "Tras reconectar, ¿cómo recuperas eventos perdidos?",
        "choices": [
          "El navegador siempre los guarda",
          "Con historial o cursor acordado con el servidor",
          "Con React.memo"
        ],
        "answer": 1,
        "why": "Reconectar restablece el canal; recuperar el hueco exige un protocolo de aplicación."
      }
    ]
  },
  {
    "id": "realtime-react",
    "title": "Una conexión, varias pantallas",
    "icon": "↔",
    "category": "Arquitectura",
    "subtitle": "Comparte los eventos y limpia cada suscripción.",
    "minutes": 10,
    "level": "Frontend real",
    "theory": "En una SPA con varios gráficos puedes situar el dueño de la conexión en un Provider estable por encima de las rutas. Un servicio recibe y valida eventos, actualiza un store o caché y cada vista selecciona sus datos. Si cada componente llama a un hook que abre un socket, cada llamada crea su propia conexión: compartir un hook no comparte la instancia. Distingue la conexión compartida de los listeners de cada vista: al desmontar una vista, elimina su listener; cierra el socket cuando termine su dueño. Varias pestañas del navegador son otro problema y no comparten automáticamente ese Provider. Para depurar un «Hola Hola», sigue el mismo messageId/clientMessageId desde clic, petición o frame enviado, servidor, frame recibido, listener y lista. Investiga doble envío, dos conexiones, listeners acumulados y el eco de un mensaje optimista. No borres por texto: una persona puede escribir Hola dos veces legítimamente. Usa ids estables e idempotencia en servidor para reintentos. Strict Mode puede revelar falta de limpieza en desarrollo; no es explicación automática de cualquier duplicado.",
    "example": "// Fragmento: bus es una referencia estable recibida del Provider.\nuseEffect(() => {\n  const onMessage = message => {\n    setMessages(previous => previous.some(m => m.id === message.id)\n      ? previous : [...previous, message]);\n  };\n  const unsubscribe = bus.subscribe(onMessage);\n  return unsubscribe;\n}, [bus]);\n// El dueño del bus gestiona socket, validación y reconexión.\n// Para mensajes optimistas, enlaza además clientMessageId e id del servidor.\n// Para gráficos muy frecuentes, agrupa cambios antes de pintar.",
    "takeaway": "En entrevista explica la decisión, sus límites y cómo comprobarías que funciona.",
    "source": "https://react.dev/learn/synchronizing-with-effects",
    "questions": [
      {
        "q": "Tres componentes llaman a un hook que crea un WebSocket. ¿Comparten canal automáticamente?",
        "choices": [
          "Sí, porque usan el mismo hook",
          "No, cada llamada crea su instancia",
          "Solo si el hook empieza por use"
        ],
        "answer": 1,
        "why": "Para compartir la conexión necesitas un dueño y una instancia compartida explícitos."
      },
      {
        "q": "Recibes dos mensajes con texto Hola e ids diferentes. ¿Los eliminas por texto?",
        "choices": [
          "No: pueden ser mensajes legítimos distintos",
          "Sí, siempre",
          "Solo en móvil"
        ],
        "answer": 0,
        "why": "La identidad del evento, no su contenido, permite distinguir repetición de coincidencia."
      }
    ]
  },
  {
    "id": "lighthouse-practice",
    "title": "Lighthouse paso a paso",
    "icon": "↔",
    "category": "Arquitectura",
    "subtitle": "Usa el informe para decidir qué medir y mejorar.",
    "minutes": 10,
    "level": "Frontend real",
    "theory": "Lighthouse realiza auditorías automáticas de rendimiento, accesibilidad, buenas prácticas y SEO. Puedes ejecutarlo desde Chrome DevTools, la CLI o PageSpeed Insights. Abre una versión de producción, DevTools y Lighthouse; elige Mobile o Desktop y genera un informe de navegación. Si tu versión de DevTools no ofrece el panel, usa PageSpeed Insights o la CLI oficial. Anota URL, versión, modo, condiciones y métricas. Repite varias veces en condiciones parecidas para distinguir variación de una mejora real. El modo móvil usa condiciones simuladas y no sustituye probar un teléfono real. Localiza una oportunidad concreta, como la imagen principal pesada o JavaScript que bloquea, haz un cambio y repite. No compares una puntuación móvil con otra de escritorio como si fueran el mismo ensayo. Lighthouse mide en laboratorio; PageSpeed Insights puede mostrar además datos reales si hay suficientes muestras. TBT indica bloqueo en una carga de laboratorio y no equivale a INP, que mide interacciones reales. Una buena nota de accesibilidad no sustituye pruebas de teclado y lector de pantalla.",
    "example": "// Hoja de práctica (rellénala con tus mediciones, no inventes números):\n// URL y versión:\n// Mobile o Desktop:\n// Tres mediciones de LCP, CLS y TBT:\n// Problema observado y evidencia:\n// Un cambio realizado:\n// Tres mediciones después con el mismo perfil:\n// ¿Mejoró? ¿Empeoró algo? ¿Qué comprobarías en usuarios reales?",
    "takeaway": "En entrevista explica la decisión, sus límites y cómo comprobarías que funciona.",
    "source": "https://developer.chrome.com/docs/lighthouse/overview",
    "questions": [
      {
        "q": "¿Qué comparación permite evaluar una mejora?",
        "choices": [
          "Móvil antes y escritorio después",
          "Misma página, perfil y condiciones antes y después",
          "Dos notas de páginas distintas"
        ],
        "answer": 1,
        "why": "Controlar las condiciones hace la comparación útil; repetir reduce el efecto del ruido."
      },
      {
        "q": "¿TBT de Lighthouse y el INP real son lo mismo?",
        "choices": [
          "Sí",
          "No: TBT ayuda a detectar bloqueo, INP mide respuesta a interacciones",
          "INP mide el tamaño de imágenes"
        ],
        "answer": 1,
        "why": "Son señales relacionadas con capacidad de respuesta, pero no equivalentes."
      }
    ]
  },
  {
    "id": "https-browser-storage",
    "title": "HTTPS y almacenamiento sin confusiones",
    "icon": "↔",
    "category": "Arquitectura",
    "subtitle": "Protege el viaje de los datos y decide qué guardar.",
    "minutes": 10,
    "level": "Frontend real",
    "theory": "HTTP define cómo intercambian mensajes cliente y servidor. HTTPS usa TLS para cifrar el transporte, detectar alteraciones y autenticar el servidor mediante certificados válidos. No corrige un XSS, no valida permisos de negocio y no garantiza que el sitio sea honesto. Evita cargar recursos HTTP desde una página HTTPS: el navegador puede bloquear contenido mixto. localStorage guarda cadenas por origen y persiste entre sesiones; sessionStorage está separado por origen y pestaña y normalmente dura esa sesión de pestaña. Ambos son accesibles a JavaScript del mismo origen y no son almacenes de secretos. Un tema visual o progreso no sensible puede encajar; contraseñas, claves privadas y tokens de sesión no deben tratarse como seguros por guardarlos allí. No confíes en un rol o precio de localStorage para autorizar: el usuario puede modificarlo. JSON.parse y escrituras pueden fallar; captura errores y valida la estructura. No tienen caducidad automática por dato: si necesitas vencimiento, diséñalo. IndexedDB sirve para datos estructurados mayores y acceso asíncrono, pero tampoco protege de scripts maliciosos del origen. El servidor debe aplicar autenticación y permisos.",
    "example": "function leerTema() {\n  try {\n    const value = localStorage.getItem(\"tema\");\n    return value === \"claro\" || value === \"oscuro\" ? value : \"oscuro\";\n  } catch { return \"oscuro\"; }\n}\ntry { localStorage.setItem(\"tema\", \"claro\"); }\ncatch { /* La app puede seguir funcionando sin guardar preferencia. */ }\n// Guardar {rol: \"admin\"} aquí nunca debe conceder permisos reales.",
    "takeaway": "En entrevista explica la decisión, sus límites y cómo comprobarías que funciona.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
    "questions": [
      {
        "q": "¿HTTPS impide que un XSS lea localStorage?",
        "choices": [
          "Sí, cifra JavaScript",
          "No: protege el transporte, no evita ejecutar un script malicioso",
          "Solo si usas JSON"
        ],
        "answer": 1,
        "why": "Son capas diferentes: un script ejecutado en el origen puede acceder a su almacenamiento."
      },
      {
        "q": "¿Qué dato encaja mejor en localStorage?",
        "choices": [
          "Una contraseña",
          "Una clave privada",
          "La preferencia de tema visual"
        ],
        "answer": 2,
        "why": "Una preferencia no sensible es un uso razonable; la aplicación debe tolerar que el almacenamiento no esté disponible."
      }
    ]
  }
]);
Object.assign(window.BEGINNER,{
  "websocket-basics": {
    "plain": "Recibe novedades sin preguntar continuamente al servidor.",
    "analogy": "Polling es llamar cada minuto para preguntar si llegó un paquete. WebSocket es mantener una conversación abierta.",
    "steps": "Lee el ejemplo. Explica qué problema resuelve. Prueba también desconexión, error o datos inesperados, según el caso."
  },
  "realtime-react": {
    "plain": "Comparte los eventos y limpia cada suscripción.",
    "analogy": "Una radio recibe la emisión y varios altavoces la reproducen; no hace falta una radio nueva por cada gráfico.",
    "steps": "Lee el ejemplo. Explica qué problema resuelve. Prueba también desconexión, error o datos inesperados, según el caso."
  },
  "lighthouse-practice": {
    "plain": "Usa el informe para decidir qué medir y mejorar.",
    "analogy": "Es una revisión del coche en un circuito: ayuda a detectar problemas, pero no describe todos los viajes reales.",
    "steps": "Lee el ejemplo. Explica qué problema resuelve. Prueba también desconexión, error o datos inesperados, según el caso."
  },
  "https-browser-storage": {
    "plain": "Protege el viaje de los datos y decide qué guardar.",
    "analogy": "HTTPS protege el sobre durante el transporte; no convierte el cajón donde lo guardas en una caja fuerte.",
    "steps": "Lee el ejemplo. Explica qué problema resuelve. Prueba también desconexión, error o datos inesperados, según el caso."
  }
});
window.OUTPUT_CHALLENGES.push(...[
  {
    "id": "objetos-identidad",
    "title": "Dos objetos parecidos",
    "topicId": "references",
    "level": "Un paso más",
    "code": "console.log({} == {});\nconst a = {};\nconst b = a;\nconsole.log(a === b);",
    "output": [
      "false",
      "true"
    ],
    "reasons": [
      "Cada literal crea un objeto distinto; comparar dos objetos compara identidad.",
      "b apunta al mismo objeto que a."
    ],
    "lesson": "Igual contenido no significa misma referencia."
  },
  {
    "id": "null-undefined-comparar",
    "title": "Ausencia con dos comparaciones",
    "topicId": "tipos",
    "level": "Un paso más",
    "code": "console.log(undefined == null);\nconsole.log(undefined === null);",
    "output": [
      "true",
      "false"
    ],
    "reasons": [
      "La igualdad no estricta tiene una regla que equipara null y undefined.",
      "La estricta distingue los tipos y devuelve false."
    ],
    "lesson": "Razona la regla concreta: no todo valor falsy es igual a null."
  },
  {
    "id": "array-vaciado",
    "title": "Un array const puede vaciarse",
    "topicId": "references",
    "level": "Un paso más",
    "code": "const clothes = [\"jacket\", \"t-shirt\"];\nconst alias = clothes;\nclothes.length = 0;\nconsole.log(clothes[0]);\nconsole.log(alias.length);",
    "output": [
      "undefined",
      "0"
    ],
    "reasons": [
      "Reducir length a cero elimina los elementos del array ordinario.",
      "alias apunta al mismo array que se ha vaciado."
    ],
    "lesson": "const impide reasignar la variable; no congela el contenido del array."
  },
  {
    "id": "iife-hoisting-incremento",
    "title": "La variable que se oculta en una IIFE",
    "topicId": "scope",
    "level": "Un paso más",
    "code": "var n = 10;\n(function () {\n  console.log(n);\n  var n = 1;\n  console.log(n++);\n  console.log(++n);\n})();\nconsole.log(n);",
    "output": [
      "undefined",
      "1",
      "3",
      "10"
    ],
    "reasons": [
      "El var local existe desde el inicio de la función y oculta al exterior, pero aún vale undefined.",
      "El postincremento devuelve 1 y después deja n en 2.",
      "El preincremento sube n a 3 y devuelve 3.",
      "La variable exterior no cambió."
    ],
    "lesson": "Una IIFE se ejecuta inmediatamente y tiene su propio ámbito. Ejercicio original: el post no proporcionaba el código de su IIFE."
  }
]);
window.INTERVIEW_WORKSHOPS.push({
  "id": "realtime-web",
  "icon": "↔",
  "title": "Tiempo real y medición",
  "summary": "Investiga mensajes duplicados y aprende a comparar auditorías de rendimiento.",
  "cases": [
    {
      "id": "chat-rastro",
      "title": "¿Dónde se duplicó el Hola?",
      "time": "15 min",
      "brief": "Un cliente envía un solo mensaje, pero el receptor lo pinta dos veces. Tras entrar y salir de la ruta el problema empeora. Rastrea el evento antes de deduplicar.",
      "before": "useEffect(() => {\n  socket.addEventListener(\"message\", onMessage);\n}, []); // Falta limpieza; revisa también dependencias.",
      "steps": [
        {
          "q": "¿Qué registras primero?",
          "choices": [
            "El texto únicamente",
            "Id del mensaje, conexión, envío, recepción y listener",
            "Solo el número de renders"
          ],
          "answer": 1,
          "why": "El rastro distingue dos envíos de dos manejadores o dos inserciones locales."
        },
        {
          "q": "Hay un frame recibido y dos ejecuciones del manejador. ¿Qué investigas?",
          "choices": [
            "Listeners duplicados y su cleanup",
            "La fuente CSS",
            "La igualdad de strings"
          ],
          "answer": 0,
          "why": "Un único frame puede ser procesado por varios listeners acumulados."
        },
        {
          "q": "¿Qué verificación cubre el arreglo?",
          "choices": [
            "Solo recargar una vez",
            "Entrar/salir de ruta, reconectar, eco antes/después de confirmación y dos mensajes legítimos iguales",
            "Borrar todo mensaje repetido por texto"
          ],
          "answer": 1,
          "why": "Comprueba ciclo de vida, protocolo e identidad sin perder mensajes válidos."
        }
      ],
      "checks": [
        "Identifico evidencia antes de cambiar código.",
        "Explico el arreglo y sus límites.",
        "Compruebo el mismo escenario después."
      ],
      "answer": "Conservaría referencias de los listeners para retirarlos con removeEventListener y declararía dependencias correctas. Revisaría el dueño de la conexión y reconciliaría por ids local/servidor. Probaría reintentos con idempotencia del servidor. Si ya hay dos frames enviados, arreglar solo la lista oculta el origen del fallo.",
      "after": "// Cuenta en voz alta: síntoma → evidencia → causa → cambio → comprobación.",
      "source": "https://react.dev/learn/synchronizing-with-effects"
    },
    {
      "id": "lighthouse-medicion",
      "title": "Una nota baja en móvil",
      "time": "15 min",
      "brief": "Tu informe móvil es peor que el de escritorio. La imagen principal pesa mucho y hay tareas largas de JavaScript. Diseña una mejora medible.",
      "before": "// Rellena una línea base con tres ejecuciones del mismo perfil.\n// No son mediciones reales: tú debes obtener los resultados.",
      "steps": [
        {
          "q": "¿Cómo estableces una línea base?",
          "choices": [
            "Varias ejecuciones de producción con el mismo perfil",
            "Mezclando móvil y escritorio",
            "Usando solo la nota más alta"
          ],
          "answer": 0,
          "why": "Versiones y condiciones comparables permiten atribuir cambios a la optimización."
        },
        {
          "q": "La imagen principal tarda en aparecer. ¿Qué investigas?",
          "choices": [
            "Su tamaño, formato, prioridad y descubrimiento en Network",
            "Solo React.memo",
            "El nombre de las variables"
          ],
          "answer": 0,
          "why": "La evidencia debe guiar la mejora del recurso que retrasa el contenido principal."
        },
        {
          "q": "La nota sube. ¿Qué falta comprobar?",
          "choices": [
            "Nada",
            "Repetir, probar interacciones y accesibilidad, y contrastar datos reales si hay",
            "Eliminar toda medición posterior"
          ],
          "answer": 1,
          "why": "Una nota de carga no demuestra que todas las interacciones y dispositivos mejoraron."
        }
      ],
      "checks": [
        "Identifico evidencia antes de cambiar código.",
        "Explico el arreglo y sus límites.",
        "Compruebo el mismo escenario después."
      ],
      "answer": "Guardaría perfil, versión y métricas. Cambiaría una causa medida, repetiría las pruebas y comprobaría teclado e interacciones en un móvil real. Distinguiría Lighthouse de datos de campo y no presentaría TBT como INP.",
      "after": "// Cuenta en voz alta: síntoma → evidencia → causa → cambio → comprobación.",
      "source": "https://developer.chrome.com/docs/lighthouse/overview"
    }
  ]
});
