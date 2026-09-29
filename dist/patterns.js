window.SOLUTION_PATTERNS = [
  {
    id:'mapas', title:'Mapas y conjuntos', icon:'{}', summary:'Cuenta o recuerda lo que ya has visto.',
    analogy:'Como llevar una libreta: anotas cada número que aparece y consultas la libreta antes de seguir.',
    when:'Cuando necesitas encontrar repetidos, parejas o contar apariciones sin revisar toda la lista una y otra vez.',
    question:'¿Qué dato me conviene recordar para no volver a buscarlo?',
    example:'Encuentra dos números que sumen 9 en [2, 7, 11, 4].',
    steps:[
      {active:[0],memory:'Vistos: ∅',text:'Empiezo por 2. Para llegar a 9 me falta 7; todavía no lo he visto. Guardo 2.'},
      {active:[1],memory:'Vistos: {2}',text:'Ahora miro 7. Su complemento es 2, que ya está guardado. Encontré la pareja [2, 7].'},
      {active:[0,1],memory:'Pareja: [2, 7]',text:'Puedo terminar. La libreta evitó comparar 7 con todos los elementos anteriores.'}
    ], values:[2,7,11,4], code:'const vistos = new Set();\nfor (const numero of numeros) {\n  const falta = objetivo - numero;\n  if (vistos.has(falta)) return [falta, numero];\n  vistos.add(numero);\n}',
    complexity:'Tiempo O(n): una pasada. Espacio O(n): guardamos números vistos.',
    interview:'Voy a guardar los números anteriores en un Set. Por cada número calculo cuál falta y compruebo si ya apareció.',
    challenges:['suma-dos','frecuencias','primer-unico','duplicados','anagramas','interseccion']
  },
  {
    id:'dos-punteros', title:'Dos punteros', icon:'↔', summary:'Mira dos posiciones y mueve la que te acerque a la respuesta.',
    analogy:'Como buscar una pareja en una fila ordenada: una persona empieza a la izquierda y otra a la derecha.',
    when:'Cuando recorres una lista ordenada, comparas extremos o quieres mover elementos sin crear otra lista.',
    question:'¿Qué extremo puedo descartar sin perder una solución?',
    example:'En [1, 2, 4, 6, 8], busca dos números que sumen 10.',
    steps:[
      {active:[0,4],memory:'1 + 8 = 9',text:'Pongo un puntero al principio y otro al final. La suma 9 es pequeña; avanzo el izquierdo.'},
      {active:[1,4],memory:'2 + 8 = 10',text:'Ahora suman 10. Encontré la pareja [2, 8].'},
      {active:[1,4],memory:'Lista ordenada',text:'Puedo descartar el 1 porque con el mayor número solo llegaba a 9. Este razonamiento depende del orden de la lista.'}
    ], values:[1,2,4,6,8], code:'let izquierda = 0;\nlet derecha = numeros.length - 1;\nwhile (izquierda < derecha) {\n  const suma = numeros[izquierda] + numeros[derecha];\n  if (suma === objetivo) return [numeros[izquierda], numeros[derecha]];\n  if (suma < objetivo) izquierda++;\n  else derecha--;\n}',
    complexity:'Tiempo O(n) si la lista ya está ordenada. Espacio O(1). Ordenar antes cambia el coste.',
    interview:'Como los números están ordenados, comparo los extremos y descarto un lado según la suma.',
    challenges:['mezclar-ordenados','mover-ceros']
  },
  {
    id:'ventana', title:'Ventana deslizante', icon:'▣', summary:'Mantén un trozo de la lista y muévelo sin recomenzar.',
    analogy:'Miras tres vagones de un tren por una ventanilla: sale uno de tu vista y entra el siguiente.',
    when:'Cuando piden un tramo consecutivo: suma de k elementos, subcadena o período continuo.',
    question:'¿Qué sale de mi tramo y qué entra cuando avanzo?',
    example:'Busca la mayor suma de 3 números seguidos en [2, 1, 5, 1, 3].',
    steps:[
      {active:[0,1,2],memory:'2 + 1 + 5 = 8 · máximo 8',text:'Sumo los tres primeros números. Esta es la primera ventana y el máximo provisional.'},
      {active:[1,2,3],memory:'8 − 2 + 1 = 7 · máximo 8',text:'Avanzo una posición: sale 2 y entra 1. Actualizo la suma sin empezar de cero.'},
      {active:[2,3,4],memory:'7 − 1 + 3 = 9 · máximo 9',text:'Sale el primer 1 y entra 3. Ahora 9 es la mayor suma.'}
    ], values:[2,1,5,1,3], code:'let suma = 0;\nfor (let i = 0; i < k; i++) suma += numeros[i];\nlet mejor = suma;\nfor (let i = k; i < numeros.length; i++) {\n  suma += numeros[i] - numeros[i - k];\n  mejor = Math.max(mejor, suma);\n}',
    complexity:'Tiempo O(n): cada número entra y sale como máximo una vez. Espacio O(1).',
    interview:'Como necesito elementos consecutivos, mantengo la suma de una ventana; al moverla resto el que sale y sumo el que entra.',
    challenges:['max-ventana','subcadena-unica']
  },
  {
    id:'pila', title:'Pila', icon:'▤', summary:'Lo último que entra es lo primero que sale.',
    analogy:'Una pila de platos: colocas uno encima y sacas primero el último que pusiste.',
    when:'Cuando hay que cerrar cosas en orden inverso: paréntesis, etiquetas o acciones de deshacer.',
    question:'¿Cuál es el último elemento abierto que todavía debo cerrar?',
    example:'Comprueba si los paréntesis de «(()())» están bien cerrados.',
    steps:[
      {active:[0],memory:'Pila: (',text:'El primer paréntesis abre. Lo guardo en la pila.'},
      {active:[0,1],memory:'Pila: ( (',text:'El segundo también abre. Lo pongo encima del anterior.'},
      {active:[0,1,2],memory:'Pila: (',text:'Este cierra: retiro el último que abrí. Continúo así hasta acabar con la pila vacía.'}
    ], values:['(','(',')','(',')',')'], code:'const pila = [];\nfor (const simbolo of texto) {\n  if (simbolo === "(") pila.push(simbolo);\n  else if (!pila.length) return false;\n  else pila.pop();\n}\nreturn pila.length === 0;',
    complexity:'Tiempo O(n). Espacio O(n) en el peor caso, si todo abre.',
    interview:'Guardo cada apertura; cuando llega un cierre, debe corresponder a la última apertura pendiente.',
    challenges:['parentesis']
  }
];
