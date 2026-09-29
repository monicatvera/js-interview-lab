window.LOCAL_TUTOR = (() => {
  let enginePromise;
  const ask = async (problem, code, result, onProgress) => {
    if (!navigator.gpu) throw Error('Tu navegador no ofrece WebGPU para ejecutar el modelo local. Los tests y pistas siguen disponibles.');
    if (!enginePromise) enginePromise = (async () => {
      const webllm = await import('https://esm.run/@mlc-ai/web-llm@0.2.85');
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw Error('No se pudo iniciar WebGPU en este dispositivo.');
      const f16 = adapter.features.has('shader-f16');
      const model = f16 ? 'SmolLM2-360M-Instruct-q4f16_1-MLC' : 'SmolLM2-360M-Instruct-q4f32_1-MLC';
      return webllm.CreateMLCEngine(model, {initProgressCallback: p => onProgress(p.text)});
    })().catch(error => {enginePromise = null; throw error});
    const engine = await enginePromise;
    const response = await engine.chat.completions.create({
      messages:[
        {role:'system',content:'Eres una tutora paciente de JavaScript. Responde en español sencillo, máximo 120 palabras. Da una pista concreta basada en el fallo, no el código completo. Si los tests pasan, sugiere un caso límite o mejora. No afirmes que el código es correcto por inspección: los tests son la fuente de verdad.'},
        {role:'user',content:`Reto: ${problem.title}. ${problem.statement}\nCódigo del alumno:\n${code.slice(0,3000)}\nResultado de tests: ${result.slice(0,1200)}\nDame una pista para el siguiente paso.`}
      ],temperature:0.3,max_tokens:180
    });
    return response.choices[0]?.message?.content || 'No se generó una respuesta. Prueba una pista guiada.';
  };
  return {ask};
})();
