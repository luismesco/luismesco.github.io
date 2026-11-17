(() => {
  'use strict';
  const state = document.querySelector('#offline-state');
  const retry = document.querySelector('#save-offline');
  const install = document.querySelector('#install-app');
  const help = document.querySelector('#install-dialog');
  const evidenceDialog = document.querySelector('#evidence-dialog');
  const select = document.querySelector('#evidence-select');
  let evidence, registration, installPrompt;
  const announce = (text, ready = false) => { state.textContent = text; state.dataset.ready = String(ready); };
  const showHelp = () => help.showModal();
  document.querySelector('#help-app').addEventListener('click', showHelp);
  document.querySelector('#close-install').addEventListener('click', () => help.close());
  document.querySelector('#close-evidence').addEventListener('click', () => evidenceDialog.close());
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
  window.addEventListener('appinstalled', () => { install.hidden = true; });
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) install.hidden = true;
  install.addEventListener('click', async () => {
    if (!installPrompt) return showHelp();
    const prompt = installPrompt; installPrompt = null;
    await prompt.prompt(); await prompt.userChoice;
    if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
  });
  async function getEvidence() {
    if (!evidence) {
      const response = await fetch('./evidencia.json');
      if (!response.ok) throw new Error('No se pudo abrir la evidencia.');
      evidence = await response.json();
      Object.entries(evidence).sort((a,b) => Number(b[1].monto)-Number(a[1].monto) || Number(a[0])-Number(b[0])).forEach(([key, value]) => {
        const option = document.createElement('option'); option.value = key;
        option.textContent = `Conclusión ${key} · ${value.titulo}`; select.append(option);
      });
    }
    return evidence;
  }
  async function showEvidence(key) {
    const area = document.querySelector('#evidence-images');
    if (!evidenceDialog.open) evidenceDialog.showModal();
    area.textContent = 'Abriendo capturas…';
    try {
      const data = await getEvidence(); const item = data[String(key)];
      if (!item) throw new Error('No se localizó la conclusión.');
      select.value = String(key);
      document.querySelector('#evidence-title').textContent = `Conclusión ${key} · Evidencia`;
      area.replaceChildren();
      item.imagenes.forEach(capture => {
        const figure = document.createElement('figure'), caption = document.createElement('figcaption');
        caption.textContent = `${capture.titulo}. ${capture.tipo}.`;
        const img = document.createElement('img'); img.src = capture.src; img.alt = capture.titulo;
        img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', `Ampliar: ${capture.titulo}`);
        const zoom = () => { const expanded = img.classList.toggle('zoom'); img.setAttribute('aria-label', `${expanded?'Reducir':'Ampliar'}: ${capture.titulo}`); };
        img.addEventListener('click', zoom); img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();zoom();} });
        img.addEventListener('error', () => { const error = document.createElement('p'); error.textContent = 'Esta captura no está guardada. Abre la app con conexión y elige «Guardar de nuevo».'; figure.append(error); });
        figure.append(caption, img); area.append(figure);
      });
    } catch (error) { area.textContent = `${error.message} Conecta el dispositivo y vuelve a guardar la app.`; }
  }
  document.querySelectorAll('[data-evidence]').forEach(button => button.addEventListener('click', () => showEvidence(button.dataset.evidence)));
  select.addEventListener('change', () => showEvidence(select.value));
  function workerStatus(worker, type = 'STATUS') {
    return new Promise((resolve, reject) => {
      if (!worker) return reject(new Error('La app aún se está preparando.'));
      const channel = new MessageChannel(); const timer = setTimeout(() => reject(new Error('No se pudo confirmar el guardado.')), 10000);
      channel.port1.onmessage = event => { clearTimeout(timer); resolve(event.data); };
      worker.postMessage({ type }, [channel.port2]);
    });
  }
  async function confirmSaved() {
    try {
      const reg = registration || await navigator.serviceWorker.ready;
      const result = await workerStatus(reg.active);
      if (result.complete) {
        announce(navigator.onLine ? 'Disponible sin conexión: análisis, ficha, PDF y capturas.' : 'Sin conexión · contenido guardado disponible.', true);
        retry.hidden = true;
      } else {
        announce('Guardado incompleto. Conecta el dispositivo y guarda de nuevo.'); retry.hidden = false;
      }
    } catch (_) { announce('Aún no se confirmó la copia sin conexión.'); retry.hidden = false; }
  }
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    announce('Para guardar sin conexión, abre la dirección publicada de la app.');
  } else {
    navigator.serviceWorker.addEventListener('message', event => {
      const msg = event.data || {};
      if (msg.type === 'OFFLINE_PROGRESS') announce(`Guardando para usar sin conexión… ${msg.done}/${msg.total}`);
      if (msg.type === 'OFFLINE_ERROR') { announce('No terminó el guardado. Conserva la conexión y vuelve a intentarlo.');retry.hidden = false; }
      if (msg.type === 'OFFLINE_READY') confirmSaved();
    });
    navigator.serviceWorker.addEventListener('controllerchange', confirmSaved);
    navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).then(async reg => {
      registration = reg;
      await navigator.serviceWorker.ready; await confirmSaved();
    }).catch(() => {
      if (navigator.serviceWorker.controller) confirmSaved();
      else {announce('Abre la app con conexión para guardar su contenido.');retry.hidden = false;}
    });
    retry.addEventListener('click', async () => {
      retry.hidden = true;announce('Guardando para usar sin conexión…');
      try {
        const reg = registration || await navigator.serviceWorker.getRegistration('./');
        if (reg?.active) await workerStatus(reg.active, 'REPAIR');
        else { await reg?.unregister();registration = await navigator.serviceWorker.register('./sw.js', {scope:'./',updateViaCache:'none'});await navigator.serviceWorker.ready; }
        await confirmSaved();
      } catch (_) { announce('No terminó el guardado. Revisa la conexión y el espacio disponible.');retry.hidden = false; }
    });
    window.addEventListener('online', confirmSaved); window.addEventListener('offline', confirmSaved);
  }
})();
