const centres=[
 {province:'Central',name:'Danthure',detail:'Kawani technique; long-standing weaving traditions.'},
 {province:'Central',name:'Mawathura',detail:'Dumbara designs; weaving, dyeing and household production.'},
 {province:'Central',name:'Dulwala',detail:'Pethampili; texture and colour blending.'},
 {province:'North-western',name:'Horombawa',detail:'Rural household weaving; bold colour and practical fabric use.'},
 {province:'North-western',name:'Makulwewa',detail:'Community-led production with strong women’s participation.'},
 {province:'North-western',name:'Polgolla',detail:'Natural dye and eco-printing; refined textures.'},
 {province:'Southern',name:'Warakapitiya',detail:'Fine-quality textiles; natural dyes and award-winning work.'},
 {province:'Southern',name:'Mahamodara Ransalu Arcade',detail:'Coastal influences; Dik-border and lightweight fabrics.'},
 {province:'Southern',name:'Kahawa',detail:'Dig-Jala structures and locally inspired patterns.'},
 {province:'Eastern',name:'Manchanthoduvai',detail:'Lightweight fabrics and subtle colour schemes.'},
 {province:'Eastern',name:'Iruthayapuram',detail:'Bold contrasts, patterned textures and local identity.'},
 {province:'Eastern',name:'Chettipalayam',detail:'Symbolic designs and functional textile production.'},
 {province:'Northern',name:'Siruppity',detail:'Traditional methods, functional textiles and skill transfer.'},
 {province:'Northern',name:'Manthuvil',detail:'Regional weaving knowledge and contemporary adaptation.'},
 {province:'Northern',name:'Nallur North',detail:'Handloom practice within the Northern Province fieldwork network.'}
];
const grid=document.querySelector('#centres'); const filter=document.querySelector('#provinceFilter');
function renderCentres(){const value=filter.value; const shown=centres.filter(c=>value==='all'||c.province===value);grid.innerHTML=shown.map((c,i)=>`<article class="centre-card"><span class="num">${String(i+1).padStart(2,'0')} / 15</span><div><div class="province">${c.province}</div><h3>${c.name}</h3><p>${c.detail}</p></div></article>`).join('')}
filter.addEventListener('change',renderCentres); renderCentres();
const header=document.querySelector('.site-header'); window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav'); toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)}); nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const viewer=document.querySelector('#modelViewer'), shell=document.querySelector('#viewerShell'); viewer.addEventListener('load',()=>shell.classList.add('model-ready')); viewer.addEventListener('error',()=>shell.classList.remove('model-ready'));
