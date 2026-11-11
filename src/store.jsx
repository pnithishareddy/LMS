import {createContext,useContext,useState,useCallback,useEffect,useRef} from 'react';
import {COURSES} from './data.js';

export const L=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
export const W=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const DEF={enrolled:[],done:{},scores:{},days:[],saved:[],notes:{},qa:{},reviews:{},plan:[],xp:0,notif:[],groups:[],toured:0,lang:'en',fs:100,hc:0,log:{},last:null,theme:'dark',user:{name:'Nithisha',email:'user@gmail.com',goal:'Become a full-stack developer'}};

/* ---------- pure helpers ---------- */
export const doneOf=(c,s)=>s.done[c.id]||[];
export const pct=(c,s)=>Math.round(doneOf(c,s).length/c.lessons.length*100);
export const mark=s=>{const d=new Date().toDateString();if(!s.days.includes(d))s.days.push(d);s.log[d]=(s.log[d]||0)+1};
export const streak=s=>{let n=0,d=new Date();while(s.days.includes(d.toDateString())){n++;d.setDate(d.getDate()-1)}return n};
export const nextLesson=(c,s)=>{const i=c.lessons.findIndex((_,i)=>!doneOf(c,s).includes(i));return i<0?0:i};
const LV=[['Beginner',0],['Learner',100],['Scholar',300],['Master',600]];
export const lvl=s=>{let i=0;LV.forEach((l,k)=>{if(s.xp>=l[1])i=k});const n=LV[i+1];return{name:LV[i][0],i,next:n,pct:n?Math.round((s.xp-LV[i][1])/(n[1]-LV[i][1])*100):100}};
export const notify=(s,t)=>{s.notif.unshift([t,Date.now(),0]);s.notif=s.notif.slice(0,20)};
export const addXP=(s,n,t)=>{const a=lvl(s).i;s.xp+=n;notify(s,`+${n} XP · ${t}`);if(lvl(s).i>a)notify(s,`Level up! You are now a ${lvl(s).name}`)};
export const locked=(c,s,get)=>{const p=c.pre&&get(c.pre);return !!p&&pct(p,s)<100};
export const hrs=c=>{const m=c.dur.match(/(\d+)h\s*(\d+)m/);return m?+m[1]+m[2]/60:1};
export const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
export const dl=(name,txt,type='text/plain')=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click()};
export const csv=r=>r.map(x=>x.map(y=>`"${String(y).replace(/"/g,'""')}"`).join(',')).join('\n');
export const confetti=()=>{for(let i=0;i<46;i++){const e=document.createElement('i');e.className='cf';e.style.cssText=`left:${Math.random()*100}vw;background:hsl(${Math.random()*360} 80% 62%);animation-delay:${Math.random()*.7}s`;document.body.append(e);setTimeout(()=>e.remove(),3200)}};

/* ---------- context ---------- */
const Ctx=createContext(null);
export const useStore=()=>useContext(Ctx);

export function StoreProvider({children}){
  const [s,setS]=useState(()=>({...DEF,...L('lms',{})}));
  const [custom,setCustom]=useState(()=>L('lms_custom',[]));
  const [auth,setAuth]=useState(()=>L('lms_auth',0));
  const [msg,setMsg]=useState('');
  const tm=useRef();

  const upd=useCallback(fn=>setS(p=>{const n=structuredClone(p);fn(n);W('lms',n);return n}),[]);
  const toast=useCallback(m=>{setMsg(m);clearTimeout(tm.current);tm.current=setTimeout(()=>setMsg(''),2400)},[]);
  const saveCustom=useCallback(v=>{setCustom(v);W('lms_custom',v)},[]);
  const login=useCallback((name,email)=>{upd(x=>{x.user={...x.user,name:name||x.user.name,email:email||x.user.email}});W('lms_auth',1);setAuth(1)},[upd]);
  const logout=useCallback(()=>{localStorage.removeItem('lms_auth');setAuth(0)},[]);

  useEffect(()=>{const d=document.documentElement;d.dataset.t=s.theme;d.dataset.hc=s.hc;d.style.fontSize=s.fs+'%'},[s.theme,s.hc,s.fs]);

  const allA=[...COURSES,...custom],all=allA.filter(c=>!c.draft),get=id=>allA.find(c=>c.id===id);
  return <Ctx.Provider value={{s,upd,toast,msg,all,allA,get,custom,saveCustom,auth,login,logout}}>{children}</Ctx.Provider>;
}
