// Revisión editorial: cada tema conserva su ejemplo y fuente originales.
// El orden de cada par de respuestas corresponde al de questions en content.js/content-extra.js.
const explanations = {
  tipos: {
    plain: 'JavaScript puede convertir un valor a otro tipo al hacer una operación. Además, algunos decimales no se guardan con exactitud.',
    analogy: '0,1 + 0,2 parece 0,3 en papel, pero el ordenador guarda aproximaciones muy pequeñas de esos números.',
    theory: 'Antes de comparar o sumar, mira qué tipo tiene cada valor. === compara sin convertir tipos. En cambio, algunos operadores sí convierten valores. Los números de JavaScript usan coma flotante: por eso 0.1 + 0.2 no es exactamente 0.3. null representa un valor ausente, pero typeof null devuelve "object" por un comportamiento antiguo del lenguaje. NaN significa que una operación numérica no dio un número válido; aun así, typeof NaN es "number".',
    steps: 'Anota los tipos. Mira si hay una conversión automática. Si hay decimales, comprueba si la igualdad exacta tiene sentido.',
    takeaway: 'Explica primero el tipo y la conversión; después habla de la precisión de los decimales si interviene.',
    why: ['La suma con decimales produce una aproximación que no es exactamente 0,3.', 'Object.is(NaN, NaN) es true. Las otras opciones fallan porque typeof null es "object" y === no convierte tipos.']
  },
  scope: {
    plain: 'Una variable solo se puede usar dentro de ciertas partes del código. También importa en qué momento intentas leerla.',
    analogy: 'Una variable declarada dentro de un bloque con let se queda dentro de esas llaves { }.',
    theory: 'let y const pertenecen al bloque donde se declaran. var pertenece a la función completa, aunque se declare dentro de un if. Las declaraciones se preparan antes de ejecutar el código, pero let y const no se pueden leer hasta llegar a su declaración: ese tramo se llama zona muerta temporal. Una declaración de función sí suele poder llamarse antes de su posición en el archivo.',
    steps: 'Localiza las llaves y la función. Identifica si la variable usa var, let o const. Sigue la ejecución hasta la línea donde se declara.',
    takeaway: 'Distingue dónde existe la variable de cuándo se puede leer.',
    why: ['let existe en el bloque, pero leer x antes de declararla lanza un error.', 'var pertenece a la función; el if no crea un ámbito nuevo para ella.']
  },
  closures: {
    plain: 'Una función puede seguir usando variables del lugar donde se creó, incluso cuando la función exterior ya terminó.',
    analogy: 'Cada vez que llamas a contador(), se crea un contador independiente. La función que devuelve conserva acceso a su propio número.',
    theory: 'En el ejemplo, contador crea n y devuelve otra función. Esa función puede modificar n en llamadas posteriores. Si llamas otra vez a contador(), se crea otro n distinto. A esta combinación de función y variables de su entorno se la llama closure. Es útil para callbacks y para guardar estado privado.',
    steps: 'Busca dónde se creó la función que se devuelve. Señala las variables externas que usa. Comprueba cuántas veces se llamó a la función exterior.',
    takeaway: 'Cada llamada a la función exterior crea su propio entorno; la función interior sigue teniendo acceso a él.',
    why: ['La nueva llamada a contador() crea otro n que empieza en 0; su primera llamada devuelve 1.', 'La función conserva acceso a las variables del lugar donde se definió; no guarda una foto fija de sus valores.']
  },
  this: {
    plain: 'En una función normal, this suele depender de cómo la llamas. En una función flecha, se toma del lugar donde fue creada.',
    analogy: 'user.say() tiene un objeto a la izquierda del punto: user. Si guardas say en otra variable, esa llamada ya no lleva a user consigo.',
    theory: 'Al llamar a user.say(), this apunta a user. Si separas el método y lo llamas como función suelta, ya no conserva esa relación. Una función flecha no crea su propio this: usa el de su entorno. bind(obj) crea una función nueva cuyo this queda fijado a obj.',
    steps: 'Si es una función normal, mira cómo se llama. Si es una flecha, mira dónde se creó. Si aparece bind, comprueba qué objeto se fijó.',
    takeaway: 'Muestra la llamada concreta antes de decir a qué apunta this.',
    why: ['bind devuelve una función nueva con this fijado a obj; no la ejecuta todavía.', 'La flecha usa el this del entorno donde fue creada.']
  },
  prototype: {
    plain: 'Si un objeto no tiene una propiedad, JavaScript puede buscarla en otro objeto conectado a él: su prototipo.',
    analogy: 'Dos objetos creados con new User() pueden usar el mismo método greet, sin guardar una copia de ese método en cada uno.',
    theory: 'JavaScript busca una propiedad primero en el propio objeto. Si no la encuentra, sigue la cadena de prototipos hasta encontrarla o llegar al final. class ofrece una forma cómoda de crear objetos: los métodos normales definidos en la clase suelen estar en un prototipo compartido. Object.hasOwn comprueba solamente las propiedades del objeto, sin buscar en sus prototipos.',
    steps: 'Comprueba si la propiedad es propia del objeto. Si no lo es, sigue la cadena de prototipos. Distingue métodos compartidos de datos de cada instancia.',
    takeaway: 'Explica dónde se encuentra la propiedad y si las instancias comparten el método.',
    why: ['Las dos instancias usan la misma función greet del prototipo de User.', 'Object.hasOwn solo mira el propio objeto; no sigue la cadena de prototipos.']
  },
  eventloop: {
    plain: 'El código normal se ejecuta primero. Después se atienden las continuaciones de promesas y, más tarde, los temporizadores pendientes.',
    analogy: 'En el ejemplo, A y B ocurren ahora; C queda pendiente para justo después; D espera su turno como temporizador.',
    theory: 'JavaScript termina el trabajo síncrono antes de ejecutar callbacks pendientes. Los .then de promesas y las continuaciones de await van a la cola de microtareas. setTimeout añade una tarea para más adelante; poner 0 no significa que se ejecute al instante. Al terminar el código actual, se procesan las microtareas pendientes antes de la siguiente tarea.',
    steps: 'Escribe primero los console.log directos. Después anota las microtareas en el orden en que se programan. Deja setTimeout para una tarea posterior.',
    takeaway: 'Di qué se ejecuta ahora y qué se ha programado para después; no adivines solo por el tiempo del temporizador.',
    why: ['A y B se imprimen directamente. C es una microtarea de la promesa; D llega después como tarea del temporizador.', 'Al terminar el código actual, se atienden las microtareas pendientes antes de la siguiente tarea.']
  },
  promises: {
    plain: 'Una promesa representa un resultado que puede llegar después o fallar. Los combinadores sirven para esperar varios resultados de distintas formas.',
    analogy: 'Si necesitas que lleguen todos los pedidos, usa all. Si basta con el primero que salga bien, usa any.',
    theory: 'Promise.all devuelve los resultados cuando todas las promesas se cumplen, pero rechaza si alguna falla. allSettled espera a que todas terminen y te dice cuáles salieron bien o mal. race toma la primera que termine, incluso si falla. any espera el primer éxito; si todas fallan, rechaza con AggregateError. Las operaciones se inician al llamar a las funciones que crean las promesas.',
    steps: 'Pregunta qué necesita el resultado: todos los éxitos, un informe de todos, el primero que termine o el primer éxito.',
    takeaway: 'Explica también qué ocurre si una de las operaciones falla.',
    why: ['Promise.any espera el primer éxito aunque otro intento haya fallado antes.', 'Promise.allSettled espera a todas y devuelve un resultado con estado para cada una.']
  },
  async: {
    plain: 'await detiene temporalmente esa función, pero el resto del programa puede seguir ejecutándose.',
    analogy: 'En el ejemplo, f imprime A, se pausa en await y el programa imprime B. Después f continúa e imprime C.',
    theory: 'Una función async siempre devuelve una promesa. Su código se ejecuta hasta llegar a await. La continuación ocurre más tarde, cuando el valor esperado está disponible. Si dos peticiones no dependen entre sí, puedes iniciarlas juntas y esperar sus resultados con Promise.all. Si la segunda necesita el resultado de la primera, tiene sentido esperar una y luego iniciar la otra.',
    steps: 'Separa el código anterior y posterior al await. Para varias operaciones, pregunta si son independientes o si una necesita la respuesta de otra.',
    takeaway: 'Justifica cuándo esperas en secuencia y cuándo inicias operaciones juntas.',
    why: ['A se imprime antes de la pausa. B se imprime mientras f espera; C llega al reanudarse f.', 'A() y B() se inician antes de esperar; así pueden avanzar a la vez.']
  },
  references: {
    plain: 'Dos variables pueden apuntar al mismo objeto. Copiar un objeto con {...a} solo copia su primera capa.',
    analogy: 'Si b es una copia superficial de a, b.user y a.user siguen señalando al mismo objeto user.',
    theory: 'Los valores primitivos, como números y textos, se comparan por valor. Dos objetos se comparan según si son exactamente el mismo objeto. El operador spread crea un objeto exterior nuevo, pero deja compartidos los objetos que hay dentro. Si modificas b.user.name, también verás el cambio desde a.user.name. Para actualizar datos anidados sin cambiar el original, copia cada capa que vayas a modificar.',
    steps: 'Dibuja cada variable apuntando a un objeto. Al hacer spread, crea otra caja exterior, pero conserva las referencias interiores.',
    takeaway: 'Aclara qué parte se ha copiado y qué parte sigue compartida.',
    why: ['b es nuevo, pero b.user y a.user apuntan al mismo objeto interior.', 'Cada {} crea un objeto diferente; por eso no son estrictamente iguales.']
  },
  collections: {
    plain: 'Set guarda valores sin repetir. Map guarda una relación entre cada clave y su valor.',
    analogy: 'Set puede quitar números repetidos de una lista. Map puede asociar un id con los datos de una persona.',
    theory: 'Set conserva un solo ejemplar de cada valor. Dos objetos escritos igual siguen siendo objetos distintos, así que ambos pueden entrar en un Set. Map relaciona claves con valores y acepta incluso objetos como claves. Ambos permiten recorrer sus elementos en el orden en que se añadieron.',
    steps: 'Para eliminar valores repetidos, piensa en Set. Para consultar datos por una clave, piensa en Map. Con objetos, comprueba si son la misma referencia.',
    takeaway: 'Set no compara el contenido de dos objetos para decidir si son duplicados.',
    why: ['Son dos objetos diferentes aunque ambos tengan x: 1; el Set guarda los dos.', 'Map admite objetos como claves, además de textos, números y otros valores.']
  },
  modules: {
    plain: 'Un módulo es un archivo que comparte código con otros archivos. import() permite cargarlo cuando se necesita.',
    analogy: 'Si una gráfica solo aparece al abrir una sección, puedes cargar su código en ese momento.',
    theory: 'Cada módulo tiene sus propias variables. Los archivos pueden compartir funciones o valores con export e import. Una importación dinámica, import("./chart.js"), devuelve una promesa que se resuelve cuando el módulo está disponible. Así puedes dejar parte del código para más tarde. Si falla la descarga, la pantalla debe mostrar una salida comprensible.',
    steps: 'Identifica qué código se carga al inicio y cuál después. Piensa qué verá la persona si la carga tarda o falla.',
    takeaway: 'Relaciona la carga dinámica con una experiencia concreta, incluidos los errores de red.',
    why: ['import() devuelve una promesa que termina con el objeto que contiene las exportaciones del módulo.', 'Una pestaña abierta puede pedir un archivo de la versión anterior que ya no esté disponible tras desplegar.']
  },
  react: {
    plain: 'React vuelve a ejecutar el componente cuando lo renderiza. Una función creada antes puede seguir usando valores de aquel render.',
    analogy: 'Un callback creado cuando count valía 0 puede continuar viendo ese 0 si no se actualizan sus dependencias.',
    theory: 'Cada render tiene sus propios valores y funciones. Si un efecto usa count, debe reflejar esa dependencia para recibir el valor correcto cuando cambie. useMemo recuerda el resultado de un cálculo entre renders mientras sus dependencias no cambian. useCallback recuerda una función. Son herramientas para casos donde hayas observado trabajo innecesario; no corrigen una dependencia omitida.',
    steps: 'Encuentra en qué render se creó la función. Revisa qué valores lee y si están en las dependencias. Mide antes de optimizar.',
    takeaway: 'Primero corrige los datos y las dependencias; después decide si memorizar algo aporta una mejora real.',
    why: ['useMemo guarda el resultado que devuelve la función de cálculo.', 'El efecto puede seguir usando el count del render anterior si no incluye la dependencia.']
  },
  portals: {
    plain: 'Un portal coloca una parte de la interfaz en otro lugar del HTML, aunque siga siendo parte del mismo componente React.',
    analogy: 'Puedes colocar el modal directamente bajo body para que no quede recortado por un contenedor de la pantalla.',
    theory: 'createPortal coloca los elementos en otro nodo del DOM. El componente sigue perteneciendo al mismo árbol de React, por lo que sus eventos siguen la relación entre componentes. Mover el modal resuelve parte del problema visual, pero no su comportamiento: necesita un nombre accesible, gestión del foco, cierre con Escape y devolución del foco al control que lo abrió.',
    steps: 'Decide dónde se mostrará el modal. Después describe apertura, foco, teclado, cierre y una prueba de cada comportamiento.',
    takeaway: 'Un portal coloca el modal; la accesibilidad exige trabajo adicional.',
    why: ['Aunque el HTML esté en otro lugar, los eventos siguen propagándose por el árbol de React.', 'Un modal también debe gestionar el teclado y el foco; createPortal no lo hace por sí solo.']
  },
  performance: {
    plain: 'Antes de acelerar una página, descubre qué parte tarda: cargar, dibujar o responder a una acción.',
    analogy: 'Si una tabla con miles de filas va lenta al desplazarse, comprueba cuánto cuesta dibujarlas antes de cambiar otras partes.',
    theory: 'Mide el problema en la situación real y usa las herramientas de rendimiento para encontrar el trabajo costoso. Si se dibujan miles de filas que no se ven, la virtualización puede mostrar solo las necesarias. Una carga inicial lenta puede requerir menos código o carga diferida. INP mide la respuesta a interacciones; LCP, la aparición del contenido principal; CLS, los saltos visuales.',
    steps: 'Describe el síntoma. Mide dónde se pierde tiempo. Cambia una cosa y vuelve a medir para ver si mejoró.',
    takeaway: 'Cuenta qué mediste, qué cambiaste y qué resultado obtuviste.',
    why: ['Perfila el renderizado para confirmar el problema; la virtualización puede reducir las filas visibles si ese es el coste.', 'INP se relaciona con la respuesta a una interacción.']
  },
  'big-o': {
    plain: 'Big O describe cómo crece la cantidad de trabajo cuando aumentan los datos.',
    analogy: 'Si revisas una lista elemento por elemento, con el doble de elementos podrías necesitar aproximadamente el doble de pasos.',
    theory: 'Llamamos n al número de elementos. Acceder a una posición conocida de un array suele costar O(1); recorrerlo, O(n). Dos recorridos anidados sobre la misma lista pueden llegar a O(n²). Esto describe el crecimiento, no los segundos exactos. Crear un Map por id cuesta trabajo al principio, pero puede compensar si después vas a buscar muchas veces.',
    steps: 'Cuenta cuántos elementos se visitan. Pregunta si hay un recorrido, recorridos anidados o una estructura preparada para buscar.',
    takeaway: 'Menciona el coste de preparar un índice y cuántas búsquedas hacen que valga la pena.',
    why: ['Al duplicar la lista, un recorrido completo hace aproximadamente el doble de comprobaciones.', 'Un Map preparado por id evita repetir una búsqueda completa en cada consulta.']
  },
  'algoritmos-ui': {
    plain: 'Antes de programar una solución, asegúrate de entender qué datos entran y qué resultado se espera.',
    analogy: 'Si te piden quitar ids repetidos, pregunta si debes mantener el orden y qué hacer con ids vacíos.',
    theory: 'Empieza con un ejemplo pequeño. Aclara la entrada, la salida y los casos especiales: lista vacía, repetidos o valores ausentes. Para quitar valores primitivos repetidos puedes usar Set. Para agrupar datos por una clave, Map suele ayudar. Haz primero una solución correcta y legible; después analiza tiempo y memoria.',
    steps: 'Repite el requisito con tus palabras. Prueba un caso normal y uno límite. Implementa y comprueba el resultado.',
    takeaway: 'En una entrevista, explicar tus supuestos y verificar un caso límite cuenta tanto como escribir código.',
    why: ['El orden y el tratamiento de ids vacíos cambian qué solución se considera correcta.', 'Set deja el primer 3 y luego el 1; elimina el segundo 3.']
  },
  'css-stack': {
    plain: 'z-index ordena elementos dentro de grupos. Un hijo no puede superar el grupo de otro padre solo por tener un número enorme.',
    analogy: 'Si el grupo A está debajo del grupo B, poner 9999 a un elemento de A no mueve todo el grupo por encima de B.',
    theory: 'Un contexto de apilamiento es un grupo que se compara como una unidad con otros grupos. Algunas propiedades, como transform o ciertos usos de position y z-index, crean contextos nuevos. En el ejemplo, padreA tiene z-index 1 y padreB tiene 2. El modal dentro de padreA permanece en su grupo, aunque tenga 9999. Revisa primero los padres, no solo el número del modal.',
    steps: 'Inspecciona el modal y sus padres. Busca qué elemento creó cada grupo. Compara primero los grupos que son hermanos.',
    takeaway: 'Señala cuál es el contexto que limita al elemento antes de proponer un cambio.',
    why: ['El z-index del modal se compara dentro del contexto de su padre; revisa ese grupo.', 'transform puede crear un contexto de apilamiento incluso si no hay desplazamiento visible.']
  },
  'css-behavior': {
    plain: 'display: none quita el elemento y su espacio. visibility: hidden lo oculta, pero conserva el espacio.',
    analogy: 'En una lista, con display: none los demás elementos ocupan el hueco; con visibility: hidden queda un espacio vacío.',
    theory: 'display: none elimina el elemento del diseño de la página. visibility: hidden lo deja en el diseño sin mostrarlo. Una pseudoclase describe una situación del elemento, como :hover o :focus-visible. Un pseudoelemento selecciona una parte generada, como ::before. Si animas un acordeón, considera también el teclado, el contenido oculto y la preferencia de movimiento reducido.',
    steps: 'Pregunta si el elemento debe ocupar espacio, si puede recibir foco y si el contenido debe estar disponible para quien usa teclado.',
    takeaway: 'Explica qué cambia en el espacio de la página y en la interacción.',
    why: ['visibility: hidden mantiene el hueco del elemento en la distribución de la página.', ':focus-visible selecciona un estado; ::before y ::after son pseudoelementos.']
  },
  typescript: {
    plain: 'TypeScript te avisa cuando un dato puede tener varias formas. Debes comprobar cuál tienes antes de usarlo.',
    analogy: 'Si un resultado puede traer datos o un error, mira primero si ok es true antes de leer data.',
    theory: 'string | undefined significa que el valor puede ser texto o no existir. Una comprobación, como if (value !== undefined), permite usarlo como texto dentro de esa rama. A esto se le llama estrechar el tipo (narrowing). unknown exige comprobar un dato recibido antes de usarlo; any deja pasar operaciones sin esa protección. Los tipos ayudan, pero no validan por sí solos lo que llega de una API.',
    steps: 'Escribe las formas posibles del dato. Comprueba una de ellas. Solo después accede a sus propiedades.',
    takeaway: 'Muestra una comprobación concreta y explica qué error evita.',
    why: ['Tras comprobar que no es undefined, puedes llamar a métodos de string sin ese riesgo.', 'unknown obliga a verificar el dato antes de usarlo; any elimina esa comprobación del compilador.']
  },
  generics: {
    plain: 'Un genérico deja que una misma función o componente trabaje con distintos tipos de datos sin perder información sobre ellos.',
    analogy: 'La tabla usa T para representar sus filas: en una pantalla T puede ser Usuario y en otra, Cuenta.',
    theory: 'En Table<T>, T representa la forma de una fila. Si una columna usa keyof T, TypeScript permite únicamente nombres de propiedades de esa fila. Así puedes reutilizar la tabla con distintos datos y detectar claves mal escritas antes de ejecutarla. Define también cómo obtener un id estable y qué mostrar si no hay filas.',
    steps: 'Define qué datos recibe la tabla. Relaciona las columnas con el tipo de fila T. Pruébala con dos conjuntos de datos distintos.',
    takeaway: 'Una tabla reutilizable debe servir con datos distintos y seguir avisando de claves inválidas.',
    why: ['keyof T representa las propiedades disponibles en cada fila de tipo T.', 'Usar la misma API con usuarios y cuentas prueba que no depende de un solo tipo de fila.']
  },
  testing: {
    plain: 'Un test de interfaz comprueba lo que alguien puede hacer y ver en la pantalla.',
    analogy: 'Para probar un botón Guardar, encuéntralo por su nombre, púlsalo y comprueba qué cambia.',
    theory: 'Renderiza el componente, busca controles por su función y nombre visible, interactúa y comprueba el resultado. Esto hace que el test siga el uso real y dependa menos de detalles internos. Si hay una petición de datos, comprueba carga, éxito y error. En un modal, prueba la apertura, Escape y el foco según el comportamiento que prometas.',
    steps: 'Describe el comportamiento esperado. Haz la acción que haría una persona. Comprueba el resultado visible y el caso de error.',
    takeaway: 'Di qué comportamiento protege el test, no solo qué línea ejecuta.',
    why: ['El rol y el nombre describen el botón como lo encuentra una persona o una tecnología de apoyo.', 'Carga, éxito y error son tres resultados visibles que pueden fallar por separado.']
  },
  design: {
    plain: 'Un componente reutilizable recibe los datos que necesita y explica con claridad cómo se usa.',
    analogy: 'Una tabla recibe filas y columnas; no debería traer dentro reglas exclusivas de la pantalla de cuentas.',
    theory: 'Antes de escribir código, define sus entradas, las acciones que comunica y los estados que mostrará. Una tabla puede recibir filas, columnas y una forma de obtener el id de cada fila. Debe contemplar al menos el caso sin datos y usar HTML de tabla cuando representa datos tabulares. Añade ordenación o paginación si el requisito lo pide, no por costumbre.',
    steps: 'Diseña una versión pequeña. Úsala con dos conjuntos de datos reales. Ajusta su API si un segundo caso lo requiere.',
    takeaway: 'Cuenta qué recibe el componente, qué muestra y cómo se comporta sin datos.',
    why: ['Definir entradas, acciones y estados hace que el componente tenga una forma clara de uso.', 'Los nombres exclusivos de una pantalla dificultan usar el componente en otra.']
  },
  architecture: {
    plain: 'Organizar una aplicación consiste en decidir dónde vive cada responsabilidad para poder cambiar una cosa sin tocarlo todo.',
    analogy: 'Si cambia la dirección de una API, es más fácil cambiar el código que hace la petición que buscarla en cada pantalla.',
    theory: 'Puedes separar la petición de datos, la lógica que prepara esos datos y el componente que los muestra. Hazlo cuando esa separación facilite cambios reales. Si dos componentes hermanos deben editar el mismo valor, guarda ese estado en un padre común y pásalo a ambos. Evita duplicar el mismo dato en varios estados si puedes calcularlo a partir de uno.',
    steps: 'Elige un cambio probable. Pregunta qué archivos habría que tocar. Coloca el estado donde lo necesitan sus consumidores.',
    takeaway: 'Defiende una decisión con un cambio concreto que se vuelve más sencillo.',
    why: ['Concentrar la petición en una función o servicio evita cambiar todos los componentes visuales.', 'Un padre común puede guardar el valor compartido y pasarlo a ambos componentes.']
  },
  principles: {
    plain: 'Reglas como DRY, KISS y YAGNI ayudan a escribir código claro sin construir soluciones más grandes de lo necesario.',
    analogy: 'Si tres pantallas usan la misma regla para validar un importe, conviene mantenerla en una sola función.',
    theory: 'DRY pide no mantener la misma regla de negocio en varios lugares. KISS propone una solución sencilla que cumpla el requisito. YAGNI recuerda que no hace falta implementar funciones para un futuro imaginado. Responsabilidad única significa que una pieza tenga una razón clara para cambiar. No extraigas código solo porque dos líneas se parecen: comprueba si expresan la misma regla.',
    steps: 'Encuentra una regla compartida de verdad. Dale un nombre claro. Comprueba que los casos reales siguen funcionando.',
    takeaway: 'Explica qué duplicación o cambio concreto resuelve tu decisión.',
    why: ['Una regla compartida en una sola función evita que las pantallas se contradigan.', 'YAGNI invita a construir lo que se necesita ahora, sin adelantar funciones hipotéticas.']
  },
  'system-design': {
    plain: 'Una pregunta de diseño pide que expliques cómo organizarías una función completa y por qué.',
    analogy: 'En un buscador, no basta con pedir resultados: hay que decidir qué pasa si alguien escribe rápido o la red falla.',
    theory: 'Aclara primero quién lo usará, cuánto dato habrá y qué experiencia se espera. En un autocompletado, una respuesta antigua puede llegar después de una nueva y sustituir resultados correctos. Puedes cancelar la petición anterior o ignorar respuestas que ya no correspondan al texto actual. Incluye carga, vacío, error y uso con teclado. Luego explica qué medirías antes de añadir más complejidad.',
    steps: 'Aclara requisitos. Describe el flujo de datos. Revisa fallos y casos límite. Explica una primera versión y posibles mejoras.',
    takeaway: 'Conecta cada decisión técnica con un requisito o un problema observable.',
    why: ['Una respuesta antigua puede llegar la última y mostrar resultados que ya no corresponden a la búsqueda.', 'Los requisitos y el volumen determinan si necesitas caché, estado compartido o virtualización.']
  },
  delivery: {
    plain: 'Git guarda el historial del código. CI ejecuta comprobaciones automáticas. El despliegue publica una versión.',
    analogy: 'Un cambio pasa por una rama, revisión y pruebas antes de llegar a la web que usa la gente.',
    theory: 'Una rama permite preparar un cambio sin mezclarlo de inmediato con el trabajo principal. Una pull request facilita revisarlo. CI suele ejecutar tests, comprobación de tipos y construcción del sitio. Después se publica la versión y se observan errores. Una pestaña abierta puede seguir usando código antiguo y pedir un archivo que ya no exista; conviene prever una forma de recuperar la pantalla.',
    steps: 'Describe cómo preparas, revisas, compruebas y publicas un cambio. Añade cómo detectas y corriges un fallo después.',
    takeaway: 'Da un ejemplo de fallo, cómo se detectó y qué hiciste para recuperarte.',
    why: ['CI ejecuta comprobaciones automáticas antes de integrar el cambio.', 'Una pestaña antigua puede pedir archivos de una versión anterior; hace falta una estrategia de recuperación.']
  }
};

for (const topic of window.COURSE) {
  const copy = explanations[topic.id];
  if (!copy) continue;
  const {plain, analogy, theory, steps, takeaway, why} = copy;
  Object.assign(window.BEGINNER[topic.id], {plain, analogy, steps});
  Object.assign(topic, {theory, takeaway});
  why.forEach((reason, index) => { topic.questions[index].why = reason; });
}
