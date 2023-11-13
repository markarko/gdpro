import ChartFilters from '../filters/chart/ChartFilters';
import PlotController from '../chart/PlotController';
import { useState } from 'react';

export default function ChartView() {
  const initialGdpData = {
    'data': {
      'country': 'belarus',
      'code': 'BLR',
      'results': [
        {'year': '1990', 'gdp': '8895.173'},
        {'year': '1991', 'gdp': '8784.377'},
        {'year': '1992', 'gdp': '7923.6504'},
        {'year': '1993', 'gdp': '7305.307'},
        {'year': '1994', 'gdp': '6458.2144'},
        {'year': '1995', 'gdp': '5805.3633'},
        {'year': '1996', 'gdp': '5988.0396'},
        {'year': '1997', 'gdp': '6698.458'},
        {'year': '1998', 'gdp': '7293.908'},
        {'year': '1999', 'gdp': '7575.9185'},
        {'year': '2000', 'gdp': '8053.174'},
        {'year': '2001', 'gdp': '8477.084'},
        {'year': '2002', 'gdp': '8961.642'},
        {'year': '2003', 'gdp': '9660.193'},
        {'year': '2004', 'gdp': '10839.956'},
        {'year': '2005', 'gdp': '11940.187'},
        {'year': '2006', 'gdp': '13214.871'},
        {'year': '2007', 'gdp': '14417.354'},
        {'year': '2008', 'gdp': '15942.897'},
        {'year': '2009', 'gdp': '16014.115'},
        {'year': '2010', 'gdp': '17300.703'},
        {'year': '2011', 'gdp': '18274.021'},
        {'year': '2012', 'gdp': '18611.455'},
        {'year': '2013', 'gdp': '18805.432'},
        {'year': '2014', 'gdp': '19119.346'},
        {'year': '2015', 'gdp': '18362.746'},
        {'year': '2016', 'gdp': '17883.127'},
        {'year': '2017', 'gdp': '18356.102'},
        {'year': '2018', 'gdp': '18974.7'},
        {'year': '2019', 'gdp': '19279.209'},
        {'year': '2020', 'gdp': '19225.574'}
      ]
    }
  };
  
  const initialProteinData = {
    'data': {
      'country': 'belarus',
      'code': 'BLR',
      'results': [
        {'year': '1990', 'gppd': '93.673975'},
        {'year': '1991', 'gppd': '92.735937'},
        {'year': '1992', 'gppd': '94.606155'},
        {'year': '1993', 'gppd': '96.93167'},
        {'year': '1994', 'gppd': '93.8058'},
        {'year': '1995', 'gppd': '92.47504'},
        {'year': '1996', 'gppd': '94.159805'},
        {'year': '1997', 'gppd': '93.09518'},
        {'year': '1998', 'gppd': '92.75616'},
        {'year': '1999', 'gppd': '89.541534'},
        {'year': '2000', 'gppd': '84.4199'},
        {'year': '2001', 'gppd': '86.02146'},
        {'year': '2002', 'gppd': '83.90524'},
        {'year': '2003', 'gppd': '82.98905'},
        {'year': '2004', 'gppd': '84.77055'},
        {'year': '2005', 'gppd': '86.67711'},
        {'year': '2006', 'gppd': '88.643074'},
        {'year': '2007', 'gppd': '89.75339'},
        {'year': '2008', 'gppd': '88.70794'},
        {'year': '2009', 'gppd': '89.38578'},
        {'year': '2010', 'gppd': '89.39441'},
        {'year': '2011', 'gppd': '88.52462'},
        {'year': '2012', 'gppd': '89.422'},
        {'year': '2013', 'gppd': '88.1609'},
        {'year': '2014', 'gppd': '88.640205'},
        {'year': '2015', 'gppd': '86.24953'},
        {'year': '2016', 'gppd': '86.47059'},
        {'year': '2017', 'gppd': '86.95709'},
        {'year': '2018', 'gppd': '87.87504'},
        {'year': '2019', 'gppd': '98.54025'},
        {'year': '2020', 'gppd': '101.87174'}
      ]
    }
  };  

  const years = initialGdpData.map(x => x.year);
  const validCountries = ['Canada', 'Ukraine', 'Mexico', 'Russia', 'England'];

  const [gdp, setGdp] = useState(initialGdpData);
  const [protein, setProtein] = useState(initialProteinData);

  return <div>
    <PlotController gdp={gdp} protein={protein} title="Hello protein and gdp" />
    <ChartFilters
      years={years}
      validCountries={validCountries}
      gdp={gdp}
      setGdp={setGdp}
      protein={protein}
      setProtein={setProtein} />
  </div>;
}