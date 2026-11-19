"use strict";
/* ===================== estado ===================== */
let DB=null, DL=null, DICT=null, imoveis=[], view={t:'home'}, saveTimers={}, entry='', confirmDel=null, micOn=false, loaded=false, linkForm=null, imTab='comodos';
const TIPOS={parede:'Parede',porta:'Porta',janela:'Janela',passagem:'Passagem',armario:'Armário'};
const ABERT=['porta','janela','passagem'];
const COL={parede:'#1d2433',porta:'#d9822b',janela:'#2f80d1',passagem:'#1f7a4d',armario:'#8b7d63'};
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fm=cm=>(cm/100).toFixed(2).replace('.',',');
function toast(t){const e=$('#toast');e.textContent=t;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',3000)}
function lsGet(){try{return JSON.parse(localStorage.getItem('medir_imoveis')||'[]')}catch(e){return[]}}
function lsSet(){try{localStorage.setItem('medir_imoveis',JSON.stringify(imoveis))}catch(e){}}
function cur(){return imoveis.find(i=>i.id===view.im)}
function room(){const im=cur();return im&&im.comodos.find(c=>c.id===view.room)}
function norm(im){im.comodos=im.comodos||[];im.ligacoes=im.ligacoes||[];return im}
function save(im){
  im.atualizado=Date.now(); lsSet();
  if(!DB) return;
  clearTimeout(saveTimers[im.id]);
  saveTimers[im.id]=setTimeout(async()=>{
    try{ await DB.collection('imoveis').doc(im.id).set(JSON.parse(JSON.stringify(im))) }
    catch(e){ if(e&&e.code==='quota_exceeded') toast('Espaço cheio: apague imóveis antigos.'); else toast('Não salvou na nuvem agora; ficou guardado neste aparelho.') }
  },700);
}
async function removeIm(im){imoveis=imoveis.filter(x=>x.id!==im.id);lsSet();if(DB){try{await DB.collection('imoveis').doc(im.id).delete()}catch(e){}}}

/* ===================== geometria do cômodo ===================== */
function geo(c){
  let x=0,y=0,hx=1,hy=0; const segs=[], wallStarts=[]; let L=0,R=0;
  const tot={E:0,W:0,N:0,S:0}, side={E:[],W:[],N:[],S:[]};
  c.paredes.forEach((w,wi)=>{
    wallStarts.push({x,y,hx,hy});
    const dir=hx>0.5?'E':hx<-0.5?'W':hy>0.5?'N':'S';
    let wl=0;
    w.pecas.forEach((p,pi)=>{const m=p.cm/100;segs.push({x1:x,y1:y,x2:x+hx*m,y2:y+hy*m,tipo:p.tipo,cm:p.cm,wi,pi,hx,hy,abre:p.abre,dob:p.dob});x+=hx*m;y+=hy*m;wl+=p.cm});
    if(wl){tot[dir]+=wl; side[dir].push(wi+1)}
    if(w.virada==='E'){[hx,hy]=[-hy,hx];L++} else if(w.virada==='D'){[hx,hy]=[hy,-hx];R++}
  });
  let area=0; segs.forEach(s=>{area+=s.x1*s.y2-s.x2*s.y1}); area/=2;
  const inLeft = Math.abs(area)>0.05 ? area>0 : L>=R;
  return {segs,x,y,hx,hy,inLeft,tot,side,wallStarts,gap:Math.hypot(x,y)*100,area:Math.abs(area)};
}
function closeInfo(c){
  const g=geo(c); const dW=Math.abs(g.tot.E-g.tot.W), dL=Math.abs(g.tot.N-g.tot.S);
  const worst=Math.max(dW,dL,Math.round(g.gap));
  return {g,dW,dL,worst,nivel:worst<=3?'ok':worst<=6?'warn':'bad'};
}
function expected(c){
  const g=geo(c); const w=c.paredes[c.paredes.length-1];
  if(c.paredes.length<3) return null;
  const vx=-g.x,vy=-g.y; const along=(vx*g.hx+vy*g.hy); const across=Math.abs(vx*-g.hy+vy*g.hx);
  if(along<=0.05||across>0.12) return null;
  const done=w.pecas.reduce((s,p)=>s+p.cm,0);
  return {total:Math.round(along*100+done)};
}
function bbox(segs){if(!segs.length)return[0,0,1,1];let a=[1e9,1e9,-1e9,-1e9];segs.forEach(s=>{a[0]=Math.min(a[0],s.x1,s.x2);a[1]=Math.min(a[1],s.y1,s.y2);a[2]=Math.max(a[2],s.x1,s.x2);a[3]=Math.max(a[3],s.y1,s.y2)});return a}
function aberturas(c){return geo(c).segs.filter(s=>ABERT.includes(s.tipo)).map(s=>({key:s.wi+'-'+s.pi,label:`Parede ${s.wi+1} · ${TIPOS[s.tipo]} ${fm(s.cm)}`,s}))}

/* ===================== encaixe (planta) ===================== */
function rot(t,x,y){const c=Math.cos(t.th),s=Math.sin(t.th);return[c*x-s*y+t.tx,s*x+c*y+t.ty]}
function rotv(t,x,y){const c=Math.cos(t.th),s=Math.sin(t.th);return[c*x-s*y,s*x+c*y]}
function layout(im){
  const G={}; im.comodos.forEach(c=>G[c.id]=geo(c));
  const lay={}; const links=im.ligacoes.filter(l=>G[l.a]&&G[l.b]);
  const order=im.comodos.filter(c=>G[c.id].segs.length).map(c=>c.id);
  const findSeg=(id,key)=>G[id].segs.find(s=>s.wi+'-'+s.pi===key);
  const inN=(id,s)=>{const k=G[id].inLeft?1:-1;return[-s.hy*k,s.hx*k]};
  let placedAny=false;
  for(const root of order){
    if(lay[root]) continue;
    const linked=links.some(l=>l.a===root||l.b===root);
    if(placedAny && !linked) continue;
    if(!linked && placedAny) continue;
    lay[root]={th:0,tx:0,ty:0,grupo:root};
    if(placedAny){ // novo grupo: colocar ao lado
      const bb=planBBox(im,lay,G,l=>l.grupo!==root); const b=bbox(G[root].segs);
      lay[root].tx=bb[2]+1.5-b[0]; lay[root].ty=bb[1]-b[1];
    }
    placedAny=true;
    const q=[root];
    while(q.length){const id=q.shift();
      links.forEach(l=>{
        let from,to,kf,kt; if(l.a===id&&!lay[l.b]){from=l.a;to=l.b;kf=l.ai;kt=l.bi} else if(l.b===id&&!lay[l.a]){from=l.b;to=l.a;kf=l.bi;kt=l.ai} else return;
        const sf=findSeg(from,kf), st=findSeg(to,kt); if(!sf||!st) return;
        const T=lay[from]; const nf=rotv(T,...inN(from,sf)); const nt=inN(to,st);
        const th=Math.atan2(-nf[1],-nf[0])-Math.atan2(nt[1],nt[0]);
        const cf=rot(T,(sf.x1+sf.x2)/2,(sf.y1+sf.y2)/2); const e=(l.esp||15)/100;
        const target=[cf[0]-nf[0]*e,cf[1]-nf[1]*e];
        const Tt={th,tx:0,ty:0}; const ct=rot(Tt,(st.x1+st.x2)/2,(st.y1+st.y2)/2);
        lay[to]={th,tx:target[0]-ct[0],ty:target[1]-ct[1],grupo:T.grupo}; q.push(to);
      });
    }
  }
  // cômodos sem ligação: ao lado
  order.forEach(id=>{ if(!lay[id]){ const bb=planBBox(im,lay,G); const b=bbox(G[id].segs); lay[id]={th:0,tx:bb[2]+1.5-b[0],ty:bb[1]-b[1],solto:true,grupo:id} } });
  return {lay,G};
}
function planBBox(im,lay,G,filter){let a=[1e9,1e9,-1e9,-1e9],any=false;
  Object.keys(lay).forEach(id=>{const t=lay[id];if(filter&&!filter(t))return;(G[id]||geo(im.comodos.find(c=>c.id===id))).segs.forEach(s=>{const p=rot(t,s.x1,s.y1),q=rot(t,s.x2,s.y2);a[0]=Math.min(a[0],p[0],q[0]);a[1]=Math.min(a[1],p[1],q[1]);a[2]=Math.max(a[2],p[0],q[0]);a[3]=Math.max(a[3],p[1],q[1]);any=true})});
  return any?a:[0,0,0,0]}
function faces(im,L){
  const out=[];
  im.comodos.forEach(c=>{const t=L.lay[c.id];if(!t)return;const g=L.G[c.id];const k=g.inLeft?1:-1;
    c.paredes.forEach((w,wi)=>{const ss=g.segs.filter(s=>s.wi===wi);if(!ss.length)return;
      const p=rot(t,ss[0].x1,ss[0].y1),q=rot(t,ss[ss.length-1].x2,ss[ss.length-1].y2);
      const n=rotv(t,-ss[0].hy*k,ss[0].hx*k); const len=Math.hypot(q[0]-p[0],q[1]-p[1]); if(len<0.02)return;
      out.push({room:c,wi,p,q,n,u:[(q[0]-p[0])/len,(q[1]-p[1])/len],len,solto:t.solto});
    })});
  return out;
}
function checks(im){
  const issues=[]; const L=layout(im); const F=faces(im,L);
  im.comodos.forEach(c=>{const g=L.G[c.id]; if(!g.segs.length){issues.push({n:'info',t:`${c.nome}: ainda sem medidas.`,r:[c.id]});return}
    if(!c.fechado){issues.push({n:'info',t:`${c.nome}: medição ainda não foi fechada.`,r:[c.id]});return}
    const ci=closeInfo(c);
    const semGiro=g.segs.filter(s=>s.tipo==='porta'&&(!s.abre||(s.abre!=='correr'&&!s.dob))).length;
    if(semGiro&&(c.moveis||[]).length) issues.push({n:'info',t:`${c.nome}: falta dizer para que lado ${semGiro>1?`abrem ${semGiro} portas`:'abre 1 porta'} (em Portas, na tela do cômodo). Sem isso, o app não confere se os móveis atrapalham a porta.`,r:[c.id]});
    if(ci.dW>6) issues.push({n:'bad',t:`${c.nome}: as paredes ${g.side.E.join(', ')} somam ${fm(g.tot.E)} m e as do lado oposto (${g.side.W.join(', ')}) somam ${fm(g.tot.W)} m - ${ci.dW} cm de diferença.`,r:[c.id],w:[[c.id,[...g.side.E,...g.side.W]]],med:true});
    if(ci.dL>6) issues.push({n:'bad',t:`${c.nome}: as paredes ${g.side.N.join(', ')} somam ${fm(g.tot.N)} m e as do lado oposto (${g.side.S.join(', ')}) somam ${fm(g.tot.S)} m - ${ci.dL} cm de diferença.`,r:[c.id],w:[[c.id,[...g.side.N,...g.side.S]]],med:true});
  });
  im.ligacoes.forEach(l=>{const A=im.comodos.find(c=>c.id===l.a),B=im.comodos.find(c=>c.id===l.b);if(!A||!B)return;
    const sa=L.G[A.id].segs.find(s=>s.wi+'-'+s.pi===l.ai), sb=L.G[B.id].segs.find(s=>s.wi+'-'+s.pi===l.bi); if(!sa||!sb)return;
    const d=Math.abs(sa.cm-sb.cm); if(d>3) issues.push({n:'info',t:`A ${TIPOS[sa.tipo].toLowerCase()} entre ${A.nome} e ${B.nome} mede ${fm(sa.cm)} de um lado e ${fm(sb.cm)} do outro (${d} cm). Normalmente é o batente: meça os dois lados do mesmo jeito.`,r:[A.id,B.id],w:[[A.id,[sa.wi+1]],[B.id,[sb.wi+1]]]});
  });
  const seen=new Set();
  const opp=(a,b)=>{const dot=a.n[0]*b.n[0]+a.n[1]*b.n[1];if(dot>-0.98)return null;const pb=[(b.p[0]-a.p[0])*a.u[0]+(b.p[1]-a.p[1])*a.u[1],(b.q[0]-a.p[0])*a.u[0]+(b.q[1]-a.p[1])*a.u[1]].sort((x,y)=>x-y);
    const ov=Math.min(a.len,pb[1])-Math.max(0,pb[0]);const s=-((b.p[0]-a.p[0])*a.n[0]+(b.p[1]-a.p[1])*a.n[1]);return ov>0.15&&s>-0.5&&s<0.5?s:null};
  F.forEach(a=>{a.ext=!F.some(b=>b.room.id!==a.room.id&&!b.solto&&opp(a,b)!==null)});
  const linkEsp=(x,y)=>im.ligacoes.filter(l=>(l.a===x&&l.b===y)||(l.a===y&&l.b===x)).map(l=>(l.esp||15)/100);
  for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){const a=F[i],b=F[j]; if(a.room.id===b.room.id||a.solto||b.solto)continue;
    const dot=a.n[0]*b.n[0]+a.n[1]*b.n[1]; const par=Math.abs(a.u[0]*b.u[1]-a.u[1]*b.u[0])<0.02; if(!par)continue;
    const ta=[0,a.len], pb=[(b.p[0]-a.p[0])*a.u[0]+(b.p[1]-a.p[1])*a.u[1],(b.q[0]-a.p[0])*a.u[0]+(b.q[1]-a.p[1])*a.u[1]].sort((x,y)=>x-y);
    const ov=Math.min(ta[1],pb[1])-Math.max(ta[0],pb[0]);
    const off=(b.p[0]-a.p[0])*a.n[0]+(b.p[1]-a.p[1])*a.n[1];
    if(dot<-0.98 && ov>0.25){ const s=-off; // espessura
      if(s>-0.5&&s<0.35){ const key=[a.room.id,b.room.id].sort().join();
        if(s<0.07){ if(seen.has('t'+key+Math.round(s*100)))continue; seen.add('t'+key+Math.round(s*100));
          issues.push({n:'bad',t: s<-0.005?`${a.room.nome} e ${b.room.nome} ficaram ${Math.round(-s*100)} cm um por cima do outro (parede ${a.wi+1} de ${a.room.nome} e parede ${b.wi+1} de ${b.room.nome}). Alguma medida está maior do que deveria.`:`A parede entre ${a.room.nome} (parede ${a.wi+1}) e ${b.room.nome} (parede ${b.wi+1}) ficou com só ${Math.round(s*100)} cm. Paredes costumam ter de 10 a 25 cm: confira as medidas desses dois cômodos.`,r:[a.room.id,b.room.id],w:[[a.room.id,[a.wi+1]],[b.room.id,[b.wi+1]]],med:true});
        } else if(s>0.30&&!linkEsp(a.room.id,b.room.id).some(e=>Math.abs(e-s)<0.04)){ issues.push({n:'warn',t:`A parede entre ${a.room.nome} (parede ${a.wi+1}) e ${b.room.nome} (parede ${b.wi+1}) ficou com ${Math.round(s*100)} cm, mais grossa que o normal. Pode ser um duto ou um erro de medida.`,r:[a.room.id,b.room.id],w:[[a.room.id,[a.wi+1]],[b.room.id,[b.wi+1]]],med:true}) }
      }
    }
    if(dot>0.98&&a.ext&&b.ext&&a.len>=0.9&&b.len>=0.9){ const gapT=Math.max(pb[0]-ta[1],ta[0]-pb[1]); const o=Math.abs(off);
      if(o>=0.04&&o<=0.15&&gapT<0.6&&gapT>-0.01){ const key='a'+[a.room.id+a.wi,b.room.id+b.wi].sort().join(); if(seen.has(key))continue; seen.add(key);
        issues.push({n:'warn',t:`A parede ${a.wi+1} de ${a.room.nome} e a parede ${b.wi+1} de ${b.room.nome} estão quase alinhadas, com ${Math.round(o*100)} cm de diferença. Se forem a mesma parede (por exemplo, a parede de fora), alguma medida desses cômodos está diferente.`,r:[a.room.id,b.room.id],w:[[a.room.id,[a.wi+1]],[b.room.id,[b.wi+1]]],med:true});
      }
    }
  }
  const soltos=im.comodos.filter(c=>L.lay[c.id]&&L.lay[c.id].solto); if(im.comodos.length>1) soltos.forEach(c=>issues.push({n:'info',t:`${c.nome} ainda não está ligado a nenhum outro cômodo.`,r:[c.id]}));
  return {issues,L};
}

