import {useState} from 'react';
import {useStore,pct,dl,csv} from '../store.jsx';
import {mkC} from '../data.js';

const STU=[['Ishaan Verma',82],['Meera Iyer',74],['Kabir Shah',61],['Ananya Das',48],['Rohan Gupta',35],['Sana Khan',22]];
const Sel=({name,opts,def})=><select name={name} defaultValue={def}>{opts.map(o=><option key={o}>{o}</option>)}</select>;

export default function Admin(){
  const {s,all,allA,custom,saveCustom,toast}=useStore();
  const [ed,setEd]=useState(null),[fq,setFq]=useState('');
  const e=ed&&custom.find(x=>x.id===ed);
  const en=all.filter(c=>s.enrolled.includes(c.id));
  const ST=[...STU,[s.user.name+' (you)',Math.round(en.reduce((a,c)=>a+pct(c,s),0)/Math.max(1,en.length))]];
  const submit=ev=>{
    ev.preventDefault();const d=Object.fromEntries(new FormData(ev.target));
    const ls=d.lessons.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>{const[a,b]=x.split('|');return`${a.replace(/,/g,' ')}|${parseInt(b)||10}`});
    const qs=d.quiz.split('\n').map(x=>x.trim()).filter(Boolean);
    if(!ls.length)return toast('Add at least one lesson');
    if(qs.some(x=>{const p=x.split('|'),n=p.length-2;return n<2||!(+p[p.length-1]>=0&&+p[p.length-1]<n)}))return toast('Each quiz line needs a question, 2+ options and a valid answer number');
    const m=ls.reduce((a,x)=>a+ +x.split('|')[1],0);
    const c=mkC(e?e.id:'c'+Date.now(),d.title,d.cat,d.lvl,d.inst,'Guest instructor',e?e.emoji:['📘','🚀','💡','🛠️'][custom.length%4],e?e.hue:Math.floor(Math.random()*360),`${Math.floor(m/60)}h ${m%60}m`,e?e.rating:4.5,d.desc,ls.join(','),qs);
    c.yt=d.yt.trim();c.draft=d.status==='Draft';
    saveCustom(e?custom.map(x=>x.id===e.id?c:x):[...custom,c]);toast(e?'Changes saved':c.draft?'Saved as draft':'Published');setEd(null);
  };
  const del=id=>{if(confirm('Delete this course?')){saveCustom(custom.filter(x=>x.id!==id));toast('Course deleted')}};
  return (
    <>
      <header className="hero"><div><h1>Course management</h1><p className="mu">{allA.length} courses · {allA.filter(c=>c.draft).length} drafts · {allA.reduce((a,c)=>a+c.lessons.length,0)} lessons</p></div>
        <div className="row"><button className="btn ghost" onClick={()=>dl('gyaan-courses.csv',csv([['Title','Category','Level','Instructor','Lessons','Status'],...allA.map(c=>[c.title,c.cat,c.lvl,c.inst,c.lessons.length,c.draft?'Draft':'Published'])]),'text/csv')}>Export courses</button>
          <button className="btn ghost" onClick={()=>dl('gyaan-students.csv',csv([['Student','Progress %'],...ST]),'text/csv')}>Export students</button></div></header>
      <div className="glass an"><h2>Learners per course</h2>{allA.map(c=>{const n=40+[...c.id].reduce((a,x)=>a+x.charCodeAt(0),0)*3%160;return <div key={c.id} className="rowb"><span>{c.title}</span><div className="bar"><i style={{width:n/2+'%'}}/></div><b>{n}</b></div>})}</div>
      <div className="cols">
        <div>
          <div className="glass tbl"><table><thead><tr><th>Course</th><th>Status</th><th>Lessons</th><th/></tr></thead>
            <tbody>{allA.map(c=><tr key={c.id}><td><b>{c.emoji} {c.title}</b><br/><small className="mu">{c.inst} · {c.cat}</small></td><td><span className="pill">{c.draft?'Draft':'Published'}</span></td><td>{c.lessons.length}</td>
              <td>{custom.some(x=>x.id===c.id)?<><button className="btn ghost sm" onClick={()=>setEd(c.id)}>Edit</button> <button className="btn ghost sm danger" onClick={()=>del(c.id)}>Delete</button></>:<small className="mu">Core</small>}</td></tr>)}</tbody></table></div>
          <h2 className="gap">Students</h2>
          <input placeholder="Filter students" aria-label="Filter students" value={fq} onChange={ev=>setFq(ev.target.value)}/>
          <div className="glass tbl"><table><tbody>{ST.filter(x=>x[0].toLowerCase().includes(fq.toLowerCase().trim())).map(x=><tr key={x[0]}><td>{x[0]}</td><td style={{width:'45%'}}><div className="bar"><i style={{width:x[1]+'%'}}/></div></td><td>{x[1]}%</td></tr>)}</tbody></table></div>
        </div>
        <form className="glass form" key={ed||'new'} onSubmit={submit}><h2>{e?'Edit course':'Add a course'}</h2>
          <label>Title<input name="title" required defaultValue={e?e.title:''}/></label>
          <label>Instructor<input name="inst" required defaultValue={e?e.inst:''}/></label>
          <label>Category<Sel name="cat" opts={['Development','Design','Data','Business']} def={e&&e.cat}/></label>
          <label>Level<Sel name="lvl" opts={['Beginner','Intermediate','Advanced']} def={e&&e.lvl}/></label>
          <label>Description<input name="desc" required defaultValue={e?e.desc:''}/></label>
          <label>Lessons (one per line: Title|minutes)<textarea name="lessons" required defaultValue={e?e.lessons.map(l=>l.join('|')).join('\n'):'Introduction|6\nCore concepts|10\nFinal project|15'}/></label>
          <label>Quiz (one per line: Question|option|option|option|answer number from 0)<textarea name="quiz" defaultValue={e?e.quiz.join('\n'):'Did this course meet your goals?|Yes|Mostly|Somewhat|Not yet|0'}/></label>
          <label>YouTube video ID (optional)<input name="yt" defaultValue={e?e.yt||'':''}/></label>
          <label>Status<Sel name="status" opts={['Published','Draft']} def={e&&e.draft?'Draft':'Published'}/></label>
          <button className="btn">{e?'Save changes':'Publish course'}</button>
          {e&&<button type="button" className="btn ghost" onClick={()=>setEd(null)}>Cancel editing</button>}
        </form>
      </div>
    </>
  );
}
