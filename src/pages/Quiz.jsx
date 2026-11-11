import {useEffect,useState} from 'react';
import {Link,useParams,useSearchParams} from 'react-router-dom';
import {useStore,pct,mark,addXP,notify,confetti} from '../store.jsx';
import {Ring,NF} from '../components.jsx';

export default function Quiz(){
  const {id}=useParams();const [sp]=useSearchParams();const {s,upd,toast,get}=useStore();const c=get(id);
  const [i,setI]=useState(0),[pk,setPk]=useState([]),[hid,setHid]=useState({}),[hints,setHints]=useState(1),[t0,setT0]=useState(Date.now()),[res,setRes]=useState(null),[,tick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>tick(x=>x+1),1000);return()=>clearInterval(t)},[]);
  if(!c)return <NF text="We couldn't find that quiz"/>;
  const bn=sp.get('bonus')?2:1,Q=c.quiz.map(x=>{const p=x.split('|');return{q:p[0],o:p.slice(1,-1),a:+p[p.length-1]}});
  const fmt=()=>{const t=Math.floor((Date.now()-t0)/1000);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
  const finish=()=>{
    const n=Q.filter((k,j)=>pk[j]===k.a).length,p=Math.round(n/Q.length*100),xp=Math.round(p/2)*bn,tt=fmt();
    upd(x=>{x.scores[c.id]=Math.max(x.scores[c.id]||0,p);mark(x);addXP(x,xp,`Quiz ${p}% in ${c.title}`);if(p>=70&&pct(c,x)===100)notify(x,`Certificate unlocked for ${c.title}`)});
    if(p>=70)confetti();setRes({n,p,xp,tt});
  };
  const retake=()=>{setI(0);setPk([]);setHid({});setHints(1);setT0(Date.now());setRes(null)};
  if(res)return (
    <div className="qz glass center"><Ring p={res.p} z={140}/><h1>{res.p>=70?'You passed':'Keep going'}</h1>
      <p className="mu">{res.n} of {Q.length} correct in {res.tt}. Best score: {s.scores[c.id]}%. You earned {res.xp} XP.</p>
      <div className="rev">{Q.map((k,j)=><div key={j} className={pk[j]===k.a?'good':'bad'}><b>{pk[j]===k.a?'✓':'✗'} {k.q}</b><small>{pk[j]===k.a?'Your answer: ':'Correct answer: '}{k.o[k.a]}</small></div>)}</div>
      <div className="nav3"><button className="btn ghost" onClick={retake}>Retake quiz</button>
        <button className="btn ghost" onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(`I scored ${res.p}% on ${c.title} at Gyaan Academy!`);toast('Result copied')}}>Copy my result</button>
        <Link className="btn" to={`/course/${c.id}`}>Back to course</Link></div></div>
  );
  const k=Q[i];
  const hint=()=>{setHid({...hid,[i]:k.o.map((_,j)=>j).filter(j=>j!==k.a&&j!==pk[i])[0]});setHints(h=>h-1)};
  return (
    <>
      <div className="crumbs"><Link to={`/course/${c.id}`}>{c.title}</Link> / Quiz</div>
      <div className="qz glass">
        <div className="bar"><i style={{width:i/Q.length*100+'%'}}/></div>
        <div className="row"><small className="mu">Question {i+1} of {Q.length}</small>{bn>1&&<span className="pill hl">Double XP</span>}<small className="mu tm">⏱ {fmt()}</small></div>
        <h2>{k.q}</h2>
        {k.o.map((o,j)=>hid[i]===j?null:<button key={j} className={'opt '+(pk[i]===j?'sel':'')} onClick={()=>{const n=[...pk];n[i]=j;setPk(n)}}><i>{'ABCD'[j]}</i>{o}</button>)}
        <div className="nav3">
          {i?<button className="btn ghost" onClick={()=>setI(i-1)}>Back</button>:<span/>}
          <button className="btn ghost" disabled={!(hints&&hid[i]==null&&k.o.length>2)} onClick={hint}>Hint ({hints} left)</button>
          <button className="btn" disabled={pk[i]==null} onClick={()=>i===Q.length-1?finish():setI(i+1)}>{i===Q.length-1?'Finish quiz':'Next question'}</button>
        </div>
      </div>
    </>
  );
}
