import {useEffect,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {useStore,lvl} from './store.jsx';

import {Modal, Logo} from './components.jsx';
const NAV=[['/','Dashboard','◈','डैशबोर्ड',['/']],['/catalogue','Catalogue','✦','कैटलॉग',['/catalogue','/course','/instructor','/recommend','/flashcards']],['/paths','Paths','⇢','सीखने के पथ',['/paths']],['/my-courses','My Courses','▣','मेरे कोर्स',['/my-courses','/lesson','/quiz']],['/saved','Saved','♥','सेव किए',['/saved']],['/planner','Planner','◷','योजना',['/planner']],['/notes','Notes','✎','नोट्स',['/notes']],['/groups','Groups','☻','समूह',['/groups']],['/leaderboard','Leaderboard','♛','लीडरबोर्ड',['/leaderboard']],['/certificates','Certificates','✪','प्रमाणपत्र',['/certificates']],['/profile','Profile','◉','प्रोफ़ाइल',['/profile']],['/settings','Settings','☰','सेटिंग्स',['/settings']],['/admin','Admin','⚙','एडमिन',['/admin']]];

function Search({close}){
  const {all,upd,logout}=useStore();const nav=useNavigate();const [t,setT]=useState('');const k=t.toLowerCase().trim();
  const AC=[['Toggle theme','◑',()=>upd(x=>{x.theme=x.theme==='dark'?'light':'dark'})],['Log out','⎋',logout],['Take the course recommender quiz','✦',()=>nav('/recommend')]];
  const cs=k?all.filter(c=>(c.title+c.inst+c.cat+c.lessons.map(l=>l[0]).join()).toLowerCase().includes(k)).slice(0,5):[];
  const pg=k?NAV.filter(n=>n[1].toLowerCase().includes(k)).slice(0,4):[];
  const ac=k?AC.filter(a=>a[0].toLowerCase().includes(k)):[];
  return (
    <Modal close={close}>
      <input autoFocus value={t} onChange={e=>setT(e.target.value)} placeholder="Search courses, pages or actions" aria-label="Quick search"/>
      <Link className="brand" to="/"><Logo /></Link>
      <div className="list">
        {cs.map(c=><Link key={c.id} className="les" to={`/course/${c.id}`} onClick={close}><i>{c.emoji}</i><div><b>{c.title}</b><small className="mu">{c.inst}</small></div></Link>)}
        {pg.map(n=><Link key={n[0]} className="les" to={n[0]} onClick={close}><i>{n[2]}</i><div><b>Go to {n[1]}</b></div></Link>)}
        {ac.map(a=><button key={a[0]} className="les" onClick={()=>{close();a[2]()}}><i>{a[1]}</i><div><b>{a[0]}</b></div></button>)}
        {!cs.length&&!pg.length&&!ac.length&&<p className="mu">{k?'No matches. Try a different keyword.':'Type to search courses, pages and actions.'}</p>}
      </div>
    </Modal>
  );
}

function Bell({close}){
  const {s,upd}=useStore();
  useEffect(()=>{upd(x=>x.notif.forEach(n=>{n[2]=1}))},[upd]);
  return (
    <Modal close={close}><h2>Notifications</h2>
      <div className="list">{s.notif.length?s.notif.map((n,i)=><div key={i} className="les"><i>•</i><div><b>{n[0]}</b><small className="mu">{new Date(n[1]).toLocaleString()}</small></div></div>):<p className="mu">You are all caught up. Complete a lesson to earn your first XP.</p>}</div>
      <button className="btn ghost" onClick={close}>Close</button>
    </Modal>
  );
}

function Tour(){
  const {upd}=useStore();const [i,setI]=useState(0);
  const S=[['Welcome to Gyaan','The sidebar holds everything: courses, learning paths, planner, notes and certificates.'],['Press / to search','Jump to any course or page, or run actions such as toggling the theme.'],['Earn XP and keep your streak','Finish lessons and quizzes to level up, and learn a little every day to keep your streak alive.']];
  const end=()=>upd(x=>{x.toured=1});
  return (
    <Modal close={end}><div className="tour"><small className="mu">Step {i+1} of {S.length}</small><h2>{S[i][0]}</h2><p>{S[i][1]}</p>
      <div className="nav3"><button className="btn ghost" onClick={end}>Skip</button><button className="btn" onClick={()=>i<S.length-1?setI(i+1):end()}>{i<S.length-1?'Next':'Start learning'}</button></div></div></Modal>
  );
}

export default function Shell({children}){
  const {s,upd,msg,get,logout}=useStore();const [m,setM]=useState(null);const loc=useLocation();
  const lv=lvl(s),un=s.notif.filter(n=>!n[2]).length,hi=s.lang==='hi',lc=s.last&&get(s.last[0]);
  useEffect(()=>{
    const k=e=>{if(e.key==='Escape')setM(null);if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();setM('search')}};
    const mv=e=>{const c=e.target.closest&&e.target.closest('.card,.tile');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}};
    window.addEventListener('keydown',k);window.addEventListener('mousemove',mv);
    return()=>{window.removeEventListener('keydown',k);window.removeEventListener('mousemove',mv)};
  },[]);
  useEffect(()=>{window.scrollTo(0,0)},[loc.pathname]);
  const on=n=>n[4].some(p=>p==='/'?loc.pathname==='/':loc.pathname.startsWith(p));
  return (
    <>
      <div className="blob b1"/><div className="blob b2"/>
      <div className="shell">
        <aside className="side">
        <div className="brand"><Logo /></div>
          <div className="xp"><small>{lv.name} · {s.xp} XP</small><div className="bar"><i style={{width:lv.pct+'%'}}/></div></div>
          <nav>{NAV.map(n=><Link key={n[0]} to={n[0]} className={on(n)?'on':''}><i>{n[2]}</i><span>{hi?n[3]:n[1]}</span></Link>)}</nav>
          {lc&&lc.lessons[s.last[1]]&&<Link className="resume" to={`/lesson/${lc.id}/${s.last[1]}`}>▶ Resume: {lc.lessons[s.last[1]][0]}</Link>}
          <div className="tools2">
            <button className="ghost" title="Search ( / )" aria-label="Search" onClick={()=>setM('search')}>⌕</button>
            <button className="ghost" title="Notifications" aria-label="Notifications" onClick={()=>setM('bell')}>🔔{un>0&&<b className="dot">{un}</b>}</button>
            <button className="ghost" title="Toggle theme" aria-label="Toggle theme" onClick={()=>upd(x=>{x.theme=x.theme==='dark'?'light':'dark'})}>◑</button>
            <button id="lo" className="ghost" title="Log out" aria-label="Log out" onClick={logout}>⎋</button>
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
      {m==='search'&&<Search close={()=>setM(null)}/>}
      {m==='bell'&&<Bell close={()=>setM(null)}/>}
      {!s.toured&&loc.pathname==='/'&&<Tour/>}
      {msg&&<div className="toast">{msg}</div>}
    </>
  );
}
