const centres = [
  {province:'Central',name:'Danthure',detail:'Kawani technique; Kandyan heritage.'},
  {province:'Central',name:'Mawathura',detail:'Dumbara designs; dyeing and women’s production.'},
  {province:'Central',name:'Dulwala',detail:'Pethampili; texture and colour blending.'},
  {province:'North-western',name:'Horombawa',detail:'Bold colour; practical fabric use.'},
  {province:'North-western',name:'Makulwewa',detail:'Women-led production; durable design.'},
  {province:'North-western',name:'Polgolla',detail:'Natural dye and eco-printing.'},
  {province:'Southern',name:'Warakapitiya',detail:'Natural dyes; award-winning Ransalu work.'},
  {province:'Southern',name:'Mahamodara Ransalu Arcade',detail:'Dik-border; coastal influence; light fabrics.'},
  {province:'Southern',name:'Kahawa',detail:'Dig-Jala; locally inspired patterns.'},
  {province:'Eastern',name:'Manchanthoduvai',detail:'Lightweight fabrics; subtle colours.'},
  {province:'Eastern',name:'Iruthayapuram',detail:'Bold contrasts and patterned textures.'},
  {province:'Eastern',name:'Chettipalayam',detail:'Traditional methods; symbolic designs.'},
  {province:'Northern',name:'Siruppity',detail:'Traditional methods and skill transfer.'},
  {province:'Northern',name:'Nallur North',detail:'Northern Province handloom practice.'},
  {province:'Northern',name:'Manthuvil',detail:'Regional weaving knowledge and adaptation.'}
];

const grid = document.querySelector('#centres');
const filter = document.querySelector('#provinceFilter');
function renderCentres(){
  const value = filter.value;
  const shown = centres.filter(c => value === 'all' || c.province === value);
  grid.innerHTML = shown.map((c,i) => `<article class="centre-card"><span class="num">${String(i+1).padStart(2,'0')} / ${shown.length}</span><div><div class="province">${c.province}</div><h3>${c.name}</h3><p>${c.detail}</p></div></article>`).join('');
}
filter.addEventListener('change', renderCentres);
renderCentres();

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), {passive:true});
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
}));

// The 3D library and the 22 MB GLB are deliberately loaded only after user action.
const loadButton = document.querySelector('#loadModel');
const viewerShell = document.querySelector('#viewerShell');
const poster = document.querySelector('#viewerPoster');
const status = document.querySelector('#viewerStatus');
let viewerLoading = false;

function loadModelViewerLibrary(){
  return new Promise((resolve, reject) => {
    if (customElements.get('model-viewer')) return resolve();
    const urls = [
      'https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js',
      'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.1.0/dist/model-viewer.min.js',
      'https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js'
    ];
    let index = 0;
    const tryNext = () => {
      if (customElements.get('model-viewer')) return resolve();
      if (index >= urls.length) return reject(new Error('3D viewer library could not be loaded.'));
      const script = document.createElement('script');
      script.type = 'module';
      script.src = urls[index++];
      script.dataset.modelViewer = 'true';
      script.onload = () => customElements.whenDefined('model-viewer').then(resolve).catch(tryNext);
      script.onerror = () => { script.remove(); tryNext(); };
      document.head.appendChild(script);
    };
    tryNext();
  });
}

loadButton.addEventListener('click', async () => {
  if (viewerLoading || customElements.get('model-viewer')) return;
  viewerLoading = true;
  loadButton.disabled = true;
  loadButton.textContent = 'Loading viewer…';
  status.textContent = 'Loading the interactive viewer and model. This may take a moment.';
  try {
    await loadModelViewerLibrary();
    const viewer = document.createElement('model-viewer');
    viewer.id = 'modelViewer';
    viewer.setAttribute('src', 'assets/models/handloom-01.glb');
    viewer.setAttribute('camera-controls', '');
    viewer.setAttribute('touch-action', 'pan-y');
    viewer.setAttribute('shadow-intensity', '0.7');
    viewer.setAttribute('exposure', '1');
    viewer.setAttribute('auto-rotate', '');
    viewer.setAttribute('rotation-per-second', '12deg');
    viewer.setAttribute('alt', 'Interactive digital twin of a Sri Lankan handloom garment');
    viewer.addEventListener('load', () => {
      status.textContent = 'Model loaded. Drag to rotate; scroll or pinch to zoom.';
      viewerShell.classList.add('model-ready');
    }, {once:true});
    viewer.addEventListener('error', () => {
      status.textContent = 'The GLB could not be displayed. Check that assets/models/handloom-01.glb is present in the GitHub repository.';
      loadButton.disabled = false;
      loadButton.textContent = 'Retry 3D twin';
      viewerLoading = false;
    }, {once:true});
    poster.replaceWith(viewer);
  } catch (error) {
    status.textContent = 'The 3D viewer library could not be loaded. Check your connection and try again.';
    loadButton.disabled = false;
    loadButton.textContent = 'Retry 3D twin';
    viewerLoading = false;
  }
});
