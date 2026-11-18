const CASOS = [{"c": 1, "id": 22, "titulo": "Cinco CFDI de nómina expedidos fuera de plazo", "monto": "371.06", "naturaleza": "Sustancial o de fondo"}, {"c": 4, "id": 26, "titulo": "Experiencia académica de dos ponentes", "monto": "1131.40", "naturaleza": "Formal"}, {"c": 5, "id": 27, "titulo": "Metas de catorce proyectos de actividades específicas", "monto": "1131.40", "naturaleza": "Formal"}, {"c": 14, "id": 35, "titulo": "Material didáctico y difusión de convocatorias", "monto": "1131.40", "naturaleza": "Formal"}, {"c": 18, "id": 40, "titulo": "Metas de diez proyectos de liderazgo de mujeres", "monto": "1131.40", "naturaleza": "Formal"}, {"c": 19, "id": 41, "titulo": "Ajustes a patrimonio sin autorización", "monto": "1131.40", "naturaleza": "Formal"}, {"c": 37, "id": 66, "titulo": "Cuatro registros en primera corrección", "monto": "1937.85", "naturaleza": "Sustancial o de fondo"}, {"c": 26, "id": 50, "titulo": "Afirme: cuenta activa tratada como cancelada", "monto": "13128.30", "naturaleza": "Sustancial o de fondo"}, {"c": 25, "id": 48, "titulo": "Banorte: cancelación del saldo sin comprobar destino", "monto": "19174.34", "naturaleza": "Sustancial o de fondo"}, {"c": 36, "id": 66, "titulo": "Registros fuera de tiempo: periodo normal", "monto": "32181.76", "naturaleza": "Sustancial o de fondo"}, {"c": 32, "id": 57, "titulo": "Saldos contrarios a la naturaleza de proveedores", "monto": "34999.52", "naturaleza": "Sustancial o de fondo"}, {"c": 27, "id": 52, "titulo": "BBVA: identidad bancaria y pólizas incompatibles", "monto": "87275.85", "naturaleza": "Sustancial o de fondo"}, {"c": 8, "id": 32, "titulo": "Liderazgo político de las mujeres: gasto mínimo", "monto": "135017.91", "naturaleza": "Sustancial o de fondo"}, {"c": 21, "id": 41, "titulo": "Catorce cuentas de campaña: saldo residual", "monto": "154743.26", "naturaleza": "Sustancial o de fondo"}, {"c": 2, "id": 25, "titulo": "Actividades específicas: porcentaje no destinado", "monto": "265531.73", "naturaleza": "Sustancial o de fondo"}, {"c": 31, "id": 57, "titulo": "Cuentas por pagar con antigüedad mayor a un año", "monto": "641755.61", "naturaleza": "Sustancial o de fondo"}, {"c": 24, "id": 46, "titulo": "Banorte: ingreso observado y egreso sancionado", "monto": "1059349.32", "naturaleza": "Sustancial o de fondo"}, {"c": 23, "id": 45, "titulo": "Banorte: acceso al expediente y comprobación del saldo", "monto": "2358731.96", "naturaleza": "Sustancial o de fondo"}, {"c": 22, "id": 44, "titulo": "Banco Azteca: saldo pendiente de comprobación", "monto": "6728035.67", "naturaleza": "Sustancial o de fondo"}];

