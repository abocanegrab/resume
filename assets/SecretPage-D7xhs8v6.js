import{u as B,r as l,j as f,t,s as m,k as D,p as ie,L as ae}from"./index-Cxi3CB8M.js";const X=new Set([3,6,10,13]),le=D`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
`,ce=D`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`,fe=m.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${t.spacing.lg};
`,pe=m.h1`
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.lg};
  color: ${t.colors.primary.main};
  text-align: center;
  margin-bottom: ${t.spacing["2xl"]};
  text-shadow: 0 0 10px ${t.colors.primary.glow};

  @media (max-width: ${t.breakpoints.mobile}) {
    font-size: ${t.typography.sizes.sm};
  }
`,ge=m.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-bottom: ${t.spacing.xl};
  animation: ${({shaking:e})=>e?le:"none"} 0.5s ease;
`,me=m.button`
  width: 72px;
  height: 72px;
  border: 2px solid ${({active:e})=>e?t.colors.primary.main:t.colors.secondary.main};
  background: ${({active:e})=>e?"rgba(92, 189, 245, 0.2)":t.colors.secondary.dark};
  color: ${({active:e})=>e?t.colors.primary.main:t.colors.neutral.lightGray};
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.sm};
  cursor: pointer;
  transition: all ${t.transitions.fast};
  box-shadow: ${({active:e})=>e?t.shadows.glow.cyan:"none"};
  position: relative;

  &:hover {
    border-color: ${t.colors.primary.light};
    background: rgba(92, 189, 245, 0.1);
  }

  @media (max-width: ${t.breakpoints.mobile}) {
    width: 60px;
    height: 60px;
  }
`,de=m.button`
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.sm};
  color: ${t.colors.neutral.black};
  background: ${t.colors.primary.main};
  border: none;
  padding: ${t.spacing.md} ${t.spacing["2xl"]};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all ${t.transitions.fast};

  &:hover {
    background: ${t.colors.primary.light};
    box-shadow: ${t.shadows.glow.cyan};
  }

  @media (max-width: ${t.breakpoints.mobile}) {
    padding: ${t.spacing.sm} ${t.spacing.xl};
  }
`,he=m.p`
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.sm};
  color: ${t.colors.accent.red};
  margin-top: ${t.spacing.lg};
  opacity: ${({visible:e})=>e?1:0};
  text-shadow: 0 0 10px rgba(255, 74, 94, 0.5);
  animation: ${({visible:e})=>e?ce:"none"} 0.3s ease;
  min-height: 1.5em;
`,ue=m.p`
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.sm};
  color: ${t.colors.neutral.lightGray};
  margin-top: ${t.spacing["2xl"]};
  text-align: center;
  max-width: 300px;
  line-height: 1.8;
`,ye=m.div`
  position: fixed;
  inset: 0;
  background: white;
  z-index: 999;
  pointer-events: none;
  opacity: ${({active:e})=>e?1:0};
  transition: opacity 0.4s ease;
`,$e=({onSuccess:e})=>{const{t:r}=B("common"),[n,s]=l.useState(new Set),[i,p]=l.useState(!1),[d,g]=l.useState(!1),[a,x]=l.useState(!1),v=l.useCallback(S=>{p(!1),s(k=>{const w=new Set(k);return w.has(S)?w.delete(S):w.add(S),w})},[]),R=l.useCallback(()=>{n.size===X.size&&[...n].every(k=>X.has(k))?(x(!0),setTimeout(e,500)):(p(!0),g(!0),setTimeout(()=>g(!1),500),setTimeout(()=>p(!1),2e3))},[n,e]);return f.jsxs(fe,{children:[f.jsx(ye,{active:a}),f.jsx(pe,{children:r("secret.password.title")}),f.jsx(ge,{shaking:d,children:Array.from({length:16},(S,k)=>{const w=k+1;return f.jsx(me,{active:n.has(w),onClick:()=>v(w),"aria-label":r("secret.password.cellLabel",{n:w}),children:w},w)})}),f.jsx(de,{onClick:R,children:r("secret.password.submit")}),f.jsx(he,{visible:i,children:i?r("secret.password.denied"):""}),f.jsx(ue,{children:r("secret.password.hint")})]})},oe=350,re=430,L=4,O=4,Y=oe/L,H=re/O,q=250,be=D`
  0%, 100% { box-shadow: 0 0 10px rgba(92, 189, 245, 0.3); }
  50% { box-shadow: 0 0 30px rgba(92, 189, 245, 0.7), 0 0 60px rgba(92, 189, 245, 0.3); }
`,Se=D`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`,we=m.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${t.spacing.lg};
`,ve=m.p`
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.sm};
  color: ${t.colors.primary.main};
  margin-bottom: ${t.spacing.xl};
  text-shadow: 0 0 10px ${t.colors.primary.glow};
