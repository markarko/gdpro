import MapFilters from './components/filters/map/MapFilters';

function App() {
  const years = [1990, 1991, 1992, 1993, 1994, 1995];
  const validCountries = ['Canada', 'Ukraine', 'Mexico', 'Russia', 'England'];
  return (
    <div className="App">
      <MapFilters years={years} validCountries={validCountries}/>
    </div>
  );
}

export default App;
