"use strict";
/* ===================== móveis: catálogo ===================== */
/* w = largura, d = profundidade (cm). uso = espaço livre de conforto em cada lado (cm):
   f = frente, t = trás, e = esquerda, r = direita (olhando o móvel de frente). forma 'redonda' usa w como diâmetro. */
const CATALOGO=[
 {grupo:'Quarto',itens:[
  {id:'cama_solteiro',nome:'Cama de solteiro',w:88,d:188,uso:{f:70,t:0,e:60,r:0}},
  {id:'cama_casal',nome:'Cama de casal',w:138,d:188,uso:{f:70,t:0,e:60,r:60}},
  {id:'cama_queen',nome:'Cama queen',w:158,d:198,uso:{f:70,t:0,e:60,r:60}},
  {id:'cama_king',nome:'Cama king',w:193,d:203,uso:{f:70,t:0,e:60,r:60}},
  {id:'criado',nome:'Criado-mudo',w:45,d:40,uso:{f:0,t:0,e:0,r:0}},
  {id:'gr2',nome:'Guarda-roupa 2 portas (abrir)',w:100,d:60,uso:{f:90,t:0,e:0,r:0}},
  {id:'gr3',nome:'Guarda-roupa 3 portas (abrir)',w:150,d:60,uso:{f:90,t:0,e:0,r:0}},
  {id:'gr4',nome:'Guarda-roupa 4 portas (abrir)',w:200,d:60,uso:{f:90,t:0,e:0,r:0}},
  {id:'grc',nome:'Guarda-roupa de correr',w:180,d:60,uso:{f:65,t:0,e:0,r:0}},
  {id:'comoda',nome:'Cômoda',w:120,d:50,uso:{f:85,t:0,e:0,r:0}},
  {id:'escrivaninha',nome:'Escrivaninha',w:120,d:60,uso:{f:85,t:0,e:0,r:0}},
 ]},
 {grupo:'Sala',itens:[
  {id:'sofa2',nome:'Sofá 2 lugares',w:160,d:90,uso:{f:45,t:0,e:0,r:0}},
  {id:'sofa3',nome:'Sofá 3 lugares',w:210,d:95,uso:{f:45,t:0,e:0,r:0}},
  {id:'poltrona',nome:'Poltrona',w:80,d:85,uso:{f:45,t:0,e:0,r:0}},
  {id:'centro',nome:'Mesa de centro',w:100,d:50,uso:{f:0,t:0,e:0,r:0}},
  {id:'rack',nome:'Rack / painel de TV',w:180,d:45,uso:{f:0,t:0,e:0,r:0}},
  {id:'estante',nome:'Estante',w:100,d:35,uso:{f:60,t:0,e:0,r:0}},
 ]},
 {grupo:'Jantar',itens:[
  {id:'mesa4',nome:'Mesa 4 lugares',w:120,d:80,uso:{f:75,t:75,e:75,r:75}},
  {id:'mesa6',nome:'Mesa 6 lugares',w:160,d:90,uso:{f:75,t:75,e:75,r:75}},
  {id:'mesa8',nome:'Mesa 8 lugares',w:200,d:100,uso:{f:75,t:75,e:75,r:75}},
  {id:'mesa_red',nome:'Mesa redonda 4 lugares',w:100,d:100,forma:'redonda',uso:{f:75,t:75,e:75,r:75}},
  {id:'aparador',nome:'Aparador',w:120,d:40,uso:{f:60,t:0,e:0,r:0}},
 ]},
 {grupo:'Cozinha e serviço',itens:[
  {id:'geladeira',nome:'Geladeira',w:70,d:75,uso:{f:90,t:0,e:0,r:0}},
  {id:'fogao4',nome:'Fogão 4 bocas',w:55,d:60,uso:{f:90,t:0,e:0,r:0}},
  {id:'fogao5',nome:'Fogão 5 bocas',w:75,d:65,uso:{f:90,t:0,e:0,r:0}},
  {id:'pia',nome:'Pia de cozinha',w:120,d:60,uso:{f:90,t:0,e:0,r:0}},
  {id:'bancada',nome:'Bancada',w:100,d:60,uso:{f:90,t:0,e:0,r:0}},
  {id:'lavalouca',nome:'Lava-louças',w:60,d:60,uso:{f:90,t:0,e:0,r:0}},
  {id:'maquina',nome:'Máquina de lavar',w:60,d:65,uso:{f:90,t:0,e:0,r:0}},
  {id:'tanque',nome:'Tanque',w:60,d:55,uso:{f:70,t:0,e:0,r:0}},
  {id:'mesa2',nome:'Mesa 2 lugares',w:80,d:60,uso:{f:75,t:0,e:0,r:75}},
 ]},
 {grupo:'Banheiro',itens:[
  {id:'vaso',nome:'Vaso sanitário',w:40,d:70,uso:{f:60,t:0,e:20,r:20}},
  {id:'pia_banh',nome:'Pia de banheiro',w:60,d:45,uso:{f:70,t:0,e:0,r:0}},
  {id:'box',nome:'Box',w:90,d:90,uso:{f:60,t:0,e:0,r:0}},
 ]},
 {grupo:'Outros',itens:[
  {id:'outro',nome:'Outro móvel',w:100,d:50,uso:{f:0,t:0,e:0,r:0}},
 ]},
];
const CAT_IDX={}; CATALOGO.forEach(g=>g.itens.forEach(i=>CAT_IDX[i.id]=i));
let movSel=null, catAberto=false, drag=null;

