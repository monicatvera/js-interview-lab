window.CODE_PROBLEMS.push(
  {
    id:'mover-ceros',title:'Mueve los ceros al final',level:'Fácil',category:'Arrays',minutes:10,
    statement:'Devuelve un array nuevo con los mismos números. Coloca los ceros al final y conserva el orden de los demás números.',
    example:'moverCeros([0, 1, 0, 3, 12]) → [1, 3, 12, 0, 0]',
    starter:'function moverCeros(numeros) {\n  // Devuelve un array nuevo\n}',
    hint:'Separa los valores distintos de cero y cuenta cuántos ceros había.',
    explanation:'Primero conservas los números no nulos en orden. Después añades exactamente tantos ceros como había en la entrada.',
    solution:'function moverCeros(numeros) {\n  const otros = numeros.filter(n => n !== 0);\n  return [...otros, ...Array(numeros.length - otros.length).fill(0)];\n}',
    tests:[{args:[[0,1,0,3,12]],expected:[1,3,12,0,0]},{args:[[0,0]],expected:[0,0]},{args:[[1,2,3]],expected:[1,2,3]},{args:[[-1,0,2,0,-3]],expected:[-1,2,-3,0,0]}]
  },
  {
    id:'interseccion',title:'Elementos en común',level:'Fácil',category:'Arrays',minutes:10,
    statement:'Devuelve los números que aparecen en ambos arrays, una sola vez y en el orden en que aparecen por primera vez en el primer array.',
    example:'interseccion([3, 1, 3, 2], [2, 3]) → [3, 2]',
    starter:'function interseccion(a, b) {\n  // Devuelve los elementos comunes\n}',
    hint:'Un Set de b permite comprobar rápidamente si un número está en el segundo array. Otro Set evita repetirlo.',
    explanation:'Recorres a de izquierda a derecha y añades solo los valores presentes en b que aún no has añadido.',
    solution:'function interseccion(a, b) {\n  const enB = new Set(b), usados = new Set(), resultado = [];\n  for (const n of a) {\n    if (enB.has(n) && !usados.has(n)) { resultado.push(n); usados.add(n); }\n  }\n  return resultado;\n}',
    tests:[{args:[[3,1,3,2],[2,3]],expected:[3,2]},{args:[[1,2],[3,4]],expected:[]},{args:[[0,0,-1],[-1,0,0]],expected:[0,-1]},{args:[[],[1]],expected:[]}]
  },
  {
    id:'fizzbuzz',title:'FizzBuzz',level:'Fácil',category:'Bucles',minutes:8,
    statement:'Devuelve un array desde 1 hasta n. Sustituye los múltiplos de 3 por "Fizz", los de 5 por "Buzz" y los de ambos por "FizzBuzz". Los demás quedan como números.',
    example:'fizzBuzz(5) → [1, 2, "Fizz", 4, "Buzz"]',
    starter:'function fizzBuzz(n) {\n  // Devuelve el array\n}',
    hint:'Comprueba primero si el número es múltiplo de 15; después prueba 3 y 5.',
    explanation:'Si pruebas 3 antes que 15, un múltiplo de ambos se quedará solo con Fizz. Por eso el caso más específico va primero.',
    solution:'function fizzBuzz(n) {\n  const salida = [];\n  for (let i = 1; i <= n; i++) {\n    salida.push(i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : i);\n  }\n  return salida;\n}',
    tests:[{args:[0],expected:[]},{args:[3],expected:[1,2,'Fizz']},{args:[5],expected:[1,2,'Fizz',4,'Buzz']},{args:[15],expected:[1,2,'Fizz',4,'Buzz','Fizz',7,8,'Fizz','Buzz',11,'Fizz',13,14,'FizzBuzz']}]
  },
  {
    id:'primer-unico',title:'Primer carácter único',level:'Fácil',category:'Strings',minutes:12,
    statement:'Devuelve el primer carácter de un texto que aparece una sola vez. Si no existe, devuelve null. Mayúsculas y minúsculas son distintas.',
    example:'primerUnico("aabbcde") → "c"',
    starter:'function primerUnico(texto) {\n  // Devuelve el carácter o null\n}',
    hint:'Cuenta las apariciones en una primera pasada. En una segunda, busca el primer carácter con cantidad 1.',
    explanation:'Necesitas las frecuencias de todo el texto antes de saber si un carácter es único. La segunda pasada conserva el orden original.',
    solution:'function primerUnico(texto) {\n  const veces = new Map();\n  for (const c of texto) veces.set(c, (veces.get(c) || 0) + 1);\n  for (const c of texto) if (veces.get(c) === 1) return c;\n  return null;\n}',
    tests:[{args:['aabbcde'],expected:'c'},{args:['aabb'],expected:null},{args:[''],expected:null},{args:['AaA'],expected:'a'},{args:['abac'],expected:'b'}]
  },
  {
    id:'rotar',title:'Rota un array',level:'Medio',category:'Arrays',minutes:14,
    statement:'Devuelve un array nuevo rotado k posiciones a la derecha. Si k supera el tamaño, vuelve a empezar. Si el array está vacío, devuelve [].',
    example:'rotar([1, 2, 3, 4, 5], 2) → [4, 5, 1, 2, 3]',
    starter:'function rotar(numeros, k) {\n  // Devuelve el array rotado\n}',
    hint:'El desplazamiento real es k % numeros.length. Corta la parte final y ponla delante.',
    explanation:'Al dividir k por la longitud, el resto indica cuánto girar de verdad. slice permite unir el tramo final con el inicial.',
    solution:'function rotar(numeros, k) {\n  if (!numeros.length) return [];\n  const pasos = k % numeros.length;\n  if (pasos === 0) return [...numeros];\n  return numeros.slice(-pasos).concat(numeros.slice(0, -pasos));\n}',
    tests:[{args:[[1,2,3,4,5],2],expected:[4,5,1,2,3]},{args:[[1,2,3],3],expected:[1,2,3]},{args:[[1,2,3],4],expected:[3,1,2]},{args:[[],2],expected:[]},{args:[[9],100],expected:[9]}]
  },
  {
    id:'mezclar-ordenados',title:'Mezcla dos arrays ordenados',level:'Medio',category:'Arrays',minutes:16,
    statement:'Recibes dos arrays de números ya ordenados de menor a mayor. Devuelve uno nuevo, también ordenado, sin eliminar repetidos.',
    example:'mezclarOrdenados([1, 3], [2, 4]) → [1, 2, 3, 4]',
    starter:'function mezclarOrdenados(a, b) {\n  // Devuelve un array ordenado\n}',
    hint:'Usa un índice para cada array. Añade el menor de los dos valores actuales y avanza solo ese índice.',
    explanation:'Dos punteros recorren los arrays una sola vez. Al final añades lo que quede en cualquiera de ellos.',
    solution:'function mezclarOrdenados(a, b) {\n  const salida = []; let i = 0, j = 0;\n  while (i < a.length && j < b.length) salida.push(a[i] <= b[j] ? a[i++] : b[j++]);\n  return salida.concat(a.slice(i), b.slice(j));\n}',
    tests:[{args:[[1,3],[2,4]],expected:[1,2,3,4]},{args:[[],[1,2]],expected:[1,2]},{args:[[1,1,5],[1,2]],expected:[1,1,1,2,5]},{args:[[-3,0],[0,9]],expected:[-3,0,0,9]}]
  },
  {
    id:'subarray-max',title:'Mayor suma consecutiva',level:'Medio',category:'Arrays',minutes:18,
    statement:'Devuelve la mayor suma que se puede formar con al menos un número consecutivo del array. El array nunca está vacío y puede contener solo negativos.',
    example:'sumaSubarray([−2, 1, −3, 4, −1, 2, 1]) → 6',
    starter:'function sumaSubarray(numeros) {\n  // Devuelve la mayor suma\n}',
    hint:'Para cada posición, decide si conviene seguir el tramo anterior o empezar uno nuevo desde ese número.',
    explanation:'Si la suma acumulada perjudica al siguiente número, empiezas otra vez. Mantienes el mejor valor visto. Esto es el algoritmo de Kadane.',
    solution:'function sumaSubarray(numeros) {\n  let actual = numeros[0], mejor = numeros[0];\n  for (let i = 1; i < numeros.length; i++) {\n    actual = Math.max(numeros[i], actual + numeros[i]);\n    mejor = Math.max(mejor, actual);\n  }\n  return mejor;\n}',
    tests:[{args:[[-2,1,-3,4,-1,2,1]],expected:6},{args:[[-5,-2,-8]],expected:-2},{args:[[1]],expected:1},{args:[[5,-9,4,3]],expected:7}]
  },
  {
    id:'anagramas',title:'Agrupa anagramas',level:'Medio',category:'Strings',minutes:20,
    statement:'Agrupa palabras que contienen las mismas letras, aunque estén en otro orden. Usa solo letras minúsculas a-z. Conserva el orden de aparición de los grupos y de las palabras.',
    example:'agruparAnagramas(["roma", "amor", "perro"]) → [["roma", "amor"], ["perro"]]',
    starter:'function agruparAnagramas(palabras) {\n  // Devuelve un array de grupos\n}',
    hint:'Si ordenas las letras de dos anagramas, obtienes la misma clave. Un Map agrupa por esa clave.',
    explanation:'La palabra ordenada sirve de firma. Map mantiene el orden en que aparecieron los primeros miembros de cada grupo.',
    solution:'function agruparAnagramas(palabras) {\n  const grupos = new Map();\n  for (const palabra of palabras) {\n    const clave = [...palabra].sort().join("");\n    if (!grupos.has(clave)) grupos.set(clave, []);\n    grupos.get(clave).push(palabra);\n  }\n  return [...grupos.values()];\n}',
    tests:[{args:[['roma','amor','perro']],expected:[['roma','amor'],['perro']]},{args:[[]],expected:[]},{args:[['','a','']],expected:[['',''],['a']]},{args:[['eat','tea','tan','ate','nat','bat']],expected:[['eat','tea','ate'],['tan','nat'],['bat']]}]
  },
  {
    id:'rangos',title:'Resume rangos consecutivos',level:'Medio',category:'Arrays',minutes:18,
    statement:'Recibes un array de enteros ordenados y sin repetidos. Agrupa cada secuencia consecutiva como "inicio->fin"; los números aislados quedan como texto.',
    example:'resumirRangos([0, 1, 2, 4, 5, 7]) → ["0->2", "4->5", "7"]',
    starter:'function resumirRangos(numeros) {\n  // Devuelve las etiquetas de cada rango\n}',
    hint:'Recuerda el inicio de cada tramo. Cuando el siguiente número ya no sea el anterior + 1, cierra el tramo.',
    explanation:'Avanzas hasta el final de un bloque consecutivo. Si inicio y fin son iguales, escribes un número; si difieren, escribes el rango.',
    solution:'function resumirRangos(numeros) {\n  const salida = []; let i = 0;\n  while (i < numeros.length) {\n    const inicio = numeros[i];\n    while (i + 1 < numeros.length && numeros[i+1] === numeros[i] + 1) i++;\n    salida.push(inicio === numeros[i] ? String(inicio) : `${inicio}->${numeros[i]}`);\n    i++;\n  }\n  return salida;\n}',
    tests:[{args:[[0,1,2,4,5,7]],expected:['0->2','4->5','7']},{args:[[]],expected:[]},{args:[[-2,-1,0,2]],expected:['-2->0','2']},{args:[[5]],expected:['5']}]
  },
  {
    id:'subcadena-unica',title:'Subcadena sin repetir',level:'Difícil',category:'Strings',minutes:25,
    statement:'Devuelve la longitud del tramo consecutivo más largo de un texto en el que ningún carácter se repite. Mayúsculas y minúsculas son distintas.',
    example:'longitudSinRepetir("abcabcbb") → 3',
    starter:'function longitudSinRepetir(texto) {\n  // Devuelve una longitud\n}',
    hint:'Usa una ventana con inicio y fin. Si un carácter ya apareció dentro de la ventana, mueve el inicio justo después de su última posición.',
    explanation:'Un Map recuerda el último índice de cada carácter. La ventana siempre contiene caracteres únicos y puedes calcular su tamaño en cada paso.',
    solution:'function longitudSinRepetir(texto) {\n  const ultima = new Map(); let inicio = 0, mejor = 0;\n  for (let i = 0; i < texto.length; i++) {\n    const c = texto[i];\n    if (ultima.has(c)) inicio = Math.max(inicio, ultima.get(c) + 1);\n    ultima.set(c, i);\n    mejor = Math.max(mejor, i - inicio + 1);\n  }\n  return mejor;\n}',
    tests:[{args:['abcabcbb'],expected:3},{args:['bbbbb'],expected:1},{args:['pwwkew'],expected:3},{args:[''],expected:0},{args:['abba'],expected:2},{args:['Aa'],expected:2}]
  },
  {
    id:'fusionar-intervalos',title:'Fusiona intervalos',level:'Difícil',category:'Arrays',minutes:25,
    statement:'Recibes intervalos [inicio, fin]. Fusiona los que se solapan o se tocan y devuelve intervalos ordenados por inicio. No modifiques el array original.',
    example:'fusionarIntervalos([[1,3],[2,6],[8,10]]) → [[1,6],[8,10]]',
    starter:'function fusionarIntervalos(intervalos) {\n  // Devuelve intervalos fusionados\n}',
    hint:'Ordena una copia por inicio. Compara cada intervalo con el último del resultado.',
    explanation:'Si el siguiente intervalo empieza antes de que acabe el anterior, amplías el final. Si hay hueco, empiezas un grupo nuevo.',
    solution:'function fusionarIntervalos(intervalos) {\n  const ordenados = intervalos.map(par => [...par]).sort((a,b) => a[0]-b[0]);\n  const salida = [];\n  for (const par of ordenados) {\n    const ultimo = salida[salida.length - 1];\n    if (ultimo && par[0] <= ultimo[1]) ultimo[1] = Math.max(ultimo[1], par[1]);\n    else salida.push(par);\n  }\n  return salida;\n}',
    tests:[{args:[[[1,3],[2,6],[8,10]]],expected:[[1,6],[8,10]]},{args:[[[1,4],[4,5]]],expected:[[1,5]]},{args:[[]],expected:[]},{args:[[[8,9],[1,2],[2,3]]],expected:[[1,3],[8,9]]},{args:[[[1,10],[2,3]]],expected:[[1,10]]}]
  },
  {
    id:'producto-excepto',title:'Producto salvo el propio',level:'Difícil',category:'Arrays',minutes:28,
    statement:'Devuelve un array donde cada posición contiene el producto de todos los números excepto el de esa posición. No uses división. El array tiene al menos dos elementos.',
    example:'productoExcepto([1, 2, 3, 4]) → [24, 12, 8, 6]',
    starter:'function productoExcepto(numeros) {\n  // Devuelve los productos\n}',
    hint:'Calcula primero el producto de todo lo que hay a la izquierda de cada posición. Luego recorre desde la derecha y multiplícalo por el producto de ese lado.',
    explanation:'Dos pasadas guardan el producto del prefijo y del sufijo sin incluir el elemento actual. Así funciona incluso si hay ceros.',
    solution:'function productoExcepto(numeros) {\n  const salida = Array(numeros.length).fill(1);\n  let izquierda = 1;\n  for (let i = 0; i < numeros.length; i++) { salida[i] = izquierda; izquierda *= numeros[i]; }\n  let derecha = 1;\n  for (let i = numeros.length - 1; i >= 0; i--) { salida[i] *= derecha; derecha *= numeros[i]; }\n  return salida;\n}',
    tests:[{args:[[1,2,3,4]],expected:[24,12,8,6]},{args:[[0,1,2]],expected:[2,0,0]},{args:[[0,0,2]],expected:[0,0,0]},{args:[[-1,2,-3]],expected:[-6,3,-2]},{args:[[5,7]],expected:[7,5]}]
  }
);
