import './App.css';
import MontrealMap from './components/Map/Map';
import ChartView from './components/chart/ChartView';
import MapView from './components/Map/MapView';

function App() {
  return (
    <div className="App">
      <MontrealMap position={[45.5, -73.6]}/>
      {/* <ChartView /> */}
      <MapView />
    </div>
  );
}

export default App;