`,xe=m.div`
  display: grid;
  grid-template-columns: repeat(${L}, ${Y}px);
  grid-template-rows: repeat(${O}, ${H}px);
  gap: 2px;
  animation: ${({complete:e})=>e?be:"none"} 1.5s ease infinite;

  @media (max-width: ${t.breakpoints.mobile}) {
    transform: scale(0.75);
    transform-origin: center;
  }
`,Re=m.div`
  width: ${Y}px;
  height: ${H}px;
  perspective: 600px;
`,Te=m.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  transition-delay: ${({delay:e})=>e}ms;
  transform: ${({flipped:e})=>e?"rotateY(180deg)":"rotateY(0)"};
`,ne=m.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  overflow: hidden;
`,ke=m(ne)`
  background: ${t.colors.secondary.dark};
  border: 1px solid ${t.colors.secondary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.xl};
  color: ${t.colors.neutral.lightGray};
`,je=m(ne)`
  transform: rotateY(180deg);
  background: ${t.colors.secondary.dark};
  border: 1px solid rgba(92, 189, 245, 0.3);
`,Ee=m.img`
  position: absolute;
  width: ${oe}px;
  height: ${re}px;
  top: ${({row:e})=>-e*H}px;
  left: ${({col:e})=>-e*Y}px;
`,Ae=m.h2`
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.sm};
  color: ${t.colors.accent.green};
  margin-top: ${t.spacing.xl};
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
  opacity: ${({visible:e})=>e?1:0};
  animation: ${({visible:e})=>e?Se:"none"} 0.6s ease;
`,ze=m.button`
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.sm};
  color: ${t.colors.neutral.black};
  background: ${t.colors.accent.green};
  border: none;
  padding: ${t.spacing.md} ${t.spacing["2xl"]};
  margin-top: ${t.spacing.lg};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: ${({visible:e})=>e?1:0};
  transform: translateY(${({visible:e})=>e?0:10}px);
  transition: all 0.4s ease;
  pointer-events: ${({visible:e})=>e?"auto":"none"};

  &:hover {
    background: #5fff3a;
    box-shadow: ${t.shadows.glow.green};
  }

  @media (max-width: ${t.breakpoints.mobile}) {
    padding: ${t.spacing.sm} ${t.spacing.xl};
  }
