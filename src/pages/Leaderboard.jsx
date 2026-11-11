import {useStore,streak} from '../store.jsx';

export default function Leaderboard(){
  const {s}=useStore();
  const pts=Object.values(s.done).flat().length*10+Object.values(s.scores).reduce((a,b)=>a+b,0)+streak(s)*5;
  const R=[['Ishaan Verma',420],['Meera Iyer',365],['Kabir Shah',310],['Ananya Das',255],['Rohan Gupta',190],['Sana Khan',120],[s.user.name,pts,1]].sort((a,b)=>b[1]-a[1]);
  return (
    <>
      <header className="hero"><div><h1>Leaderboard</h1><p className="mu">You are ranked #{R.findIndex(r=>r[2])+1} of {R.length} this month</p></div></header>
      <div className="podium">{R.slice(0,3).map((r,i)=><div key={r[0]} className={`glass pod p${i}`}><span className="medal">{['🥇','🥈','🥉'][i]}</span><div className="av">{r[0][0]}</div><b>{r[0]}{r[2]?' (you)':''}</b><span className="num">{r[1]}</span><small className="mu">points</small></div>)}</div>
      <div className="list">{R.slice(3).map((r,i)=><div key={r[0]} className={'les '+(r[2]?'cur':'')}><i>{i+4}</i><div><b>{r[0]}{r[2]?' (you)':''}</b><small className="mu">{r[1]} points</small></div></div>)}</div>
      <p className="mu">Points: 10 per lesson, your quiz scores, and 5 per streak day.</p>
    </>
  );
}
