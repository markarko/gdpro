import '../Filters.css';
import BasicFilters from './basic/BasicFilters';
import CountryRankingFilter from './country_ranking/CountryRankingFilter';
import { useState, useEffect } from 'react';

export default function ChartFilters({
  setGdp,
  setProtein,
  validYears,
  validCountries,
  dataLayout,
  setError,
  setChartTitle }) {

  const FilterType = {
    Basic: 'basic',
    CountryRanking: 'country-ranking'
  };

  const [selectedFilterType, setSelectedFilterType] = useState(FilterType.Basic);

  const [basicFilters, setBasicFilters] = useState({
    country: validCountries[0],
    minYear: validYears[0],
    maxYear: validYears[validYears.length - 1]
  });

  const [countryRankingFilter, setCountryRankingFilter] = useState({
    orderBy: 'highest',
    value: 'gdp'
  });

  useEffect(() => {
    async function fetchDefaultData() {
      await updateDataWithBasicFilters(setGdp, setProtein, basicFilters, setChartTitle);
    }

    fetchDefaultData();
  // this is the initial fetch, so it should be ran only on the initial render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = async e => {
    e.preventDefault();
    try{
      switch (selectedFilterType) {
      case FilterType.Basic:
        await updateDataWithBasicFilters(setGdp, setProtein, basicFilters, setChartTitle);
        break;
      case FilterType.CountryRanking:
        await updateDataWithCountryRankingFilter(
          setGdp,
          setProtein,
          countryRankingFilter,
          dataLayout,
          setChartTitle);
        break;
      default: break;
      }
    } catch(err) {
      setError(err.message);
    }
  };

  return(
    <form className="ChartFilters" onSubmit={applyFilters}>
      <div className="filterType">
        <input
          type="radio"
          name="filterType"
          value={FilterType.Basic}
          onChange={e => setSelectedFilterType(e.target.value)}
          checked={selectedFilterType === FilterType.Basic} />
        <BasicFilters
          years={validYears}
          validCountries={validCountries}
          basicFilters={basicFilters}
          setBasicFilters={setBasicFilters}
          disable={selectedFilterType !== FilterType.Basic} />
      </div>
      <div className="filterType">
        <input
          type="radio"
          name="filterType"
          value={FilterType.CountryRanking}
          onChange={e => setSelectedFilterType(e.target.value)}
          checked={selectedFilterType === FilterType.CountryRanking} />
        <CountryRankingFilter
          setCountryRankingFilter={setCountryRankingFilter}
          disable={selectedFilterType !== FilterType.CountryRanking} />
      </div>
      <button>Apply</button>
    </form>
  );
}

async function updateDataWithBasicFilters(
  setGdp,
  setProtein,
  basicFilters,
  setChartTitle) {

  async function getDataForBasicFitlers(dataType, basicFilters, setChartTitle) {
    const country = basicFilters['country'];
    const minYear = basicFilters['minYear'];
    const maxYear = basicFilters['maxYear'];
  
    const url = `/api/v1/${dataType}/countries/${country}?startYear=${minYear}&endYear=${maxYear}`;
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok){
      throw new Error(json.error);
    }

    // currently gets called twice
    setChartTitle(createChartTitle(true, true, country));

    return json;
  }

  const [gdpData, proteinData] = await Promise.all([
    getDataForBasicFitlers('gdp', basicFilters, setChartTitle),
    getDataForBasicFitlers('protein', basicFilters, setChartTitle)
  ]);

  setGdp(gdpData);
  setProtein(proteinData);
}

async function updateDataWithCountryRankingFilter(
  setGdp,
  setProtein,
  countryRankingFilter,
  dataLayout,
  setChartTitle ) {

  async function getDataForCountryRankingFilter() {
    const orderBy = countryRankingFilter['orderBy'];
    const value = countryRankingFilter['value'];

    const url = `/api/v1/${value}/countries/top/1?orderBy=${orderBy}`;
    const response = await fetch(url);
    const json = await response.json();
    
    if (!response.ok){
      throw new Error(json.error);
    }

    return json;
  }
  
  const dataSingleYear = await getDataForCountryRankingFilter();
  const countryName = dataSingleYear.data.results[0].country;
  const dataType = countryRankingFilter['value'];
  
  const url = `/api/v1/${dataType}/countries/${countryName}`;
  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok){
    throw new Error(json.error);
  }

  if (countryRankingFilter['value'] === 'gdp'){
    setGdp(json);
    setProtein(dataLayout);
    setChartTitle(createChartTitle(true, false, countryName));
  } else if (countryRankingFilter['value'] === 'protein') {
    setProtein(json);
    setGdp(dataLayout);
    setChartTitle(createChartTitle(false, true, countryName));
  }

}

function createChartTitle(gdpSelected, proteinSelected, countryName){
  let title = '';

  title += gdpSelected ? 'gdp ' : '';
  title += gdpSelected && proteinSelected ? 'and ' : '';
  title += proteinSelected ? 'daily protein intake ' : '';
  title += `of ${countryName} `;

  return title;
}