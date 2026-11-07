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
function project(x,y){let w=canvas.clientWidth,h=canvas.clientHeight,s=Math.min(w/13,h/9)*state.zoom;return [w/2+(x-y)*s*.78+state.panX,h/2+(x+y)*s*.39+state.panY]}
function poly(points,fill,stroke='#8bd9e8',lw=1){ctx.beginPath();points.forEach((p,i)=>{let q=project(p[0],p[1]);i?ctx.lineTo(...q):ctx.moveTo(...q)});ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}
function ellipse(x,y,rx,ry,fill){let p=project(x,y);let s=Math.min(canvas.clientWidth/13,canvas.clientHeight/9)*state.zoom;ctx.beginPath();ctx.ellipse(p[0],p[1],rx*s,ry*s*.55,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function text(x,y,t,size,color='#f6fbff'){let p=project(x,y);ctx.font=`900 ${size}px system-ui`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#09283d';ctx.strokeText(t,p[0],p[1]);ctx.fillStyle=color;ctx.fillText(t,p[0],p[1])}
function penguin(x,y,accent,scale=1){let p=project(x,y),s=Math.min(canvas.clientWidth/13,canvas.clientHeight/9)*state.zoom*scale;ellipse(x,y+.13,.33*scale,.22*scale,'#123244');ctx.fillStyle='#071723';ctx.beginPath();ctx.ellipse(p[0],p[1]-s*.34,s*.24,s*.38,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f4f8f7';ctx.beginPath();ctx.ellipse(p[0],p[1]-s*.28,s*.145,s*.26,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(p[0]-s*.055,p[1]-s*.55);ctx.lineTo(p[0]+s*.055,p[1]-s*.55);ctx.lineTo(p[0],p[1]-s*.46);ctx.fill();ctx.fillStyle='#ffad45';ctx.beginPath();ctx.moveTo(p[0],p[1]-s*.32);ctx.lineTo(p[0]+s*.09,p[1]-s*.29);ctx.lineTo(p[0],p[1]-s*.25);ctx.fill();ctx.fillStyle='#ffc04d';ctx.fillRect(p[0]-s*.1,p[1]+s*.02,s*.09,s*.035);ctx.fillRect(p[0]+s*.02,p[1]+s*.02,s*.09,s*.035)}
function building(b){let lv=state.levels[b.id]||1,x=b.x,y=b.y,base= b.kind==='castle'?'#91cbd8':b.kind==='gold'?'#9b7138':b.kind==='crystal'?'#277c9d':b.kind==='store'?'#62558c':b.kind==='barracks'?'#496a80':'#4a8198';
poly([[x-1,y],[x,y-.65],[x+1,y],[x,y+.65]],'#b5e9f2','#e4fbff',2);
poly([[x-.72,y-.05],[x,y-.5],[x+.72,y-.05],[x,y+.38]],base,'#c0e8ef',1.4);
poly([[x-.72,y-.05],[x,y+.38],[x,y+.85],[x-.72,y+.42]],'#163f58','#6fb9ca');
poly([[x,y+.38],[x+.72,y-.05],[x+.72,y+.42],[x,y+.85]],'#22546c','#6fb9ca');
poly([[x-.78,y-.08],[x,y-.62],[x+.78,y-.08],[x,y+.34]],b.kind==='castle'?'#d8b866':'#8bd2e2','#e9faff',1.4);
if(b.kind==='castle'){for(let dx of [-.48,.48])for(let dy of [-.35,.35]){let q=project(x+dx,y+dy);ctx.fillStyle='#e6d08b';ctx.fillRect(q[0]-4,q[1]-22,8,25)}}
if(b.kind==='crystal'){for(let i=0;i<4;i++){let q=project(x-.3+i*.19,y-.12);ctx.fillStyle='#6beaff';ctx.beginPath();ctx.moveTo(q[0],q[1]-24-i%2*9);ctx.lineTo(q[0]+7,q[1]);ctx.lineTo(q[0]-7,q[1]);ctx.fill()}}
if(b.kind==='gold'){for(let i=0;i<4;i++){let q=project(x-.3+i*.2,y-.1);ctx.fillStyle='#f5c34e';ctx.beginPath();ctx.arc(q[0],q[1]-8,5,0,7);ctx.fill()}}
text(x,y-.86,`${b.name} · Lv.${lv}`,Math.max(9,Math.min(12,canvas.clientWidth/38)),state.selected===b.id?'#ffe08a':'#f4fbff')}
function draw(){if(!ctx||!canvas.clientWidth)return;let w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);
let grd=ctx.createLinearGradient(0,0,0,h);grd.addColorStop(0,'#286f88');grd.addColorStop(1,'#103b55');ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
for(let i=0;i<30;i++){let x=((i*83)%w),y=((i*47)%h);ctx.fillStyle='#d7f8ff22';ctx.beginPath();ctx.arc(x,y,1.5,0,7);ctx.fill()}
poly([[-6.3,0],[0,-5],[6.3,0],[0,5]],'#2c7890','#9be6f1',4);
poly([[-5.8,0],[0,-4.6],[5.8,0],[0,4.6]],'#e4f7f8','#ffffff',2);
poly([[-5.4,0],[0,-4.2],[5.4,0],[0,4.2]],'#c8eaf0','#8acbd8',1);
poly([[-.55,-4.2],[.55,-4.2],[.55,4.2],[-.55,4.2]],'#f7ffffaa','#fff',1);
poly([[-5.2,-.45],[5.2,-.45],[5.2,.45],[-5.2,.45]],'#f7ffffaa','#fff',1);
for(let i=0;i<12;i++){let x=-5.2+i*.94;penguin(x,-3.8,'#e0f5fb',.52);penguin(x,3.7,'#e0f5fb',.52)}
buildings.slice().sort((a,b)=>a.y-b.y).forEach(building);
if(state.built){building({id:'guard',name:'Pos Penjaga',x:-1.6,y:-3.25,kind:'tower'});}
heroes.forEach((h,i)=>penguin(h.x+Math.sin(Date.now()/700+i)*.06,h.y,h.c,.72));
for(let i=0;i<6;i++)penguin(-4.2+i*1.55,4.3,'#c7d9e3',.48);
if(state.selected){let b=buildings.find(x=>x.id===state.selected);if(b){let p=project(b.x,b.y);ctx.strokeStyle='#ffe39a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p[0],p[1],24,0,7);ctx.stroke()}}
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
