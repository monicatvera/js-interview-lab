// Salidas verificadas: una respuesta por cada console.log, en el orden en que aparece.
window.OUTPUT_CHALLENGES = [
  {
    id: 'closures-contadores', topicId: 'closures', title: 'Dos contadores independientes', level: 'Calentamiento',
    code: 'function contador() {\n  let n = 0;\n  return () => ++n;\n}\nconst a = contador();\nconst b = contador();\nconsole.log(a());\nconsole.log(a());\nconsole.log(b());',
    output: ['1', '2', '1'],
    reasons: ['La primera llamada a a aumenta su propio n de 0 a 1.', 'a conserva el mismo n, que ahora pasa de 1 a 2.', 'b se creó con otra llamada a contador: su n todavía era 0.'],
    lesson: 'Cada llamada a contador() crea una variable n distinta. La función devuelta recuerda la suya.'
  },
  {
    id: 'closures-fabrica', topicId: 'closures', title: 'Una función que fabrica funciones', level: 'Un paso más',
    code: 'function sumarA(cantidad) {\n  return numero => numero + cantidad;\n}\nconst sumarDos = sumarA(2);\nconst sumarCinco = sumarA(5);\nconsole.log(sumarDos(3));\nconsole.log(sumarCinco(3));\nconsole.log(sumarDos(10));',
    output: ['5', '8', '12'],
    reasons: ['sumarDos recuerda que cantidad vale 2: 3 + 2.', 'sumarCinco recuerda otro valor, 5: 3 + 5.', 'sumarDos sigue usando su 2: 10 + 2.'],
    lesson: 'La función interior puede usar la variable cantidad de la llamada que la creó.'
  },
  {
    id: 'this-llamada', topicId: 'this', title: 'Misma función, distinto objeto', level: 'Calentamiento',
    code: 'const usuario = {\n  nombre: "Ada",\n  saludar() { return this.nombre; }\n};\nconst otra = { nombre: "Lin", saludar: usuario.saludar };\nconsole.log(usuario.saludar());\nconsole.log(otra.saludar());',
    output: ['Ada', 'Lin'],
    reasons: ['La llamada es usuario.saludar(): this es usuario.', 'Ahora la llamada es otra.saludar(): this es otra. La función es la misma.'],
    lesson: 'En una función normal, fíjate en el objeto que aparece a la izquierda del punto al llamarla.'
  },
  {
    id: 'this-flecha', topicId: 'this', title: 'La flecha conserva this', level: 'Un paso más',
    code: 'const usuario = {\n  nombre: "Ada",\n  crearSaludo() { return () => this.nombre; }\n};\nconst saludo = usuario.crearSaludo();\nconst otra = { nombre: "Lin", saludo };\nconsole.log(saludo());\nconsole.log(otra.saludo());',
    output: ['Ada', 'Ada'],
    reasons: ['La flecha se creó dentro de usuario.crearSaludo(), donde this era usuario.', 'Llamarla desde otra no cambia el this que la flecha tomó al crearse.'],
    lesson: 'Una función flecha usa el this de su entorno. Moverla a otro objeto no lo cambia.'
  },
  {
    id: 'eventloop-colas', topicId: 'eventloop', title: 'Ahora, promesa y temporizador', level: 'Calentamiento',
    code: 'console.log("A");\nsetTimeout(() => console.log("D"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("B");',
    output: ['A', 'B', 'C', 'D'],
    reasons: ['A se ejecuta directamente.', 'B también es código directo; el temporizador y la promesa están pendientes.', 'El .then de la promesa va a una microtarea, que se atiende después.', 'El temporizador espera la siguiente tarea, aunque indique 0 ms.'],
    lesson: 'Primero termina el código actual; luego van las microtareas; después, el temporizador.'
  },
  {
    id: 'eventloop-await', topicId: 'eventloop', title: 'Dónde se pausa await', level: 'Un paso más',
    code: 'console.log("inicio");\nasync function tarea() {\n  console.log("A");\n  await Promise.resolve();\n  console.log("B");\n}\ntarea();\nPromise.resolve().then(() => console.log("C"));\nconsole.log("fin");',
    output: ['inicio', 'A', 'fin', 'B', 'C'],
    reasons: ['Se ejecuta el primer console.log.', 'tarea() empieza inmediatamente y llega hasta await.', 'El código exterior sigue mientras tarea espera.', 'La continuación después de await se programó primero como microtarea.', 'Este .then se programó después, así que C llega detrás de B.'],
    lesson: 'await pausa la función, no todo el programa. Las microtareas se atienden en el orden en que se programaron.'
  },
  {
    id: 'promises-todas', topicId: 'promises', title: 'Esperar todos los resultados', level: 'Calentamiento',
    code: 'const a = Promise.resolve("bien");\nconst b = Promise.reject("falló");\nPromise.allSettled([a, b]).then(resultados => {\n  console.log(resultados[0].status);\n  console.log(resultados[1].status);\n});\nconsole.log("listo");',
    output: ['listo', 'fulfilled', 'rejected'],
    reasons: ['El código directo termina antes del callback de la promesa.', 'La primera promesa se cumplió: su estado es fulfilled.', 'La segunda promesa falló: su estado es rejected. allSettled recoge ambos resultados.'],
    lesson: 'allSettled espera a todas y devuelve el estado de cada una, incluso si alguna falla.'
  },
  {
    id: 'promises-all', topicId: 'promises', title: 'La suma llega después', level: 'Un paso más',
    code: 'Promise.all([\n  Promise.resolve(2),\n  Promise.resolve(3)\n]).then(numeros => console.log(numeros[0] + numeros[1]));\nconsole.log("antes");',
    output: ['antes', '5'],
    reasons: ['La llamada al console.log directo ocurre antes que el callback de .then.', 'all recibe los dos resultados y el callback suma 2 + 3.'],
    lesson: 'Promise.all espera a que todas se cumplan; su .then se ejecuta después del código actual.'
  }
];
