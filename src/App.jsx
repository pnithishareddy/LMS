import {Routes,Route,Navigate,Outlet} from 'react-router-dom';
import {useStore} from './store.jsx';
import Shell from './Shell.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Catalogue from './pages/Catalogue.jsx';
import Course from './pages/Course.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Lesson from './pages/Lesson.jsx';
import Quiz from './pages/Quiz.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import Saved from './pages/Saved.jsx';
import Planner from './pages/Planner.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Certificates from './pages/Certificates.jsx';
import Instructor from './pages/Instructor.jsx';
import Paths from './pages/Paths.jsx';
import Recommend from './pages/Recommend.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Groups from './pages/Groups.jsx';
import Notes from './pages/Notes.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

function Guard(){const {auth}=useStore();return auth?<Shell><Outlet/></Shell>:<Navigate to="/login" replace/>}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route element={<Guard/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="catalogue" element={<Catalogue/>}/>
        <Route path="course/:id" element={<Course/>}/>
        <Route path="my-courses" element={<MyCourses/>}/>
        <Route path="lesson/:id/:n" element={<Lesson/>}/>
        <Route path="quiz/:id" element={<Quiz/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="admin" element={<Admin/>}/>
        <Route path="saved" element={<Saved/>}/>
        <Route path="planner" element={<Planner/>}/>
        <Route path="leaderboard" element={<Leaderboard/>}/>
        <Route path="certificates" element={<Certificates/>}/>
        <Route path="certificates/:id" element={<Certificates/>}/>
        <Route path="instructor/:name" element={<Instructor/>}/>
        <Route path="paths" element={<Paths/>}/>
        <Route path="recommend" element={<Recommend/>}/>
        <Route path="flashcards/:id" element={<Flashcards/>}/>
        <Route path="groups" element={<Groups/>}/>
        <Route path="notes" element={<Notes/>}/>
        <Route path="settings" element={<Settings/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
    </Routes>
  );
}
