# JS Interview Lab

Web en español para preparar entrevistas de JavaScript y frontend. Cada tema ofrece una explicación sencilla, una analogía, una versión técnica y preguntas con respuesta razonada.

## Contenido

- 26 temas y 52 preguntas sobre JavaScript, React, TypeScript, CSS, algoritmos, testing y arquitectura.
- Tres casos guiados: tabla reutilizable, modal accesible y búsqueda con respuestas fuera de orden.
- Simulacro, reto diario, repaso de fallos y progreso guardado en el navegador mediante `localStorage`.
- Referencias de documentación en cada lección. El índice de [DevCaress](https://github.com/DevCaress/guia-entrevistas-de-programacion) ayudó a seleccionar temas; las explicaciones y preguntas de esta web son propias.

## Ejecutar

Es una web estática sin instalación ni dependencias de build. Sirve la carpeta `dist` con un servidor HTTP local:

```bash
python3 -m http.server 8000 --directory dist
```

Abre `http://localhost:8000`. También puedes publicar `dist` en cualquier alojamiento estático.

## Estructura

- `dist/content.js`: lecciones iniciales y preguntas.
- `dist/content-extra.js`: ampliación del temario, explicaciones sencillas y casos prácticos.
- `dist/app.js`: navegación, cuestionarios y progreso.
- `dist/styles.css`: diseño responsive.

El progreso se guarda solo en el navegador y no se sincroniza entre dispositivos. No hay backend ni cuentas.

## Verificación rápida

```bash
node --check dist/content.js
node --check dist/content-extra.js
node --check dist/app.js
```

Web publicada: [JS Interview Lab](https://js-interview-lab-monica.monicatvera.chatgpt.site) (el acceso puede requerir permiso del propietario).
