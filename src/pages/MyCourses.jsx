import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useStore,pct} from '../store.jsx';
import {Card} from '../components.jsx';

export default function MyCourses(){
  const {s,all}=useStore();const [tab,setTab]=useState('go');
  const en=all.filter(c=>s.enrolled.includes(c.id)),r=en.filter(c=>tab==='go'?pct(c,s)<100:pct(c,s)===100);
  return (
    <>
      <header className="hero"><div><h1>My courses</h1><p className="mu">{en.length} enrolled</p></div></header>
      <div className="chips"><button className={'chip '+(tab==='go'?'on':'')} onClick={()=>setTab('go')}>In progress</button><button className={'chip '+(tab==='done'?'on':'')} onClick={()=>setTab('done')}>Completed</button></div>
      <div className="grid">{r.length?r.map(c=><Card key={c.id} c={c}/>):<div className="empty"><h3>{tab==='go'?'No courses in progress':'No completed courses yet'}</h3><p className="mu">{tab==='go'?'Enrol in a course to see it here.':'Finish every lesson in a course to see it here.'}</p><Link className="btn" to="/catalogue">Browse courses</Link></div>}</div>
    </>
  );
}
