import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from "./LandingPage/LandingPage";

function App()
{
  return (
    <Router>
      <Routes>
        <Route
        exact
        path="/"
        element={<LandingPage />}
        />
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </Router>
  );
}

export default App;
