import './App.css';
import QuizComponent from './components/quiz/QuizComponent';
import NavBar from './components/navbar/navbar';
import ChartView from './components/chart/ChartView';
import Footer from './components/footer/Footer';
import MapView from './components/Map/MapView';
import { useState } from 'react';

function App() {
  const views = {
    Chart : 'chart',
    Map : 'map',
    Quiz : 'quiz'
  };

  const [currentView, setCurrentView] = useState(views.Chart);

  return <div>
    <NavBar setCurrentView={setCurrentView} views={views} />
    <View currentView={currentView} views={views} />
    <Footer />
  </div>;
}

function View({ currentView, views }) {
  switch (currentView){
  case views.Chart:
    return <ChartView />;
  case views.Map:
    return <MapView />;
  case views.Quiz:
    return <QuizComponent />;
  default:
    return <div>Unsupported view</div>;
  }
}

export default App;
