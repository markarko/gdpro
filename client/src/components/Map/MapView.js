import MapFilters from '../filters/map/MapFilters';
import Map from './Map';
import { useEffect, useState } from 'react';


/**
 * MapView component used for displaying the map
 * Gets the data from the server and passes it to the Map & MapFilters components
 * @returns JSX MapView Component with the map
 */

export default function MapView() {
  const dataLayout = {
    'data': {
      'results': []
    }
  };
  
  const [gdp, setGdp] = useState(dataLayout);
  const [protein, setProtein] = useState(dataLayout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validYears, setValidYears] = useState([]);
  const [validCountries, setValidCountries] = useState([]);
  
  async function getJson(url) {
    const response = await fetch(url);
    return await response.json();
  }

  useEffect(() => {
    async function fetchInitialData() {
      const yearsUrl = '/api/v1/gdp/countries/ukraine';
      const countriesUrl = '/api/v1/gdp/countries/all'; 

      const yearsData = await getJson(yearsUrl);
      const countriesData = await getJson(countriesUrl);          
      setLoading(false);
    
      const years = yearsData.data.results.map(x => x.year); 
      setValidYears(years);
    
      const countries = countriesData.data;
      setValidCountries(countries);
    }
    fetchInitialData();
  }, []);
  
  if (loading) {
    return <div></div>;
  }

  return <>
    <Map
      gdp={gdp.data.results} 
      protein={protein.data.results} 
    />
    <MapFilters
      years={validYears}
      validCountries={validCountries}
      setGdp={setGdp}
      setProtein={setProtein}
      dataLayout={dataLayout}
      setError={setError}
    />
    { error ? <div>{error}</div> : <div></div> }
    <hr />
  </>;
}