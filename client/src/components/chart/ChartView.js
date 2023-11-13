import ChartFilters from '../filters/chart/ChartFilters';
import PlotController from '../chart/PlotController';
import { useState } from 'react';

export default function ChartView() {
  const dataLayout = {
    'data': {
      'country': '',
      'code': '',
      'results': []
    }
  };
  const [gdp, setGdp] = useState(dataLayout);
  const [protein, setProtein] = useState(dataLayout);

  return <div>
    <PlotController
      gdp={gdp['data']['results']}
      protein={protein['data']['results']}
      title="Chart for protein and gdp" />
    <ChartFilters
      setGdp={setGdp}
      setProtein={setProtein} />
  </div>;
}