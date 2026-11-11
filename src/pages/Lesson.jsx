import {useEffect} from 'react';
import {Link,useParams} from 'react-router-dom';
import {useStore,pct,doneOf,locked,notify,addXP,mark,confetti,dl} from '../store.jsx';
import {Ring,LessonRow,NF} from '../components.jsx';

export default function Lesson(){
  const {id,n}=useParams();const {s,upd,toast,get}=useStore();const c=get(id);
  const i=c?Math.min(Math.max(+n||0,0),c.lessons.length-1):0,en=c&&s.enrolled.includes(c.id);
  const done=c&&doneOf(c,s).includes(i);
  const complete=()=>{
    upd(x=>{const a=new Set(doneOf(c,x)),was=a.has(i);was?a.delete(i):a.add(i);x.done[c.id]=[...a];
      if(!was){mark(x);addXP(x,10,'Lesson completed');if(a.size===c.lessons.length)notify(x,`${c.title} complete. Pass the quiz to unlock your certificate`)}});
    if(!done){toast('Lesson completed +10 XP');if(doneOf(c,s).length+1===c.lessons.length)confetti()}else toast('Marked as not done');
  };
  useEffect(()=>{if(c&&en)upd(x=>{x.last=[c.id,i]})},[id,n,en]);   // eslint-disable-line
  useEffect(()=>{
    if(!c)return;
    const k=e=>{if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||e.metaKey||e.ctrlKey)return;
      if(e.key==='n'&&i<c.lessons.length-1)window.location.assign(`/lesson/${c.id}/${i+1}`);
      if(e.key==='p'&&i>0)window.location.assign(`/lesson/${c.id}/${i-1}`);
      if(e.key==='m')complete()};
    window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);
  });
  if(!c)return <NF text="We couldn't find that lesson"/>;
  const pre=c.pre&&get(c.pre);
  if(!en){const lk=locked(c,s,get);return (
    <div className="empty"><h2>{lk?'This course is locked':'Enrol to open this lesson'}</h2><p className="mu">{lk?`Finish ${pre.title} first.`:`${c.title} is free to join.`}</p>
      {lk?<Link className="btn" to={`/course/${pre.id}`}>Go to {pre.title}</Link>:<button className="btn" onClick={()=>{upd(x=>{x.enrolled.push(c.id);notify(x,'Enrolled in '+c.title)})}}>Enrol now</button>}</div>
  )}
  const [t,m]=c.lessons[i],last=i===c.lessons.length-1,key=c.id+':'+i;
  const code=`// ${t}\nconst topic = "${t.replace(/["\\]/g,'')}";\nconsole.log("Practising:", topic);`;
  return (
    <>
      <div className="crumbs"><Link to={`/course/${c.id}`}>{c.title}</Link> / Lesson {i+1}</div>
      <div className="cols lv">
        <article>
          {c.yt?<iframe className="vid" src={`https://www.youtube-nocookie.com/embed/${c.yt}`} title={t} allowFullScreen/>
          :<div className="vid" style={{'--h':c.hue}}><button aria-label="Play">▶</button><span>{t} · {m} min</span></div>}
          <h1>{t}</h1>
          <p>In <b>{c.title}</b> we unpack <b>{t}</b>: what it is, why it matters, and how {c.inst.split(' ').slice(-2)[0]} uses it on real projects.</p>
          <div className="callout"><b>Key idea</b><p>Learn the basics of {t.toLowerCase()} first. Speed and style come from practice.</p></div>
          <h3>Try it yourself</h3>
          <pre className="code"><code>{code}</code><button className="cp" onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(code);toast('Code copied')}}>Copy</button></pre>
          <h3>You'll practise</h3><ul><li>Break {t.toLowerCase()} into small, testable steps</li><li>Apply it in a short challenge</li><li>Note what to improve next time</li></ul>
          <h3>My notes</h3>
          <textarea placeholder="Jot down key points. Saved automatically." value={s.notes[key]||''} onChange={e=>{const v=e.target.value;upd(x=>{x.notes[key]=v})}}/>
          <div className="row"><button className="btn ghost sm" onClick={()=>dl(`${c.id}-lesson-${i+1}-notes.txt`,`${c.title}: ${t}\n\n${s.notes[key]||''}`)}>Download my notes</button><small className="mu">Shortcuts: N next · P previous · M mark complete</small></div>
          <div className="nav3">
            {i>0?<Link className="btn ghost" to={`/lesson/${c.id}/${i-1}`}>Previous</Link>:<span/>}
            <button className={'btn '+(done?'ghost':'')} onClick={complete}>{done?'Completed ✓ (undo)':'Mark as complete'}</button>
            {last?<Link className="btn" to={`/quiz/${c.id}`}>Take quiz</Link>:<Link className="btn" to={`/lesson/${c.id}/${i+1}`}>Next</Link>}
          </div>
        </article>
        <aside className="glass"><div className="row"><Ring p={pct(c,s)} z={56}/><b>{doneOf(c,s).length}/{c.lessons.length} done</b></div>
          <div className="list">{c.lessons.map((_,j)=><LessonRow key={j} c={c} i={j} cur={j===i}/>)}</div></aside>
      </div>
    </>
  );
}
