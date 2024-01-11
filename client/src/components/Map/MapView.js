import MapFilters from '../filters/map/MapFilters';
import Map from './Map';
import { useState } from 'react';


/**
 * MapView component used for displaying the map
 * Gets the data from the server and passes it to the Map & MapFilters components
 * @returns JSX MapView Component with the map
 */

export default function MapView({ validYears, validCountries, error, setError }) {
  const dataLayout = {
    'data': {
      'results': []
    }
  };
  
  const [gdp, setGdp] = useState(dataLayout);
  const [protein, setProtein] = useState(dataLayout);

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