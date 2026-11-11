import {useStore,mark} from '../store.jsx';

const D=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Planner(){
  const {s,upd,all,get,toast}=useStore();
  const add=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));upd(x=>{x.plan.push({id:Date.now(),day:+d.day,time:d.time,cid:d.cid,done:false})});toast('Session added')};
  const flip=id=>upd(x=>{const p=x.plan.find(q=>q.id===id);p.done=!p.done;if(p.done)mark(x)});
  const del=id=>{upd(x=>{x.plan=x.plan.filter(p=>p.id!==id)});toast('Session deleted')};
  return (
    <>
      <header className="hero"><div><h1>Study planner</h1><p className="mu">{s.plan.filter(x=>x.done).length} of {s.plan.length} sessions done this week</p></div></header>
      <form className="glass form pf" onSubmit={add}>
        <select name="day" aria-label="Day">{D.map((d,i)=><option key={d} value={i}>{d}</option>)}</select>
        <input name="time" type="time" defaultValue="18:00" required aria-label="Time"/>
        <select name="cid" aria-label="Course">{all.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select>
        <button className="btn">Add session</button>
      </form>
      <div className="week">{D.map((d,i)=>{const items=s.plan.filter(x=>x.day===i).sort((a,b)=>a.time.localeCompare(b.time));return (
        <div key={d} className="glass day"><b>{d}</b>
          {items.map(x=>{const c=get(x.cid);return <div key={x.id} className={'sess '+(x.done?'ok':'')}><small>{x.time}</small><b>{c?c.title:'Removed course'}</b><div className="row"><button className="chip" onClick={()=>flip(x.id)}>{x.done?'Undo':'Done'}</button><button className="chip danger" onClick={()=>del(x.id)}>Delete</button></div></div>})}
          {!items.length&&<small className="mu">Free day</small>}
        </div>)})}</div>
    </>
  );
}
