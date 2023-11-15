import './App.css';
import QuizComponent from './components/quiz/QuizComponent';
import NavBar from './components/navbar/navbar';
import ChartView from './components/chart/ChartView';
import Footer from './components/footer/Footer';
import MapView from './components/Map/MapView';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<ChartView />} />
        <Route path="Quiz" element={<QuizComponent />} />
        <Route path="Map" element={<MapView />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
