import {useEffect,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {useStore} from '../store.jsx';
import {NF} from '../components.jsx';

export default function Flashcards(){
  const {id}=useParams();const {get}=useStore();const c=get(id);
  const [i,setI]=useState(0),[fl,setFl]=useState(0);
  const D=c?c.quiz.map(x=>{const p=x.split('|');return[p[0],p.slice(1,-1)[+p[p.length-1]]]}):[];
  useEffect(()=>{
    const k=e=>{
      if(e.key===' '){e.preventDefault();setFl(f=>f?0:1)}
      if(e.key==='ArrowRight'){setI(x=>Math.min(D.length-1,x+1));setFl(0)}
      if(e.key==='ArrowLeft'){setI(x=>Math.max(0,x-1));setFl(0)}
    };
    window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);
  },[id,D.length]);
  if(!c)return <NF text="We couldn't find that course"/>;
  return (
    <>
      <div className="crumbs"><Link to={`/course/${c.id}`}>{c.title}</Link> / Flashcards</div>
      <div className="fc">
        <button className={'flip '+(fl?'on':'')} aria-label="Flip card" onClick={()=>setFl(fl?0:1)}><span>{fl?'Answer':'Question'}</span><h2>{D[i][fl]}</h2><small className="mu">Click or press space to flip</small></button>
        <div className="nav3"><button className="btn ghost" disabled={!i} onClick={()=>{setI(i-1);setFl(0)}}>Previous</button><small className="mu">Card {i+1} of {D.length}</small><button className="btn" disabled={i>=D.length-1} onClick={()=>{setI(i+1);setFl(0)}}>Next card</button></div>
      </div>
    </>
  );
}
