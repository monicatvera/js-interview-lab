import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const base = (process.env.SITE_BASE_URL || 'https://monicatvera.github.io/js-interview-lab/').replace(/\/?$/, '/');
const scripts = [
  'content.js', 'content-extra.js', 'content-polish.js', 'content-senior.js',
  'content-core-extra.js', 'output-challenges.js', 'code-problems.js',
  'code-problems-extra.js', 'patterns.js', 'interview-workshops.js',
  'interview-workshops-extra.js', 'interview-production.js', 'react-deep-dive.js', 'browser-interview.js', 'react-senior-prep.js', 'realtime-web.js',
];
const context = vm.createContext({ window: {} });
for (const file of scripts) vm.runInContext(fs.readFileSync(path.join(dist, file), 'utf8'), context, { filename: file });
const lessons = context.window.COURSE;
const beginner = context.window.BEGINNER;
if (!Array.isArray(lessons) || lessons.length < 48) throw new Error('Faltan lecciones en el temario');
if (new Set(lessons.map(t => t.id)).size !== lessons.length) throw new Error('Hay IDs de tema duplicados');

const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const topicUrl = topic => `${base}temas/${encodeURIComponent(topic.id)}.html`;
const topicLink = topic => `<a href="${encodeURIComponent(topic.id)}.html">${escape(topic.title)}</a>`;
const description = topic => `${topic.title}: ${topic.subtitle} Aprende la idea con un ejemplo y practica preguntas de entrevista frontend.`.slice(0, 160);
const shell = ({ title, summary, canonical, body }) => `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#101525">
  <title>${escape(title)} · JS Interview Lab</title>
  <meta name="description" content="${escape(summary)}">
  <link rel="canonical" href="${escape(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escape(title)} · JS Interview Lab">
  <meta property="og:description" content="${escape(summary)}">
  <meta property="og:url" content="${escape(canonical)}">
  <link rel="stylesheet" href="../styles.css">
</head>
<body><div class="shell">
  <header class="topbar"><a class="brand" href="../" aria-label="JS Interview Lab, inicio"><span class="brand-mark">{JS}</span><span>interview<span class="brand-accent">lab</span></span></a><span class="top-note">Aprende y practica para entrevistas frontend</span></header>
  <main>${body}</main>
  <footer class="footer"><a href="index.html">Todos los temas</a><span>JS Interview Lab · Aprende, razona y practica</span></footer>
</div></body>
</html>
`;

fs.mkdirSync(path.join(dist, 'temas'), { recursive: true });
for (const topic of lessons) {
  if (!/^[a-z0-9-]+$/.test(topic.id)) throw new Error(`ID no válido: ${topic.id}`);
  const simple = beginner[topic.id];
  if (!simple) throw new Error(`Falta explicación sencilla: ${topic.id}`);
  const related = lessons.filter(other => other.id !== topic.id && other.category === topic.category).slice(0, 3);
  const body = `<article class="view seo-topic">
    <nav aria-label="Ruta"><a href="index.html">Todos los temas</a> <span aria-hidden="true">›</span> ${escape(topic.category)}</nav>
    <div class="lesson-head"><span class="topic-icon" aria-hidden="true">${escape(topic.icon)}</span><div><span class="eyebrow">${escape(topic.category)} · ${topic.minutes} min</span><h1>${escape(topic.title)}</h1><p>${escape(topic.subtitle)}</p></div></div>
    <div class="lesson-grid"><div class="lesson-card">
      <div class="simple-box"><span class="panel-kicker">La idea, en pocas palabras</span><p class="simple-main">${escape(simple.plain)}</p><p><strong>Piensa en este caso:</strong> ${escape(simple.analogy)}</p></div>
      <h2>Cómo funciona</h2><p>${escape(topic.theory)}</p>
      <h2>Un ejemplo</h2><pre class="code"><code>${escape(topic.example)}</code></pre>
      <div class="steps-box"><strong>Cómo razonarlo</strong><p>${escape(simple.steps)}</p></div>
      <p class="takeaway"><strong>Cómo explicarlo en una entrevista:</strong> ${escape(topic.takeaway)}</p>
      <h2>Comprueba si lo has entendido</h2><ul>${topic.questions.map(q => `<li>${escape(q.q)}</li>`).join('')}</ul>
      <a class="primary seo-cta" href="../#tema/${encodeURIComponent(topic.id)}">Practicar ${topic.questions.length} preguntas con explicaciones →</a>
    </div><aside class="lesson-card"><span class="pill">Sigue aprendiendo</span><h2>Documentación</h2><p>Consulta la fuente original si quieres profundizar.</p><a class="source-link" href="${escape(topic.source)}" target="_blank" rel="noopener noreferrer">Abrir documentación ↗</a>${related.length ? `<h2>Temas relacionados</h2><ul class="seo-related">${related.map(other => `<li>${topicLink(other)}</li>`).join('')}</ul>` : ''}</aside></div>
  </article>`;
  fs.writeFileSync(path.join(dist, 'temas', `${topic.id}.html`), shell({
    title: topic.title, summary: description(topic), canonical: topicUrl(topic), body,
  }));
}

const categories = [...new Set(lessons.map(topic => topic.category))];
const indexBody = `<div class="view seo-index"><div class="eyebrow">Guía para entrevistas frontend</div><h1>Temas explicados desde cero</h1><p>Elige qué quieres entender. Cada lección incluye una idea sencilla, un ejemplo y preguntas para practicar gratis y sin cuenta.</p>${categories.map(category => `<section><h2>${escape(category)}</h2><ul>${lessons.filter(topic => topic.category === category).map(topic => `<li>${topicLink(topic)}<span>${escape(topic.subtitle)}</span></li>`).join('')}</ul></section>`).join('')}<a class="primary seo-cta" href="../">Entrar al mapa interactivo →</a></div>`;
fs.writeFileSync(path.join(dist, 'temas', 'index.html'), shell({
  title: 'Temas de JavaScript y frontend',
  summary: `Aprende ${lessons.length} temas de JavaScript, React, TypeScript, CSS y arquitectura con explicaciones sencillas y preguntas de entrevista.`,
  canonical: `${base}temas/`, body: indexBody,
}));
const urls = [base, `${base}temas/`, ...lessons.map(topicUrl)];
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Generadas ${lessons.length} páginas de tema y sitemap con ${urls.length} URL.`);