`;function Ce(e,r){const n=e*r,s=[];let i=0,p=e-1,d=0,g=r-1;for(;s.length<n;){for(let a=d;a<=g&&s.length<n;a++)s.push(i*r+a);i++;for(let a=i;a<=p&&s.length<n;a++)s.push(a*r+g);g--;for(let a=g;a>=d&&s.length<n;a--)s.push(p*r+a);p--;for(let a=p;a>=i&&s.length<n;a--)s.push(a*r+d);d++}return s}const _e=({onComplete:e})=>{const{t:r}=B("common"),[n,s]=l.useState(new Set),[i,p]=l.useState(!1),[d,g]=l.useState(!1),a=l.useMemo(()=>Ce(O,L),[]);return l.useEffect(()=>{const x=[];a.forEach((R,S)=>{x.push(setTimeout(()=>{s(k=>new Set(k).add(R))},(S+1)*q))});const v=(a.length+1)*q;return x.push(setTimeout(()=>p(!0),v)),x.push(setTimeout(()=>g(!0),v+600)),()=>x.forEach(clearTimeout)},[a]),f.jsxs(we,{children:[f.jsx(ve,{children:r("secret.reveal.loading")}),f.jsx(xe,{complete:i,children:Array.from({length:O*L},(x,v)=>{const R=Math.floor(v/L),S=v%L;return f.jsx(Re,{children:f.jsxs(Te,{flipped:n.has(v),delay:0,children:[f.jsx(ke,{children:"?"}),f.jsx(je,{row:R,col:S,children:f.jsx(Ee,{src:"/resume/sprites/character.svg",alt:"",row:R,col:S,draggable:!1,loading:"eager"})})]})},v)})}),f.jsx(Ae,{visible:i,children:r("secret.reveal.complete")}),f.jsx(ze,{visible:d,onClick:e,children:r("secret.reveal.start")})]})},U=e=>(ie(e)??[0,0,0]).join(", "),F=U(t.colors.secondary.medium),Ge=U(t.colors.primary.main),J=U(t.colors.background.primary),y=800,E=400,b=340,Le=.6,Me=-12,Ie=20,_=30,Q=4,Pe=.001,Z=90,Oe=160,M="#0f71de",N="#12d5cd",Be="#f0b281",ee="#0a4fa0",De=m.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${t.spacing.lg};
`,We=m.h2`
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.md};
  color: ${t.colors.primary.main};
  margin-bottom: ${t.spacing.lg};
  text-shadow: 0 0 10px ${t.colors.primary.glow};

  @media (max-width: ${t.breakpoints.mobile}) {
    font-size: ${t.typography.sizes.sm};
  }
`,Fe=m.canvas`
  border: 2px solid ${t.colors.secondary.main};
  background: ${t.colors.neutral.black};
  max-width: 100%;
  height: auto;
  cursor: pointer;
  image-rendering: pixelated;
`;function Ne(e,r,n){const s=r.x,i=r.y;if(r.hitTimer>0&&Math.floor(r.hitTimer*10)%2===0&&(e.globalAlpha=.5),e.fillStyle=M,e.fillRect(s+2,i,16,10),e.fillStyle=N,e.fillRect(s+8,i+1,4,4),e.fillStyle=Be,e.fillRect(s+4,i+10,12,6),e.fillStyle=M,e.fillRect(s+2,i+16,16,8),e.fillStyle=N,e.fillRect(s+6,i+17,8,3),!n)e.fillStyle=M,e.fillRect(s+4,i+24,5,6),e.fillRect(s+11,i+24,5,6),e.fillStyle=ee,e.fillRect(s+3,i+28,6,2),e.fillRect(s+11,i+28,6,2);else{const d=r.frame===0?0:3;e.fillStyle=M,e.fillRect(s+3,i+24,5,4+d),e.fillRect(s+12,i+24,5,4+(3-d)),e.fillStyle=ee,e.fillRect(s+2,i+27+d,6,3),e.fillRect(s+11,i+27+(3-d),6,3)}e.fillStyle=M,e.fillRect(s+16,i+16,6,5),e.fillStyle=N,e.fillRect(s+20,i+17,3,3),e.globalAlpha=1}function Ye(e,r,n){e.fillStyle=t.colors.accent.gold,e.beginPath(),e.arc(r+10,n+6,10,Math.PI,0),e.fill(),e.fillRect(r-2,n+5,24,4),e.fillStyle="#333",e.fillRect(r+3,n+9,14,6),e.fillStyle="#FFF",e.fillRect(r+5,n+9,3,3),e.fillRect(r+12,n+9,3,3),e.fillStyle="#000",e.fillRect(r+6,n+10,2,2),e.fillRect(r+13,n+10,2,2)}function He(e,r,n,s,i){e.fillStyle="#888";const p=8,d=Math.floor(s/p);for(let g=0;g<d;g++){const a=r+g*p;e.beginPath(),e.moveTo(a,n+i),e.lineTo(a+p/2,n),e.lineTo(a+p,n+i),e.closePath(),e.fill()}e.fillStyle=t.colors.accent.red;for(let g=0;g<d;g++){const a=r+g*p;e.beginPath(),e.moveTo(a+2,n+i*.4),e.lineTo(a+p/2,n),e.lineTo(a+p-2,n+i*.4),e.closePath(),e.fill()}}function te(e,r){const n=[];let s=0;for(let i=0;i<e;i++){const p=30+Math.random()*60,d=30+Math.random()*r;n.push({x:s,w:p,h:d}),s+=p+10+Math.random()*30}return n}const Ue=()=>{const{t:e}=B("common"),r=l.useRef(null),n=l.useRef("idle"),[s]=l.useState(()=>"ontouchstart"in window||navigator.maxTouchPoints>0),i=l.useRef(0),p=l.useRef(0),d=l.useRef({x:60,y:b-_,vy:0,jumps:0,frame:0,frameTimer:0,hitTimer:0}),g=l.useRef([]),a=l.useRef(0),x=l.useRef(0),v=l.useRef(Q),R=l.useRef(200),S=l.useRef(0),k=l.useRef([{offset:0,speed:.3,buildings:te(30,80)},{offset:0,speed:.6,buildings:te(25,50)}]);l.useEffect(()=>{const o=localStorage.getItem("megaman-runner-highscore");o&&(x.current=parseInt(o,10))},[]);const w=l.useCallback(()=>{const o=d.current;o.y=b-_,o.vy=0,o.jumps=0,o.frame=0,o.frameTimer=0,o.hitTimer=0,g.current=[],a.current=0,v.current=Q,R.current=200,S.current=0,k.current.forEach(u=>u.offset=0)},[]),V=l.useCallback(()=>{const o=d.current;o.jumps<2&&(o.vy=Me,o.jumps++)},[]),I=l.useCallback(()=>{const o=n.current;o==="idle"?(w(),n.current="playing"):o==="playing"?V():o==="gameOver"&&(w(),n.current="playing")},[w,V]),K=l.useCallback((o,u)=>{const T=n.current,c=d.current,A=v.current;o.fillStyle=t.colors.background.primary,o.fillRect(0,0,y,E),k.current.forEach((h,P)=>{const G=P===0?.15:.25;o.fillStyle=`rgba(${F}, ${G})`,T==="playing"&&(h.offset+=A*h.speed*u*60),h.buildings.forEach(j=>{let z=j.x-h.offset%(y*3);for(;z<-j.w;)z+=y*3;if(z<y+j.w){o.fillRect(z,b-j.h,j.w,j.h),o.fillStyle=`rgba(${Ge}, ${G*.5})`;for(let $=b-j.h+8;$<b-4;$+=12)for(let C=z+6;C<z+j.w-4;C+=10)o.fillRect(C,$,4,4);o.fillStyle=`rgba(${F}, ${G})`}})}),o.fillStyle=t.colors.secondary.main,o.fillRect(0,b,y,4),o.fillStyle=t.colors.secondary.dark,o.fillRect(0,b+4,y,E-b-4),T==="playing"&&(S.current=(S.current+A*u*60)%20),o.fillStyle=`rgba(${F}, 0.5)`;for(let h=-S.current;h<y;h+=20)o.fillRect(h,b+6,10,2),o.fillRect(h+10,b+14,10,2);if(T==="playing"){if(c.vy+=Le*u*60,c.y+=c.vy*u*60,c.y>=b-_&&(c.y=b-_,c.vy=0,c.jumps=0),c.y>=b-_-1&&(c.frameTimer+=u*60,c.frameTimer>8&&(c.frame=(c.frame+1)%2,c.frameTimer=0)),c.hitTimer>0&&(c.hitTimer-=u),v.current+=Pe*u*60,R.current-=A*u*60,R.current<=0){const $=Math.random()>.4?"mettaur":"spike",C=$==="mettaur"?{x:y,type:$,w:20,h:15}:{x:y,type:$,w:32,h:14};g.current.push(C),R.current=Z+Math.random()*(Oe-Z)}g.current.forEach($=>{$.x-=A*u*60}),g.current=g.current.filter($=>$.x>-50),a.current+=u*60;const P=c.x+4,G=c.y+4,j=Ie-8,z=_-4;for(const $ of g.current){const C=b-$.h;if(P<$.x+$.w&&P+j>$.x&&G<C+$.h&&G+z>C){n.current="gameOver";const W=Math.floor(a.current);W>x.current&&(x.current=W,localStorage.setItem("megaman-runner-highscore",String(W)));break}}}g.current.forEach(h=>{h.type==="mettaur"?Ye(o,h.x,b-h.h):He(o,h.x,b-h.h,h.w,h.h)});const se=c.y>=b-_-1;if(Ne(o,c,se),o.font=`16px ${t.typography.fonts.pixel}`,o.textAlign="right",o.fillStyle=t.colors.neutral.white,o.fillText(`${e("secret.game.score")}: ${String(Math.floor(a.current)).padStart(5,"0")}`,y-16,30),o.textAlign="left",o.fillStyle=t.colors.primary.main,o.fillText(`${e("secret.game.highScore")}: ${String(x.current).padStart(5,"0")}`,16,30),T==="idle"){o.fillStyle=`rgba(${J}, 0.6)`,o.fillRect(0,0,y,E),o.textAlign="center",o.font=`20px ${t.typography.fonts.pixel}`,o.fillStyle=t.colors.primary.main,o.fillText(e("secret.game.title"),y/2,E/2-30),o.font=`14px ${t.typography.fonts.pixel}`,o.fillStyle=t.colors.neutral.silver;const h=e(s?"secret.game.startMobile":"secret.game.start");o.fillText(h,y/2,E/2+20)}if(T==="gameOver"){o.fillStyle=`rgba(${J}, 0.7)`,o.fillRect(0,0,y,E),o.textAlign="center",o.font=`20px ${t.typography.fonts.pixel}`,o.fillStyle=t.colors.accent.red,o.fillText(e("secret.game.gameOver"),y/2,E/2-40),o.font=`14px ${t.typography.fonts.pixel}`,o.fillStyle=t.colors.neutral.white,o.fillText(`${e("secret.game.score")}: ${Math.floor(a.current)}`,y/2,E/2+10),o.font=`14px ${t.typography.fonts.pixel}`,o.fillStyle=t.colors.neutral.silver;const h=e(s?"secret.game.startMobile":"secret.game.retry");o.fillText(h,y/2,E/2+50)}},[e,s]);return l.useEffect(()=>{const o=r.current;if(!o)return;const u=o.getContext("2d");if(!u)return;const T=c=>{const A=p.current?Math.min((c-p.current)/1e3,.05):.016666666666666666;p.current=c,K(u,A),i.current=requestAnimationFrame(T)};return i.current=requestAnimationFrame(T),()=>cancelAnimationFrame(i.current)},[K]),l.useEffect(()=>{const o=c=>{(c.code==="Space"||c.code==="ArrowUp")&&(c.preventDefault(),I())},u=c=>{const A=c.target;A.tagName==="A"||A.closest("a")||(c.preventDefault(),I())};window.addEventListener("keydown",o);const T=r.current;return T?.addEventListener("touchstart",u,{passive:!1}),()=>{window.removeEventListener("keydown",o),T?.removeEventListener("touchstart",u)}},[I]),f.jsxs(De,{children:[f.jsx(We,{children:e("secret.game.title")}),f.jsx(Fe,{ref:r,width:y,height:E,onClick:I})]})},Ve=m.div`
  position: relative;
  min-height: 100vh;
  background: ${t.colors.neutral.black};
  overflow: hidden;
`,Ke=m.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  background: ${t.colors.gradients.scanline};
  opacity: 0.4;
`,Xe=m(ae)`
  position: fixed;
  top: ${t.spacing.lg};
  left: ${t.spacing.lg};
  font-family: ${t.typography.fonts.pixel};
  font-size: ${t.typography.sizes.sm};
  color: ${t.colors.neutral.silver};
  text-decoration: none;
  z-index: 200;
  transition: color ${t.transitions.fast};
  opacity: 0.7;

  &:hover {
    color: ${t.colors.primary.main};
    opacity: 1;
  }

  &::before {
    content: '< ';
  }
`,Je=()=>{const{t:e}=B("common"),[r,n]=l.useState("password");return f.jsxs(Ve,{children:[f.jsx(Ke,{}),f.jsx(Xe,{to:"/",children:e("secret.back")}),r==="password"&&f.jsx($e,{onSuccess:()=>n("reveal")}),r==="reveal"&&f.jsx(_e,{onComplete:()=>n("game")}),r==="game"&&f.jsx(Ue,{})]})};export{Je as SecretPage,Je as default};
