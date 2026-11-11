import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useStore} from '../store.jsx';
import {Card,Modal} from '../components.jsx';

const LV={Beginner:0,Intermediate:1,Advanced:2};
const mins=c=>c.lessons.reduce((a,l)=>a+ +l[1],0);

export default function Catalogue(){
  const {all,get}=useStore();
  const cats=['All',...new Set(all.map(c=>c.cat))];
  const [f,setF]=useState({q:'',cat:'All',sort:'rating',lv:'All',rt:0});
  const [cmp,setCmp]=useState([]),[open,setOpen]=useState(false);
  const set=k=>e=>setF({...f,[k]:k==='rt'?+e.target.value:e.target.value});
  let r=all.filter(c=>(f.cat==='All'||c.cat===f.cat)&&(f.lv==='All'||c.lvl===f.lv)&&c.rating>=f.rt&&(c.title+c.inst+c.cat).toLowerCase().includes(f.q.toLowerCase().trim()));
  r=[...r].sort((a,b)=>f.sort==='title'?a.title.localeCompare(b.title):f.sort==='dur'?mins(a)-mins(b):f.sort==='lvl'?LV[a.lvl]-LV[b.lvl]:b.rating-a.rating);
  const toggle=(e,id)=>{e.preventDefault();e.stopPropagation();setCmp(x=>x.includes(id)?x.filter(i=>i!==id):x.length<3?[...x,id]:x)};
  const C=cmp.map(get).filter(Boolean);
  const R=[['Instructor',c=>c.inst],['Category',c=>c.cat],['Level',c=>c.lvl],['Duration',c=>c.dur],['Lessons',c=>c.lessons.length],['Rating',c=>'★ '+c.rating],['Prerequisite',c=>c.pre?get(c.pre).title:'None']];
  return (
    <>
      <header className="hero"><div><h1>Course catalogue</h1><p className="mu">{all.length} courses from working practitioners</p></div><Link className="btn ghost" to="/recommend">Help me choose</Link></header>
      <div className="tools">
        <input type="search" placeholder="Search courses or instructors" aria-label="Search" value={f.q} onChange={set('q')}/>
        <select aria-label="Level" value={f.lv} onChange={set('lv')}><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
        <select aria-label="Minimum rating" value={f.rt} onChange={set('rt')}><option value="0">Any rating</option><option value="4.5">4.5 and up</option><option value="4.8">4.8 and up</option></select>
        <select aria-label="Sort" value={f.sort} onChange={set('sort')}><option value="rating">Top rated</option><option value="title">A to Z</option><option value="dur">Shortest first</option><option value="lvl">Level</option></select>
      </div>
      <div className="chips">{cats.map(c=><button key={c} className={'chip '+(f.cat===c?'on':'')} onClick={()=>setF({...f,cat:c})}>{c}</button>)}</div>
      <div className="grid">
        {r.length?r.map(c=><Card key={c.id} c={c}><button className={'cmp '+(cmp.includes(c.id)?'on':'')} title="Add to compare" aria-label="Compare" onClick={e=>toggle(e,c.id)}>⇄</button></Card>)
        :<div className="empty"><h3>No matches</h3><p className="mu">Try another keyword or clear a filter.</p></div>}
      </div>
      {cmp.length>1&&<div className="cbar"><b>{cmp.length} courses selected</b><button className="btn" onClick={()=>setOpen(true)}>Compare</button><button className="btn ghost" onClick={()=>setCmp([])}>Clear</button></div>}
      {open&&<Modal wide close={()=>setOpen(false)}><h2>Compare courses</h2>
        <div className="tbl"><table className="cmpt"><thead><tr><th/>{C.map(c=><th key={c.id}>{c.emoji} {c.title}</th>)}</tr></thead>
          <tbody>{R.map(x=><tr key={x[0]}><td>{x[0]}</td>{C.map(c=><td key={c.id}>{x[1](c)}</td>)}</tr>)}</tbody></table></div>
        <button className="btn ghost" onClick={()=>setOpen(false)}>Close</button></Modal>}
    </>
  );
}
