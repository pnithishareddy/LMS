import {useStore,L,W,dl} from '../store.jsx';

const Opts=({a})=>a.map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>);

export default function Settings(){
  const {s,upd,toast}=useStore();
  const restore=e=>{
    const r=new FileReader();
    r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.lms)throw 0;W('lms',d.lms);W('lms_custom',d.custom||[]);W('lms_users',d.users||[]);toast('Backup restored');setTimeout(()=>window.location.reload(),600)}catch{toast('That file is not a Gyaan backup')}};
    r.readAsText(e.target.files[0]);
  };
  const clear=()=>{if(confirm('Delete all progress, notes and custom courses on this device?')){['lms','lms_custom','lms_users'].forEach(k=>localStorage.removeItem(k));window.location.reload()}};
  return (
    <>
      <header className="hero"><div><h1>Settings</h1><p className="mu">Make Gyaan comfortable for you</p></div></header>
      <div className="cols">
        <div className="glass form"><h2>Appearance</h2>
          <label>Theme<select value={s.theme} onChange={e=>upd(x=>{x.theme=e.target.value})}><Opts a={[['dark','Dark'],['light','Light']]}/></select></label>
          <label>Text size<select value={s.fs} onChange={e=>upd(x=>{x.fs=+e.target.value})}><Opts a={[[90,'Small'],[100,'Default'],[115,'Large'],[130,'Extra large']]}/></select></label>
          <label className="chk"><input type="checkbox" checked={!!s.hc} onChange={e=>upd(x=>{x.hc=+e.target.checked})}/> High contrast</label>
          {/* <label>Language<select value={s.lang} onChange={e=>upd(x=>{x.lang=e.target.value})}><Opts a={[['en','English'],['hi','हिन्दी (menu)']]}/></select></label>
        */} </div>
        <div className="glass form"><h2>Your data</h2><p className="mu">Everything is stored in this browser. Back it up to move to another device.</p>
          <button className="btn" onClick={()=>dl('gyaan-backup.json',JSON.stringify({lms:L('lms',{}),custom:L('lms_custom',[]),users:L('lms_users',[])}),'application/json')}>Download backup</button>
          <label>Restore from a backup<input type="file" accept=".json" onChange={restore}/></label>
          <button className="btn ghost danger" onClick={clear}>Clear all data</button></div>
      </div>
    </>
  );
}