function footprint(m){const r=((m.rot||0)%180+180)%180===90;return{w:(r?m.d:m.w)/100,d:(r?m.w:m.d)/100}}
/* desenho de um móvel, em coordenadas do SVG (y invertido). x,y = centro em metros (mundo); ang = graus no sentido do mundo */
function svgMovel(m,x,y,ang,fs,opt={}){
  const w=m.w/100,d=m.d/100,u=m.uso||{},sel=opt.sel;
  let o=`<g transform="translate(${x} ${-y}) rotate(${-ang})" ${opt.click?`data-mov="${m.id}" class="mov"`:''}>`;
  if(opt.uso!==false){
    const LS=opt.lados||{}; const cor={ok:['#f3b23c','#d99a1e',0.16],warn:['#f79009','#dc6803',0.3],bad:['#f04438','#d92d20',0.3]};
    const z=l=>{const c2=cor[(LS[l]&&LS[l].st)||'ok'];return `fill="${c2[0]}" fill-opacity="${c2[2]}" stroke="${c2[1]}" stroke-opacity=".75" stroke-dasharray="${fs*0.35} ${fs*0.25}" stroke-width="${fs*0.05}"`};
    if(m.forma==='redonda'){ if(u.f) o+=`<circle cx="0" cy="0" r="${w/2+u.f/100}" ${z('f')}/>` }
    else{
      if(u.f) o+=`<rect x="${-w/2}" y="${d/2}" width="${w}" height="${u.f/100}" ${z('f')}/>`;
      if(u.t) o+=`<rect x="${-w/2}" y="${-d/2-u.t/100}" width="${w}" height="${u.t/100}" ${z('t')}/>`;
      if(u.e) o+=`<rect x="${-w/2-u.e/100}" y="${-d/2}" width="${u.e/100}" height="${d}" ${z('e')}/>`;
      if(u.r) o+=`<rect x="${w/2}" y="${-d/2}" width="${u.r/100}" height="${d}" ${z('r')}/>`;
    }
  }
  const bc=opt.nivel==='bad'?'#d92d20':opt.nivel==='warn'?'#dc6803':null;
  const st=`fill="${opt.nivel==='bad'?'#fde8e6':sel?'#dbe7f7':'#eef2f7'}" stroke="${sel?'#d9822b':bc||'#2b5487'}" stroke-width="${sel||bc?fs*0.14:fs*0.07}"`;
  if(m.forma==='redonda') o+=`<circle cx="0" cy="0" r="${w/2}" ${st}/>`;
  else{ o+=`<rect x="${-w/2}" y="${-d/2}" width="${w}" height="${d}" rx="${Math.min(w,d)*0.04}" ${st}/>`;
    o+=`<line x1="${-w/2+w*0.12}" y1="${d/2-fs*0.12}" x2="${w/2-w*0.12}" y2="${d/2-fs*0.12}" stroke="${sel?'#d9822b':'#2b5487'}" stroke-width="${fs*0.1}" stroke-opacity=".55"/>` }
  if(opt.label!==false){const t=esc(m.nome.length>16?m.nome.slice(0,15)+'…':m.nome);const f2=Math.min(fs*0.62,w/Math.max(t.length,4)*1.7,d*0.45);
    const ra=((ang%360)+360)%360, flip=ra>90&&ra<=270?180:0;
    o+=`<text x="0" y="0" font-size="${f2}" text-anchor="middle" dominant-baseline="central" fill="#1f3a5f" font-family="sans-serif" font-weight="600" transform="rotate(${flip})">${t}</text>`}
  return o+'</g>';
}
/* ===================== tela de móveis ===================== */
function moveisV(){
  const im=cur(),c=room(); if(!c){view={t:'im',im:view.im};return imV()}
  c.moveis=c.moveis||[];
  const g=geo(c),b=bbox(g.segs),w=Math.max(b[2]-b[0],1),h=Math.max(b[3]-b[1],1),pad=Math.max(w,h)*0.1,fs=Math.max(w,h)/24,sw=Math.max(w,h)/110;
  let s=`<svg id="mvsvg" viewBox="${b[0]-pad} ${-(b[3]+pad)} ${w+2*pad} ${h+2*pad}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="touch-action:none">`;
  g.segs.forEach(sg=>{const dash=['porta','armario','passagem'].includes(sg.tipo)?`stroke-dasharray="${sw*2.2} ${sw*1.4}"`:'';
    s+=`<line x1="${sg.x1}" y1="${-sg.y1}" x2="${sg.x2}" y2="${-sg.y2}" stroke="${COL[sg.tipo]}" stroke-width="${sg.tipo==='janela'?sw*2.2:sw}" stroke-linecap="square" ${dash}/>`});
  const k=g.inLeft?1:-1;
  g.segs.forEach(sg=>{const nx=-sg.hy*k,ny=sg.hx*k,mx=(sg.x1+sg.x2)/2+nx*fs*0.75,my=(sg.y1+sg.y2)/2+ny*fs*0.75;
    s+=`<text x="${mx}" y="${-my}" font-size="${fs*0.6}" text-anchor="middle" dominant-baseline="central" fill="#9aa3b2" font-family="sans-serif">${fm(sg.cm)}</text>`});
  const AV=avisosMoveis(c); const ia=m=>AV[m.id]||{av:[],lados:{},nivel:'ok'};
  c.moveis.forEach(m=>{if(m.id!==movSel)s+=svgMovel(m,m.x,m.y,m.rot||0,fs,{click:1,lados:ia(m).lados,nivel:ia(m).nivel})});
  const sm=c.moveis.find(m=>m.id===movSel); if(sm) s+=svgMovel(sm,sm.x,sm.y,sm.rot||0,fs,{click:1,sel:1,lados:ia(sm).lados,nivel:ia(sm).nivel});
  s+='</svg>';
  let h2=`<div class="top"><button class="ghost" data-a="voltarRoom">‹ ${esc(c.nome)}</button><h1>Móveis</h1></div>`;
  h2+=`<div class="planbox">${s}</div>`;
  const todos=c.moveis.flatMap(m=>ia(m).av); const vist=new Set(); const lista=todos.filter(a=>!vist.has(a.t)&&vist.add(a.t));
  if(c.moveis.length) h2+= lista.length?`<div class="status ${lista.some(a=>a.n==='bad')?'bad':'warn'}"><b>${lista.length} aviso(s) neste cômodo</b>${lista.map(a=>`<div class="av ${a.n}">${esc(a.t)}</div>`).join('')}</div>`:`<div class="status ok"><b>Tudo cabe com conforto.</b></div>`;
  h2+=`<p class="help">Arraste o móvel com o dedo. Perto da parede, ele encosta sozinho. Faixa amarela: espaço livre com conforto. Laranja: apertado, mas dá. Vermelho: abaixo do mínimo.</p>`;
  if(sm){const fr=v=>esc(v);
    h2+=`<div class="card"><div class="row" style="align-items:center"><b style="flex:1">${esc(sm.nome)}</b><button class="ghost" data-a="movDesel">Fechar</button></div>
      <div class="grid2" style="margin-top:6px"><button class="turn" data-a="movGirar">↻ Girar 90°</button><button data-a="movDup">Duplicar</button></div>
      <div class="frm"><label>Nome</label><input id="mvNome" value="${fr(sm.nome)}">
      <div class="grid2"><div><label>${sm.forma==='redonda'?'Diâmetro':'Largura'} (cm)</label><input id="mvW" inputmode="decimal" value="${sm.w}"></div>${sm.forma==='redonda'?'<div></div>':`<div><label>Profundidade (cm)</label><input id="mvD" inputmode="decimal" value="${sm.d}"></div>`}</div>
      <label>Espaço livre para usar (cm)</label>
      <div class="grid4">${(sm.forma==='redonda'?[['f','Em volta']]:[['f','Frente'],['t','Trás'],['e','Esquerda'],['r','Direita']]).map(([k2,t])=>{const L2=ia(sm).lados[k2];return `<div><span class="mini-l">${t}</span><input data-uso="${k2}" inputmode="decimal" value="${(sm.uso||{})[k2]||0}">${L2?`<span class="livre ${L2.st}">tem ${L2.livre>=300?'+300':L2.livre}</span>`:''}</div>`}).join('')}</div>
      <p class="help">Esquerda e direita olhando o móvel de frente. A frente é o lado com a linha mais grossa.</p></div>
      <button class="ghost" style="color:var(--bad)" data-a="movDel">Tirar este móvel</button></div>`;
  }
  h2+=`<button class="pri wide" data-a="catAbrir">+ Adicionar móvel</button>`;
  if(catAberto){h2+=`<div class="card cat">`+CATALOGO.map(gr=>`<div class="cat-g">${gr.grupo}</div>`+gr.itens.map(it=>`<button class="cat-i" data-a="movAdd" data-id="${it.id}"><span>${esc(it.nome)}</span><span class="mut">${it.forma==='redonda'?'Ø '+it.w:it.w+' × '+it.d} cm</span></button>`).join('')).join('')+`</div>`}
  if(c.moveis.length){h2+=`<h2>Neste cômodo</h2><div class="walls">`+c.moveis.map(m=>`<div data-a="movSel" data-id="${m.id}" style="cursor:pointer"><span style="flex:1">${esc(m.nome)}</span><span class="mut">${m.forma==='redonda'?'Ø '+m.w:m.w+' × '+m.d} cm</span>${ia(m).nivel!=='ok'?`<span class="dot ${ia(m).nivel}"></span>`:''}</div>`).join('')+`</div>`}
  return h2;
}
function movCentro(c){const g=geo(c),b=bbox(g.segs);return[(b[0]+b[2])/2,(b[1]+b[3])/2]}
function movAdd(id){const im=cur(),c=room(),it=CAT_IDX[id];if(!it)return;c.moveis=c.moveis||[];const[x,y]=movCentro(c);
  const m={id:uid(),cat:id,nome:it.nome,w:it.w,d:it.d,forma:it.forma||null,uso:{...it.uso},x,y,rot:0};c.moveis.push(m);movSel=m.id;catAberto=false;save(im)}
