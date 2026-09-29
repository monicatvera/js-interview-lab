window.CODE_PROBLEMS = [
  {
    id:'duplicados',title:'Quita duplicados',level:'Fácil',category:'Arrays',minutes:8,
    statement:'Recibes una lista de números. Devuelve otra lista con cada número una sola vez y conserva el orden de la primera aparición.',
    example:'quitarDuplicados([3, 1, 3, 2, 1]) → [3, 1, 2]',
    starter:'function quitarDuplicados(numeros) {\n  // Escribe tu solución aquí\n}',
    hint:'Un Set recuerda qué números ya has visto. Recorre la lista en orden.',
    explanation:'Un Set permite saber si un valor ya apareció. Si es nuevo, lo añades al resultado. También puedes usar [...new Set(numeros)].',
    solution:'function quitarDuplicados(numeros) {\n  return [...new Set(numeros)];\n}',
    tests:[{args:[[3,1,3,2,1]],expected:[3,1,2]},{args:[[]],expected:[]},{args:[[0,0,-1,0,-1,2]],expected:[0,-1,2]},{args:[[5,4,3]],expected:[5,4,3]}]
  },
  {
    id:'suma-dos',title:'Suma de dos',level:'Fácil',category:'Arrays',minutes:12,
    statement:'Devuelve los índices de dos números distintos que suman objetivo. Hay una sola pareja válida. No puedes usar el mismo elemento dos veces.',
    example:'sumaDos([2, 7, 11, 15], 9) → [0, 1]',
    starter:'function sumaDos(numeros, objetivo) {\n  // Devuelve [indice1, indice2]\n}',
    hint:'Al mirar el número actual, calcula cuánto falta. Guarda en un Map los números que ya pasaron y sus índices.',
    explanation:'Para cada número n, buscas objetivo - n entre los anteriores. Si existe, ya tienes los dos índices; si no, guardas n para la siguiente vuelta.',
    solution:'function sumaDos(numeros, objetivo) {\n  const vistos = new Map();\n  for (let i = 0; i < numeros.length; i++) {\n    const falta = objetivo - numeros[i];\n    if (vistos.has(falta)) return [vistos.get(falta), i];\n    vistos.set(numeros[i], i);\n  }\n}',
    tests:[{args:[[2,7,11,15],9],expected:[0,1]},{args:[[3,2,4],6],expected:[1,2]},{args:[[3,3],6],expected:[0,1]},{args:[[-2,8,4,1],-1],expected:[0,3]}]
  },
  {
    id:'parentesis',title:'Paréntesis bien cerrados',level:'Fácil',category:'Strings',minutes:12,
    statement:'Devuelve true si cada apertura (, [ o { se cierra en el orden correcto. Si queda algo abierto, devuelve false.',
    example:'parentesisValidos("{[()]}") → true; parentesisValidos("([)]") → false',
    starter:'function parentesisValidos(texto) {\n  // Devuelve true o false\n}',
    hint:'Piensa en una pila de platos: la última apertura debe ser la primera que se cierre.',
    explanation:'Al abrir, apilas el carácter. Al cerrar, compruebas si coincide con la última apertura. Al final la pila debe estar vacía.',
    solution:'function parentesisValidos(texto) {\n  const pila = [];\n  const pareja = { ")":"(", "]":"[", "}":"{" };\n  for (const caracter of texto) {\n    if ("([{ ".includes(caracter) && caracter !== " ") pila.push(caracter);\n    else if (pila.pop() !== pareja[caracter]) return false;\n  }\n  return pila.length === 0;\n}',
    tests:[{args:['{[()]}'],expected:true},{args:['([)]'],expected:false},{args:[''],expected:true},{args:['((('],expected:false},{args:['()[]{}'],expected:true},{args:['}'],expected:false}]
  },
  {
    id:'frecuencias',title:'Cuenta palabras',level:'Fácil',category:'Objetos',minutes:10,
    statement:'Recibes un array de palabras. Devuelve un objeto que indique cuántas veces aparece cada una. Las mayúsculas y minúsculas cuentan como palabras distintas.',
    example:'contarPalabras(["sol", "luna", "sol"]) → { sol: 2, luna: 1 }',
    starter:'function contarPalabras(palabras) {\n  // Devuelve un objeto con las cantidades\n}',
    hint:'Crea un objeto vacío y aumenta su contador por cada palabra. Usa Object.create(null) si quieres evitar claves heredadas.',
    explanation:'La clave del objeto es la palabra y el valor es su cantidad. Cuando no existe aún, empieza en cero y suma uno.',
    solution:'function contarPalabras(palabras) {\n  const resultado = Object.create(null);\n  for (const palabra of palabras) resultado[palabra] = (resultado[palabra] || 0) + 1;\n  return resultado;\n}',
    tests:[{args:[['sol','luna','sol']],expected:{sol:2,luna:1}},{args:[[]],expected:{}},{args:[['A','a','A']],expected:{A:2,a:1}},{args:[['toString','toString']],expected:{toString:2}}]
  },
  {
    id:'palindromo',title:'¿Es un palíndromo?',level:'Medio',category:'Strings',minutes:12,
    statement:'Comprueba si un texto se lee igual de izquierda a derecha y al revés. Ignora espacios, signos y diferencias entre mayúsculas y minúsculas. Para estos retos, usa letras a-z y números.',
    example:'esPalindromo("Anita lava la tina") → true',
    starter:'function esPalindromo(texto) {\n  // Devuelve true o false\n}',
    hint:'Primero limpia el texto con toLowerCase() y replace(). Luego compara con su reverso.',
    explanation:'Al quitar caracteres que no son letras o números y pasar a minúsculas, solo queda comparar el texto con sus caracteres invertidos.',
    solution:'function esPalindromo(texto) {\n  const limpio = texto.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return limpio === [...limpio].reverse().join("");\n}',
    tests:[{args:['Anita lava la tina'],expected:true},{args:['Hola mundo'],expected:false},{args:['A man, a plan, a canal: Panama'],expected:true},{args:[''],expected:true},{args:['12321'],expected:true}]
  },
  {
    id:'aplanar',title:'Aplana un array',level:'Medio',category:'Recursión',minutes:15,
    statement:'Convierte un array con arrays dentro, a cualquier profundidad, en un único array plano. Conserva el orden.',
    example:'aplanar([1, [2, [3]], 4]) → [1, 2, 3, 4]',
    starter:'function aplanar(lista) {\n  // Devuelve un array plano\n}',
    hint:'Para cada elemento: si es un array, aplánalo también; si no, añádelo al resultado.',
    explanation:'La recursión repite la misma tarea para cada array interior. Array.isArray distingue un array de un valor normal. También existe lista.flat(Infinity).',
    solution:'function aplanar(lista) {\n  const resultado = [];\n  for (const valor of lista) {\n    if (Array.isArray(valor)) resultado.push(...aplanar(valor));\n    else resultado.push(valor);\n  }\n  return resultado;\n}',
    tests:[{args:[[1,[2,[3]],4]],expected:[1,2,3,4]},{args:[[]],expected:[]},{args:[[[[1]],[],[2,3]]],expected:[1,2,3]},{args:[[0,[false,null],['x']]],expected:[0,false,null,'x']}]
  },
  {
    id:'agrupar',title:'Agrupa por propiedad',level:'Medio',category:'Objetos',minutes:15,
    statement:'Agrupa una lista de objetos por el valor de una propiedad. Devuelve un objeto donde cada clave contiene los elementos de ese grupo en su orden original.',
    example:'agruparPor([{tipo:"a"},{tipo:"b"},{tipo:"a"}], "tipo") → {a:[{tipo:"a"},{tipo:"a"}], b:[{tipo:"b"}]}',
    starter:'function agruparPor(elementos, propiedad) {\n  // Devuelve los grupos\n}',
    hint:'Para cada elemento, lee elemento[propiedad]. Si todavía no hay grupo, crea un array vacío antes de hacer push.',
    explanation:'Un acumulador guarda un array por cada valor de la propiedad. Añades cada objeto al grupo que le corresponde.',
    solution:'function agruparPor(elementos, propiedad) {\n  const grupos = Object.create(null);\n  for (const elemento of elementos) {\n    const clave = elemento[propiedad];\n    (grupos[clave] ??= []).push(elemento);\n  }\n  return grupos;\n}',
    tests:[{args:[[{tipo:'a'},{tipo:'b'},{tipo:'a'}],'tipo'],expected:{a:[{tipo:'a'},{tipo:'a'}],b:[{tipo:'b'}]}},{args:[[],'tipo'],expected:{}},{args:[[{n:1},{n:2},{n:1}],'n'],expected:{'1':[{n:1},{n:1}],'2':[{n:2}]}}]
  },
  {
    id:'max-ventana',title:'Suma máxima de una ventana',level:'Medio',category:'Arrays',minutes:18,
    statement:'Devuelve la suma más grande de k números consecutivos. k siempre está entre 1 y el tamaño del array. Puede haber números negativos.',
    example:'maxVentana([2, 1, 5, 1, 3, 2], 3) → 9',
    starter:'function maxVentana(numeros, k) {\n  // Devuelve la mayor suma de k consecutivos\n}',
    hint:'Suma los primeros k. Al mover la ventana, resta el número que sale y suma el que entra.',
    explanation:'La ventana deslizante evita volver a sumar todos los valores. Actualizas la suma al moverla un puesto y recuerdas el máximo.',
    solution:'function maxVentana(numeros, k) {\n  let suma = 0;\n  for (let i = 0; i < k; i++) suma += numeros[i];\n  let mejor = suma;\n  for (let i = k; i < numeros.length; i++) {\n    suma += numeros[i] - numeros[i-k];\n    mejor = Math.max(mejor, suma);\n  }\n  return mejor;\n}',
    tests:[{args:[[2,1,5,1,3,2],3],expected:9},{args:[[-4,-2,-7],2],expected:-6},{args:[[5],1],expected:5},{args:[[1,2,3,4],2],expected:7}]
  }
];
