import{R as U,r as f,u as F,V as E,j as O,n as R}from"./index-Blc67mG2.js";const D=U[typeof document<"u"&&document.createElement!==void 0?"useLayoutEffect":"useEffect"],k=e=>{const n=f.useRef(e);return f.useEffect(()=>{n.current=e}),n};function q(){}function j(e,n,t={}){const r=K(t.polyfill),o=k(n);return D(()=>{let i=!1;const c=e&&"current"in e?e.current:e;if(!c)return q;function s(a,u){i||o.current(a,u)}return r.subscribe(c,s),()=>{i=!0,r.unsubscribe(c,s)}},[e,r,o]),r.observer}function B(e){let n=!1,t=[];const r=new Map,o=new(e||window.ResizeObserver)((i,c)=>{t=t.concat(i);function s(){const a=new Set;for(let u=0;u<t.length;u++){if(a.has(t[u].target))continue;a.add(t[u].target);const l=r.get(t[u].target);l==null||l.forEach(N=>N(t[u],c))}t=[],n=!1}n||window.requestAnimationFrame(s),n=!0});return{observer:o,subscribe(i,c){var s;o.observe(i);const a=(s=r.get(i))!==null&&s!==void 0?s:[];a.push(c),r.set(i,a)},unsubscribe(i,c){var s;const a=(s=r.get(i))!==null&&s!==void 0?s:[];if(a.length===1){o.unobserve(i),r.delete(i);return}const u=a.indexOf(c);u!==-1&&a.splice(u,1),r.set(i,a)}}}let g;const K=e=>g||(g=B(e)),H=3,W=1.02,Z=6,V=18,$=6,A=.5,Q=1e3,X=1.3,J=300,Y=700,ee=1e3,v=1.15,b=3,te=5,ne=.5,d=e=>Math.PI*e,I=({x:e,y:n},t,r)=>({x:e+t*Math.cos(r),y:n+t*Math.sin(r)}),T=(e,n,t,r)=>{e.bezierCurveTo(n.x,n.y,t.x,t.y,r.x,r.y)},m=(e,n,t)=>t*(n-e)+e,y=e=>e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2,p=e=>{const{width:n,height:t}=e.canvas.getBoundingClientRect();return{x:n/2,y:t/2}},re=(e,n,t,r,o)=>{const i=t*1.3333333333333333*Math.tan(d(.125)),c=p(e),s={x:c.x*(1+n.x),y:c.y*(1+n.y)};e.strokeStyle=o,e.beginPath();const a=r.angle+d(1/2),u=r.angle+d(3/2);e.arc(s.x,s.y,t,a,u,!1);const l=I(s,t,u),N=t*r.depth*X,S=I(s,t-N,m(r.angle,d(3)-r.angle,r.depth)),_=I(s,t,a),h={cp1:I(l,i,u+d(1/2)),cp2:I(S,i,r.angle+d(3/2))},M={cp1:I(S,i,r.angle+d(1/2)),cp2:I(_,i,a+d(3/2))};T(e,h.cp1,h.cp2,S),T(e,M.cp1,M.cp2,_),e.stroke()},ce=(e,n,t,r)=>{const o=p(e),i=o.x*(1-Math.cos(t)+n.x),c=o.y*(1-Math.sin(t)+n.y),s=o.x*(1+Math.cos(t)+n.x),a=o.y*(1+Math.sin(t)+n.y),u=e.createLinearGradient(i,c,s,a);return r.forEach(({pct:l,color:N})=>{u.addColorStop(l,N)}),u},w=[{segments:[{pct:.42,color:"transparent"},{pct:.61,color:"#f185becc"}],startAngle:3.52,speedMultiplier:1.21,centerOffset:{x:.01,y:-.01},radiusOffset:.02,width:3.38},{segments:[{pct:.28,color:"#13ef93cc"},{pct:.62,color:"#f185becc"}],startAngle:1.59,speedMultiplier:.64,centerOffset:{x:-.03,y:-.01},radiusOffset:.05,width:2.39},{segments:[{pct:.31,color:"#027a48cc"},{pct:.66,color:"#3a00d3cc"}],startAngle:2.86,speedMultiplier:.94,centerOffset:{x:.02,y:.02},radiusOffset:-.06,width:2.64},{segments:[{pct:.16,color:"#3a00d3cc"},{pct:.62,color:"#027a48cc"},{pct:.75,color:"#ba80f5cc"}],startAngle:.65,speedMultiplier:1.23,centerOffset:{x:.01,y:0},radiusOffset:-.01,width:2.32},{segments:[{pct:.02,color:"#13ef93cc"},{pct:.8,color:"#149afbcc"}],startAngle:6.19,speedMultiplier:1.18,centerOffset:{x:-.04,y:.02},radiusOffset:.01,width:3.98},{segments:[{pct:.2,color:"transparent"},{pct:.47,color:"transparent"},{pct:.81,color:"#b8f8d2cc"}],startAngle:.49,speedMultiplier:.51,centerOffset:{x:.04,y:-.01},radiusOffset:-.04,width:1.19}],L=w.length,se=e=>1+(W-1)*Math.sin(e.current.time*d(1)/H/1e3)*m(1,0,e.current.deflation)*m(1,.33,e.current.focus),C=(e,n)=>{const t=e.slice(n,n+b);return t.reduce((r,o)=>r+o)/t.length},oe=(e,n)=>m(1,v,C(e.current.agentNoise,n)),ie=(e,n)=>m(1,1/v,C(e.current.userNoise,n)),P=(e,n,t,r)=>{n.current.time+=(r-t)*m(1,te,n.current.focus)*m(1,A,n.current.deflation),e.clearRect(0,0,e.canvas.width,e.canvas.height),e.filter="saturate(150%)";const o=p(e),i=Math.min(o.x,o.y);w.forEach((c,s)=>{e.lineWidth=c.width,e.shadowColor=c.segments[0].color,e.shadowBlur=c.width*1.1;const a=i*.8*oe(n,s)*ie(n,s)*se(n),u=ce(e,c.centerOffset,c.startAngle+n.current.time*d(1)/1e3/Z*c.speedMultiplier,c.segments);re(e,c.centerOffset,(a+c.radiusOffset*a)*m(1,ne,y(n.current.focus)),{depth:y(n.current.deflation),angle:d(3/2)+d(Math.sin(n.current.time*d(1)/($*A)/1e3)/V)},u)}),requestAnimationFrame(c=>{P(e,n,r,c)})},x=e=>{switch(e){case E.LISTENING:return 0;case E.THINKING:return 0;case E.NONE:case E.SLEEPING:return 1;case E.SPEAKING:return 0;default:return 0}},z=e=>{switch(e){case E.LISTENING:return 0;case E.THINKING:return 1;case E.SLEEPING:return 0;case E.SPEAKING:return 0;default:return 0}},G=(e,n,t,r,o=r)=>{if(t.current.generation>e)return;const i=x(n);if(i<t.current.deflation){const s=(o-r)/J;t.current.deflation=Math.max(i,t.current.deflation-s)}else{const s=(o-r)/Q;t.current.deflation=Math.min(i,t.current.deflation+s)}const c=z(n);if(c<t.current.focus){const s=(o-r)/ee;t.current.focus=Math.max(c,t.current.focus-s)}else{const s=(o-r)/Y;t.current.focus=Math.min(c,t.current.focus+s)}(t.current.deflation!==i||t.current.focus!==c)&&requestAnimationFrame(s=>{G(e,n,t,o,s)})},ue=({width:e=0,height:n=0,agentVolume:t=0,userVolume:r=0})=>{const{status:o}=F(),i=f.useRef(null),c=f.useRef({generation:0,time:0,deflation:x(o),focus:z(o),agentNoise:Array(L+b).fill(t),userNoise:Array(L+b).fill(o===E.SLEEPING?0:r)});return f.useEffect(()=>{if(i.current){const s=i.current.getContext("2d");if(s){const a=performance.now();requestAnimationFrame(u=>{P(s,c,a,u)})}}},[]),f.useEffect(()=>{c.current.generation+=1,requestAnimationFrame(s=>{G(c.current.generation,o,c,s)})},[o]),f.useEffect(()=>{c.current.agentNoise.shift(),c.current.agentNoise.push(t)},[t]),f.useEffect(()=>{o!==E.SLEEPING&&(c.current.userNoise.shift(),c.current.userNoise.push(r))},[r,o]),O.jsx("canvas",{ref:i,width:e,height:n})},ae=e=>{const[n,t]=f.useState(new DOMRect);return f.useLayoutEffect(()=>{e!=null&&e.current&&t(e.current.getBoundingClientRect())},[e]),j(e,r=>t(r.contentRect)),n},le=({agentVoiceAnalyser:e,userVoiceAnalyser:n,onOrbClick:t})=>{const r=f.useRef(null),o=ae(r),[i,c]=f.useState(0),[s,a]=f.useState(0);return f.useEffect(()=>{if(!e)return;const u=new Uint8Array(e.frequencyBinCount),l=()=>{c(R(e,u,48)),requestAnimationFrame(l)};l()},[e]),f.useEffect(()=>{if(!n)return;const u=new Uint8Array(n.frequencyBinCount),l=()=>{a(R(n,u,48)),requestAnimationFrame(l)};l()},[n]),O.jsx("div",{className:"flex items-center justify-center",children:O.jsx("button",{ref:r,onClick:t,className:"orb-animation",children:r.current&&O.jsx(ue,{width:o.width,height:o.height,agentVolume:i,userVolume:s})})})};export{le as default};