/* ===================== desenhos ===================== */
function svgRoom(c,opt={}){
  const g=geo(c); const b=bbox(g.segs);
  const w=Math.max(b[2]-b[0],1), h=Math.max(b[3]-b[1],1); const pad=Math.max(w,h)*(opt.mini?0.08:0.16);
  const fs=Math.max(w,h)/(opt.mini?100:21); const sw=opt.mini?Math.max(w,h)/40:Math.max(w,h)/110;
  const vb=[b[0]-pad,-(b[3]+pad),w+2*pad,h+2*pad];
  let o=`<svg viewBox="${vb.join(' ')}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" ${opt.id?`id="${opt.id}"`:'class="mini"'}>`;
  g.segs.forEach(s=>{const dash=s.tipo==='porta'||s.tipo==='armario'||s.tipo==='passagem'?`stroke-dasharray="${sw*2.2} ${sw*1.4}"`:'';
    o+=`<line x1="${s.x1}" y1="${-s.y1}" x2="${s.x2}" y2="${-s.y2}" stroke="${COL[s.tipo]}" stroke-width="${s.tipo==='janela'?sw*2.2:sw}" stroke-linecap="square" ${dash}/>`});
  g.segs.forEach(s=>{const a2=portaArco(s,g.inLeft);if(a2)o+=svgArco(a2,(x,y)=>[x,y],sw)});
  if(!opt.mini){const k=g.inLeft?1:-1;
    g.segs.forEach(s=>{const nx=-s.hy*k,ny=s.hx*k;const mx=(s.x1+s.x2)/2+nx*fs*0.95,my=(s.y1+s.y2)/2+ny*fs*0.95;
      o+=`<text x="${mx}" y="${-my}" font-size="${fs}" text-anchor="middle" dominant-baseline="central" fill="${s.tipo==='parede'?'#b0451c':COL[s.tipo]}" font-weight="700" font-family="sans-serif">${fm(s.cm)}</text>`});
    g.wallStarts.forEach((p,i)=>{if(!c.paredes[i].pecas.length)return;const cx=p.x+p.hx*fs*0.9-p.hy*k*fs*2.1,cy=p.y+p.hy*fs*0.9+p.hx*k*fs*2.1;
      o+=`<circle cx="${cx}" cy="${-cy}" r="${fs*0.72}" fill="#1f3a5f"/><text x="${cx}" y="${-cy}" font-size="${fs*0.85}" fill="#fff" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="700">${i+1}</text>`});
    o+=`<circle cx="0" cy="0" r="${fs*0.45}" fill="#1f7a4d"/>`;
    if(!c.fechado){const a=fs*0.9;const px=g.x,py=g.y;const t=[[px+g.hx*a,py+g.hy*a],[px-g.hx*a*0.6-g.hy*a*0.7,py-g.hy*a*0.6+g.hx*a*0.7],[px-g.hx*a*0.6+g.hy*a*0.7,py-g.hy*a*0.6-g.hx*a*0.7]];
      o+=`<polygon points="${t.map(p=>p[0]+','+(-p[1])).join(' ')}" fill="#b42318"/>`}}
  return o+'</svg>';
}
function svgPlan(im,res,opt={}){
  const {L,issues}=res; const bb=planBBox(im,L.lay,L.G); if(bb[0]>bb[2]) return '';
  const w=Math.max(bb[2]-bb[0],1),h=Math.max(bb[3]-bb[1],1),pad=Math.max(w,h)*0.06,fs=Math.max(w,h)/34,sw=Math.max(w,h)/180;
  let o=`<svg viewBox="${bb[0]-pad} ${-(bb[3]+pad)} ${w+2*pad} ${h+2*pad}" xmlns="http://www.w3.org/2000/svg" id="${opt.id||'plan'}" preserveAspectRatio="xMidYMid meet">`;
  const marked={}; (opt.marcar?issues:[]).forEach(i=>(i.w||[]).forEach(([rid,ws])=>{if(i.n!=='info'){marked[rid]=marked[rid]||new Set();ws.forEach(x=>marked[rid].add(x))}}));
  im.comodos.forEach(c=>{const t=L.lay[c.id];if(!t)return;const g=L.G[c.id];
    g.segs.forEach(s=>{const p=rot(t,s.x1,s.y1),q=rot(t,s.x2,s.y2);const dash=s.tipo==='porta'||s.tipo==='armario'||s.tipo==='passagem'?`stroke-dasharray="${sw*2.4} ${sw*1.6}"`:'';
      if(marked[c.id]&&marked[c.id].has(s.wi+1)) o+=`<line x1="${p[0]}" y1="${-p[1]}" x2="${q[0]}" y2="${-q[1]}" stroke="#f04438" stroke-opacity=".35" stroke-width="${sw*6}" stroke-linecap="round"/>`;
      o+=`<line x1="${p[0]}" y1="${-p[1]}" x2="${q[0]}" y2="${-q[1]}" stroke="${COL[s.tipo]}" stroke-width="${s.tipo==='janela'?sw*2.2:sw}" stroke-linecap="square" ${dash}/>`});
    g.segs.forEach(s=>{const a2=portaArco(s,g.inLeft);if(a2&&a2.dentro)o+=svgArco(a2,(x,y)=>rot(t,x,y),sw)});
    const AVm=(c.moveis||[]).length?avisosMoveis(c):{};(c.moveis||[]).forEach(m=>{const p=rot(t,m.x,m.y);const q=AVm[m.id]||{};o+=svgMovel(m,p[0],p[1],(m.rot||0)+t.th*180/Math.PI,fs*0.7,{label:false,lados:q.lados,nivel:q.nivel})});
    const b=bbox(g.segs);const cc=rot(t,(b[0]+b[2])/2,(b[1]+b[3])/2);
    o+=`<text x="${cc[0]}" y="${-cc[1]}" font-size="${fs}" text-anchor="middle" dominant-baseline="central" fill="#1f3a5f" font-weight="700" font-family="sans-serif">${esc(c.nome)}</text>`;
    if(opt.numeros){const k=g.inLeft?1:-1;g.wallStarts.forEach((p0,i)=>{if(!c.paredes[i].pecas.length)return;const ss=g.segs.filter(s=>s.wi===i);const m=[(ss[0].x1+ss[ss.length-1].x2)/2-ss[0].hy*k*fs*1.2,(ss[0].y1+ss[ss.length-1].y2)/2+ss[0].hx*k*fs*1.2];const pp=rot(t,...m);
      o+=`<circle cx="${pp[0]}" cy="${-pp[1]}" r="${fs*0.55}" fill="${marked[c.id]&&marked[c.id].has(i+1)?'#b42318':'#8a93a3'}"/><text x="${pp[0]}" y="${-pp[1]}" font-size="${fs*0.62}" fill="#fff" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="700">${i+1}</text>`})}
  });
  return o+'</svg>';
}

