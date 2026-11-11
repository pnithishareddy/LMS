import {Link} from 'react-router-dom';
import {useStore} from '../store.jsx';
import {Card} from '../components.jsx';

export default function Saved(){
  const {s,all}=useStore();const r=all.filter(c=>s.saved.includes(c.id));
  return (
    <>
      <header className="hero"><div><h1>Saved courses</h1><p className="mu">{r.length} on your wishlist</p></div></header>
      <div className="grid">{r.length?r.map(c=><Card key={c.id} c={c}/>):<div className="empty"><h3>Nothing saved yet</h3><p className="mu">Tap the heart on any course to keep it here.</p><Link className="btn" to="/catalogue">Browse courses</Link></div>}</div>
    </>
  );
}
