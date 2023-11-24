import './ChartView.css';
import ChartFilters from '../filters/chart/ChartFilters';
import PlotController from '../chart/PlotController';
import { useEffect, useState } from 'react';

export default function ChartView() {
  const dataLayout = {
    'data': {
      'country': '',
      'code': '',
      'results': []
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [gdp, setGdp] = useState(dataLayout);
  const [protein, setProtein] = useState(dataLayout);

  const [validYears, setValidYears] = useState([]);
  const [validCountries, setValidCountries] = useState([]);

  const [chartTitle, setChartTitle] = useState('Chart representingthe ' + 
  'gdp and daily protein intake of afghanistan');

  useEffect(() => {
    async function getJson(url) {
      const response = await fetch(url);
      return await response.json();
    }
    async function fetchInitialData() {
      try{
        const yearsUrl = '/api/v1/gdp/countries/ukraine';
        const countriesUrl = '/api/v1/gdp/countries/all'; 
  
        const fetches = [getJson(yearsUrl), getJson(countriesUrl)];
        const [yearsData, countriesData] = await Promise.all(fetches);
      
        const years = yearsData.data.results.map(x => x.year); 
        setValidYears(years);
  
        const countries = countriesData.data;
        setValidCountries(countries);
      } catch(err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return <div className="ChartView">
    <PlotController
      gdp={gdp['data']['results']}
      protein={protein['data']['results']}
      title={chartTitle} />
    <ChartFilters
      setGdp={setGdp}
      setProtein={setProtein}
      validYears={validYears}
      validCountries={validCountries}
      dataLayout={dataLayout}
      setError={setError}
      setChartTitle={setChartTitle} />
    { error ? <div>{error}</div> : <div></div> }
  </div>;
}