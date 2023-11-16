import MapFilters from '../filters/map/MapFilters';
import Map from './Map';
import { useEffect, useState } from 'react';

export default function MapView() {
  const dataLayout = {
    'data': {
      'results': []
    }
  };
  
  const proteinDataLayout = {
    'data': {
      'results': [
        {'county': 'iran',
          'code': 'IRN',
          'year': 2018,
          'gppd': 78.99342,
          'position': ['32.427908', '53.688046']
        }
      ]
    }
  };

  const gdpDataLayout = {
    'data': {
      'results': [
        {'county': 'iran',
          'code': 'IRN',
          'year': 2018,
          'gpd': 14628.946,
          'position': ['32.427908', '53.688046']
        }
      ]
    }
  };
  
  const [gdp, setGdp] = useState(gdpDataLayout);
  const [protein, setProtein] = useState(proteinDataLayout);
  const [loading, setLoading] = useState(true);
  const [error,] = useState(false);
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
  
  if (error) {
    return <div>{error}</div>;
  }
  
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
    />
  </>;
}