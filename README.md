# JS Interview Lab

Web en español para entender conceptos de JavaScript y frontend y practicar entrevistas sin memorizar respuestas a ciegas.

## Qué encontrarás

- 38 temas con una idea sencilla, una explicación, código y una forma de razonarlo en entrevista.
- 76 preguntas con respuesta explicada.
- Veintisiete retos de código por niveles con editor, tests automáticos, pistas, soluciones y progreso.
- Dieciséis entrevistas guiadas: React, diseño frontend, refactorización, Git/CI, componentes prácticos y situaciones de producción. Incluyen un `useFetch` cancelable, un dashboard con polling y reintentos, y un simulacro para contar un proyecto con criterio.
- Cuatro patrones para resolver problemas (mapas, dos punteros, ventana deslizante y pila), con pasos visuales y enlaces a retos donde aplicarlos.
- Simulacro cronometrado de 35 minutos con un reto fácil, uno medio y uno difícil. El reloj se conserva al recargar la página durante esa sesión.
- Tutora IA local opcional mediante WebLLM: descarga un modelo en el navegador si hay WebGPU. Sin cuenta ni clave; los tests y las pistas funcionan aunque la IA no esté disponible.
- Ocho retos de «¿qué imprime?» donde escribes la salida y recibes una explicación por línea.
- Siete casos guiados: componentes, búsqueda y ejercicios de programación.
- Simulacro, reto diario, repaso de fallos y progreso guardado en este navegador con `localStorage`.
- Enlaces a la documentación original en cada lección.

El índice de [DevCaress](https://github.com/DevCaress/guia-entrevistas-de-programacion) ayudó a seleccionar temas. Las explicaciones y preguntas de esta web son propias.

## Ejecutar

No necesita instalar paquetes. Sirve la carpeta `dist` con un servidor HTTP local:

```sh
python3 -m http.server 8000 --directory dist
```

Abre `http://localhost:8000`. También puedes publicar la carpeta `dist` en un alojamiento estático.

## Dónde editar

- `dist/content.js`: primeros temas, ejemplos y preguntas.
- `dist/content-extra.js`: temas adicionales, explicaciones iniciales y casos prácticos.
- `dist/content-polish.js`: redacción clara de las explicaciones y respuestas. Se aplica después de los otros dos archivos.
- `dist/content-senior.js`: preguntas de entrevista senior y ejercicios adicionales.
- `dist/content-core-extra.js`: fundamentos que completan el temario de JavaScript.
- `dist/code-problems.js`: retos y casos de prueba.
- `dist/code-problems-extra.js`: retos adicionales de dificultad creciente.
- `dist/patterns.js`: guías visuales de patrones y relación con los retos.
- `dist/interview-workshops.js`: casos guiados y dos retos de código para tablas y búsquedas.
- `dist/interview-workshops-extra.js`: tres casos y retos adicionales de componentes con estados asíncronos.
- `dist/interview-production.js`: tres casos de entrevista sobre peticiones, polling y defensa de un proyecto, con dos retos de código relacionados.
- `dist/code-runner.js`: ejecución de soluciones en un Worker con límite de tiempo.
- `dist/local-tutor.js`: pistas opcionales con un modelo local.
- `dist/output-challenges.js`: código, salidas y explicación de cada reto escrito.
- `dist/app.js`: navegación, cuestionarios y progreso.
- `dist/styles.css`: diseño.
- `dist/index.html`: estructura y orden de los scripts.

Comprueba la sintaxis con `for file in dist/*.js; do node --check "$file" || exit 1; done`. El progreso no se sincroniza entre dispositivos: no hay cuentas ni servidor de datos.

[Abre la web publicada](https://monicatvera.github.io/js-interview-lab/).