/* ===================== telas ===================== */
function render(){const a=$('#app'); if(view.t==='home')a.innerHTML=homeV(); else if(view.t==='im')a.innerHTML=imV(); else if(view.t==='moveis')a.innerHTML=moveisV(); else a.innerHTML=roomV(); bind(); if(view.t==='moveis')bindMoveis()}
function statusBadge(c){
  if(!c.paredes.some(w=>w.pecas.length)) return '<span class="badge b-run">vazio</span>';
  if(!c.fechado) return '<span class="badge b-run">medindo</span>';
  const ci=closeInfo(c); return ci.nivel==='ok'?'<span class="badge b-ok">fechou</span>':ci.nivel==='warn'?`<span class="badge b-warn">${ci.worst} cm de diferença</span>`:`<span class="badge b-bad">${ci.worst} cm: medir de novo</span>`;
}
function homeV(){
  let h=`<h1>Medir imóvel</h1><p class="mut">Meça cada cômodo parede por parede. O desenho aparece na hora e o app avisa quando alguma medida não fecha.</p>`;
  h+=`<div class="card"><div class="row"><input id="novoIm" placeholder="Nome do imóvel (ex.: Apto 43)"><button class="pri" style="flex:none" data-a="novoIm">Criar</button></div></div>`;
  if(!loaded) h+=`<p class="mut">Carregando…</p>`; else if(!imoveis.length) h+=`<p class="mut">Nenhum imóvel ainda. Crie o primeiro acima.</p>`;
  h+='<div class="list">'+imoveis.slice().sort((a,b)=>(b.atualizado||0)-(a.atualizado||0)).map(im=>`<div class="card" data-a="abrirIm" data-id="${im.id}"><div style="flex:1"><b>${esc(im.nome)}</b><div class="mut">${im.comodos.length} cômodo(s) · ${new Date(im.atualizado||im.criado).toLocaleDateString('pt-BR')}</div></div><span style="font-size:22px;color:#9aa3b2">›</span></div>`).join('')+'</div>';
  if(imoveis.length) h+=`<div style="margin-top:18px"><button class="ghost" data-a="jsonTodos">Baixar cópia de todos os imóveis (.json)</button></div>`;
  if(!imoveis.some(x=>x.id==='apto-medido')) h+=`<div style="margin-top:4px"><button class="ghost" data-a="carregarMedido">Carregar o apartamento que medimos (12 e 13/11)</button></div>`;
  h+=`<div style="margin-top:4px"><label class="ghostbtn">Abrir cópia de segurança (.json)<input type="file" id="imp" accept=".json,application/json" style="display:none"></label></div>`;
  return h;
}
function imV(){
  const im=cur(); if(!im){view={t:'home'};return homeV()}
  const res=checks(im); const nProb=res.issues.filter(i=>i.n!=='info').length;
  let h=`<div class="top"><button class="ghost" data-a="home">‹ Imóveis</button><h1>${esc(im.nome)}</h1></div>`;
  h+=`<div class="tabs">${[['comodos','Cômodos'],['planta','Planta'],['conf','Conferência'+(nProb?` (${nProb})`:'')]].map(([k,t])=>`<button class="${imTab===k?'on':''}" data-a="tab" data-k="${k}">${t}</button>`).join('')}</div>`;
  if(imTab==='comodos'){
    h+=`<div class="card"><div class="row"><input id="novoRoom" placeholder="Novo cômodo (ex.: Sala)"><button class="pri" style="flex:none" data-a="novoRoom">Adicionar</button></div></div>`;
    h+='<div class="list">'+im.comodos.map(c=>{const g=geo(c);const b=bbox(g.segs);const dims=g.segs.length?`${fm(Math.round((b[2]-b[0])*100))} × ${fm(Math.round((b[3]-b[1])*100))} m`:'';
      return `<div class="card" data-a="abrirRoom" data-id="${c.id}">${g.segs.length?svgRoom(c,{mini:1}):'<div class="mini"></div>'}<div style="flex:1"><b>${esc(c.nome)}</b><div class="mut">${dims}${(c.moveis||[]).length?` · ${c.moveis.length} móvel(is)`:''}</div>${statusBadge(c)}${(()=>{if(!(c.moveis||[]).length)return'';const A=Object.values(avisosMoveis(c));const n=A.reduce((s2,x)=>s2+x.av.length,0);return n?` <span class="badge ${A.some(x=>x.nivel==='bad')?'b-bad':'b-warn'}">móveis: ${n} aviso(s)</span>`:''})()}</div></div>`}).join('')+'</div>';
  }
  if(imTab==='planta'){
    const sv=svgPlan(im,res,{id:'plan',numeros:true,marcar:true});
    h+= sv?`<div class="planbox">${sv}</div><p class="help">Paredes em vermelho têm medida para conferir (veja a aba Conferência). Os números cinza são os números das paredes de cada cômodo.</p>`:`<p class="mut">Meça os cômodos primeiro.</p>`;
    h+=`<h2>Ligações entre cômodos</h2><p class="help">Ligue os cômodos pela mesma porta, passagem ou janela vista dos dois lados. O app encaixa um cômodo no outro, contando a espessura da parede.</p>`;
    h+=im.ligacoes.map(l=>{const A=im.comodos.find(c=>c.id===l.a),B=im.comodos.find(c=>c.id===l.b);if(!A||!B)return'';
      const la=aberturas(A).find(x=>x.key===l.ai),lb=aberturas(B).find(x=>x.key===l.bi);
      return `<div class="card linkc"><div style="flex:1"><b>${esc(A.nome)}</b> <span class="mut">${la?esc(la.label):'?'}</span><br><b>${esc(B.nome)}</b> <span class="mut">${lb?esc(lb.label):'?'}</span><br><span class="mut">Parede de ${l.esp||15} cm</span></div><button class="ghost" style="color:var(--bad)" data-a="delLink" data-id="${l.id}">Remover</button></div>`}).join('');
    h+=linkFormV(im);
  }
  if(imTab==='conf'){
    const it=res.issues; const prob=it.filter(i=>i.n!=='info');
    h+= prob.length?`<div class="status bad"><b>${prob.length} ponto(s) para conferir.</b> Gere o relatório para levar na hora de medir.</div>`:`<div class="status ok"><b>Nada para conferir.</b> As medidas fecham entre si.</div>`;
    h+=it.map(i=>`<div class="issue ${i.n}">${esc(i.t)}</div>`).join('');
    h+=`<button class="pri wide" data-a="relatorio">Relatório do que medir de novo (PDF)</button>`;
    const mv=im.comodos.filter(c=>(c.moveis||[]).length).map(c=>{const A=avisosMoveis(c);const vs=new Set();return {c,av:Object.values(A).flatMap(x=>x.av).filter(x=>!vs.has(x.t)&&vs.add(x.t))}});
    if(mv.length){h+=`<h2>Móveis</h2>`;const tot=mv.reduce((s2,x)=>s2+x.av.length,0);
      h+= tot?mv.filter(x=>x.av.length).map(x=>`<div class="issue-h">${esc(x.c.nome)}</div>`+x.av.map(i=>`<div class="issue ${i.n}">${esc(i.t)}</div>`).join('')).join(''):`<div class="status ok"><b>Todos os móveis cabem com conforto.</b></div>`}
  }
  if(im.comodos.length){
    h+=`<h2>Exportar</h2><div class="grid2"><button data-a="pdf">PDF da planta</button><button data-a="dxf">Arquivo AutoCAD</button></div><p class="help">O arquivo do AutoCAD vem dentro de um .zip (DXF, em metros, tamanho real), com os cômodos encaixados como na aba Planta.</p><button class="ghost" data-a="json">Baixar cópia de segurança (.json)</button>`;
  }
  h+= confirmDel==='im'?`<div class="card confirm"><p>Apagar <b>${esc(im.nome)}</b> e todas as medidas?</p><div class="row"><button data-a="cancelDel">Não</button><button class="danger" data-a="delIm">Apagar</button></div></div>`:`<p><button class="ghost" style="color:var(--bad)" data-a="askDelIm">Apagar este imóvel</button></p>`;
  return h;
}
function linkFormV(im){
  const rs=im.comodos.filter(c=>aberturas(c).length);
  if(rs.length<2) return `<p class="mut">Para ligar, meça pelo menos dois cômodos com portas, passagens ou janelas.</p>`;
  const f=linkForm||{a:rs[0].id,b:rs[1].id,ai:'',bi:'',esp:15};
  const A=rs.find(c=>c.id===f.a)||rs[0], B=rs.find(c=>c.id===f.b)||rs[1];
  const opt=(list,sel)=>list.map(x=>`<option value="${x.key}" ${x.key===sel?'selected':''}>${esc(x.label)}</option>`).join('');
  const ro=(sel)=>rs.map(c=>`<option value="${c.id}" ${c.id===sel?'selected':''}>${esc(c.nome)}</option>`).join('');
  return `<div class="card"><b>Nova ligação</b>
  <div class="frm"><label>Cômodo</label><select id="lA">${ro(A.id)}</select><select id="lAi">${opt(aberturas(A),f.ai)}</select>
  <label>liga com o cômodo</label><select id="lB">${ro(B.id)}</select><select id="lBi">${opt(aberturas(B),f.bi)}</select>
  <label>Espessura da parede (cm)</label><input id="lE" inputmode="decimal" value="${f.esp||15}"></div>
  <button class="pri wide" data-a="addLink">Ligar</button></div>`;
}
function roomV(){
  const im=cur(),c=room(); if(!c){view={t:'im',im:view.im};return imV()}
  const ci=closeInfo(c); const hasAny=c.paredes.some(w=>w.pecas.length);
  let h=`<div class="top"><button class="ghost" data-a="voltarIm">‹ ${esc(im.nome)}</button><h1>${esc(c.nome)}</h1></div>`;
  h+=hasAny?svgRoom(c,{id:'draw'}):`<div id="draw" style="display:flex;align-items:center;justify-content:center;padding:18px;text-align:center" class="mut">Comece num canto ou na beirada de uma porta. Siga pela parede, digitando cada pedaço (parede, porta, janela). No canto, toque em virar à esquerda ou à direita.</div>`;
  if(c.fechado){const g=ci.g;const msg=ci.nivel==='ok'?'Fechou certinho.':ci.nivel==='warn'?'Pequena diferença, normal para trena.':'Não fechou. Vale medir de novo as paredes abaixo.';
    h+=`<div class="status ${ci.nivel}"><b>${msg}</b><div class="res"><table>
      <tr><td>Um sentido</td><td>${fm(g.tot.E)} m<br><span class="mut">paredes ${g.side.E.join(', ')||'–'}</span></td><td>${fm(g.tot.W)} m<br><span class="mut">paredes ${g.side.W.join(', ')||'–'}</span></td><td><b>${ci.dW} cm</b></td></tr>
      <tr><td>Outro sentido</td><td>${fm(g.tot.N)} m<br><span class="mut">paredes ${g.side.N.join(', ')||'–'}</span></td><td>${fm(g.tot.S)} m<br><span class="mut">paredes ${g.side.S.join(', ')||'–'}</span></td><td><b>${ci.dL} cm</b></td></tr></table></div></div>
      <button class="pri wide" data-a="abrirMoveis" style="margin-bottom:8px">Móveis${(c.moveis||[]).length?` (${c.moveis.length})`:''}</button>
      <div class="row"><button data-a="reabrir">Continuar medindo</button><button data-a="voltarIm">Pronto</button></div>`;
  } else if(hasAny){const ex=expected(c);const nW=c.paredes.length;
    let st=`Parede <b>${nW}</b> em andamento. `; if(ex) st+=`Se esta for a última parede, ela deve medir cerca de <b>${fm(ex.total)} m</b>.`; else if(nW>=3) st+=`Até o ponto de início faltam ${fm(Math.round(ci.g.gap))} m em linha reta.`;
    h+=`<div class="status">${st}</div>`}
  if(!c.fechado){const prev=parseMed(entry);
    h+=`<div class="entry"><input id="med" class="big" inputmode="decimal" placeholder="medida (ex.: 2,62 ou 92)" value="${esc(entry)}" autocomplete="off">
      <div class="prev" id="prev">${prev?('= '+fm(prev)+' m'):'Com vírgula = metros · sem vírgula = centímetros'}</div>
      <div class="grid5">${Object.keys(TIPOS).map(t=>`<button class="t-${t}" data-a="add" data-t="${t}">${TIPOS[t]}</button>`).join('')}</div>
      <div class="grid2" style="margin-top:6px"><button class="turn" data-a="virar" data-v="E">↰ Virar à esquerda</button><button class="turn" data-a="virar" data-v="D">Virar à direita ↱</button></div>
      <div class="grid3" style="margin-top:6px"><button data-a="undo">Desfazer</button>${DICT?`<button class="mic ${micOn?'on':''}" data-a="mic">${micOn?'■ Parar':'🎤 Falar'}</button>`:'<span></span>'}<button class="pri" data-a="fechar" ${c.paredes.length<3?'disabled':''}>Fechar cômodo</button></div></div>`;
    if(DICT) h+=`<p class="help">Falando: "parede 1,90", "porta 92", "janela 1,45", "passagem 80", "virar à esquerda", "desfazer", "fechar".</p>`}
  if(hasAny){h+=`<h2>Paredes</h2><div class="walls">`+c.paredes.map((w,i)=>w.pecas.length||!c.fechado?`<div><b>${i+1}</b><span style="flex:1">${w.pecas.map(p=>`<span class="chip t-${p.tipo}">${p.tipo==='parede'?'':TIPOS[p.tipo]+' '}${fm(p.cm)}</span>`).join(' + ')||'<span class="mut">…</span>'}${w.pecas.length>1?` <span class="mut">= ${fm(w.pecas.reduce((s,p)=>s+p.cm,0))}</span>`:''}</span><span class="mut">${w.virada==='E'?'↰ esq.':w.virada==='D'?'dir. ↱':''}</span></div>`:'').join('')+`</div>`}
  if(hasAny) h+=portasV(c);
  h+= confirmDel==='room'?`<div class="card confirm"><p>Apagar o cômodo <b>${esc(c.nome)}</b>?</p><div class="row"><button data-a="cancelDel">Não</button><button class="danger" data-a="delRoom">Apagar</button></div></div>`:`<p><button class="ghost" style="color:var(--bad)" data-a="askDelRoom">Apagar este cômodo</button></p>`;
  return h;
}

