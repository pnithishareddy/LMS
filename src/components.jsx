import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {useStore,doneOf,pct} from './store.jsx';

export const Ring=({p,z=72})=>(
  <svg className="ring" width={z} height={z} viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="15.9" className="rb"/>
    <circle cx="18" cy="18" r="15.9" className="rf" strokeDasharray={`${p} 100`}/>
    <text x="18" y="20.6" textAnchor="middle">{p}%</text>
  </svg>
);

export const Bar=({p})=>(<><div className="bar"><i style={{width:p+'%'}}/></div><small className="mu">{p}% complete</small></>);

export function Card({c,children}){
  const {s,upd,toast}=useStore();
  const en=s.enrolled.includes(c.id),sv=s.saved.includes(c.id);
  const save=e=>{e.preventDefault();upd(x=>{x.saved=sv?x.saved.filter(i=>i!==c.id):[...x.saved,c.id]});toast(sv?'Removed from saved':'Saved for later')};
  return (
    <Link className="card" to={`/course/${c.id}`} style={{'--h':c.hue}}>
      <div className="art">
        <span className="em">{c.emoji}</span><span className="tag">{c.cat}</span>
        {en&&<span className="tag on">Enrolled</span>}
        <button className={'bm '+(sv?'on':'')} aria-label="Save course" onClick={save}>♥</button>
        {children}
      </div>
      <div className="cb">
        <h3>{c.title}</h3><p className="mu">{c.inst}</p>
        <div className="row"><span className="star">★ {c.rating}</span><span className="mu">{c.dur}</span><span className="pill">{c.lvl}</span></div>
        {en&&<Bar p={pct(c,s)}/>}
      </div>
    </Link>
  );
}

export function LessonRow({c,i,cur}){
  const {s}=useStore();const d=doneOf(c,s).includes(i);
  return (
    <Link className={`les ${cur?'cur':''} ${d?'ok':''}`} to={`/lesson/${c.id}/${i}`}>
      <i>{d?'✓':i+1}</i><div><b>{c.lessons[i][0]}</b><small className="mu">{c.lessons[i][1]} min</small></div>
    </Link>
  );
}

export function Num({n,suffix=''}){
  const [v,setV]=useState(0);
  useEffect(()=>{let k=0;const t=setInterval(()=>{k+=Math.max(1,Math.ceil(n/12));if(k>=n){k=n;clearInterval(t)}setV(k)},25);return()=>clearInterval(t)},[n]);
  return <>{v}{suffix}</>;
}

export function Cal({s}){
  const cells=[];
  for(let i=27;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);cells.push(<i key={i} className={'cd '+(s.days.includes(d.toDateString())?'on':'')} title={d.toDateString()}/>)}
  return <div className="cal">{cells}</div>;
}

export function Week({s}){
  const a=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);a.push([d.toLocaleDateString(undefined,{weekday:'short'}),s.log[d.toDateString()]||0])}
  const mx=Math.max(1,...a.map(x=>x[1]));
  return <div className="wk">{a.map(x=><div key={x[0]} title={x[1]+' activities'}><i style={{height:x[1]/mx*100+'%'}}/><small className="mu">{x[0]}</small></div>)}</div>;
}

export const Modal=({close,wide,children})=>(
  <div id="ov" onClick={e=>e.target===e.currentTarget&&close()}><div className={'glass '+(wide?'wide':'')}>{children}</div></div>
);

export const NF=({text="We couldn't find that"})=>(
  <div className="empty"><h2>{text}</h2><p className="mu">It may have been removed.</p><Link className="btn" to="/catalogue">Browse the catalogue</Link></div>
);
