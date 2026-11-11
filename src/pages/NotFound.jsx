import {Link} from 'react-router-dom';
export default function NotFound(){
  return <div className="empty"><h1>404</h1><h2>This page took a day off</h2><p className="mu">The link may be broken or the page has moved.</p><Link className="btn" to="/">Back to dashboard</Link></div>;
}
