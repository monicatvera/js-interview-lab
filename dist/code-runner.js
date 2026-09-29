// Cada ejecución se crea en un Worker nuevo para cortar bucles infinitos sin congelar la página.
const equal = (a,b) => {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
  return ka.length === kb.length && ka.every((key,i) => key === kb[i] && equal(a[key],b[key]));
};
self.onmessage = ({data}) => {
  const results = [];
  try {
    const solve = new Function(`"use strict"; return (${data.code});`)();
    if (typeof solve !== 'function') throw Error('Tu código debe definir una función.');
    for (const test of data.tests) {
      try {
        const inputs = structuredClone(test.args), before = structuredClone(inputs);
        const actual = solve(...inputs);
        if (actual && typeof actual.then === 'function') throw Error('Este reto espera una respuesta síncrona.');
        const changed = !!test.preserveInput && !equal(inputs,before);
        results.push({ok:equal(actual,test.expected) && !changed,actual:JSON.stringify(actual) ?? String(actual),error:changed?'Has modificado la entrada original.':''});
      } catch (error) { results.push({ok:false,error:String(error.message || error).slice(0,180)}); }
    }
    self.postMessage({results});
  } catch (error) {self.postMessage({error:String(error.message || error).slice(0,180)});}
};
