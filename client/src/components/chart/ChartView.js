import './ChartView.css';
import ChartFilters from '../filters/chart/ChartFilters';
import PlotController from '../chart/PlotController';
import { useState } from 'react';

/**
 * ChartView component used for displaying the chart
 * Gets the data from the server and passes it to the PlotController & ChartFilters components
 * @returns JSX ChartView Component with the chart
 * @param {Object} validYears - The valid years
 * @param {Object} validCountries - The valid countries
 * @param {String} error - The error
 * @param {Function} setError - The setError function
 * @param {Function} setChartTitle - The setChartTitle function
 * @returns JSX ChartView Component with the chart
 */
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