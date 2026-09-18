(() => {
  'use strict';

  const centres = [
    ['Central','Danthure','Kawani technique; Kandyan heritage.'],['Central','Mawathura','Dumbara designs; dyeing and women’s production.'],['Central','Dulwala','Pethampili; texture and colour blending.'],
    ['North-western','Horombawa','Bold colour; practical fabric use.'],['North-western','Makulwewa','Women-led production; durable design.'],['North-western','Polgolla','Natural dye and eco-printing.'],
    ['Southern','Warakapitiya','Natural dyes; award-winning Ransalu work.'],['Southern','Mahamodara Ransalu Arcade','Dik-border; coastal influence; light fabrics.'],['Southern','Kahawa','Dig-Jala; locally inspired patterns.'],
    ['Eastern','Manchanthoduvai','Lightweight fabrics; subtle colours.'],['Eastern','Iruthayapuram','Bold contrasts and patterned textures.'],['Eastern','Chettipalayam','Traditional methods; symbolic designs.'],
    ['Northern','Siruppity','Traditional methods and skill transfer.'],['Northern','Nallur North','Northern Province handloom practice.'],['Northern','Manthuvil','Regional weaving knowledge and adaptation.']
  ];

  const grid = document.querySelector('#centres');
  const filter = document.querySelector('#provinceFilter');
  if (grid && filter) {
    const renderCentres = () => {
      const value = filter.value;
      const shown = centres.filter(c => value === 'all' || c[0] === value);
      grid.innerHTML = shown.map((c, i) => `<article class="centre-card"><span class="num">${String(i + 1).padStart(2,'0')} / ${shown.length}</span><div><div class="province">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p></div></article>`).join('');
    };
    filter.addEventListener('change', renderCentres);
    renderCentres();
  }

  const header = document.querySelector('.site-header');
  if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 24), {passive:true});

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  // Deliberately lazy: neither the viewer library nor the 22 MB GLB is requested on page load.
  const loadButton = document.querySelector('#loadModel');
  const shell = document.querySelector('#viewerShell');
  const poster = document.querySelector('#viewerPoster');
  const stage = document.querySelector('#viewerStage');
  const status = document.querySelector('#viewerStatus');
  let loading = false;
  let libraryPromise = null;

  const sources = [
    'https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js',
    'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.1.0/dist/model-viewer.min.js',
    'https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js'
  ];

  function loadLibrary() {
    if (customElements.get('model-viewer')) return Promise.resolve();
    if (libraryPromise) return libraryPromise;
    libraryPromise = new Promise((resolve, reject) => {
      let index = 0;
      const attempt = () => {
        if (customElements.get('model-viewer')) return resolve();
        if (index >= sources.length) return reject(new Error('viewer-library'));
        const src = sources[index++];
        const script = document.createElement('script');
        script.type = 'module';
        script.src = src;
        script.async = true;
        let settled = false;
        const finish = (ok) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (ok) resolve(); else { script.remove(); attempt(); }
        };
        const timer = setTimeout(() => finish(false), 10000);
        script.onload = () => {
          const wait = setTimeout(() => finish(false), 5000);
          customElements.whenDefined('model-viewer').then(() => { clearTimeout(wait); finish(true); }).catch(() => finish(false));
        };
        script.onerror = () => finish(false);
        document.head.appendChild(script);
      };
      attempt();
    });
    return libraryPromise;
  }

  function resetViewer(message) {
    if (stage) { stage.hidden = true; stage.innerHTML = ''; }
    if (poster) poster.hidden = false;
    if (loadButton) { loadButton.disabled = false; loadButton.textContent = 'Retry 3D twin'; }
    if (status) status.textContent = message;
    loading = false;
  }

  async function startViewer() {
    if (!loadButton || !shell || !stage || loading) return;
    loading = true;
    loadButton.disabled = true;
    loadButton.textContent = 'Loading viewer…';
    if (status) status.textContent = 'Connecting to the 3D viewer…';
    try {
      await loadLibrary();
      if (poster) poster.hidden = true;
      stage.hidden = false;
      const viewer = document.createElement('model-viewer');
      viewer.setAttribute('src', 'assets/models/handloom-01.glb');
      viewer.setAttribute('camera-controls', '');
      viewer.setAttribute('touch-action', 'pan-y');
      viewer.setAttribute('shadow-intensity', '0.65');
      viewer.setAttribute('exposure', '1');
      viewer.setAttribute('alt', 'Interactive digital twin of a Sri Lankan handloom garment');
      viewer.setAttribute('interaction-prompt', 'auto');
      viewer.setAttribute('ar', '');
      viewer.style.width = '100%';
      viewer.style.height = '100%';
      viewer.addEventListener('load', () => {
        if (status) status.textContent = 'Loaded. Drag to rotate; wheel or pinch to zoom.';
        loadButton.textContent = '3D twin loaded';
        loading = false;
      }, {once:true});
      viewer.addEventListener('error', () => resetViewer('The model could not be loaded. Check the GitHub Pages file path and try again.'), {once:true});
      stage.appendChild(viewer);
      if (status) status.textContent = 'Downloading the 3D model…';
    } catch (error) {
      resetViewer('The 3D viewer library could not be reached. Check your connection and try again.');
    }
  }

  if (loadButton) loadButton.addEventListener('click', startViewer);
})();
