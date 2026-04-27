import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MotionReel from './pages/MotionReel';
import About from './pages/About';
import Stills from './pages/Stills';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/motion-reel" element={<MotionReel />} />
        <Route path="/about" element={<About />} />
        <Route path="/stills" element={<Stills />} />
      </Routes>
    </Router>
  );
}

export default App;
