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
    const z='fill="#f3b23c" fill-opacity="0.16" stroke="#d99a1e" stroke-opacity=".7" stroke-dasharray="'+fs*0.35+' '+fs*0.25+'" stroke-width="'+fs*0.05+'"';
    if(m.forma==='redonda'){ if(u.f) o+=`<circle cx="0" cy="0" r="${w/2+u.f/100}" ${z}/>` }
    else{
      if(u.f) o+=`<rect x="${-w/2}" y="${d/2}" width="${w}" height="${u.f/100}" ${z}/>`;
      if(u.t) o+=`<rect x="${-w/2}" y="${-d/2-u.t/100}" width="${w}" height="${u.t/100}" ${z}/>`;
      if(u.e) o+=`<rect x="${-w/2-u.e/100}" y="${-d/2}" width="${u.e/100}" height="${d}" ${z}/>`;
      if(u.r) o+=`<rect x="${w/2}" y="${-d/2}" width="${u.r/100}" height="${d}" ${z}/>`;
    }
  }
  const st=`fill="${sel?'#dbe7f7':'#eef2f7'}" stroke="${sel?'#d9822b':'#2b5487'}" stroke-width="${sel?fs*0.14:fs*0.07}"`;
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
  c.moveis.forEach(m=>{if(m.id!==movSel)s+=svgMovel(m,m.x,m.y,m.rot||0,fs,{click:1})});
  const sm=c.moveis.find(m=>m.id===movSel); if(sm) s+=svgMovel(sm,sm.x,sm.y,sm.rot||0,fs,{click:1,sel:1});
  s+='</svg>';
  let h2=`<div class="top"><button class="ghost" data-a="voltarRoom">‹ ${esc(c.nome)}</button><h1>Móveis</h1></div>`;
  h2+=`<div class="planbox">${s}</div><p class="help">Arraste o móvel com o dedo. Perto da parede, ele encosta sozinho. A faixa amarela é o espaço livre para usar o móvel com conforto.</p>`;
  if(sm){const fr=v=>esc(v);
    h2+=`<div class="card"><div class="row" style="align-items:center"><b style="flex:1">${esc(sm.nome)}</b><button class="ghost" data-a="movDesel">Fechar</button></div>
      <div class="grid2" style="margin-top:6px"><button class="turn" data-a="movGirar">↻ Girar 90°</button><button data-a="movDup">Duplicar</button></div>
      <div class="frm"><label>Nome</label><input id="mvNome" value="${fr(sm.nome)}">
      <div class="grid2"><div><label>${sm.forma==='redonda'?'Diâmetro':'Largura'} (cm)</label><input id="mvW" inputmode="decimal" value="${sm.w}"></div>${sm.forma==='redonda'?'<div></div>':`<div><label>Profundidade (cm)</label><input id="mvD" inputmode="decimal" value="${sm.d}"></div>`}</div>
      <label>Espaço livre para usar (cm)</label>
      <div class="grid4">${(sm.forma==='redonda'?[['f','Em volta']]:[['f','Frente'],['t','Trás'],['e','Esquerda'],['r','Direita']]).map(([k2,t])=>`<div><span class="mini-l">${t}</span><input data-uso="${k2}" inputmode="decimal" value="${(sm.uso||{})[k2]||0}"></div>`).join('')}</div>
      <p class="help">Esquerda e direita olhando o móvel de frente. A frente é o lado com a linha mais grossa.</p></div>
      <button class="ghost" style="color:var(--bad)" data-a="movDel">Tirar este móvel</button></div>`;
  }
  h2+=`<button class="pri wide" data-a="catAbrir">+ Adicionar móvel</button>`;
  if(catAberto){h2+=`<div class="card cat">`+CATALOGO.map(gr=>`<div class="cat-g">${gr.grupo}</div>`+gr.itens.map(it=>`<button class="cat-i" data-a="movAdd" data-id="${it.id}"><span>${esc(it.nome)}</span><span class="mut">${it.forma==='redonda'?'Ø '+it.w:it.w+' × '+it.d} cm</span></button>`).join('')).join('')+`</div>`}
  if(c.moveis.length){h2+=`<h2>Neste cômodo</h2><div class="walls">`+c.moveis.map(m=>`<div data-a="movSel" data-id="${m.id}" style="cursor:pointer"><span style="flex:1">${esc(m.nome)}</span><span class="mut">${m.forma==='redonda'?'Ø '+m.w:m.w+' × '+m.d} cm</span></div>`).join('')+`</div>`}
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
