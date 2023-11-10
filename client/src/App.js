import './App.css';
import DataDisplay from './components/DataDisplay';
import MontrealMap from './components/Map/Map';

function App() {
  return (
    <div className="App">
      <MontrealMap position={[45.5, -73.6]}/>
      <DataDisplay />
    </div>
  );
}

export default App;
