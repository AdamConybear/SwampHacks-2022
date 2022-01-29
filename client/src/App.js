import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';

function App()
{
  return (
    <Router>
      <Routes>
        <Route
        exact
        path="/LandingPage"
        element={<LandingPage />}
        />
        <Route path="*" element={<Navigate to="/LandingPage"/>} />
      </Routes>
    </Router>
  );
}

export default App;
