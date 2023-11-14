import QuizComponent from './components/quiz/QuizComponent';
import ReactDOM from 'react-dom/client';
import NavBar from './components/navbar/navbar';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="Quiz" element={<QuizComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