/* ===================== medição ===================== */
function parseMed(s){s=String(s||'').trim().replace(/\s/g,'');if(!s)return null;
  if(/^\d+[,.]\d*$/.test(s)){const v=Math.round(parseFloat(s.replace(',','.'))*100);return v>0?v:null}
  if(/^\d+$/.test(s)){const n=parseInt(s,10);return n>0?n:null}return null}
function lastWall(c){let w=c.paredes[c.paredes.length-1];if(!w||w.virada){w={pecas:[],virada:null};c.paredes.push(w)}return w}
function addPeca(t,cm){const im=cur(),c=room();if(!c||c.fechado)return;if(!cm){toast('Digite a medida primeiro.');return}
  lastWall(c).pecas.push({tipo:t,cm});entry='';save(im);render();focusMed()}
function virar(v){const im=cur(),c=room();const pend=parseMed(entry);if(pend){lastWall(c).pecas.push({tipo:'parede',cm:pend});entry=''}
  const ww=c.paredes[c.paredes.length-1];if(!ww||!ww.pecas.length){toast('Meça a parede antes de virar.');render();return}
  ww.virada=v;c.paredes.push({pecas:[],virada:null});save(im);render();focusMed()}
function undo(){const im=cur(),c=room();let w=c.paredes[c.paredes.length-1];if(!w)return;
  if(!w.pecas.length&&c.paredes.length>1){c.paredes.pop();c.paredes[c.paredes.length-1].virada=null}else if(w.pecas.length)w.pecas.pop();
  save(im);render()}