(() => {
 'use strict';
 const pages=[...document.querySelectorAll('.page')], jump=document.querySelector('#jump'),search=document.querySelector('#reader-search'),nature=document.querySelector('#nature-filter'),state=document.querySelector('#search-state');
 const amountOrder=document.querySelector('#amount-order');
 const tabs=[...document.querySelectorAll('[data-view]')],panels=[];let current=0,view='conclusiones',presentationState;
 const money=n=>Number(n).toLocaleString('es-MX',{style:'currency',currency:'MXN'});
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const grid=document.createElement('main');grid.className='result-grid wrap';grid.id='resultados';pages[0].before(grid);
 function group(start,end,title,subtitle='',category='analisis',id='') {
  const parts=pages.slice(start-1,end),panel=document.createElement('details');panel.className='reader-panel';panel.dataset.category=category;if(id)panel.id=id;
  const summary=document.createElement('summary'),copy=document.createElement('span');copy.className='panel-copy';
  const heading=document.createElement('strong');heading.className='panel-heading';heading.textContent=title;copy.append(heading);
  if(subtitle){const small=document.createElement('span');small.className='panel-subtitle';small.textContent=subtitle;copy.append(small);}
  const affordance=document.createElement('span');affordance.className='panel-affordance';affordance.setAttribute('aria-hidden','true');affordance.textContent='+';
  summary.append(copy,affordance);panel.append(summary);parts.forEach(page=>panel.append(page));grid.append(panel);panels.push(panel);return panel;
 }
 group(1,1,'Resumen y propuesta de defensa','Hallazgos principales y clasificación jurídica');
 group(2,4,'Clasificación y criterios de revisión','Alcance del análisis · faltas formales y sustanciales o de fondo');
 group(5,7,'Tabla de sanciones','Las 19 conclusiones, de menor a mayor monto');
 group(8,8,'Proporcionalidad y cobro','Sanción y descuento de ministraciones');
 CASOS.forEach((c,i)=>{
  const panel=group(9+i*2,10+i*2,c.titulo,'','conclusiones',`caso-${c.c}`);panel.classList.add('case-panel');panel.dataset.conclusion=String(c.c);panel.dataset.nature=c.naturaleza;
  const copy=panel.querySelector('.panel-copy');const badges=document.createElement('span');badges.className='case-tags';
  const number=document.createElement('span');number.className='conclusion-tag';number.textContent=`Conclusión ${c.c}`;
  const type=document.createElement('span');type.className='nature-tag';type.textContent=c.naturaleza;badges.append(number,type);copy.prepend(badges);
  const code=document.createElement('span');code.className='panel-subtitle';code.textContent=`ID ${c.id} · ${pages[8+i*2].querySelector('.eyebrow').textContent.trim()}`;copy.append(code);
  const amount=document.createElement('span');amount.className='case-amount';const value=document.createElement('strong');value.textContent=money(c.monto);const caption=document.createElement('small');caption.textContent='Sanción propuesta';amount.append(value,caption);copy.append(amount);
 });
 group(47,51,'Seguimientos y efectos pendientes','Vistas, reintegros y asuntos distintos de las sanciones actuales');
 group(52,57,'Anexos y documentación','26 anexos de cálculo y tres anexos documentales','anexos','anexos');
 group(58,66,'Todas las observaciones','Consulta de los 70 ID del dictamen');
 group(67,68,'Fuentes y precedentes','Criterios aplicados y límites de su alcance','fuentes','fuentes');
 group(69,69,'Ruta de defensa','Conclusiones y acciones propuestas');
 panels.forEach(p=>p.dataset.search=norm(p.textContent));
 pages.forEach((p,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+p.dataset.title;jump.append(o)});
 function filter(){
  const terms=norm(search.value.trim()).split(/\s+/).filter(Boolean);let count=0;
  panels.forEach(panel=>{panel.hidden=!document.body.classList.contains('presentation')&&(panel.dataset.category!==view||terms.some(t=>!panel.dataset.search.includes(t))||(view==='conclusiones'&&nature.value&&panel.dataset.nature!==nature.value));if(!panel.hidden)count++;});
  if(grid.dataset.order!==amountOrder.value){
   const cases=panels.filter(panel=>panel.classList.contains('case-panel'));
   if(amountOrder.value.startsWith('number-'))cases.sort((a,b)=>Number(a.dataset.conclusion)-Number(b.dataset.conclusion));
   if(amountOrder.value.endsWith('desc'))cases.reverse();
   const anchor=panels.find(panel=>panel.dataset.category==='anexos').previousElementSibling;
   cases.forEach(panel=>grid.insertBefore(panel,anchor));
   grid.dataset.order=amountOrder.value;
  }
  amountOrder.disabled=view!=='conclusiones';
  const names={conclusiones:'conclusiones',analisis:'apartados de análisis',anexos:'apartado de anexos',fuentes:'apartado de fuentes'};
  const orderLabels={asc:'de menor a mayor sanción propuesta',desc:'de mayor a menor sanción propuesta','number-asc':'número de conclusión ascendente','number-desc':'número de conclusión descendente'};
  state.textContent=`${count} ${names[view]}${view==='conclusiones'?' · '+orderLabels[amountOrder.value]:''}`;
  nature.disabled=view!=='conclusiones';tabs.forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.view===view)));
 }
 function setView(value){view=value;filter();}
 tabs.forEach(t=>t.onclick=()=>{search.value='';nature.value='';setView(t.dataset.view);});
 function reveal(page){const panel=page.closest('details');if(panel){if(!document.body.classList.contains('presentation')){search.value='';nature.value='';setView(panel.dataset.category);}panel.hidden=false;panel.open=true;}}
 function go(i,scroll=true){current=Math.max(0,Math.min(pages.length-1,i));pages.forEach((p,j)=>p.classList.toggle('current',j===current));jump.value=current;document.querySelector('#counter').textContent=(current+1)+' / '+pages.length;if(scroll){reveal(pages[current]);pages[current].scrollIntoView({behavior:'smooth',block:'start'});}}
 const present=document.querySelector('#present');
 function mode(on){
  if(on){presentationState=panels.map(p=>({p,open:p.open,hidden:p.hidden}));document.body.classList.add('presentation');panels.forEach(p=>{p.open=true;p.hidden=false});}
  else{document.body.classList.remove('presentation');presentationState?.forEach(({p,open,hidden})=>{p.open=open;p.hidden=hidden});}
  present.textContent=on?'Volver a consulta':'Presentar';present.setAttribute('aria-pressed',String(on));go(current,on);
 }
 document.querySelector('#prev').onclick=()=>go(current-1);document.querySelector('#next').onclick=()=>go(current+1);jump.onchange=()=>go(Number(jump.value));present.onclick=()=>mode(!document.body.classList.contains('presentation'));
 document.querySelector('#expand-all').onclick=()=>panels.filter(p=>!p.hidden).forEach(p=>p.open=true);document.querySelector('#collapse-all').onclick=()=>panels.forEach(p=>p.open=false);
 search.addEventListener('input',filter);nature.addEventListener('change',filter);amountOrder.addEventListener('change',filter);
 document.querySelector('#clear-search').onclick=()=>{search.value='';nature.value='';filter();search.focus();};
 let printState;function preparePrint(){if(printState)return;panels.forEach(p=>grid.append(p));grid.dataset.order='asc';printState=panels.map(p=>({p,open:p.open,hidden:p.hidden}));panels.forEach(p=>{p.open=true;p.hidden=false});}
 function endPrint(){printState?.forEach(({p,open,hidden})=>{p.open=open;p.hidden=hidden});printState=null;filter();}
 window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',endPrint);document.querySelector('#print-app').onclick=()=>{preparePrint();window.print();};
 document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();go(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(current-1);}if(e.key==='Escape'&&document.body.classList.contains('presentation'))mode(false);});
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.getElementById(a.getAttribute('href').slice(1));if(!el)return;e.preventDefault();const page=el.closest('.page'),panel=el.closest('details');if(page){go(pages.indexOf(page));}else{if(panel){search.value='';nature.value='';setView(panel.dataset.category);panel.open=true;}el.scrollIntoView({behavior:'smooth',block:'start'});}}));
 go(0,false);filter();
 if(location.hash){const el=document.getElementById(location.hash.slice(1));if(el?.closest('.page'))go(pages.indexOf(el.closest('.page')));else if(el?.matches('.case-panel')){el.open=true;el.scrollIntoView();}}
})();
