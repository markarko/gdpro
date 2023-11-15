import './App.css';
import ChartView from './components/chart/ChartView';
import Footer from './components/footer/Footer';
import MapView from './components/Map/MapView';

function App() {
  return (
    <div className="App">
      <ChartView />
      <MapView />
      <Footer />
    </div>
  );
}

export default App;
