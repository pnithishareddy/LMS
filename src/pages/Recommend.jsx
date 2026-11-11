import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useStore,hrs} from '../store.jsx';
import {PATHS} from '../data.js';

const Qs=[['What do you want to achieve?',[['Build websites','fe'],['Work with data','ds'],['Design and ship products','pd']]],['How much time can you give each week?',[['Under 3 hours',2],['3 to 6 hours',4.5],['More than 6 hours',8]]],['Where are you starting from?',[['Brand new',0],['Some experience',1],['Confident',2]]]];

export default function Recommend(){
  const {get}=useStore();const [a,setA]=useState([]);
  if(a.length<3){const [t,o]=Qs[a.length];return (
    <>
      <header className="hero"><div><h1>Find my path</h1><p className="mu">Three quick questions</p></div></header>
      <div className="qz glass"><div className="bar"><i style={{width:a.length/3*100+'%'}}/></div><small className="mu">Question {a.length+1} of 3</small><h2>{t}</h2>
        {o.map((x,j)=><button key={j} className="opt" onClick={()=>setA([...a,x[1]])}><i>{'ABC'[j]}</i>{x[0]}</button>)}
        {a.length>0&&<button className="btn ghost" onClick={()=>setA(a.slice(0,-1))}>Back</button>}</div>
    </>
  )}
  const pt=PATHS.find(p=>p.id===a[0]),cs=pt.c.map(get).filter(Boolean),h=cs.reduce((t,c)=>t+hrs(c),0),wk=Math.max(1,Math.ceil(h*(a[2]===2?.7:1)/a[1]));
  return (
    <>
      <header className="hero"><div><h1>Your path: {pt.t}</h1><p className="mu">{pt.d}</p></div></header>
      <div className="glass path"><div className="row"><span className="em">{pt.e}</span><div><h2>About {wk} week{wk>1?'s':''} to finish</h2><p className="mu">{cs.length} courses · {h.toFixed(1)} hours of lessons at your pace</p></div></div>
        <div className="steps">{cs.map((c,i)=><Link key={c.id} className="les" to={`/course/${c.id}`}><i>{i+1}</i><div><b>{c.title}</b><small className="mu">{c.lvl} · {c.dur}</small></div></Link>)}</div>
        <div className="nav3"><button className="btn ghost" onClick={()=>setA([])}>Start over</button><Link className="btn" to="/paths">See all paths</Link></div></div>
    </>
  );
}
