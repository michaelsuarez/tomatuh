'use strict';
(() => {
  const DESTINATION = 'https://chatgpt.com/';
  const COUNTDOWN_MS = 5000;
  const COUNT = NAMES.length;
  // One note per character, matched to the HATS order.
  const NOTES = [
    'I wear SPF 50. Still ripened.',
    'Arr! Pass the condiments, matey.',
    'Dressed up for the salad.',
    'Bow before the Sauce Monarch.',
    'Put me in, coach. I can roll downhill.',
    'I have read every recipe. Alarming.',
    'Cold outside? I came pre-stewed.',
    'I say, this vine is simply delightful.',
    'The special today is… me. Run.',
    'I grew this myself. The hat, not the leaf.',
    'Can we skip the squat day?',
    'Too cool for the soup pot.',
    'Surprise! I brought nothing but vibes.',
    'Technically a fruit. Spiritually a snack.',
    'Wanted for crimes against pasta.',
    'Good evening. I prefer "heirloom".'
  ];
  const patch = document.querySelector('#patch');
  const replay = document.querySelector('#again');
  const confetti = document.querySelector('#confetti');
  const toast = document.querySelector('#toast');
  const toastText = document.querySelector('#toast-text');
  const message = document.querySelector('#message');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const rand = (a,b)=>a+Math.random()*(b-a);
  const clamp = (n,lo,hi)=>Math.max(lo,Math.min(n,hi));
  let cast=[], open=null, winner=null, won=false, timer, frame, last=0, W, H, base;

  function shuffle(items){
    const bag=items.slice();
    for(let i=bag.length-1;i>0;i--){const j=Math.floor(rand(0,i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}
    return bag;
  }
  function measure(){
    W=patch.clientWidth||innerWidth;H=patch.clientHeight||innerHeight;
    base=clamp(Math.sqrt(W*H/COUNT)*.78,64,200);
  }
  // Re-fit when the patch changes size (rotation, iOS toolbars, late stylesheet).
  function fit(){
    const stale=H<120||W<120;
    measure();
    if(stale&&H>=120&&W>=120&&!won){start();return;}
    for(const p of cast){const m=p.s*.5;p.x=clamp(p.x,m,W-m);p.y=clamp(p.y,p.s*.62,H-m);}
    if(open)placeNote(open);
  }
  function draw(p){
    const hop=motion.matches?0:p.z;
    p.el.style.transform=`translate3d(${p.x-p.s/2}px,${p.y-p.s/2}px,0)`;
    p.el.style.zIndex=p===open?'9500':String(Math.round(p.y));
    p.body.style.transform=`translateY(${-hop}px) rotate(${p===open?0:p.tilt+hop*p.vx*.006}deg)`;
    p.shadow.style.transform=`scale(${1-hop/p.s*.8})`;
  }
  function bounce(a,b){
    const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01,min=(a.s+b.s)*.3;
    if(d>=min||a===open||b===open)return;
    const nx=dx/d,ny=dy/d,depth=(min-d)*.5;
    a.x-=nx*depth;a.y-=ny*depth;b.x+=nx*depth;b.y+=ny*depth;
    const approach=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
    if(approach>0){a.vx-=approach*nx;a.vy-=approach*ny;b.vx+=approach*nx;b.vy+=approach*ny;}
  }
  function tick(t){
    const dt=Math.min(.04,(t-last)/1000)||0;last=t;
    if(!motion.matches&&!won){
      for(const p of cast){
        if(p===open)continue;
        p.x+=p.vx*dt;p.y+=p.vy*dt;p.wait-=dt;
        if(p.wait<=0&&p.z===0){
          p.lift=p.s*rand(1.2,2);p.wait=rand(1.2,4.5);
          const ang=rand(0,Math.PI*2),speed=p.s*rand(.22,.55);
          p.vx=Math.cos(ang)*speed;p.vy=Math.sin(ang)*speed;
        }
        p.lift-=p.s*6.8*dt;p.z=Math.max(0,p.z+p.lift*dt);if(!p.z)p.lift=0;
        const m=p.s*.5,top=p.s*.62;
        if(p.x<m||p.x>W-m)p.vx=(p.x<m?1:-1)*Math.abs(p.vx);
        if(p.y<top||p.y>H-m)p.vy=(p.y<top?1:-1)*Math.abs(p.vy);
        p.x=clamp(p.x,m,W-m);p.y=clamp(p.y,top,H-m);
      }
      for(let i=0;i<cast.length;i++)for(let j=i+1;j<cast.length;j++)bounce(cast[i],cast[j]);
    }
    cast.forEach(draw);frame=requestAnimationFrame(tick);
  }
  function placeNote(p){
    const note=p.el.querySelector('.note');
    const mx=note.offsetWidth/2+8,my=note.offsetHeight/2+12;
    p.x=clamp(p.x,mx,W-mx);p.y=clamp(p.y,my,H-my);draw(p);
  }
  function celebrate(){
    for(let i=0;i<90;i++){
      const bit=document.createElement('i');
      bit.style.cssText=`left:${rand(0,100)}%;background:${ACCENTS[i%ACCENTS.length]};--time:${rand(1.8,3.3)}s;animation-delay:${rand(-2.5,0)}s;--drift:${rand(-120,120)}px;--quiet-y:${rand(0,100)}%`;
      confetti.append(bit);
    }
  }
  function reveal(p){
    if(won)return;
    const prev=open;
    if(prev){
      prev.el.classList.remove('flipped');
      prev.el.setAttribute('aria-pressed','false');
      prev.el.setAttribute('aria-label','Turn over '+NAMES[prev.i]);
      open=null;
    }
    if(prev===p)return;
    open=p;p.z=0;p.lift=0;
    const lucky=p===winner;
    const line=lucky?'Hooray, you found me!':NOTES[p.i];
    p.el.querySelector('.note').textContent=line;
    p.el.classList.add('flipped');
    p.el.setAttribute('aria-pressed','true');
    p.el.setAttribute('aria-label',NAMES[p.i]+'. '+line);
    message.textContent=line;
    placeNote(p);
    if(lucky){
      won=true;p.el.classList.add('chosen');replay.hidden=false;
      celebrate();
      toastText.textContent='You found the lucky tomato! Hopping over to ChatGPT…';
      toast.hidden=false;
      message.textContent='Lucky tomato found. Going to ChatGPT in five seconds. Press the play again button to stay.';
      timer=setTimeout(()=>location.assign(DESTINATION),COUNTDOWN_MS);
    }
  }
  function start(){
    cancelAnimationFrame(frame);clearTimeout(timer);
    confetti.replaceChildren();patch.replaceChildren();
    open=null;won=false;replay.hidden=true;toast.hidden=true;message.textContent='';
    measure();
    const order=shuffle(HATS.map((_,i)=>i));
    const cols=Math.min(8,Math.max(2,Math.round(Math.sqrt(COUNT*W/H))));
    const rows=Math.ceil(COUNT/cols);
    const cells=shuffle(Array.from({length:cols*rows},(_,i)=>i));
    const luckyIndex=Math.floor(rand(0,COUNT));
    cast=order.map((i,k)=>{
      const el=document.createElement('button');el.type='button';el.className='tom';
      el.setAttribute('aria-label','Turn over '+NAMES[i]);el.setAttribute('aria-pressed','false');
      el.innerHTML=`<span class="shadow"></span><span class="hop"><span class="turn"><span class="face">${tomato(i,false)}</span><span class="back">${tomato(i,true)}<span class="note" aria-hidden="true"></span></span></span></span>`;
      const s=base*rand(.82,1.18),cell=cells[k],m=s*.5;
      const cw=W/cols,ch=H/rows;
      const p={el,i,s,body:el.querySelector('.hop'),shadow:el.querySelector('.shadow'),
        x:clamp((cell%cols+rand(.3,.7))*cw,m,W-m),y:clamp((Math.floor(cell/cols)+rand(.3,.7))*ch,s*.62,H-m),
        vx:0,vy:0,z:0,lift:0,wait:rand(0,3),tilt:rand(-7,7)};
      el.style.width=el.style.height=s+'px';
      el.addEventListener('click',()=>reveal(p));
      patch.append(el);
      return p;
    });
    winner=cast[luckyIndex];
    last=performance.now();frame=requestAnimationFrame(tick);
  }
  replay.addEventListener('click',start);
  if('ResizeObserver' in window)new ResizeObserver(fit).observe(patch);
  else addEventListener('resize',fit);
  addEventListener('orientationchange',()=>setTimeout(fit,300));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&won)start();});
  start();
})();
