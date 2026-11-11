import {useStore,streak} from '../store.jsx';
import {Week,Cal} from '../components.jsx';

export default function Profile(){
  const {s,upd,toast,get,logout}=useStore();const u=s.user;
  const ld=Object.values(s.done).flat().length,sc=Object.values(s.scores);
  const B=[['🌱','First step','Complete a lesson',ld>=1],['📚','Page turner','Complete 5 lessons',ld>=5],['🎯','Quiz passer','Score 70% or more',sc.some(x=>x>=70)],['💯','Perfect score','Score 100%',sc.includes(100)],['🔥','On fire','3-day streak',streak(s)>=3]];
  const save=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));upd(x=>{x.user=d});toast('Profile saved')};
  const reset=()=>{if(confirm('Clear enrolments, progress and scores?')){upd(x=>{x.enrolled=[];x.done={};x.scores={};x.days=[];x.log={}});toast('Progress reset')}};
  return (
    <>
      <header className="hero"><div className="row"><div className="av lg">{u.name[0]||'A'}</div><div><h1>{u.name}</h1><p className="mu">{u.email}</p></div></div></header>
      <div className="cols">
        <form className="glass form" onSubmit={save} key={u.name+u.email}><h2>Edit profile</h2>
          <label>Full name<input name="name" defaultValue={u.name} required/></label>
          <label>Email<input name="email" type="email" defaultValue={u.email} required/></label>
          <label>Learning goal<input name="goal" defaultValue={u.goal}/></label><button className="btn">Save changes</button></form>
        <div>
          <div className="bento two"><div className="tile"><b className="num">{s.enrolled.length}</b><span className="mu">Enrolled</span></div><div className="tile"><b className="num">{ld}</b><span className="mu">Lessons</span></div><div className="tile"><b className="num">{sc.length}</b><span className="mu">Quizzes taken</span></div><div className="tile hot"><b className="num">{streak(s)}</b><span className="mu">Day streak</span></div></div>
          <h2>This week</h2><Week s={s}/>
          <h2>Quiz scores</h2><div className="glass an">{Object.entries(s.scores).map(([id,p])=>{const c=get(id);return c&&<div key={id} className="rowb"><span>{c.title}</span><div className="bar"><i style={{width:p+'%'}}/></div><b>{p}%</b></div>})}{!sc.length&&<p className="mu">Take a quiz to see your scores here.</p>}</div>
          <h2>Last 4 weeks</h2><Cal s={s}/>
          <h2>Badges</h2><div className="badges">{B.map(b=><div key={b[1]} className={'badge '+(b[3]?'':'lock')}><span>{b[0]}</span><b>{b[1]}</b><small className="mu">{b[2]}</small></div>)}</div>
          <div className="row"><button className="btn ghost danger" onClick={reset}>Reset my progress</button><button className="btn ghost" onClick={logout}>Log out</button></div>
        </div>
      </div>
    </>
  );
}
