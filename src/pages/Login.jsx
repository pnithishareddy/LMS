import {useState} from 'react';
import {Navigate} from 'react-router-dom';
import {useStore,L,W} from '../store.jsx';

const D={email:'user@gmail.com',pw:'user123',name:'Nithisha'};

export default function Login(){
  const {auth,login}=useStore();
  const [up,setUp]=useState(false),[err,setErr]=useState('');
  const [f,setF]=useState({name:'',email:D.email,pw:D.pw});
  if(auth)return <Navigate to="/" replace/>;
  const mode=u=>{setUp(u);setErr('');setF({name:'',email:u?'':D.email,pw:u?'':D.pw})};
  const submit=e=>{
    e.preventDefault();const U=L('lms_users',[]),em=f.email.trim().toLowerCase();
    if(up){
      if(em===D.email||U.some(u=>u.email===em))return setErr('That email already has an account. Log in instead.');
      const u={email:em,pw:f.pw,name:f.name.trim()||'Student'};W('lms_users',[...U,u]);return login(u.name,em);
    }
    const u=em===D.email&&f.pw===D.pw?D:U.find(x=>x.email===em&&x.pw===f.pw);
    u?login(u.name,em):setErr('Email or password is incorrect. Use the demo account above or sign up.');
  };
  return (
    <>
      <div className="blob b1"/><div className="blob b2"/>
      <main className="auth"><div className="glass authc">
        <div className="brand"><b>ज्ञ</b><span>Gyaan</span></div>
        <h1>Learn something new today</h1><p className="mu">Log in to pick up where you left off.</p>
        <div className="cred"><b>Demo account</b><span>Email: {D.email}</span><span>Password: {D.pw}</span>
          <button type="button" className="btn" onClick={()=>login(D.name,D.email)}>Log in with demo account</button></div>
        <div className="chips"><button className={'chip '+(!up?'on':'')} onClick={()=>mode(false)}>Log in</button><button className={'chip '+(up?'on':'')} onClick={()=>mode(true)}>Sign up</button></div>
        <form className="form" onSubmit={submit}>
          <label hidden={!up}>Full name<input value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></label>
          <label>Email<input type="email" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label>
          <label>Password<input type="password" minLength={4} required value={f.pw} onChange={e=>setF({...f,pw:e.target.value})}/></label>
          <p className="er" role="alert">{err}</p>
          <button className="btn">Continue</button>
          <button type="button" className="btn ghost" onClick={()=>login()}>Continue as guest</button>
        </form>
      </div></main>
    </>
  );
}
