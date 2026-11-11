import {Link} from 'react-router-dom';
import {useStore} from '../store.jsx';

export default function Notes(){
  const {s,get}=useStore();
  const r=Object.entries(s.notes).filter(x=>x[1].trim()).map(([k,t])=>{const [id,i]=k.split(':'),c=get(id);return c&&c.lessons[+i]?{c,i:+i,t}:null}).filter(Boolean);
  return (
    <>
      <header className="hero"><div><h1>My notes</h1><p className="mu">{r.length} notes across your lessons</p></div>{r.length>0&&<button className="btn noprint" onClick={()=>window.print()}>Print notes</button>}</header>
      <div className="list">{r.length?r.map(x=><Link key={x.c.id+x.i} className="les note" to={`/lesson/${x.c.id}/${x.i}`}><i>{x.c.emoji}</i><div><b>{x.c.title} · {x.c.lessons[x.i][0]}</b><small>{x.t}</small></div></Link>)
        :<div className="empty"><h3>No notes yet</h3><p className="mu">Write notes under any lesson and they collect here.</p><Link className="btn" to="/my-courses">Open a lesson</Link></div>}</div>
    </>
  );
}
