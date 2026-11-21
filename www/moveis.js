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
  {id:'lateral',nome:'Mesa lateral (ao lado do sofá)',w:45,d:45,uso:{f:0,t:0,e:0,r:0}},
  {id:'canto',nome:'Mesa de canto',w:60,d:60,uso:{f:0,t:0,e:0,r:0}},
  {id:'puff',nome:'Pufe',w:45,d:45,uso:{f:0,t:0,e:0,r:0}},
  {id:'rack',nome:'Rack / painel de TV',w:180,d:45,uso:{f:0,t:0,e:0,r:0}},
  {id:'estante',nome:'Estante',w:100,d:35,uso:{f:60,t:0,e:0,r:0}},
 ]},
 {grupo:'Jantar',itens:[
  {id:'mesa4',nome:'Mesa 4 lugares',w:120,d:80,uso:{f:75,t:75,e:75,r:75}},
  {id:'mesa6',nome:'Mesa 6 lugares',w:160,d:90,uso:{f:75,t:75,e:75,r:75}},
  {id:'mesa8',nome:'Mesa 8 lugares',w:200,d:100,uso:{f:75,t:75,e:75,r:75}},
  {id:'mesa_red',nome:'Mesa redonda 4 lugares',w:100,d:100,forma:'redonda',uso:{f:75,t:75,e:75,r:75}},
  {id:'aparador',nome:'Aparador',w:120,d:40,uso:{f:60,t:0,e:0,r:0}},
  {id:'bufe',nome:'Bufê',w:160,d:45,uso:{f:80,t:0,e:0,r:0}},
  {id:'cristaleira',nome:'Cristaleira',w:100,d:40,uso:{f:70,t:0,e:0,r:0}},
  {id:'cadeira',nome:'Cadeira avulsa',w:45,d:50,uso:{f:30,t:0,e:0,r:0}},
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
let movSel=null, catAberto=false, drag=null, mvFs=0.2, mvCotasLista=[], cotaEdit=null;

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
  g.segs.forEach(sg=>{const a2=portaArco(sg,g.inLeft);if(a2)s+=svgArco(a2,(x,y)=>[x,y],sw)});
  const k=g.inLeft?1:-1;
  g.segs.forEach(sg=>{const nx=-sg.hy*k,ny=sg.hx*k,mx=(sg.x1+sg.x2)/2+nx*fs*0.75,my=(sg.y1+sg.y2)/2+ny*fs*0.75;
    s+=`<text x="${mx}" y="${-my}" font-size="${fs*0.6}" text-anchor="middle" dominant-baseline="central" fill="#9aa3b2" font-family="sans-serif">${fm(sg.cm)}</text>`});
  const AV=avisosMoveis(c); const ia=m=>AV[m.id]||{av:[],lados:{},nivel:'ok'};
  c.moveis.forEach(m=>{if(m.id!==movSel)s+=svgMovel(m,m.x,m.y,m.rot||0,fs,{click:1,lados:ia(m).lados,nivel:ia(m).nivel})});
  const sm=c.moveis.find(m=>m.id===movSel); if(sm) s+=svgMovel(sm,sm.x,sm.y,sm.rot||0,fs,{click:1,sel:1,lados:ia(sm).lados,nivel:ia(sm).nivel});
  mvFs=fs; s+=`<g id="mvCotas" style="pointer-events:none">${sm?svgCotas(c,sm,fs):''}</g>`;
  s+='</svg>';
  let h2=`<div class="top"><button class="back" data-a="voltarRoom">‹ Voltar</button><h1>Móveis · ${esc(c.nome)}</h1></div>`;
  h2+=`<div class="planbox">${s}</div>`;
  const todos=c.moveis.flatMap(m=>ia(m).av); const vist=new Set(); const lista=todos.filter(a=>!vist.has(a.t)&&vist.add(a.t));
  if(c.moveis.length) h2+= lista.length?`<div class="status ${lista.some(a=>a.n==='bad')?'bad':'warn'}"><b>${lista.length} aviso(s) neste cômodo</b>${lista.map(a=>`<div class="av ${a.n}">${esc(a.t)}</div>`).join('')}</div>`:`<div class="status ok"><b>Tudo cabe com conforto.</b></div>`;
  h2+=`<p class="help">Arraste o móvel com o dedo. Perto da parede, ele encosta sozinho, inclusive em degraus e cantos da parede. Use as setas do ajuste fino para mexer de 1 em 1 cm. Toque numa medida para digitar a distância que quiser, ou use Centralizar para pôr o móvel no meio. Faixa amarela: espaço livre com conforto. Laranja: apertado, mas dá. Vermelho: abaixo do mínimo. Toque num móvel para ver, em centímetros, quanto falta até a parede, o outro móvel, o fim da parede em que ele está encostado (onde ela faz a curva) ou a próxima porta, passagem ou janela.</p>`;
  if(sm){const fr=v=>esc(v);
    h2+=`<div class="card"><div class="row" style="align-items:center"><b style="flex:1">${esc(sm.nome)}</b><button class="ghost" data-a="movDesel">Fechar</button></div>
      <div class="grid2" style="margin-top:6px"><button class="turn" data-a="movGirar">↻ Girar 90°</button><button data-a="movDup">Duplicar</button></div>${cotaEdit&&cotaEdit.mid===sm.id?`<div class="cotaed"><label>Distância ${COTA_TXT[cotaEdit.tipo]}${COTA_DIR[cotaEdit.dir.join()]}</label><div class="row"><input id="cotaV" inputmode="decimal" value="${cotaEdit.cm}"><span style="flex:none">cm</span><button class="pri" style="flex:none" data-a="cotaOk">Aplicar</button><button class="ghost" style="flex:none" data-a="cotaCancel">Cancelar</button></div></div>`:''}
      <div class="segrow" style="margin-top:6px"><span class="mini-l">Centralizar</span><button class="seg" data-a="movCentro" data-v="x">↔ no meio</button><button class="seg" data-a="movCentro" data-v="y">↕ no meio</button></div><div class="segrow" style="margin-top:6px"><span class="mini-l">Ajuste fino (1 cm)</span><button class="seg" data-a="movMv" data-v="-1,0">◀</button><button class="seg" data-a="movMv" data-v="0,1">▲</button><button class="seg" data-a="movMv" data-v="0,-1">▼</button><button class="seg" data-a="movMv" data-v="1,0">▶</button></div>
      <div class="frm"><label>Nome</label><input id="mvNome" value="${fr(sm.nome)}">
      <div class="grid2"><div><label>${sm.forma==='redonda'?'Diâmetro':'Largura'} (cm)</label><input id="mvW" inputmode="decimal" value="${sm.w}"></div>${sm.forma==='redonda'?'<div></div>':`<div><label>Profundidade (cm)</label><input id="mvD" inputmode="decimal" value="${sm.d}"></div>`}</div>
      <label>Espaço livre para usar (cm)</label>
      <div class="grid4">${(sm.forma==='redonda'?[['f','Em volta']]:[['f','Frente'],['t','Trás'],['e','Esquerda'],['r','Direita']]).map(([k2,t])=>{const L2=ia(sm).lados[k2];return `<div><span class="mini-l">${t}</span><input data-uso="${k2}" inputmode="decimal" value="${(sm.uso||{})[k2]||0}">${L2?`<span class="livre ${L2.st}">tem ${L2.livre>=300?'+300':L2.livre}</span>`:''}</div>`}).join('')}</div>
      <p class="help">Esquerda e direita olhando o móvel de frente. A frente é o lado com a linha mais grossa.</p></div>
      <div class="row" style="margin-top:6px"><button class="ghost" data-a="meuSalvar">☆ Salvar nos meus móveis</button><button class="ghost" style="color:var(--bad)" data-a="movDel">Tirar este móvel</button></div></div>`;
  }
  h2+=`<button class="pri wide" data-a="catAbrir">+ Adicionar móvel</button>`;
  const meus=meusGet();
  if(catAberto){h2+=`<div class="card cat">`+(meus.length?`<div class="cat-g">Meus móveis</div>`+meus.map((it,i)=>`<div class="row" style="gap:4px"><button class="cat-i" style="flex:1" data-a="meuAdd" data-i="${i}"><span>${esc(it.nome)}</span><span class="mut">${it.forma==='redonda'?'Ø '+it.w:it.w+' × '+it.d} cm</span></button><button class="ghost" style="flex:none;color:var(--bad)" data-a="meuDel" data-i="${i}" aria-label="Apagar">✕</button></div>`).join(''):'')+CATALOGO.map(gr=>`<div class="cat-g">${gr.grupo}</div>`+gr.itens.map(it=>`<button class="cat-i" data-a="movAdd" data-id="${it.id}"><span>${esc(it.nome)}</span><span class="mut">${it.forma==='redonda'?'Ø '+it.w:it.w+' × '+it.d} cm</span></button>`).join('')).join('')+`</div>`}
  if(c.moveis.length){h2+=`<h2>Neste cômodo</h2><div class="walls">`+c.moveis.map(m=>`<div data-a="movSel" data-id="${m.id}" style="cursor:pointer"><span style="flex:1">${esc(m.nome)}</span><span class="mut">${m.forma==='redonda'?'Ø '+m.w:m.w+' × '+m.d} cm</span>${ia(m).nivel!=='ok'?`<span class="dot ${ia(m).nivel}"></span>`:''}</div>`).join('')+`</div>`}
  return h2;
}
function movCentro(c){const g=geo(c),b=bbox(g.segs);return[(b[0]+b[2])/2,(b[1]+b[3])/2]}
function movAdd(id){const im=cur(),c=room(),it=CAT_IDX[id];if(!it)return;c.moveis=c.moveis||[];const[x,y]=movCentro(c);
  const m={id:uid(),cat:id,nome:it.nome,w:it.w,d:it.d,forma:it.forma||null,uso:{...it.uso},x,y,rot:0};c.moveis.push(m);movSel=m.id;catAberto=false;save(im)}
/* encosta na parede: paredes do cômodo são horizontais/verticais no próprio cômodo */
const SOLTOS=new Set(['mesa4','mesa6','mesa8','mesa_red','mesa2','centro','cadeira','lateral','canto','puff']);
function distParedes(c,m){
  const g=geo(c),b=corpo(m),out=[];
  g.segs.forEach(s=>{
    if(Math.abs(s.x1-s.x2)<1e-6){const y0=Math.min(s.y1,s.y2),y1=Math.max(s.y1,s.y2);if(Math.min(b.T,y1)-Math.max(b.B,y0)<0.05)return;
      out.push({dir:[1,0],d:s.x1-b.R,pos:s.x1},{dir:[-1,0],d:b.L-s.x1,pos:s.x1})}
    else if(Math.abs(s.y1-s.y2)<1e-6){const x0=Math.min(s.x1,s.x2),x1=Math.max(s.x1,s.x2);if(Math.min(b.R,x1)-Math.max(b.L,x0)<0.05)return;
      out.push({dir:[0,1],d:s.y1-b.T,pos:s.y1},{dir:[0,-1],d:b.B-s.y1,pos:s.y1})}
  });
  return out.filter(o=>o.d>-0.6);
}
function encostar(m,o){const fp=footprint(m);if(o.dir[0]===1)m.x=o.pos-fp.w/2;else if(o.dir[0]===-1)m.x=o.pos+fp.w/2;else if(o.dir[1]===1)m.y=o.pos-fp.d/2;else m.y=o.pos+fp.d/2}
function movSnap(c,m,girar){
  const tol=0.30;
  let ws=distParedes(c,m).filter(o=>o.d<=tol).sort((x,y)=>Math.abs(x.d)-Math.abs(y.d));
  if(!ws.length) return;
  const w0=ws[0];
  if(girar&&m.forma!=='redonda'&&!SOLTOS.has(m.cat)&&!((m.uso||{}).t)){
    const alvo={'0,1':0,'1,0':270,'-1,0':90,'0,-1':180}[w0.dir.join()];
    if(alvo!==undefined&&alvo!==(m.rot||0)) m.rot=alvo;
  }
  if(encaixar(c,m,tol)||encaixar(c,m,tol,true)) return;
  /* se não achou encaixe livre, faz como antes: encosta na parede mais perto */
  const again=distParedes(c,m).filter(o=>o.d<=tol).sort((x,y)=>Math.abs(x.d)-Math.abs(y.d));
  if(again[0]) encostar(m,again[0]);
}
/* procura a posição mais perto onde o móvel encosta nas paredes sem atravessar nenhuma (serve para degraus, nichos e cantos) */
function cruzaParede(g,b){return g.segs.some(s=>{const x0=Math.min(s.x1,s.x2),x1=Math.max(s.x1,s.x2),y0=Math.min(s.y1,s.y2),y1=Math.max(s.y1,s.y2);
  if(Math.abs(x1-x0)<1e-6) return x0>b.L+0.003&&x0<b.R-0.003&&Math.min(y1,b.T)-Math.max(y0,b.B)>0.003;
  return y0>b.B+0.003&&y0<b.T-0.003&&Math.min(x1,b.R)-Math.max(x0,b.L)>0.003})}
function encaixar(c,m,tol,soParedes){
  const g=geo(c); if(!g.segs.length) return false; const fp=footprint(m); const poly=g.segs.map(s=>[s.x1,s.y1]);
  const xs=[{v:m.x,w:0}], ys=[{v:m.y,w:0}];
  g.segs.forEach(s=>{
    if(Math.abs(s.x1-s.x2)<1e-6){const y0=Math.min(s.y1,s.y2),y1=Math.max(s.y1,s.y2); if(y1<m.y-fp.d/2-tol||y0>m.y+fp.d/2+tol) return;
      [s.x1-fp.w/2,s.x1+fp.w/2].forEach(v=>{if(Math.abs(v-m.x)<=tol)xs.push({v,w:1})})}
    else {const x0=Math.min(s.x1,s.x2),x1=Math.max(s.x1,s.x2); if(x1<m.x-fp.w/2-tol||x0>m.x+fp.w/2+tol) return;
      [s.y1-fp.d/2,s.y1+fp.d/2].forEach(v=>{if(Math.abs(v-m.y)<=tol)ys.push({v,w:1})})}
  });
  const outros=soParedes?[]:(c.moveis||[]).filter(o=>o.id!==m.id).map(corpo);
  outros.forEach(r=>{ if(!(r.T<m.y-fp.d/2-tol||r.B>m.y+fp.d/2+tol)) [r.L-fp.w/2,r.R+fp.w/2].forEach(v=>{if(Math.abs(v-m.x)<=tol)xs.push({v,w:0.5})});
    if(!(r.R<m.x-fp.w/2-tol||r.L>m.x+fp.w/2+tol)) [r.B-fp.d/2,r.T+fp.d/2].forEach(v=>{if(Math.abs(v-m.y)<=tol)ys.push({v,w:0.5})}) });
  let best=null;
  xs.forEach(X=>ys.forEach(Y=>{
    const b={L:X.v-fp.w/2,R:X.v+fp.w/2,B:Y.v-fp.d/2,T:Y.v+fp.d/2};
    const pts=[[b.L+0.004,b.B+0.004],[b.R-0.004,b.B+0.004],[b.R-0.004,b.T-0.004],[b.L+0.004,b.T-0.004],[X.v,Y.v]];
    if(pts.some(p=>!dentro(poly,p[0],p[1]))||cruzaParede(g,b)) return;
    if(outros.some(r=>Math.min(b.R,r.R)-Math.max(b.L,r.L)>0.005&&Math.min(b.T,r.T)-Math.max(b.B,r.B)>0.005)) return;
    const toque=X.w+Y.w; if(!toque) return;
    const custo=Math.hypot(X.v-m.x,Y.v-m.y)-toque*0.12;
    if(!best||custo<best.custo) best={x:X.v,y:Y.v,custo};
  }));
  if(!best) return false; m.x=best.x; m.y=best.y; return true;
}
function movMover(m,dx,dy){m.x=Math.round((m.x+dx)*1000)/1000;m.y=Math.round((m.y+dy)*1000)/1000}
function svgPt(svg,ev){const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse());return[q.x,-q.y]}
function bindMoveis(){
  const svg=$('#mvsvg'); if(!svg) return;
  svg.addEventListener('pointerdown',ev=>{const ce=ev.target.closest('[data-cota]');
    if(ce){const q=mvCotasLista[+ce.dataset.cota];if(q&&movSel){cotaEdit={mid:movSel,dir:q.dir,tipo:q.tipo,cm:q.cm};render();setTimeout(()=>{const i=$('#cotaV');if(i){i.scrollIntoView({block:'center'});i.focus();i.select()}},50)}ev.preventDefault();return}
    const gEl=ev.target.closest('[data-mov]');const c=room();
    if(!gEl){ if(movSel){movSel=null;render()} return }
    const m=c.moveis.find(x=>x.id===gEl.dataset.mov); if(!m)return;
    const p=svgPt(svg,ev); drag={m,dx:m.x-p[0],dy:m.y-p[1],moved:false,id:ev.pointerId};
    if(movSel!==m.id){movSel=m.id; render(); const s2=$('#mvsvg'); if(s2){try{s2.setPointerCapture(ev.pointerId)}catch(e){}} } else {try{svg.setPointerCapture(ev.pointerId)}catch(e){}}
    ev.preventDefault();
  });
  const mv=ev=>{if(!drag)return;const s2=$('#mvsvg');const p=svgPt(s2,ev);drag.m.x=p[0]+drag.dx;drag.m.y=p[1]+drag.dy;drag.moved=true;
    const gEl=s2.querySelector(`[data-mov="${drag.m.id}"]`); if(gEl) gEl.setAttribute('transform',`translate(${drag.m.x} ${-drag.m.y}) rotate(${-(drag.m.rot||0)})`); const gc=s2.querySelector('#mvCotas'); if(gc) gc.innerHTML=svgCotas(room(),drag.m,mvFs); ev.preventDefault()};
  const up=()=>{if(!drag)return;const c=room();if(drag.moved){movSnap(c,drag.m,true);drag.m.x=Math.round(drag.m.x*100)/100;drag.m.y=Math.round(drag.m.y*100)/100;save(cur())}drag=null;render()};
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
    case 'movSel':cotaEdit=null;movSel=b.dataset.id;window.scrollTo(0,0);return true;
    case 'movDesel':cotaEdit=null;movSel=null;return true;
    case 'movGirar':if(m){m.rot=((m.rot||0)+90)%360;movSnap(c,m);save(im)}return true;
    case 'cotaCancel':cotaEdit=null;return true;
    case 'cotaOk':{if(!m||!cotaEdit)return true;const v=parseFloat(($('#cotaV').value||'').replace(',','.'));if(!(v>=0)){toast('Digite a distância em centímetros.');return true}
      const atual=cotasMovel(c,m).find(q=>!q.invade&&q.tipo===cotaEdit.tipo&&q.dir.join()===cotaEdit.dir.join());const cm0=atual?atual.cm:cotaEdit.cm;
      movMover(m,cotaEdit.dir[0]*(cm0-v)/100,cotaEdit.dir[1]*(cm0-v)/100);cotaEdit=null;save(im);return true}
    case 'movCentro':{if(!m)return true;const ax=b.dataset.v==='x'?0:1;const qs=cotasMovel(c,m).filter(q=>!q.invade);
      const menor=sg=>{const l=qs.filter(q=>q.dir[ax]===sg).map(q=>q.cm);return l.length?Math.min(...l):null};const a1=menor(-1),a2=menor(1);
      if(a1===null||a2===null){toast('Não achei parede ou móvel dos dois lados para centralizar.');return true}
      const sh=(a2-a1)/200;movMover(m,ax===0?sh:0,ax===1?sh:0);save(im);toast('No meio: '+Math.round((a1+a2)/2)+' cm de cada lado.');return true}
    case 'movMv':if(m){const[vx,vy]=b.dataset.v.split(',').map(Number);movMover(m,vx*0.01,vy*0.01);save(im)}return true;
    case 'movDup':if(m){const n={...m,uso:{...m.uso},id:uid(),x:m.x+0.3,y:m.y-0.3};c.moveis.push(n);movSel=n.id;save(im)}return true;
    case 'portaAbre':portaSet(im,c,b.dataset.k,'abre',b.dataset.v);save(im);return true;
    case 'portaDob':portaSet(im,c,b.dataset.k,'dob',b.dataset.v);save(im);return true;
    case 'meuSalvar':if(m){const l=meusGet().filter(x=>!(x.nome===m.nome&&x.w===m.w&&x.d===m.d));l.unshift({cat:m.cat,nome:m.nome,w:m.w,d:m.d,forma:m.forma||null,uso:{...m.uso}});meusSet(l);toast('Salvo nos seus móveis.')}return true;
    case 'meuAdd':{const it=meusGet()[+b.dataset.i];if(!it)return true;c.moveis=c.moveis||[];const[x,y]=movCentro(c);const n={id:uid(),cat:it.cat,nome:it.nome,w:it.w,d:it.d,forma:it.forma,uso:{...it.uso},x,y,rot:0};c.moveis.push(n);movSel=n.id;catAberto=false;save(im);return true}
    case 'meuDel':{const l=meusGet();l.splice(+b.dataset.i,1);meusSet(l);return true}
    case 'movDel':if(m){c.moveis=c.moveis.filter(x=>x.id!==m.id);movSel=null;save(im)}return true;
  }
  return false;
}

