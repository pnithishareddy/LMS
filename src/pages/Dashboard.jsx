import {Link} from 'react-router-dom';
import {useStore,pct,lvl,streak,nextLesson,locked} from '../store.jsx';
import {Card,Ring,Num,Cal} from '../components.jsx';

const D=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Dashboard(){
  const {s,all,get}=useStore();
  const en=all.filter(c=>s.enrolled.includes(c.id)),ld=Object.values(s.done).flat().length,sc=Object.values(s.scores);
  const avg=sc.length?Math.round(sc.reduce((a,b)=>a+b)/sc.length):0,cur=en.find(c=>pct(c,s)<100);
  const rec=all.filter(c=>!s.enrolled.includes(c.id)&&!locked(c,s,get)).slice(0,3),lv=lvl(s);
  const today=s.log[new Date().toDateString()]||0,dc=all[Math.floor(Date.now()/864e5)%all.length];
  const up=s.plan.filter(x=>!x.done).sort((a,b)=>a.day-b.day||a.time.localeCompare(b.time)).slice(0,3);
  return (
    <>
      <header className="hero"><div><h1>{s.lang==='hi'?'नमस्ते,':'Good to see you,'} <span className="grad">{s.user.name.split(' ')[0]}</span></h1><p className="mu">{s.user.goal}</p></div><Link className="btn" to="/catalogue">Find a course</Link></header>
      <section className="bento">
        <div className="tile big" style={cur?{'--h':cur.hue}:undefined}>
          {cur?<><div className="orb"><Ring p={pct(cur,s)} z={120}/></div><div><p className="mu">Pick up where you left off</p><h2>{cur.title}</h2><p className="mu">Next: {cur.lessons[nextLesson(cur,s)][0]}</p><Link className="btn" to={`/lesson/${cur.id}/${nextLesson(cur,s)}`}>Resume lesson</Link></div></>
          :<div><h2>Nothing in progress yet</h2><p className="mu">Enrol in a course and your next lesson shows up here.</p><Link className="btn" to="/catalogue">Browse courses</Link></div>}
        </div>
        <div className="tile"><b className="num"><Num n={en.length}/></b><span className="mu">Courses enrolled</span></div>
        <div className="tile"><b className="num"><Num n={ld}/></b><span className="mu">Lessons completed</span></div>
        <div className="tile"><b className="num"><Num n={avg} suffix="%"/></b><span className="mu">Average quiz score</span></div>
        <div className="tile hot"><b className="num">🔥 <Num n={streak(s)}/></b><span className="mu">Day streak</span></div>
      </section>
      <section className="bento">
        <div className="tile goal"><Ring p={Math.min(100,Math.round(today/2*100))} z={76}/><span className="mu">Daily goal: {Math.min(today,2)} of 2 lessons</span></div>
        <div className="tile"><b className="num">{lv.name}</b><span className="mu">{s.xp} XP{lv.next?` · ${lv.next[1]-s.xp} to ${lv.next[0]}`:' · top level'}</span><div className="bar"><i style={{width:lv.pct+'%'}}/></div></div>
        <div className="tile span2"><span className="mu">Your last 4 weeks</span><Cal s={s}/></div>
      </section>
      <div className="cols dash">
        <section>
          {dc&&<Link className="glass chal" to={`/quiz/${dc.id}?bonus=1`} style={{'--h':dc.hue}}><span className="em">{dc.emoji}</span><div><span className="pill hl">Double XP today</span><h3>Daily challenge: {dc.title}</h3><p className="mu">Take the quiz now and earn twice the XP.</p></div></Link>}
          <Link className="glass chal" to="/recommend"><span className="em">🧭</span><div><h3>Not sure where to start?</h3><p className="mu">Answer three questions and get a learning path made for you.</p></div></Link>
        </section>
        <aside className="glass"><h3>Upcoming study sessions</h3>
          <div className="list">{up.length?up.map(x=>{const c=get(x.cid);return <Link key={x.id} className="les" to="/planner"><i>{D[x.day][0]}</i><div><b>{c?c.title:'Removed course'}</b><small className="mu">{D[x.day]} at {x.time}</small></div></Link>}):<p className="mu">No sessions planned. Add one in the planner.</p>}</div>
        </aside>
      </div>
      <div className="sec"><h2>Your courses</h2><Link to="/my-courses">See all</Link></div>
      <div className="grid">{en.length?en.slice(0,3).map(c=><Card key={c.id} c={c}/>):<div className="empty"><p className="mu">You haven't enrolled in anything yet. Start with one of the picks below.</p></div>}</div>
      <div className="sec"><h2>Picked for you</h2><Link to="/catalogue">Full catalogue</Link></div>
      <div className="grid">{rec.map(c=><Card key={c.id} c={c}/>)}</div>
    </>
  );
}
