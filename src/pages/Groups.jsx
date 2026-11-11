import {useStore,notify} from '../store.jsx';
import {SAMPLE} from '../data.js';

export default function Groups(){
  const {s,upd,all,get,toast}=useStore();
  const flip=id=>{const j=s.groups.includes(id);upd(x=>{x.groups=j?x.groups.filter(g=>g!==id):[...x.groups,id];if(!j)notify(x,'Joined the '+get(id).title+' circle')});toast(j?'Left the group':'Joined the group')};
  return (
    <>
      <header className="hero"><div><h1>Study groups</h1><p className="mu">{s.groups.length} joined. Learning with others keeps you going</p></div></header>
      <div className="grid">{all.map((c,k)=>{const j=s.groups.includes(c.id),m=SAMPLE.filter((_,x)=>(x+k)%2===0);return (
        <div key={c.id} className="card" style={{'--h':c.hue}}>
          <div className="art"><span className="em">{c.emoji}</span></div>
          <div className="cb"><h3>{c.title} circle</h3><p className="mu">Weekly goal: finish {Math.min(3,c.lessons.length)} lessons together</p>
            <div className="mem">{m.map(n=><div key={n} className="av" title={n}>{n[0]}</div>)}{j&&<div className="av you" title="You">{s.user.name[0]}</div>}</div>
            <small className="mu">{m.length+(j?1:0)} members</small>
            <button className={'btn '+(j?'ghost':'')} onClick={()=>flip(c.id)}>{j?'Leave group':'Join group'}</button></div>
        </div>)})}</div>
    </>
  );
}
