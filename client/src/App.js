import './App.css';
import DataDisplay from './components/DataDisplay';
import MontrealMap from './components/Map/Map';
import ChartView from './components/chart/ChartView';

function App() {
  return (
    <div className="App">
      <MontrealMap position={[45.5, -73.6]}/>
      <DataDisplay />
      <ChartView />
    </div>
  );
}

export default App;