function fechar(){const im=cur(),c=room();const pend=parseMed(entry);if(pend){lastWall(c).pecas.push({tipo:'parede',cm:pend});entry=''}
  while(c.paredes.length&&!c.paredes[c.paredes.length-1].pecas.length)c.paredes.pop();
  if(c.paredes.length)c.paredes[c.paredes.length-1].virada=null;c.fechado=true;save(im);render();window.scrollTo(0,0)}
function focusMed(){const e=$('#med');if(e&&!micOn)e.focus({preventScroll:true})}

/* ===================== voz ===================== */
function falado(text){
  if(view.t!=='room')return;
  let t=' '+text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')+' ';
  t=t.replace(/(\d+)\s*metros?\s*(e\s*)?(\d{1,2})(\s*centimetros?)?/g,(m,a,_,b)=>` ${a},${b.padStart(2,'0')} `).replace(/(\d+)\s*metros?/g,' $1,00 ').replace(/(\d+)\s*(centimetros?|cm)/g,' $1 ');
  const parts=t.split(/(?=\b(?:parede|porta|janela|passagem|vao|armario|virar|vira|esquerda|direita|desfazer|apagar|fechar)\b)/);
  const did=[];
  parts.forEach(p=>{const n=(p.match(/\d+(?:[,.]\d+)?/)||[])[0];
    if(/\b(desfazer|apagar)\b/.test(p)){undo();did.push('desfazer');return}
    if(/\bfechar\b/.test(p)){fechar();did.push('fechar');return}
    if(/\besquerda\b/.test(p)&&!n){virar('E');did.push('virar à esquerda');return}
    if(/\bdireita\b/.test(p)&&!n){virar('D');did.push('virar à direita');return}
    if(n){const tp=/\bporta\b/.test(p)?'porta':/\bjanela\b/.test(p)?'janela':/\b(passagem|vao)\b/.test(p)?'passagem':/\barmario\b/.test(p)?'armario':'parede';const cm=parseMed(n);if(cm){addPeca(tp,cm);did.push(TIPOS[tp]+' '+fm(cm))}}});
  toast(did.length?('Entendi: '+did.join(' · ')):'Não entendi: "'+text+'"');
}
function nativeSpeech(){const SR=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.SpeechRecognition;if(!SR)return null;
  let on=false,cbF=null,cbS=null;
  const loop=async()=>{while(on){try{const r=await SR.start({language:'pt-BR',maxResults:1,partialResults:false,popup:false});const t=r&&r.matches&&r.matches[0];if(t&&cbF)cbF({text:t})}catch(e){if(!on)break;await new Promise(z=>setTimeout(z,300))}}cbS&&cbS({state:'idle'})};
  return {async start(){let p=await SR.checkPermissions();if(p.speechRecognition!=='granted'){p=await SR.requestPermissions();if(p.speechRecognition!=='granted')throw{code:'not_granted'}}
      on=true;cbS&&cbS({state:'listening'});loop()},
    async stop(){on=false;try{await SR.stop()}catch(e){}},onFinal(f){cbF=f},onState(f){cbS=f}};
}
function webSpeech(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return null;
  let r=null,cbF=null,cbS=null;
  return {start(){r=new SR();r.lang='pt-BR';r.continuous=true;r.interimResults=false;
      r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal&&cbF)cbF({text:e.results[i][0].transcript})};
      r.onend=()=>cbS&&cbS({state:'idle'});r.onstart=()=>cbS&&cbS({state:'listening'});
      return new Promise((ok,no)=>{r.onerror=ev=>{no({code:ev.error==='not-allowed'?'not_granted':'erro'})};try{r.start();ok()}catch(e){no(e)}})},
    stop(){try{r&&r.stop()}catch(e){}return Promise.resolve()},onFinal(f){cbF=f},onState(f){cbS=f}};
}
async function toggleMic(){if(!DICT)return;
  if(micOn){try{await DICT.stop()}catch(e){}micOn=false;render();return}
  DICT.start().catch(e=>{micOn=false;render();toast(e&&e.code==='not_granted'?'Microfone não liberado.':'Não consegui ligar o microfone.')});
  micOn=true;render()}

