import {Link} from 'react-router-dom';
import {useStore,pct,notify} from '../store.jsx';
import {Bar} from '../components.jsx';
import {PATHS} from '../data.js';

export default function Paths(){
  const {s,upd,get,toast}=useStore();
  const enrolAll=p=>{upd(x=>{p.c.forEach(id=>{if(!x.enrolled.includes(id))x.enrolled.push(id)});notify(x,'Enrolled in path: '+p.t)});toast('Enrolled in '+p.t)};
  return (
    <>
      <header className="hero"><div><h1>Learning paths</h1><p className="mu">Courses grouped in the best order, with one progress bar for the whole journey</p></div><Link className="btn ghost" to="/recommend">Find my path</Link></header>
      {PATHS.map(p=>{const cs=p.c.map(get).filter(Boolean),pc=Math.round(cs.reduce((a,c)=>a+pct(c,s),0)/cs.length),ok=cs.every(c=>s.enrolled.includes(c.id));return (
        <section key={p.id} className="glass path">
          <div className="row"><span className="em">{p.e}</span><div><h2>{p.t}</h2><p className="mu">{p.d}</p></div><button className={'btn '+(ok?'ghost':'')} disabled={ok} onClick={()=>enrolAll(p)}>{ok?'Enrolled in all':'Enrol in all'}</button></div>
          <Bar p={pc}/>
          <div className="steps">{cs.map((c,i)=><Link key={c.id} className={'les '+(pct(c,s)===100?'ok':'')} to={`/course/${c.id}`}><i>{pct(c,s)===100?'✓':i+1}</i><div><b>{c.title}</b><small className="mu">{c.lvl} · {c.dur} · {pct(c,s)}% done</small></div></Link>)}</div>
        </section>)})}
    </>
  );
}
