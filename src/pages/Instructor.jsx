import {useParams} from 'react-router-dom';
import {useStore} from '../store.jsx';
import {Card,NF} from '../components.jsx';

export default function Instructor(){
  const {name}=useParams();const {all}=useStore();const n=decodeURIComponent(name),cs=all.filter(c=>c.inst===n);
  if(!cs.length)return <NF text="We couldn't find that instructor"/>;
  const c0=cs[0],f=n.split(' ').slice(-2)[0];
  return (
    <>
      <section className="chero" style={{'--h':c0.hue}}><div className="av lg">{n.split(' ').pop()[0]}</div>
        <div><h1>{n}</h1><p>{c0.role}</p><p className="mu">{cs.length} course{cs.length>1?'s':''} · ★ {(cs.reduce((a,c)=>a+c.rating,0)/cs.length).toFixed(1)} average rating</p>
          <p>{f} has spent over a decade building and teaching {c0.cat.toLowerCase()}, and believes the best way to learn is by making real things.</p></div></section>
      <h2>Courses by {f}</h2><div className="grid">{cs.map(c=><Card key={c.id} c={c}/>)}</div>
    </>
  );
}
