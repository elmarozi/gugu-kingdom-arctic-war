(()=>{
const canvas=document.getElementById('world'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id);
const state={gold:8420000,crystal:5780000,ore:2340000,troops:0,levels:{castle:7,crystalMine:6,goldMine:6,store:6,barracks:5,towerL:4,towerR:4},built:false,selected:null,zoom:1,panX:0,panY:0};
const buildings=[
 {id:'castle',name:'Markas Utama',x:0,y:0,kind:'castle'},
 {id:'crystalMine',name:'Tambang Kristal',x:-3.1,y:-1.8,kind:'crystal'},
 {id:'goldMine',name:'Tambang Emas',x:3.1,y:-1.8,kind:'gold'},
 {id:'store',name:'Gudang',x:-3.1,y:2.2,kind:'store'},
 {id:'barracks',name:'Barak',x:3.1,y:2.2,kind:'barracks'},
 {id:'towerL',name:'Menara Es',x:-4.5,y:0,kind:'tower'},
 {id:'towerR',name:'Menara Es',x:4.5,y:0,kind:'tower'}
];
const heroes=[{name:'Kiro',x:0.1,y:1.1,c:'#e7bd58'},{name:'Frost',x:-2.7,y:-.7,c:'#61d8ed'},{name:'Aurum',x:2.6,y:-.7,c:'#e9bb50'},{name:'Bora',x:-1.8,y:3,c:'#a88ae5'}];
function save(){try{localStorage.setItem('gugu-arctic-save',JSON.stringify(state))}catch(e){}}
function load(){try{let d=JSON.parse(localStorage.getItem('gugu-arctic-save')||'null');if(d)Object.assign(state,d)}catch(e){}}
function fmt(n){return n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n)}
function hud(){$('gold').textContent=fmt(state.gold);$('crystal').textContent=fmt(state.crystal);$('ore').textContent=fmt(state.ore)}
function notice(t){$('notice').textContent=t}
function size(){let r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(r.width*d);canvas.height=Math.floor(r.height*d);ctx.setTransform(d,0,0,d,0,0);draw()}
window.addEventListener('resize',size);
function project(x,y){let w=canvas.clientWidth,h=canvas.clientHeight,s=Math.min(w/11.5,h/12)*state.zoom;return [w/2+(x-y)*s*.88+state.panX,h/2+(x+y)*s*.60+state.panY]}
function poly(points,fill,stroke='#8bd9e8',lw=1){ctx.beginPath();points.forEach((p,i)=>{let q=project(p[0],p[1]);i?ctx.lineTo(...q):ctx.moveTo(...q)});ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}
function ellipse(x,y,rx,ry,fill){let p=project(x,y);let s=Math.min(canvas.clientWidth/11.5,canvas.clientHeight/12)*state.zoom;ctx.beginPath();ctx.ellipse(p[0],p[1],rx*s,ry*s*.55,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function text(x,y,t,size,color='#f6fbff'){let p=project(x,y);ctx.save();ctx.font=`800 ${size}px system-ui`;ctx.textAlign='center';let width=ctx.measureText(t).width+12;ctx.fillStyle='#08283ddd';ctx.strokeStyle='#8bd9e8';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(p[0]-width/2,p[1]-size-5,width,size+10,7);ctx.fill();ctx.stroke();ctx.fillStyle=color;ctx.fillText(t,p[0],p[1]);ctx.restore()}
function penguin(x,y,accent,scale=1){let p=project(x,y),s=Math.min(canvas.clientWidth/11.5,canvas.clientHeight/12)*state.zoom*scale*1.48;ellipse(x,y+.13,.33*scale,.22*scale,'#123244');ctx.fillStyle='#071723';ctx.beginPath();ctx.ellipse(p[0],p[1]-s*.34,s*.24,s*.38,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f4f8f7';ctx.beginPath();ctx.ellipse(p[0],p[1]-s*.28,s*.145,s*.26,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(p[0]-s*.055,p[1]-s*.55);ctx.lineTo(p[0]+s*.055,p[1]-s*.55);ctx.lineTo(p[0],p[1]-s*.46);ctx.fill();ctx.fillStyle='#ffad45';ctx.beginPath();ctx.moveTo(p[0],p[1]-s*.32);ctx.lineTo(p[0]+s*.09,p[1]-s*.29);ctx.lineTo(p[0],p[1]-s*.25);ctx.fill();ctx.fillStyle='#ffc04d';ctx.fillRect(p[0]-s*.1,p[1]+s*.02,s*.09,s*.035);ctx.fillRect(p[0]+s*.02,p[1]+s*.02,s*.09,s*.035)}
function building(b){
 const lv=state.levels[b.id]||1,x=b.x,y=b.y;
 const palettes={castle:['#d8c17d','#9c7641','#644b36'],crystal:['#65e7f5','#268eaa','#174d70'],gold:['#f4ce67','#b47a2c','#694624'],store:['#b7a1df','#725c9d','#3e365f'],barracks:['#a8c9dc','#567b91','#294a61'],tower:['#b3f3ff','#4e9cb6','#24536d']};
 const [roof,wall,side]=palettes[b.kind]||palettes.tower;
 // raised snowy foundation with bevel and shadow
 ellipse(x+.12,y+.36,1.05,.67,'#173b50');
 poly([[x-1.05,y],[x,y-.62],[x+1.05,y],[x,y+.62]],'#e9f8f8','#ffffff',2);
 poly([[x-1.05,y],[x,y+.62],[x,y+1.02],[x-1.05,y+.4]],'#6ca9b9','#c8f5fa',1);
 poly([[x,y+.62],[x+1.05,y],[x+1.05,y+.4],[x,y+1.02]],'#477e96','#b5eaf3',1);
 // walls
 poly([[x-.68,y-.02],[x,y-.42],[x+.68,y-.02],[x,y+.38]],wall,'#e7fbff',1.5);
 poly([[x-.68,y-.02],[x,y+.38],[x,y+.88],[x-.68,y+.46]],side,'#8bc7d5',1);
 poly([[x,y+.38],[x+.68,y-.02],[x+.68,y+.46],[x,y+.88]],'#193e57','#80b9c8',1);
 // roof / architectural silhouette
 poly([[x-.82,y-.12],[x,y-.76],[x+.82,y-.12],[x,y+.28]],roof,'#fff4ce',1.5);
 if(b.kind==='castle'){
   for(let dx of [-.55,.55]){let q=project(x+dx,y-.13);ctx.fillStyle='#f1d58a';ctx.fillRect(q[0]-7,q[1]-39,14,43);ctx.fillStyle='#8e6238';ctx.fillRect(q[0]-3,q[1]-29,6,17)}
   let q=project(x,y-.4);ctx.fillStyle='#f4df9b';ctx.fillRect(q[0]-8,q[1]-55,16,48);ctx.fillStyle='#b94f48';ctx.beginPath();ctx.moveTo(q[0]-12,q[1]-53);ctx.lineTo(q[0],q[1]-70);ctx.lineTo(q[0]+12,q[1]-53);ctx.fill();
 } else if(b.kind==='crystal'){
   for(let i=0;i<5;i++){let q=project(x-.38+i*.19,y-.13);ctx.fillStyle=i%2?'#a5f7ff':'#43cce8';ctx.beginPath();ctx.moveTo(q[0],q[1]-42-i%2*13);ctx.lineTo(q[0]+9,q[1]+2);ctx.lineTo(q[0]-8,q[1]+2);ctx.closePath();ctx.fill();ctx.strokeStyle='#e4ffff';ctx.stroke()}
 } else if(b.kind==='gold'){
   for(let i=0;i<4;i++){let q=project(x-.3+i*.2,y-.12);ctx.fillStyle='#ffdb70';ctx.beginPath();ctx.ellipse(q[0],q[1]-13,7,5,0,0,7);ctx.fill();ctx.strokeStyle='#fff0b2';ctx.stroke()}
 } else if(b.kind==='tower'){
   let q=project(x,y-.42);ctx.fillStyle='#c4f8ff';ctx.fillRect(q[0]-5,q[1]-38,10,42);ctx.beginPath();ctx.moveTo(q[0]-11,q[1]-36);ctx.lineTo(q[0],q[1]-55);ctx.lineTo(q[0]+11,q[1]-36);ctx.fill();
 } else {
   let q=project(x,y-.25);ctx.fillStyle='#f4e1a8';ctx.fillRect(q[0]-15,q[1]-20,30,22);ctx.strokeStyle='#fff4d4';ctx.strokeRect(q[0]-15,q[1]-20,30,22)
 }
 if(state.selected===b.id){let q=project(x,y);ctx.strokeStyle='#ffe18b';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(q[0],q[1]+12,43,20,0,0,7);ctx.stroke()}
 text(x,y-1.12,`${b.name} · Lv.${lv}`,Math.max(10,Math.min(13,canvas.clientWidth/32)),state.selected===b.id?'#ffe08a':'#ffffff');
}
function draw(){if(!ctx||!canvas.clientWidth)return;let w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);
 let grd=ctx.createLinearGradient(0,0,0,h);grd.addColorStop(0,'#17465f');grd.addColorStop(.55,'#0c354e');grd.addColorStop(1,'#061e32');ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
 // distant aurora and drifting snow
 let aur=ctx.createRadialGradient(w*.5,h*.38,10,w*.5,h*.38,w*.62);aur.addColorStop(0,'#4e9eae55');aur.addColorStop(1,'#0a2c4300');ctx.fillStyle=aur;ctx.fillRect(0,0,w,h);
 for(let i=0;i<48;i++){let x=(i*137)%w,y=(i*83)%h;ctx.fillStyle='#dffaff35';ctx.beginPath();ctx.arc(x,y,1+(i%3)*.45,0,7);ctx.fill()}
 // broad layered ice island
 poly([[-7.3,0],[0,-5.8],[7.3,0],[0,5.8]],'#0b2639','#b4f2ff',5);
 poly([[-6.85,0],[0,-5.45],[6.85,0],[0,5.45]],'#4b9bad','#d6fbff',3);
 poly([[-6.45,0],[0,-5.05],[6.45,0],[0,5.05]],'#d8f0f0','#ffffff',2);
 poly([[-6.05,0],[0,-4.72],[6.05,0],[0,4.72]],'#c3e5e9','#91cbd9',1);
 // paths on the snowfield
 poly([[-.38,-4.7],[.38,-4.7],[.38,4.7],[-.38,4.7]],'#f7ffff55','#ffffff55',1);
 poly([[-5.9,-.34],[5.9,-.34],[5.9,.34],[-5.9,.34]],'#f7ffff55','#ffffff55',1);
 // ice cliffs and snow drifts around the perimeter
 for(let i=0;i<12;i++){let x=-5.6+i*1.02;ellipse(x,-4.25,.34,.2,'#f5ffff');ellipse(x,4.25,.34,.2,'#efffff')}
 buildings.slice().sort((a,b)=>a.y-b.y).forEach(building);
 if(state.built)building({id:'guard',name:'Pos Penjaga',x:-1.6,y:-3.25,kind:'tower'});
 heroes.forEach((h,i)=>penguin(h.x+Math.sin(Date.now()/700+i)*.08,h.y,h.c,1.02));
 // small patrol groups, not a wall of repeated icons
 for(let i=0;i<4;i++)penguin(-4.5+i*.55,3.55,'#d8edf4',.7);
}
let last=0;function animate(t){if(t-last>45){draw();last=t}requestAnimationFrame(animate)}
let down=null,drag=false;
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY};drag=false;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!down)return;let dx=e.clientX-down.px,dy=e.clientY-down.py;if(Math.abs(e.clientX-down.x)+Math.abs(e.clientY-down.y)>7)drag=true;if(drag){state.panX+=dx;state.panY+=dy;down.px=e.clientX;down.py=e.clientY;draw()}});
canvas.addEventListener('pointerup',e=>{if(!down)return;if(!drag){let x=e.clientX-canvas.getBoundingClientRect().left,y=e.clientY-canvas.getBoundingClientRect().top;let hit=null,dist=1e9;for(let b of buildings){let p=project(b.x,b.y),d=Math.hypot(x-p[0],y-p[1]);if(d<dist){dist=d;hit=b}}if(hit&&dist<55){state.selected=hit.id;showBuilding(hit)}}down=null});
canvas.addEventListener('wheel',e=>{state.zoom=Math.max(.72,Math.min(1.45,state.zoom+(e.deltaY<0?.06:-.06)));draw()},{passive:true});
let pinch=0;canvas.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});
canvas.addEventListener('touchmove',e=>{if(e.touches.length===2){let d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch){state.zoom=Math.max(.72,Math.min(1.45,state.zoom*d/pinch));draw()}pinch=d}},{passive:true});
function modal(title,desc,buttons){$('modalTitle').textContent=title;$('modalText').textContent=desc;let box=$('modalButtons');box.innerHTML='';buttons.forEach(b=>{let el=document.createElement('button');el.className=b.secondary?'panel-secondary':'panel-action';el.textContent=b.label;el.onclick=b.fn;box.appendChild(el)});$('modal').classList.remove('hidden')}
function close(){$('modal').classList.add('hidden')}
$('close').onclick=close;
function showBuilding(b){modal(b.name,`Level ${state.levels[b.id]||1}\nBangunan kerajaan Gugu. Upgrade meningkatkan level fasilitas.`,[{label:'UPGRADE · 90K+',fn:()=>upgrade(b)},{label:'TUTUP',secondary:true,fn:close}])}
function upgrade(b){let lv=state.levels[b.id]||1,cost=90000+lv*lv*18000;if(state.gold<cost){notice('Emas belum cukup.');return close()}state.gold-=cost;state.levels[b.id]=lv+1;state.selected=b.id;save();hud();draw();close();notice(`${b.name} naik ke Lv.${lv+1}!`)}
function build(){modal('BANGUN FASILITAS','Bangun Pos Penjaga di lahan kosong.\nBiaya: 120.000 emas + 25.000 bijih.',[{label:'BANGUN POS PENJAGA',fn:()=>{if(state.built)return notice('Pos Penjaga sudah dibangun.'),close();if(state.gold<120000||state.ore<25000)return notice('Sumber daya belum cukup.'),close();state.gold-=120000;state.ore-=25000;state.built=true;save();hud();draw();close();notice('Pos Penjaga selesai dibangun!')}},{label:'BATAL',secondary:true,fn:close}])}
function train(){modal('BARAK · PENGAWAL ES','Latih 5 Pengawal Es untuk mempertahankan kerajaan atau menyerang.\nBiaya: 45.000 emas + 18.000 bijih.',[{label:'LATIH 5 PASUKAN',fn:()=>{if(state.gold<45000||state.ore<18000)return notice('Sumber daya belum cukup.'),close();state.gold-=45000;state.ore-=18000;state.troops+=5;save();hud();close();notice(`5 Pengawal Es siap. Total pasukan: ${state.troops}`)}},{label:'TUTUP',secondary:true,fn:close}])}
function attack(){if(state.troops<5)return modal('PASUKAN BELUM CUKUP','Butuh minimal 5 Pengawal Es untuk menyerang.',[{label:'MENGERTI',fn:close}]);modal('SERANG WILAYAH MUSUH','Kirim 5 Pengawal Es dalam ekspedisi ke wilayah beku.',[{label:'MULAI SERANGAN',fn:()=>{state.troops-=5;let win=Math.random()<.76;if(win){state.gold+=75000;state.crystal+=25000;notice('Kemenangan! +75K emas dan +25K kristal.')}else{state.troops+=2;notice('Serangan gagal. 2 pengawal berhasil kembali.')}save();hud();close()}},{label:'BATAL',secondary:true,fn:close}])}
function heroModal(){modal('GUGU SQUAD','KIRO · Komandan Penjaga\nFROST · Ahli Kristal\nAURUM · Ahli Emas\nBORA · Kepala Logistik\n\nPara hero menjaga aktivitas kerajaan.',[{label:'KEMBALI',fn:close}])}
document.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>({build,upgrade:()=>state.selected?showBuilding(buildings.find(x=>x.id===state.selected)):notice('Pilih bangunan di peta dahulu.'),heroes:heroModal,train,attack}[b.dataset.act])()));
let economy=0;setInterval(()=>{state.gold+=850;state.crystal+=420;state.ore+=300;economy+=5;hud();if(economy%15===0)save()},5000);
load();hud();size();requestAnimationFrame(animate);
setTimeout(()=>{let n=0,t=setInterval(()=>{n=Math.min(100,n+2+Math.random()*5);$('loadFill').style.width=n+'%';$('loadPct').textContent=Math.floor(n)+'%';if(n>35)$('loadLabel').textContent='MEMBANGUN KERAJAAN ES...';if(n>72)$('loadLabel').textContent='MEMANGGIL PASUKAN PENGUIN...';if(n>=100){clearInterval(t);setTimeout(()=>{$('splash').classList.add('hidden');$('game').classList.remove('hidden');size()},300)}},90)},150);
})();
