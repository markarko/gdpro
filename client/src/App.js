import QuizComponent from './components/quiz/QuizComponent';
import ReactDOM from 'react-dom/client';
import NavBar from './components/navbar/navbar';
import ChartView from './components/chart/ChartView';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<ChartView />} />
        <Route path="Quiz" element={<QuizComponent />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