/* ===================== exportar ===================== */
function slug(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^\w\- ]/g,'').trim()||'imovel'}
const NATIVO=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
function b64(blob){return new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(',')[1]);r.onerror=no;r.readAsDataURL(blob)})}
async function baixar(filename,data){
  if(NATIVO){try{const P=window.Capacitor.Plugins;const blob=data instanceof Blob?data:new Blob([data]);
      const w=await P.Filesystem.writeFile({path:filename,data:await b64(blob),directory:'CACHE'});
      await P.Share.share({title:filename,url:w.uri,dialogTitle:'Salvar ou enviar '+filename})}
    catch(e){if(!(e&&/cancel/i.test(e.message||'')))toast('Não consegui salvar o arquivo.')}return}
  if(DL){try{await DL.save({filename,data})}catch(e){if(e&&e.code!=='declined')toast('Não consegui baixar o arquivo.')}return}
  try{const blob=data instanceof Blob?data:new Blob([data]);const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
  catch(e){toast('Não consegui baixar o arquivo.')}
}
function pdfDrawRoom(d,c,area,opt={}){
  const g=geo(c);const b=bbox(g.segs),w=Math.max(b[2]-b[0],0.5),h=Math.max(b[3]-b[1],0.5);
  const s=Math.min(area.w/w,area.h/h);const ox=area.x+(area.w-w*s)/2-b[0]*s,oy=area.y+(area.h-h*s)/2+b[3]*s;const P=(x,y)=>[ox+x*s,oy-y*s];
  g.segs.forEach(sg=>{const[x1,y1]=P(sg.x1,sg.y1),[x2,y2]=P(sg.x2,sg.y2);
    if(opt.marcar&&opt.marcar.has(sg.wi+1)){d.setDrawColor(240,68,56);d.setLineWidth(3.2);d.setLineDashPattern([],0);d.line(x1,y1,x2,y2)}
    const col=hex(COL[sg.tipo]);d.setDrawColor(...col);d.setLineWidth(sg.tipo==='janela'?1.6:0.8);
    d.setLineDashPattern(['porta','armario','passagem'].includes(sg.tipo)?[2,1.4]:[],0);d.line(x1,y1,x2,y2)});
  d.setLineDashPattern([],0);d.setFont('helvetica','bold');d.setFontSize(8.5);const k=g.inLeft?1:-1;
  g.segs.forEach(sg=>{const off=4.2/s;const nx=-sg.hy*k,ny=sg.hx*k;const[mx,my]=P((sg.x1+sg.x2)/2+nx*off,(sg.y1+sg.y2)/2+ny*off);
    d.setTextColor(...(sg.tipo==='parede'?[176,69,28]:hex(COL[sg.tipo])));d.text(fm(sg.cm),mx,my,{align:'center',baseline:'middle'})});
  g.wallStarts.forEach((p,i)=>{if(!c.paredes[i].pecas.length)return;const off=9/s;const[cx,cy]=P(p.x+p.hx*off*0.5-p.hy*k*off,p.y+p.hy*off*0.5+p.hx*k*off);
    const red=opt.marcar&&opt.marcar.has(i+1);d.setFillColor(...(red?[180,35,24]:[31,58,95]));d.circle(cx,cy,2.3,'F');d.setTextColor(255,255,255);d.setFontSize(7.5);d.text(String(i+1),cx,cy,{align:'center',baseline:'middle'})});
}
function hex(h){return[1,3,5].map(i=>parseInt(h.slice(i,i+2),16))}
function pdfPlan(d,im,res,area,opt={}){
  const {L,issues}=res;const bb=planBBox(im,L.lay,L.G);const w=Math.max(bb[2]-bb[0],0.5),h=Math.max(bb[3]-bb[1],0.5);
  const s=Math.min(area.w/w,area.h/h);const ox=area.x+(area.w-w*s)/2-bb[0]*s,oy=area.y+(area.h-h*s)/2+bb[3]*s;const P=(x,y)=>[ox+x*s,oy-y*s];
  const marked={};(opt.marcar?issues:[]).forEach(i=>(i.w||[]).forEach(([rid,ws])=>{if(i.n!=='info'){marked[rid]=marked[rid]||new Set();ws.forEach(x=>marked[rid].add(x))}}));
  im.comodos.forEach(c=>{const t=L.lay[c.id];if(!t)return;const g=L.G[c.id];const k=g.inLeft?1:-1;
    g.segs.forEach(sg=>{const p=P(...rot(t,sg.x1,sg.y1)),q=P(...rot(t,sg.x2,sg.y2));
      if(marked[c.id]&&marked[c.id].has(sg.wi+1)){d.setDrawColor(240,68,56);d.setLineWidth(2.6);d.setLineDashPattern([],0);d.line(p[0],p[1],q[0],q[1])}
      d.setDrawColor(...hex(COL[sg.tipo]));d.setLineWidth(sg.tipo==='janela'?1.3:0.6);d.setLineDashPattern(['porta','armario','passagem'].includes(sg.tipo)?[1.6,1.1]:[],0);d.line(p[0],p[1],q[0],q[1]);
      if(opt.medidas){const n=rotv(t,-sg.hy*k,sg.hx*k);const off=2.6/s;const m=P(...rot(t,(sg.x1+sg.x2)/2,(sg.y1+sg.y2)/2).map((v,i)=>v+n[i]*off));d.setFont('helvetica','normal');d.setFontSize(5.5);d.setTextColor(...(sg.tipo==='parede'?[176,69,28]:hex(COL[sg.tipo])));d.text(fm(sg.cm),m[0],m[1],{align:'center',baseline:'middle'})}});
    d.setLineDashPattern([],0);const b=bbox(g.segs);const cc=P(...rot(t,(b[0]+b[2])/2,(b[1]+b[3])/2));d.setFont('helvetica','bold');d.setFontSize(9);d.setTextColor(31,58,95);d.text(c.nome,cc[0],cc[1],{align:'center',baseline:'middle'});
    if(opt.numeros){g.wallStarts.forEach((p0,i)=>{if(!c.paredes[i].pecas.length)return;const ss=g.segs.filter(x=>x.wi===i);const off=4.5/s;const m=[(ss[0].x1+ss[ss.length-1].x2)/2-ss[0].hy*k*off,(ss[0].y1+ss[ss.length-1].y2)/2+ss[0].hx*k*off];const pp=P(...rot(t,...m));
      const red=marked[c.id]&&marked[c.id].has(i+1);d.setFillColor(...(red?[180,35,24]:[138,147,163]));d.circle(pp[0],pp[1],1.9,'F');d.setTextColor(255,255,255);d.setFontSize(6);d.text(String(i+1),pp[0],pp[1],{align:'center',baseline:'middle'})})}
  });
}
function newPdf(){const {jsPDF}=window.jspdf||{};if(!jsPDF){toast('Gerador de PDF não carregou. Confira a internet.');return null}return new jsPDF({unit:'mm',format:'a4'})}
function pdf(){
  const im=cur();const d=newPdf();if(!d)return;const res=checks(im);
  d.deletePage(1);d.addPage('a4','landscape');
  d.setFont('helvetica','bold');d.setFontSize(16);d.setTextColor(31,58,95);d.text(im.nome+' - planta',14,14);
  d.setFont('helvetica','normal');d.setFontSize(9);d.setTextColor(90,100,116);d.text('Medidas internas em metros · '+new Date().toLocaleDateString('pt-BR'),14,20);
  pdfPlan(d,im,res,{x:14,y:26,w:269,h:174},{medidas:true});
  im.comodos.forEach(c=>{const g=geo(c);if(!g.segs.length)return;d.addPage('a4','portrait');
    d.setFont('helvetica','bold');d.setFontSize(16);d.setTextColor(31,58,95);d.text(c.nome,15,18);
    pdfDrawRoom(d,c,{x:22,y:30,w:166,h:150});
    let yy=192;d.setFont('helvetica','normal');d.setFontSize(10);d.setTextColor(29,36,51);
    c.paredes.forEach((wl,i)=>{if(!wl.pecas.length)return;const t=`Parede ${i+1}: `+wl.pecas.map(p=>(p.tipo==='parede'?'':TIPOS[p.tipo].toLowerCase()+' ')+fm(p.cm)).join(' + ')+(wl.virada==='E'?'  (vira à esquerda)':wl.virada==='D'?'  (vira à direita)':'');
      if(yy>282){d.addPage();yy=20}d.text(t,15,yy);yy+=6})});
  baixar(slug(im.nome)+' - planta.pdf',d.output('blob'));
}
function relatorio(){
  const im=cur();const d=newPdf();if(!d)return;const res=checks(im);const it=res.issues.filter(i=>i.n!=='info');
  d.setFont('helvetica','bold');d.setFontSize(16);d.setTextColor(31,58,95);d.text('O que medir de novo - '+im.nome,15,18);
  d.setFont('helvetica','normal');d.setFontSize(9);d.setTextColor(90,100,116);
  d.text(d.splitTextToSize('Gerado em '+new Date().toLocaleDateString('pt-BR')+'. Dica: além dos pedaços, meça cada parede inteira, de canto a canto. Os números são os das paredes de cada cômodo (veja os desenhos).',180),15,24);
  let y=36;
  if(!it.length){d.setFontSize(12);d.setTextColor(31,122,77);d.text('Nada para conferir: as medidas fecham entre si.',15,y);y+=10}
  it.forEach((i,k)=>{d.setFont('helvetica','bold');d.setFontSize(10);d.setTextColor(...(i.n==='bad'?[180,35,24]:[178,107,0]));
    const lines=d.splitTextToSize(`${k+1}. ${i.t}`,180);if(y+lines.length*5+12>285){d.addPage();y=20}
    d.text(lines,15,y);y+=lines.length*4.8+1.5;d.setFont('helvetica','normal');d.setTextColor(90,100,116);d.setFontSize(9);
    d.text('Medida nova: ______________________________________________',15,y+2);y+=9});
  const marcados={};it.forEach(i=>(i.w||[]).forEach(([rid,ws])=>{marcados[rid]=marcados[rid]||new Set();ws.forEach(x=>marcados[rid].add(x))}));
  if(Object.keys(res.L.lay).length>1){d.addPage('a4','landscape');d.setFont('helvetica','bold');d.setFontSize(14);d.setTextColor(31,58,95);d.text('Planta - paredes para conferir em vermelho',14,14);pdfPlan(d,im,res,{x:14,y:22,w:269,h:178},{numeros:true,marcar:true})}
  im.comodos.filter(c=>marcados[c.id]).forEach(c=>{d.addPage('a4','portrait');d.setFont('helvetica','bold');d.setFontSize(15);d.setTextColor(31,58,95);d.text(c.nome,15,18);pdfDrawRoom(d,c,{x:22,y:28,w:166,h:160},{marcar:marcados[c.id]});
    let yy=200;d.setFont('helvetica','normal');d.setFontSize(10);d.setTextColor(29,36,51);
    c.paredes.forEach((wl,i)=>{if(!wl.pecas.length)return;const red=marcados[c.id].has(i+1);d.setTextColor(...(red?[180,35,24]:[29,36,51]));d.setFont('helvetica',red?'bold':'normal');
      const t=`Parede ${i+1}: `+wl.pecas.map(p=>(p.tipo==='parede'?'':TIPOS[p.tipo].toLowerCase()+' ')+fm(p.cm)).join(' + ')+(red?'   nova: __________':'');if(yy>285){d.addPage();yy=20}d.text(t,15,yy);yy+=6})});
  baixar(slug(im.nome)+' - o que medir de novo.pdf',d.output('blob'));
}
function dxfStr(s){return String(s).replace(/[^\x20-\x7e]/g,ch=>'\\U+'+ch.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0'))}
function dxf(){
  const im=cur();if(!window.JSZip){toast('Compactador não carregou. Confira a internet.');return}
  const res=checks(im);const {L}=res;const out=[];const add=(...a)=>a.forEach(v=>out.push(String(v)));
  add(0,'SECTION',2,'HEADER',9,'$ACADVER',1,'AC1009',9,'$INSUNITS',70,6,9,'$DWGCODEPAGE',3,'ANSI_1252',0,'ENDSEC');
  const layers=[['PAREDES',7],['PORTAS',30],['JANELAS',5],['PASSAGENS',3],['ARMARIOS',8],['COTAS',1],['TEXTOS',3]];
  add(0,'SECTION',2,'TABLES',0,'TABLE',2,'LAYER',70,layers.length);layers.forEach(([n,c])=>add(0,'LAYER',2,n,70,0,62,c,6,'CONTINUOUS'));add(0,'ENDTAB',0,'ENDSEC');
  add(0,'SECTION',2,'ENTITIES');
  const line=(ly,a,b)=>add(0,'LINE',8,ly,10,a[0].toFixed(4),20,a[1].toFixed(4),30,0,11,b[0].toFixed(4),21,b[1].toFixed(4),31,0);
  const text=(ly,p,h,t,r=0)=>add(0,'TEXT',8,ly,10,p[0].toFixed(4),20,p[1].toFixed(4),30,0,40,h,1,dxfStr(t),50,r.toFixed(2),72,1,11,p[0].toFixed(4),21,p[1].toFixed(4),31,0,73,2);
  im.comodos.forEach(c=>{const t=L.lay[c.id];if(!t)return;const g=L.G[c.id];const k=g.inLeft?1:-1;
    g.segs.forEach(s=>{const ly={porta:'PORTAS',janela:'JANELAS',passagem:'PASSAGENS',armario:'ARMARIOS'}[s.tipo]||'PAREDES';
      line(ly,rot(t,s.x1,s.y1),rot(t,s.x2,s.y2));const n=rotv(t,-s.hy*k,s.hx*k);const m=rot(t,(s.x1+s.x2)/2,(s.y1+s.y2)/2);
      const u=rotv(t,s.hx,s.hy);let ang=Math.atan2(u[1],u[0])*180/Math.PI;if(ang>90.5)ang-=180;if(ang<-89.5)ang+=180;
      text('COTAS',[m[0]+n[0]*0.12,m[1]+n[1]*0.12],0.07,fm(s.cm),ang)});
    const b=bbox(g.segs);text('TEXTOS',rot(t,(b[0]+b[2])/2,(b[1]+b[3])/2),0.15,c.nome)});
  add(0,'ENDSEC',0,'EOF');
  const z=new JSZip();z.file(slug(im.nome)+'.dxf',out.join('\r\n'));z.generateAsync({type:'blob'}).then(bl=>baixar(slug(im.nome)+' - autocad.zip',bl));
}

/* ===================== eventos ===================== */
function bind(){
  const m=$('#med');
  if(m){m.addEventListener('input',e=>{entry=e.target.value;const p=parseMed(entry);$('#prev').textContent=p?('= '+fm(p)+' m'):'Com vírgula = metros · sem vírgula = centímetros'});
    m.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addPeca('parede',parseMed(entry))}})}
  ['novoIm','novoRoom'].forEach(id=>{const e=$('#'+id);if(e)e.addEventListener('keydown',ev=>{if(ev.key==='Enter')act(id)})});
  const sync=()=>{linkForm={a:$('#lA').value,ai:$('#lAi').value,b:$('#lB').value,bi:$('#lBi').value,esp:$('#lE').value}};
  ['lA','lB'].forEach(id=>{const e=$('#'+id);if(e)e.addEventListener('change',()=>{sync();if(id==='lA')linkForm.ai='';else linkForm.bi='';render()})});
  ['lAi','lBi','lE'].forEach(id=>{const e=$('#'+id);if(e)e.addEventListener('change',sync)});
  const imp=$('#imp');if(imp)imp.addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text());
    const lista=(Array.isArray(j.imoveis)?j.imoveis:[j]).filter(x=>x&&x.id&&Array.isArray(x.comodos)).map(norm);if(!lista.length)throw 0;
    lista.forEach(x=>{const i=imoveis.findIndex(y=>y.id===x.id);if(i>=0)imoveis[i]=x;else imoveis.push(x);save(x)});
    if(lista.length===1){view={t:'im',im:lista[0].id};toast('Imóvel aberto.')}else{view={t:'home'};toast(lista.length+' imóveis abertos.')}render()}catch(err){toast('Arquivo não reconhecido.')}e.target.value=''});
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;act(b.dataset.a,b)});
function act(a,b){const im=cur();
  if(typeof actMoveis==='function'&&actMoveis(a,b)){render();return}
  switch(a){
    case 'novoIm':{const n=$('#novoIm').value.trim();if(!n){toast('Digite o nome do imóvel.');return}const x={id:uid(),nome:n,criado:Date.now(),comodos:[],ligacoes:[]};imoveis.push(x);save(x);view={t:'im',im:x.id};imTab='comodos';break}
    case 'abrirIm':view={t:'im',im:b.dataset.id};confirmDel=null;imTab='comodos';linkForm=null;break;
    case 'home':view={t:'home'};confirmDel=null;break;
    case 'tab':imTab=b.dataset.k;break;
    case 'novoRoom':{const n=$('#novoRoom').value.trim();if(!n){toast('Digite o nome do cômodo.');return}const c={id:uid(),nome:n,paredes:[{pecas:[],virada:null}],fechado:false};im.comodos.push(c);save(im);view={t:'room',im:im.id,room:c.id};entry='';break}
    case 'abrirRoom':view={t:'room',im:im.id,room:b.dataset.id};entry='';confirmDel=null;break;
    case 'voltarIm':if(micOn)toggleMic();view={t:'im',im:im.id};confirmDel=null;break;
    case 'add':addPeca(b.dataset.t,parseMed(entry));return;
    case 'virar':virar(b.dataset.v);return; case 'undo':undo();return; case 'fechar':fechar();return; case 'mic':toggleMic();return;
    case 'reabrir':{const c=room();c.fechado=false;save(im);break}
    case 'addLink':{const A=$('#lA').value,B=$('#lB').value,ai=$('#lAi').value,bi=$('#lBi').value,esp=parseFloat(($('#lE').value||'15').replace(',','.'))||15;
      if(A===B){toast('Escolha dois cômodos diferentes.');return}if(!ai||!bi){toast('Escolha a abertura nos dois cômodos.');return}
      im.ligacoes=im.ligacoes.filter(l=>!((l.a===A&&l.ai===ai)||(l.b===B&&l.bi===bi)));im.ligacoes.push({id:uid(),a:A,ai,b:B,bi,esp:Math.round(esp)});linkForm=null;save(im);toast('Cômodos ligados.');break}
    case 'delLink':im.ligacoes=im.ligacoes.filter(l=>l.id!==b.dataset.id);save(im);break;
    case 'pdf':pdf();return; case 'dxf':dxf();return; case 'relatorio':relatorio();return;
    case 'carregarMedido':fetch('dados/apartamento-medido.json').then(r=>r.json()).then(j=>{(j.imoveis||[j]).map(norm).forEach(x=>{const i=imoveis.findIndex(y=>y.id===x.id);if(i>=0)imoveis[i]=x;else imoveis.push(x);save(x)});view={t:'im',im:'apto-medido'};imTab='planta';render();toast('Apartamento carregado.')}).catch(()=>toast('Não consegui carregar. Confira a internet.'));return;
    case 'jsonTodos':baixar('medir imovel - todos os imoveis - '+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({app:'Medir imóvel',data:new Date().toISOString(),imoveis},null,1));return;
    case 'json':baixar(slug(im.nome)+' - medidas.json',JSON.stringify(im,null,1));return;
    case 'askDelIm':confirmDel='im';break; case 'askDelRoom':confirmDel='room';break; case 'cancelDel':confirmDel=null;break;
    case 'delIm':removeIm(im);view={t:'home'};confirmDel=null;break;
    case 'delRoom':{const id=view.room;im.comodos=im.comodos.filter(c=>c.id!==id);im.ligacoes=im.ligacoes.filter(l=>l.a!==id&&l.b!==id);save(im);view={t:'im',im:im.id};confirmDel=null;break}
  }
  render();
}