/* encosta na parede: paredes do cômodo são horizontais/verticais no próprio cômodo */
function movSnap(c,m){
  const g=geo(c),fp=footprint(m),tol=0.12;
  const L=m.x-fp.w/2,R=m.x+fp.w/2,B=m.y-fp.d/2,T=m.y+fp.d/2;
  let bx=null,by=null;
  g.segs.forEach(s=>{
    if(Math.abs(s.x1-s.x2)<1e-6){ const wx=s.x1, y0=Math.min(s.y1,s.y2), y1=Math.max(s.y1,s.y2); if(Math.min(T,y1)-Math.max(B,y0)<0.05)return;
      [[L,wx-L],[R,wx-R]].forEach(([e,dx])=>{if(Math.abs(dx)<tol&&(bx===null||Math.abs(dx)<Math.abs(bx)))bx=dx}) }
    else if(Math.abs(s.y1-s.y2)<1e-6){ const wy=s.y1, x0=Math.min(s.x1,s.x2), x1=Math.max(s.x1,s.x2); if(Math.min(R,x1)-Math.max(L,x0)<0.05)return;
      [[B,wy-B],[T,wy-T]].forEach(([e,dy])=>{if(Math.abs(dy)<tol&&(by===null||Math.abs(dy)<Math.abs(by)))by=dy}) }
  });
  if(bx!==null)m.x+=bx; if(by!==null)m.y+=by;
}
function svgPt(svg,ev){const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse());return[q.x,-q.y]}
function bindMoveis(){
  const svg=$('#mvsvg'); if(!svg) return;
  svg.addEventListener('pointerdown',ev=>{const gEl=ev.target.closest('[data-mov]');const c=room();
    if(!gEl){ if(movSel){movSel=null;render()} return }
    const m=c.moveis.find(x=>x.id===gEl.dataset.mov); if(!m)return;
    const p=svgPt(svg,ev); drag={m,dx:m.x-p[0],dy:m.y-p[1],moved:false,id:ev.pointerId};
    if(movSel!==m.id){movSel=m.id; render(); const s2=$('#mvsvg'); if(s2){try{s2.setPointerCapture(ev.pointerId)}catch(e){}} } else {try{svg.setPointerCapture(ev.pointerId)}catch(e){}}
    ev.preventDefault();
  });
  const mv=ev=>{if(!drag)return;const s2=$('#mvsvg');const p=svgPt(s2,ev);drag.m.x=p[0]+drag.dx;drag.m.y=p[1]+drag.dy;drag.moved=true;
    const gEl=s2.querySelector(`[data-mov="${drag.m.id}"]`); if(gEl) gEl.setAttribute('transform',`translate(${drag.m.x} ${-drag.m.y}) rotate(${-(drag.m.rot||0)})`); ev.preventDefault()};
  const up=()=>{if(!drag)return;const c=room();if(drag.moved){movSnap(c,drag.m);drag.m.x=Math.round(drag.m.x*100)/100;drag.m.y=Math.round(drag.m.y*100)/100;save(cur())}drag=null;render()};
  document.onpointermove=mv; document.onpointerup=up; document.onpointercancel=up;
  const nome=$('#mvNome'); if(nome) nome.addEventListener('change',e=>{const m=room().moveis.find(x=>x.id===movSel);m.nome=e.target.value.trim()||m.nome;save(cur());render()});
  [['mvW','w'],['mvD','d']].forEach(([id,k])=>{const e=$('#'+id);if(e)e.addEventListener('change',ev=>{const m=room().moveis.find(x=>x.id===movSel);const v=Math.round(parseFloat(ev.target.value.replace(',','.')));if(v>0){m[k]=v;if(m.forma==='redonda')m.d=m.w;save(cur())}render()})});
  document.querySelectorAll('[data-uso]').forEach(e=>e.addEventListener('change',ev=>{const m=room().moveis.find(x=>x.id===movSel);const v=Math.max(0,Math.round(parseFloat(ev.target.value.replace(',','.'))||0));m.uso=m.uso||{};
    if(m.forma==='redonda'){m.uso.f=m.uso.t=m.uso.e=m.uso.r=v}else m.uso[ev.target.dataset.uso]=v;save(cur());render()}));
}
function actMoveis(a,b){const im=cur(),c=room();const m=c&&c.moveis&&c.moveis.find(x=>x.id===movSel);
  switch(a){
    case 'abrirMoveis':view={t:'moveis',im:im.id,room:c.id};movSel=null;catAberto=false;return true;
    case 'voltarRoom':view={t:'room',im:im.id,room:c.id};movSel=null;return true;
    case 'catAbrir':catAberto=!catAberto;return true;
    case 'movAdd':movAdd(b.dataset.id);return true;
    case 'movSel':movSel=b.dataset.id;window.scrollTo(0,0);return true;
    case 'movDesel':movSel=null;return true;
    case 'movGirar':if(m){m.rot=((m.rot||0)+90)%360;movSnap(c,m);save(im)}return true;
    case 'movDup':if(m){const n={...m,uso:{...m.uso},id:uid(),x:m.x+0.3,y:m.y-0.3};c.moveis.push(n);movSel=n.id;save(im)}return true;
    case 'movDel':if(m){c.moveis=c.moveis.filter(x=>x.id!==m.id);movSel=null;save(im)}return true;
  }
  return false;
}

