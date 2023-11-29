import './ChartView.css';
import ChartFilters from '../filters/chart/ChartFilters';
import PlotController from '../chart/PlotController';
import { useState } from 'react';

export default function ChartView({ validYears, validCountries, error, setError }) {
  const dataLayout = {
    'data': {
      'country': '',
      'code': '',
      'results': []
    }
  };

  const [gdp, setGdp] = useState(dataLayout);
  const [protein, setProtein] = useState(dataLayout);

  const [chartTitle, setChartTitle] = useState('Chart representingthe ' + 
  'gdp and daily protein intake of afghanistan');

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
    <hr />
  </div>;
}