/* ===================== início ===================== */
imoveis=lsGet().map(norm); render();
(async()=>{
  const cl=window.claude;
  if(!cl||!cl.use){ DICT=NATIVO?nativeSpeech():webSpeech(); if(DICT)hookDict(); loaded=true; render();
    if(!NATIVO&&'serviceWorker' in navigator && location.protocol==='https:'){try{navigator.serviceWorker.register('sw.js')}catch(e){}} return }
  cl.use('downloads').then(d=>{DL=d;render()});
  cl.use('dictation').then(d=>{DICT=d||webSpeech();if(DICT)hookDict();render()});
  const db=await cl.use('db');DB=db;if(!db){loaded=true;render();return}
  let done=false;const tm=setTimeout(()=>{if(!done){loaded=true;render();toast('A nuvem está demorando; mostrando o que está neste aparelho.')}},10000);
  try{const snap=await db.collection('imoveis').get();done=true;clearTimeout(tm);
    const map=new Map(snap.docs.map(d=>d.data()).filter(Boolean).map(x=>norm(JSON.parse(JSON.stringify(x)))).map(x=>[x.id,x]));
    lsGet().map(norm).forEach(x=>{const n=map.get(x.id);if(!n||(x.atualizado||0)>(n.atualizado||0)){map.set(x.id,x);save(x)}});
    imoveis=[...map.values()];lsSet()}catch(e){done=true;clearTimeout(tm)}
  loaded=true;render();
})();
function hookDict(){DICT.onFinal(({text})=>{if(text&&text.trim())falado(text)});DICT.onState(({state})=>{const on=state==='listening';if(on!==micOn){micOn=on;render()}})}
