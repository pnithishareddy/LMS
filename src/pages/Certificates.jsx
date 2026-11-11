import {Link,useParams} from 'react-router-dom';
import {useStore,pct} from '../store.jsx';
import {Logo} from '../components.jsx';
export default function Certificates(){
  const {id}=useParams();const {s,all,get}=useStore();
  const done=all.filter(c=>pct(c,s)===100&&(s.scores[c.id]||0)>=70),c=id&&get(id);
  if(c){
    if(!done.includes(c))return <div className="empty"><h2>Certificate not unlocked yet</h2><p className="mu">Complete every lesson and score 70% or more on the quiz.</p><Link className="btn" to={`/course/${c.id}`}>Go to course</Link></div>;
    return (
      <>
        <div className="cert" style={{'--h':c.hue}}>
          <div className="brand"><Logo /></div>
        
          <p>This certifies that</p><h1>{s.user.name}</h1><p>has successfully completed</p><h2>{c.title}</h2>
          <p>with a final quiz score of {s.scores[c.id]}%</p>
          <div className="sig"><span>{new Date().toLocaleDateString(undefined,{dateStyle:'long'})}<br/><small>Date</small></span><span>{c.inst}<br/><small>Instructor</small></span></div>
        </div>
        <div className="nav3 noprint"><Link className="btn ghost" to="/certificates">All certificates</Link><button className="btn" onClick={()=>window.print()}>Print or save as PDF</button></div>
      </>
    );
  }
  return (
    <>
      <header className="hero"><div><h1>Certificates</h1><p className="mu">{done.length} earned. Finish all lessons and pass the quiz to unlock one.</p></div></header>
      <div className="grid">{all.map(c=>{const ok=done.includes(c);return (
        <div key={c.id} className={'card '+(ok?'':'lock')} style={{'--h':c.hue}}>
          <div className="art"><span className="em">{ok?'🎓':'🔒'}</span></div>
          <div className="cb"><h3>{c.title}</h3>
            <p className="mu">{ok?'Ready to download':`${pct(c,s)}% done · best quiz ${s.scores[c.id]!=null?s.scores[c.id]+'%':'none yet'}`}</p>
            {ok?<Link className="btn" to={`/certificates/${c.id}`}>View certificate</Link>:<Link className="btn ghost" to={`/course/${c.id}`}>Continue course</Link>}</div>
        </div>)})}</div>
    </>
  );
}
