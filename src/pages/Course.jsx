import {Link,useParams} from 'react-router-dom';
import {useStore,pct,nextLesson,locked,notify,stars} from '../store.jsx';
import {Ring,LessonRow,NF} from '../components.jsx';
import {ANN} from '../data.js';

const SEED=[['Rohan','Great pacing, loved the project.',5],['Meera','Clear explanations, a bit fast in places.',4]];
const SQ=[['Kabir','Is the quiz open-book?'],['Instructor','Yes. Use your notes to practise.']];

export default function Course(){
  const {id}=useParams();const {s,upd,toast,get}=useStore();const c=get(id);
  if(!c)return <NF text="We couldn't find that course"/>;
  const en=s.enrolled.includes(c.id),p=pct(c,s),pre=c.pre&&get(c.pre),lock=!en&&locked(c,s,get);
  const r=s.reviews[c.id],qa=[...SQ,...(s.qa[c.id]||[])],first=s.user.name.split(' ')[0],ifirst=c.inst.split(' ').slice(-2)[0];
  const toggle=()=>{upd(x=>{if(en)x.enrolled=x.enrolled.filter(i=>i!==c.id);else{x.enrolled.push(c.id);notify(x,'Enrolled in '+c.title)}});toast(en?'Unenrolled':"You're enrolled. Let's go!")};
  const review=e=>{e.preventDefault();const d=new FormData(e.target);upd(x=>{x.reviews[c.id]={r:+d.get('r'),txt:d.get('txt')}});toast('Review posted');e.target.reset()};
  const ask=e=>{e.preventDefault();const t=new FormData(e.target).get('t');upd(x=>{x.qa[c.id]=[...(x.qa[c.id]||[]),[first,t]]});toast('Question posted');e.target.reset()};
  return (
    <>
      <section className="chero" style={{'--h':c.hue}}>
        <div className="em xl">{c.emoji}</div>
        <div><span className="pill">{c.lvl}</span><h1>{c.title}</h1><p>{c.desc}</p><p className="mu">★ {c.rating} · {c.dur} · {c.lessons.length} lessons</p>
          {lock&&<p className="lockmsg">🔒 Finish <Link to={`/course/${c.pre}`}><u>{pre.title}</u></Link> first to unlock this course.</p>}
          <div className="row"><button className="btn" disabled={lock} onClick={toggle}>{en?'Unenrol':lock?'Locked':'Enrol for free'}</button>
            {en&&<Link className="btn ghost" to={`/lesson/${c.id}/${nextLesson(c,s)}`}>{p?'Continue':'Start learning'}</Link>}</div></div>
        {en&&<div className="orb"><Ring p={p} z={110}/></div>}
      </section>
      {ANN[c.id]&&<div className="callout ann"><b>Announcement from {ifirst}</b><p>{ANN[c.id]}</p></div>}
      <div className="cols">
        <section><h2>Lessons</h2><div className="list">{c.lessons.map((_,i)=><LessonRow key={i} c={c} i={i}/>)}</div>
          <div className="row"><Link className="btn ghost" to={`/flashcards/${c.id}`}>Study flashcards</Link><Link className="btn ghost" to={`/quiz/${c.id}`}>Take the final quiz{s.scores[c.id]!=null?` · best ${s.scores[c.id]}%`:''}</Link></div></section>
        <aside className="glass inst"><div className="av">{c.inst.split(' ').pop()[0]}</div><h3><Link to={`/instructor/${encodeURIComponent(c.inst)}`}>{c.inst}</Link></h3><p className="mu">{c.role}</p><p>Teaches with real projects and honest feedback on what works in practice.</p></aside>
      </div>
      <div className="cols soc">
        <section><h2>Reviews</h2>
          <div className="list">{[...(r?[[first+' (you)',r.txt,r.r]]:[]),...SEED].map((x,i)=><div key={i} className="les"><i>{x[0][0]}</i><div><b className="star">{stars(x[2])}</b><small>{x[0]}: {x[1]}</small></div></div>)}</div>
          <form className="glass form" onSubmit={review}><h3>{r?'Update your review':'Rate this course'}</h3>
            <select name="r" aria-label="Rating">{[5,4,3,2,1].map(n=><option key={n} value={n}>{stars(n)}</option>)}</select>
            <input name="txt" placeholder="What did you think?" required/><button className="btn">Submit review</button></form></section>
        <section><h2>Discussion</h2>
          <div className="list">{qa.map((x,i)=><div key={i} className="les"><i>{x[0][0]}</i><div><b>{x[0]}</b><small>{x[1]}</small></div></div>)}</div>
          <form className="glass form" onSubmit={ask}><input name="t" placeholder="Ask a question" required aria-label="Question"/><button className="btn">Post question</button></form></section>
      </div>
    </>
  );
}
