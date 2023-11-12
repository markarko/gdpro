import ChartFilters from '../filters/chart/ChartFilters';
import PlotController from '../chart/PlotController';

export default function ChartView() {
  const years = [1990, 1991, 1992, 1993, 1994, 1995];
  const validCountries = ['Canada', 'Ukraine', 'Mexico', 'Russia', 'England'];
  
  const gdpData = [{'year':'2000', 'gdp':'41338.65'},
    {'year':'2001', 'gdp':'41623.95'}, {'year':'2002', 'gdp':'42416.41'},
    {'year':'2003', 'gdp':'42793.08'}, {'year':'2004', 'gdp':'43704.414'},
    {'year':'2005', 'gdp':'44680.797'}, {'year':'2006', 'gdp':'45396.84'},
    {'year':'2007', 'gdp':'45888.477'}, {'year':'2008', 'gdp':'45851.63'},
    {'year':'2009', 'gdp':'44003.617'}, {'year':'2010', 'gdp':'44861.523'},
    {'year':'2011', 'gdp':'45822.598'}, {'year':'2012', 'gdp':'46126.516'},
    {'year':'2013', 'gdp':'46704.76'}, {'year':'2014', 'gdp':'47564.61'},
    {'year':'2015', 'gdp':'47522.14'}, {'year':'2016', 'gdp':'47457.586'},
    {'year':'2017', 'gdp':'48317.176'}, {'year':'2018', 'gdp':'48962.48'},
    {'year':'2019', 'gdp':'49171.51'}, {'year':'2020', 'gdp':'46064.254'}];
  
  const proteinData = [{'year':'2000', 'gppd':'106.1173'},
    {'year':'2001', 'gppd':'104.996574'}, {'year':'2002', 'gppd':'105.120964'},
    {'year':'2003', 'gppd':'103.919685'}, {'year':'2004', 'gppd':'104.82765'},
    {'year':'2005', 'gppd':'102.22755'}, {'year':'2006', 'gppd':'103.781845'},
    {'year':'2007', 'gppd':'104.78244'}, {'year':'2008', 'gppd':'105.17737'},
    {'year':'2009', 'gppd':'103.62841'}, {'year':'2010', 'gppd':'102.66495'},
    {'year':'2011', 'gppd':'102.147224'}, {'year':'2012', 'gppd':'104.136215'},
    {'year':'2013', 'gppd':'102.880005'}, {'year':'2014', 'gppd':'99.44325'},
    {'year':'2015', 'gppd':'98.42561'}, {'year':'2016', 'gppd':'103.18423'},
    {'year':'2017', 'gppd':'105.22894'}, {'year':'2018', 'gppd':'108.08585'},
    {'year':'2019', 'gppd':'106.781654'}, {'year':'2020', 'gppd':'106.307205'}];

  return (<div>
    <PlotController gdp={gdpData} protein={proteinData} title="Hello protein and gdp" />
    <ChartFilters years={years} validCountries={validCountries}/>
  </div>);
}