/* ===================== etapa 2: avisos ===================== */
const ALTOS=new Set(['gr2','gr3','gr4','grc','estante','geladeira']);
const LADO_NOME={f:'frente',t:'trás',e:'lado esquerdo',r:'lado direito'};
function rotV(v,deg){const a=deg*Math.PI/180,c=Math.round(Math.cos(a)),s=Math.round(Math.sin(a));return[v[0]*c-v[1]*s,v[0]*s+v[1]*c]}
function corpo(m){const fp=footprint(m);return{L:m.x-fp.w/2,R:m.x+fp.w/2,B:m.y-fp.d/2,T:m.y+fp.d/2}}
function minimo(conf){return conf>0?Math.max(0,conf-15):0}
function dentro(poly,x,y){let d=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))d=!d}return d}
/* distância livre a partir de (px,py) na direção dir (eixo), até parede ou outro móvel */
function raio(px,py,dir,paredes,outros,max){
  let best=max;
  paredes.forEach(s=>{
    if(dir[0]!==0){ if(Math.abs(s.x1-s.x2)>1e-6)return; const y0=Math.min(s.y1,s.y2),y1=Math.max(s.y1,s.y2); if(py<=y0+1e-4||py>=y1-1e-4)return; const d=(s.x1-px)*dir[0]; if(d>-1e-4&&d<best)best=Math.max(0,d) }
    else { if(Math.abs(s.y1-s.y2)>1e-6)return; const x0=Math.min(s.x1,s.x2),x1=Math.max(s.x1,s.x2); if(px<=x0+1e-4||px>=x1-1e-4)return; const d=(s.y1-py)*dir[1]; if(d>-1e-4&&d<best)best=Math.max(0,d) }
  });
  outros.forEach(r=>{
    if(dir[0]!==0){ if(py<=r.B+1e-4||py>=r.T-1e-4)return; const face=dir[0]>0?r.L:r.R; const d=(face-px)*dir[0]; if(d>-1e-4&&d<best)best=Math.max(0,d) }
    else { if(px<=r.L+1e-4||px>=r.R-1e-4)return; const face=dir[1]>0?r.B:r.T; const d=(face-py)*dir[1]; if(d>-1e-4&&d<best)best=Math.max(0,d) }
  });
  return best;
}
function livreLado(m,lado,paredes,outros){
  const b=corpo(m); const loc={f:[0,-1],t:[0,1],e:[-1,0],r:[1,0]}[lado]; const v=rotV(loc,m.rot||0);
  const ini=v[0]!==0?(v[0]>0?b.R:b.L):(v[1]>0?b.T:b.B); const a0=v[0]!==0?b.B:b.L, a1=v[0]!==0?b.T:b.R;
  const n=Math.max(3,Math.round((a1-a0)/0.05)); const vals=[];
  for(let i=0;i<=n;i++){const t=a0+0.02+(a1-a0-0.04)*i/n; const px=v[0]!==0?ini:t, py=v[0]!==0?t:ini; vals.push(raio(px,py,v,paredes,outros,3))}
  vals.sort((a,b2)=>a-b2);
  /* nas laterais vale o espaço que existe em pelo menos 70% do lado (ex.: criado-mudo na cabeceira não conta); frente e trás usam o ponto mais apertado */
  const val=(lado==='e'||lado==='r')&&m.forma!=='redonda'?vals[Math.floor(vals.length*0.3)]:vals[0];
  return Math.round(val*100);
}
function avisosMoveis(c){
  const res={}; const g=geo(c); const ms=c.moveis||[]; if(!ms.length||!g.segs.length) return res;
  const paredes=g.segs.filter(s=>s.tipo!=='porta'&&s.tipo!=='passagem');
  const poly=g.segs.map(s=>[s.x1,s.y1]); const k=g.inLeft?1:-1;
  const rects={}; ms.forEach(m=>rects[m.id]=corpo(m));
  ms.forEach(m=>{
    const av=[], lados={}; const b=rects[m.id]; const outros=ms.filter(o=>o.id!==m.id).map(o=>rects[o.id]);
    // 1. dentro do cômodo / atravessando parede
    const pts=[[b.L+0.01,b.B+0.01],[b.R-0.01,b.B+0.01],[b.R-0.01,b.T-0.01],[b.L+0.01,b.T-0.01],[(b.L+b.R)/2,b.B+0.01],[(b.L+b.R)/2,b.T-0.01],[b.L+0.01,(b.B+b.T)/2],[b.R-0.01,(b.B+b.T)/2]];
    const fora=pts.some(p=>!dentro(poly,p[0],p[1]));
    const cruza=g.segs.some(s=>{const x0=Math.min(s.x1,s.x2),x1=Math.max(s.x1,s.x2),y0=Math.min(s.y1,s.y2),y1=Math.max(s.y1,s.y2);return x1>b.L+0.01&&x0<b.R-0.01&&y1>b.B+0.01&&y0<b.T-0.01});
    if(fora||cruza) av.push({n:'bad',t:`${m.nome}: está atravessando a parede ou saindo do cômodo.`});
    // 2. em cima de outro móvel
    ms.forEach(o=>{if(o.id<=m.id)return;const r=rects[o.id];const ox=Math.min(b.R,r.R)-Math.max(b.L,r.L),oy=Math.min(b.T,r.T)-Math.max(b.B,r.B);
      if(ox>0.01&&oy>0.01){av.push({n:'bad',t:`${m.nome} e ${o.nome} estão um em cima do outro.`});(res[o.id]=res[o.id]||{av:[],lados:{}}).av.push({n:'bad',t:`${o.nome} e ${m.nome} estão um em cima do outro.`})}});
    // 3. espaço livre de cada lado
    if(!(fora||cruza)){
      const u=m.uso||{}; const ladosAt=m.forma==='redonda'?['f','t','e','r']:['f','t','e','r'];
      ladosAt.forEach(l=>{const conf=u[l]||0; if(!conf)return; const livre=livreLado(m,l,paredes,outros); const mi=minimo(conf);
        const st=livre>=conf?'ok':livre>=mi?'warn':'bad'; lados[l]={livre,conf,mi,st};
        if(st!=='ok'){const nome=m.forma==='redonda'?'em volta':LADO_NOME[l];
          av.push({n:st,t:`${m.nome}: ${nome} com ${livre} cm livres (o ideal é ${conf} cm${mi?`, o mínimo ${mi} cm`:''}).`})}});
      if(m.forma==='redonda'){const vals=Object.values(lados); if(vals.length){const w=vals.reduce((a,b2)=>a.livre<b2.livre?a:b2); ['f','t','e','r'].forEach(l=>lados[l]=lados[l]||w);
        // junta os avisos da mesa redonda num só
        const ruins=av.filter(a=>/em volta/.test(a.t)); if(ruins.length>1){const pior=ruins.sort((a,b2)=>a.n==='bad'?-1:1)[0];for(const r2 of ruins)av.splice(av.indexOf(r2),1);av.push({n:pior.n,t:`${m.nome}: em volta ficou com ${w.livre} cm livres no lado mais apertado (o ideal é ${w.conf} cm, o mínimo ${w.mi} cm).`})}}}
    }
    // 4. na frente de porta ou passagem
    g.segs.filter(s=>s.tipo==='porta'||s.tipo==='passagem').forEach(s=>{
      const nx=-s.hy*k,ny=s.hx*k; const prof=s.tipo==='porta'?s.cm/100:0.6;
      const xs=[s.x1,s.x2,s.x1+nx*prof,s.x2+nx*prof],ys=[s.y1,s.y2,s.y1+ny*prof,s.y2+ny*prof];
      const z={L:Math.min(...xs),R:Math.max(...xs),B:Math.min(...ys),T:Math.max(...ys)};
      const ox=Math.min(b.R,z.R)-Math.max(b.L,z.L),oy=Math.min(b.T,z.T)-Math.max(b.B,z.B);
      if(ox>0.02&&oy>0.02) av.push({n:'warn',t:`${m.nome}: está na frente da ${s.tipo==='porta'?'porta':'passagem'} (parede ${s.wi+1}) e pode atrapalhar ${s.tipo==='porta'?'a porta de abrir':'a passagem'}.`});
    });
    // 5. móvel alto na frente da janela
    if(ALTOS.has(m.cat)) g.segs.filter(s=>s.tipo==='janela').forEach(s=>{
      const hz=Math.abs(s.y1-s.y2)<1e-6; const x0=Math.min(s.x1,s.x2),x1=Math.max(s.x1,s.x2),y0=Math.min(s.y1,s.y2),y1=Math.max(s.y1,s.y2);
      const perto=hz?(Math.min(Math.abs(b.B-s.y1),Math.abs(b.T-s.y1))<0.15&&Math.min(b.R,x1)-Math.max(b.L,x0)>0.05):(Math.min(Math.abs(b.L-s.x1),Math.abs(b.R-s.x1))<0.15&&Math.min(b.T,y1)-Math.max(b.B,y0)>0.05);
      if(perto) av.push({n:'warn',t:`${m.nome}: é um móvel alto e está na frente da janela (parede ${s.wi+1}).`});
    });
    const cur2=res[m.id]||{av:[],lados:{}}; cur2.av=cur2.av.concat(av); cur2.lados=lados; res[m.id]=cur2;
  });
  Object.values(res).forEach(r=>{r.nivel=r.av.some(a=>a.n==='bad')?'bad':r.av.length?'warn':'ok'});
  return res;
}