/* ===================== etapa 2: avisos ===================== */
const ALTOS=new Set(['gr2','gr3','gr4','grc','estante','geladeira','cristaleira']);
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
/* ===================== medidas em volta do móvel ===================== */
/* para cada um dos 4 lados: quanto falta até a parede, o outro móvel, ou o começo de uma porta/passagem/janela na parede encostada */
function cotasMovel(c,m){
  const g=geo(c); if(!g.segs.length) return [];
  const b=corpo(m); const outros=(c.moveis||[]).filter(o=>o.id!==m.id).map(corpo);
  const aberturas=g.segs.filter(s=>s.tipo==='porta'||s.tipo==='passagem'||s.tipo==='janela');
  const out=[]; const MAX=6, PERTO=0.35, cy=(b.B+b.T)/2, cx=(b.L+b.R)/2;
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(dir=>{
    const hz=dir[0]!==0; const face=hz?(dir[0]>0?b.R:b.L):(dir[1]>0?b.T:b.B);
    const px=hz?face:cx, py=hz?cy:face;
    // a) até a parede ou o móvel em frente, saindo do meio do lado
    const dd=raio(px,py,dir,g.segs,outros,MAX);
    if(dd<MAX-0.01) out.push({x1:px,y1:py,x2:px+dir[0]*dd,y2:py+dir[1]*dd,cm:Math.round(dd*100),tipo:'livre',dir});
    // c) ao longo de uma parede encostada: até o fim dela (onde faz a curva)
    [-1,1].forEach(lado=>{
      const lo=hz?b.B:b.L, hi=hz?b.T:b.R;
      const cand=g.segs.filter(s=>hz?Math.abs(s.y1-s.y2)<1e-6:Math.abs(s.x1-s.x2)<1e-6).filter(s=>{const lin=hz?s.y1:s.x1;return lado<0?(lin<=lo+0.01&&lo-lin<=PERTO):(lin>=hi-0.01&&lin-hi<=PERTO)});
      if(!cand.length) return;
      const lin0=hz?cand[0].y1:cand[0].x1; const mesma=cand.filter(s=>Math.abs((hz?s.y1:s.x1)-lin0)<0.01).map(s=>hz?[Math.min(s.x1,s.x2),Math.max(s.x1,s.x2)]:[Math.min(s.y1,s.y2),Math.max(s.y1,s.y2)]).sort((p,q)=>p[0]-q[0]);
      const m0=hz?b.L:b.B, m1=hz?b.R:b.T; let i=mesma.findIndex(p=>p[1]>m0+0.02&&p[0]<m1-0.02); if(i<0) return;
      let a0=mesma[i][0],a1=mesma[i][1];
      for(let j=i+1;j<mesma.length&&mesma[j][0]<=a1+0.02;j++)a1=Math.max(a1,mesma[j][1]);
      for(let j=i-1;j>=0&&mesma[j][1]>=a0-0.02;j--)a0=Math.min(a0,mesma[j][0]);
      const sgn=hz?dir[0]:dir[1]; const fim=sgn>0?a1:a0; const dist=(fim-face)*sgn;
      if(dist<0.01||Math.abs(dist-dd)<0.03) return;
      const yv=lado<0?lo+0.12:hi-0.12;
      out.push({x1:hz?face:yv,y1:hz?yv:face,x2:hz?face+dir[0]*dist:yv,y2:hz?yv:face+dir[1]*dist,cm:Math.round(dist*100),tipo:'fim',dir});
    });
    // b) ao longo de uma parede encostada: até o começo da porta/passagem/janela
    aberturas.forEach(s=>{
      const par=hz?Math.abs(s.y1-s.y2)<1e-6:Math.abs(s.x1-s.x2)<1e-6; if(!par) return;
      const lin=hz?s.y1:s.x1; const lo=hz?b.B:b.L, hi=hz?b.T:b.R;
      const lado=(lin<=lo+0.01&&lo-lin<=PERTO)?-1:(lin>=hi-0.01&&lin-hi<=PERTO)?1:0; if(!lado) return;
      const a0=hz?Math.min(s.x1,s.x2):Math.min(s.y1,s.y2), a1=hz?Math.max(s.x1,s.x2):Math.max(s.y1,s.y2);
      const sgn=hz?dir[0]:dir[1]; const perto2=sgn>0?a0:a1; const dist=(perto2-face)*sgn;
      const cobre=Math.min(a1,hz?b.R:b.T)-Math.max(a0,hz?b.L:b.B);
      const yv=lado<0?lo+0.06:hi-0.06;
      if(cobre>0.02){ if(sgn>0) out.push({x1:hz?Math.max(a0,b.L):yv,y1:hz?yv:Math.max(a0,b.B),x2:hz?Math.min(a1,b.R):yv,y2:hz?yv:Math.min(a1,b.T),cm:Math.round(cobre*100),tipo:s.tipo,invade:true,dir}); return }
      if(dist<-0.005||dist>MAX) return;
      out.push({x1:hz?face:yv,y1:hz?yv:face,x2:hz?face+dir[0]*dist:yv,y2:hz?yv:face+dir[1]*dist,cm:Math.round(dist*100),tipo:s.tipo,dir});
    });
  });
  // se existe o fim da parede num sentido, não mostra a medida que passa da curva e vai até o fim do cômodo
  const kd=q=>q.dir.join();
  const comFim=new Set(out.filter(q=>q.tipo==='fim').map(kd));
  for(let i=out.length-1;i>=0;i--){const q=out[i];if(q.tipo==='livre'&&comFim.has(kd(q))){const f2=out.find(z=>z.tipo==='fim'&&kd(z)===kd(q));if(f2&&f2.cm<q.cm)out.splice(i,1)}}
  // só a abertura mais perto em cada sentido
  const vist={}; return out.filter(q=>{if(q.tipo==='livre'||q.tipo==='fim'||q.invade)return true;const k=q.dir.join();if(vist[k]!==undefined&&vist[k]<=q.cm)return false;vist[k]=q.cm;return true})
    .filter((q,i,arr)=>{if(q.tipo==='livre'||q.tipo==='fim'||q.invade)return true;const k=q.dir.join();return vist[k]===q.cm});
}
const COTA_COR={livre:'#5b6475',fim:'#1f3a5f',porta:'#d9822b',passagem:'#2e7d32',janela:'#2e7bd6'};
const COTA_TXT={livre:'até a parede ou móvel em frente',fim:'até o fim da parede',porta:'até a porta',passagem:'até a passagem',janela:'até a janela'};
const COTA_DIR={'1,0':' (→)','-1,0':' (←)','0,1':' (↑)','0,-1':' (↓)'};
const COTA_NOME={fim:'fim da parede',porta:'porta',passagem:'passagem',janela:'janela'};
function svgCotas(c,m,fs){
  let o=''; const sw=fs*0.06, f=fs*0.55; mvCotasLista=cotasMovel(c,m);
  mvCotasLista.forEach((q,qi)=>{const cor=q.invade?'#d92d20':COTA_COR[q.tipo];const hz=Math.abs(q.y1-q.y2)<1e-6;
    const tk=fs*0.18; const t1=hz?`M ${q.x1} ${-q.y1-tk} V ${-q.y1+tk} M ${q.x2} ${-q.y2-tk} V ${-q.y2+tk}`:`M ${q.x1-tk} ${-q.y1} H ${q.x1+tk} M ${q.x2-tk} ${-q.y2} H ${q.x2+tk}`;
    o+=`<path d="M ${q.x1} ${-q.y1} L ${q.x2} ${-q.y2} ${t1}" stroke="${cor}" stroke-width="${sw}" fill="none" ${q.invade?'':`stroke-dasharray="${fs*0.2} ${fs*0.12}"`}/>`;
    if(q.cm<1&&!q.invade) return;
    const txt=q.invade?`invade ${COTA_NOME[q.tipo]} ${q.cm}`:q.tipo==='livre'?`${q.cm}`:`${q.cm} até ${COTA_NOME[q.tipo]}`;
    const w2=txt.length*f*0.55+f*0.4; const len=Math.hypot(q.x2-q.x1,q.y2-q.y1); let mx=(q.x1+q.x2)/2, my=(q.y1+q.y2)/2;
    if(len<w2&&len>1e-6){const ux=(q.x2-q.x1)/len,uy=(q.y2-q.y1)/len;mx=q.x2+ux*(w2/2+f*0.3);my=q.y2+uy*(w2/2+f*0.3)}
    o+=`<g ${q.invade?'':`data-cota="${qi}" style="pointer-events:auto;cursor:pointer"`} transform="translate(${mx} ${-my})${hz?'':' rotate(-90)'}"><rect x="${-w2/2}" y="${-f*0.65}" width="${w2}" height="${f*1.3}" rx="${f*0.3}" fill="#fff" fill-opacity=".92" stroke="${cor}" stroke-width="${sw*0.7}"/><text x="0" y="0" font-size="${f}" text-anchor="middle" dominant-baseline="central" fill="${cor}" font-family="sans-serif" font-weight="700">${txt}</text></g>`});
  return o;
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
      const nx=-s.hy*k,ny=s.hx*k; const arco=portaArco(s,g.inLeft);
      if(s.tipo==='porta'&&(s.abre==='fora'||s.abre==='correr'||(arco&&!arco.dentro))) return;
      let z,raioOk=null;
      if(arco){const xs=[arco.H[0],arco.C[0],arco.O[0]],ys=[arco.H[1],arco.C[1],arco.O[1]];z={L:Math.min(...xs),R:Math.max(...xs),B:Math.min(...ys),T:Math.max(...ys)};
        const qx=Math.max(b.L,Math.min(arco.H[0],b.R)),qy=Math.max(b.B,Math.min(arco.H[1],b.T));raioOk=Math.hypot(qx-arco.H[0],qy-arco.H[1])<arco.w-0.02}
      else{const prof=s.tipo==='porta'?s.cm/100:0.6;const xs=[s.x1,s.x2,s.x1+nx*prof,s.x2+nx*prof],ys=[s.y1,s.y2,s.y1+ny*prof,s.y2+ny*prof];z={L:Math.min(...xs),R:Math.max(...xs),B:Math.min(...ys),T:Math.max(...ys)}}
      const ox=Math.min(b.R,z.R)-Math.max(b.L,z.L),oy=Math.min(b.T,z.T)-Math.max(b.B,z.B);
      if(ox>0.02&&oy>0.02&&raioOk!==false){
        if(s.tipo==='passagem') av.push({n:'warn',t:`${m.nome}: está na frente da passagem (parede ${s.wi+1}) e atrapalha quem passa.`});
        else if(arco) av.push({n:'bad',t:`${m.nome}: está no giro da porta (parede ${s.wi+1}). A porta bate no móvel.`});
        else av.push({n:'warn',t:`${m.nome}: está na frente da porta (parede ${s.wi+1}) e pode atrapalhar. Diga para que lado ela abre (em Portas, na tela do cômodo).`});
      }
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

/* ===================== etapa 3: giro das portas ===================== */
/* s = segmento de porta (de geo), inLeft = lado de dentro do cômodo. Retorna dobradiça H, ponta fechada C, ponta aberta O. */
function portaArco(s,inLeft){
  if(s.tipo!=='porta'||!s.abre||s.abre==='correr'||!s.dob) return null;
  const k=inLeft?1:-1, n=[-s.hy*k,s.hx*k], u=[s.hx,s.hy], w=s.cm/100;
  const left=[n[1],-n[0]]; const paraFim=(left[0]*u[0]+left[1]*u[1])>0;
  const naEsq=s.dob==='E'; const H=(naEsq===paraFim)?[s.x2,s.y2]:[s.x1,s.y1]; const C=(naEsq===paraFim)?[s.x1,s.y1]:[s.x2,s.y2];
  const d=s.abre==='dentro'?n:[-n[0],-n[1]]; const O=[H[0]+d[0]*w,H[1]+d[1]*w];
  return {H,C,O,w,dentro:s.abre==='dentro'};
}
function svgArco(a,P,sw,cor){ /* P: função que leva (x,y) do cômodo para (x,y) do mundo */
  const H=P(...a.H),C=P(...a.C),O=P(...a.O); const hx=H[0],hy=-H[1],cx=C[0],cy=-C[1],ox=O[0],oy=-O[1];
  const cr=(cx-hx)*(oy-hy)-(cy-hy)*(ox-hx); const sweep=cr>0?1:0;
  return `<path d="M ${cx} ${cy} A ${a.w} ${a.w} 0 0 ${sweep} ${ox} ${oy}" fill="none" stroke="${cor||'#d9822b'}" stroke-width="${sw*0.5}" stroke-dasharray="${sw*1.6} ${sw*1.1}"/><line x1="${hx}" y1="${hy}" x2="${ox}" y2="${oy}" stroke="${cor||'#d9822b'}" stroke-width="${sw*0.9}"/>`;
}
function portasV(c){
  const g=geo(c); const ps=g.segs.filter(s=>s.tipo==='porta'); if(!ps.length) return '';
  const bt=(k,v,cur,txt)=>`<button class="seg ${cur===v?'on':''}" data-a="${k}" data-k="${ps[0]?'':''}" >${txt}</button>`;
  let h=`<h2>Portas</h2><p class="help">Para o app saber o giro da porta. A dobradiça é vista de dentro deste cômodo, olhando para a porta.</p>`;
  h+=ps.map(s=>{const key=s.wi+'-'+s.pi;const p=c.paredes[s.wi].pecas[s.pi];
    const b=(a,v,txt,cur)=>`<button class="seg ${cur===v?'on':''}" data-a="${a}" data-k="${key}" data-v="${v}">${txt}</button>`;
    return `<div class="card porta"><b>Parede ${s.wi+1} · Porta ${fm(s.cm)}</b>
      <div class="segrow"><span class="mini-l">Abre</span>${b('portaAbre','dentro','Para dentro',p.abre)}${b('portaAbre','fora','Para fora',p.abre)}${b('portaAbre','correr','De correr',p.abre)}</div>
      ${p.abre==='correr'?'':`<div class="segrow"><span class="mini-l">Dobradiça</span>${b('portaDob','E','À esquerda',p.dob)}${b('portaDob','D','À direita',p.dob)}</div>`}</div>`}).join('');
  return h;
}
/* aplica no cômodo e espelha na mesma porta vista do outro cômodo (se as portas estiverem ligadas) */
function portaSet(im,c,key,campo,v){
  const [wi,pi]=key.split('-').map(Number); const p=c.paredes[wi].pecas[pi]; p[campo]=v;
  (im.ligacoes||[]).forEach(l=>{let oid=null,ok=null; if(l.a===c.id&&l.ai===key){oid=l.b;ok=l.bi} else if(l.b===c.id&&l.bi===key){oid=l.a;ok=l.ai} if(!oid)return;
    const oc=im.comodos.find(x=>x.id===oid); if(!oc)return; const [w2,p2]=ok.split('-').map(Number); const q=oc.paredes[w2]&&oc.paredes[w2].pecas[p2]; if(!q||q.tipo!=='porta')return;
    if(campo==='abre') q.abre=v==='dentro'?'fora':v==='fora'?'dentro':'correr'; else q.dob=v==='E'?'D':'E';
  });
}

/* ===================== etapa 4: móveis e portas no PDF e no AutoCAD ===================== */
function arcoPontos(a,n){const aC=Math.atan2(a.C[1]-a.H[1],a.C[0]-a.H[0]),aO=Math.atan2(a.O[1]-a.H[1],a.O[0]-a.H[0]);let dl=aO-aC;while(dl>Math.PI)dl-=2*Math.PI;while(dl<-Math.PI)dl+=2*Math.PI;
  const pts=[];for(let i=0;i<=n;i++){const t=aC+dl*i/n;pts.push([a.H[0]+a.w*Math.cos(t),a.H[1]+a.w*Math.sin(t)])}return pts}
/* Q: (x,y) do cômodo -> (x,y) da página; esc: mm por metro */
function pdfCotas(d,c,Q){
  const vist=new Set();
  (c.moveis||[]).forEach(m=>cotasMovel(c,m).forEach(q=>{if(!q.invade&&(q.cm<1||q.cm>300))return;
    const k=[q.x1,q.y1,q.x2,q.y2].map(v=>Math.round(v*50)).sort().join();if(vist.has(k))return;vist.add(k);
    const cor=q.invade?[217,45,32]:hex(COTA_COR[q.tipo]);const a=Q(q.x1,q.y1),b=Q(q.x2,q.y2);
    d.setDrawColor(...cor);d.setLineWidth(0.2);d.setLineDashPattern(q.invade?[]:[0.8,0.5],0);d.line(a[0],a[1],b[0],b[1]);d.setLineDashPattern([],0);
    const hz=Math.abs(a[1]-b[1])<0.01;const tk=0.9;
    if(hz){d.line(a[0],a[1]-tk,a[0],a[1]+tk);d.line(b[0],b[1]-tk,b[0],b[1]+tk)}else{d.line(a[0]-tk,a[1],a[0]+tk,a[1]);d.line(b[0]-tk,b[1],b[0]+tk,b[1])}
    const txt=q.invade?'invade '+COTA_NOME[q.tipo]+' '+q.cm:q.tipo==='livre'?String(q.cm):q.cm+' até '+COTA_NOME[q.tipo];
    d.setFont('helvetica','bold');d.setFontSize(6);const tw=d.getTextWidth(txt);const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    d.setFillColor(255,255,255);if(hz)d.rect(mx-tw/2-0.6,my-1.5,tw+1.2,3,'F');else d.rect(mx-1.5,my-tw/2-0.6,3,tw+1.2,'F');
    d.setTextColor(...cor);d.text(txt,mx,my,{align:'center',baseline:'middle',angle:hz?0:90})}));
}
function pdfMoveisPortas(d,c,g,Q,esc,opt={}){
  g.segs.forEach(s=>{const a=portaArco(s,g.inLeft);if(!a||(opt.soDentro&&!a.dentro))return;
    d.setDrawColor(217,130,43);d.setLineWidth(0.25);d.setLineDashPattern([1.2,0.9],0);const pts=arcoPontos(a,14).map(p=>Q(...p));
    for(let i=1;i<pts.length;i++)d.line(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1]);
    d.setLineDashPattern([],0);d.setLineWidth(0.5);const h=Q(...a.H),o=Q(...a.O);d.line(h[0],h[1],o[0],o[1])});
  (c.moveis||[]).forEach(m=>{d.setDrawColor(43,84,135);d.setFillColor(238,242,247);d.setLineWidth(0.35);d.setLineDashPattern([],0);
    if(m.forma==='redonda'){const p=Q(m.x,m.y);d.circle(p[0],p[1],m.w/200*esc,'FD')}
    else{const b=corpo(m);const pts=[[b.L,b.B],[b.R,b.B],[b.R,b.T],[b.L,b.T]].map(p=>Q(...p));d.lines(pts.slice(1).map((p,i)=>[p[0]-pts[i][0],p[1]-pts[i][1]]),pts[0][0],pts[0][1],[1,1],'FD',true)}
    if(opt.nomes!==false){const p=Q(m.x,m.y);const fp=footprint(m);const larg=fp.w*esc*0.92;let fz=opt.fonte||7;d.setFont('helvetica','bold');d.setFontSize(fz);
      let nome=m.nome;while(d.getTextWidth(nome)>larg&&fz>4.5){fz-=0.5;d.setFontSize(fz)}
      if(d.getTextWidth(nome)>larg){const pal=nome.split(' ');nome=pal[0];if(d.getTextWidth(nome)>larg){while(nome.length>2&&d.getTextWidth(nome+'.')>larg)nome=nome.slice(0,-1);nome+='.'}}
      d.setTextColor(31,58,95);d.text(nome,p[0],p[1],{align:'center',baseline:'middle'});
      if(opt.medidas&&fp.d*esc>fz*0.9){const med=m.forma==='redonda'?'Ø '+fm(m.w):fm(m.w)+' × '+fm(m.d);d.setFont('helvetica','normal');let f2=Math.max(4,fz-1.5);d.setFontSize(f2);
        if(d.getTextWidth(med)<=larg){d.setTextColor(90,100,116);d.text(med,p[0],p[1]+fz*0.45,{align:'center',baseline:'middle'})}}}
  });
}
function dxfMoveisPortas(add,c,g,t,line,text){
  g.segs.forEach(s=>{const a=portaArco(s,g.inLeft);if(!a||!a.dentro)return;const H=rot(t,...a.H),C=rot(t,...a.C),O=rot(t,...a.O);
    let aC=Math.atan2(C[1]-H[1],C[0]-H[0])*180/Math.PI,aO=Math.atan2(O[1]-H[1],O[0]-H[0])*180/Math.PI;const ccw=((aO-aC)%360+360)%360;
    const [a1,a2]=ccw<=180?[aC,aO]:[aO,aC];add(0,'ARC',8,'PORTAS',10,H[0].toFixed(4),20,H[1].toFixed(4),30,0,40,a.w.toFixed(4),50,a1.toFixed(2),51,a2.toFixed(2));line('PORTAS',H,O)});
  (c.moveis||[]).forEach(m=>{const p=rot(t,m.x,m.y);
    if(m.forma==='redonda') add(0,'CIRCLE',8,'MOVEIS',10,p[0].toFixed(4),20,p[1].toFixed(4),30,0,40,(m.w/200).toFixed(4));
    else{const b=corpo(m);const pts=[[b.L,b.B],[b.R,b.B],[b.R,b.T],[b.L,b.T]].map(q=>rot(t,...q));for(let i=0;i<4;i++)line('MOVEIS',pts[i],pts[(i+1)%4])}
    text('MOVEIS',p,0.08,m.nome)});
  const vist=new Set();
  (c.moveis||[]).forEach(m=>cotasMovel(c,m).forEach(q=>{if(!q.invade&&(q.cm<1||q.cm>300))return;const k=[q.x1,q.y1,q.x2,q.y2].map(v=>Math.round(v*50)).sort().join();if(vist.has(k))return;vist.add(k);
    const a=rot(t,q.x1,q.y1),b=rot(t,q.x2,q.y2);line('COTAS-MOVEIS',a,b);const u=[b[0]-a[0],b[1]-a[1]];let ang=Math.atan2(u[1],u[0])*180/Math.PI;if(ang>90.5)ang-=180;if(ang<-89.5)ang+=180;
    text('COTAS-MOVEIS',[(a[0]+b[0])/2,(a[1]+b[1])/2],0.05,q.invade?'invade '+COTA_NOME[q.tipo]+' '+q.cm:q.tipo==='livre'?String(q.cm):q.cm+' ate '+COTA_NOME[q.tipo],ang)}));
}
/* ===================== meus móveis ===================== */
function meusGet(){try{return JSON.parse(localStorage.getItem('medir_meus_moveis')||'[]')}catch(e){return[]}}
function meusSet(l){try{localStorage.setItem('medir_meus_moveis',JSON.stringify(l))}catch(e){}}
