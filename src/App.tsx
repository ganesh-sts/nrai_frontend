import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CoachDetails from './pages/coachdetails/CoachDetails';
import CoachRegister from './pages/coachregister/CoachRegister';
import CoachLogin from './pages/coachlogin/CoachLogin';
import CoachDashboard from './pages/coachdashboard/CoachDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoachRegister />} />
        <Route path="/coach-details" element={<CoachDetails />} />
        <Route path="/coach-login" element={<CoachLogin />} />

        <Route path="/coach-dashboard" element={<CoachDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
