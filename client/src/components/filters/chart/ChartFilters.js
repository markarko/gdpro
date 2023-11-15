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
  setError }) {
    
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
      await updateDataWithBasicFilters(setGdp, setProtein, basicFilters);
    }
    fetchDefaultData();
  }, []);

  const applyFilters = async e => {
    e.preventDefault();
    try{
      switch (selectedFilterType) {
      case FilterType.Basic:
        await updateDataWithBasicFilters(setGdp, setProtein, basicFilters); break;
      case FilterType.CountryRanking:
        await updateDataWithCountryRankingFilter(
          setGdp,
          setProtein,
          countryRankingFilter,
          dataLayout);
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
  basicFilters) {

  async function getDataForBasicFitlers(dataType, basicFilters) {
    const country = basicFilters['country'];
    const minYear = basicFilters['minYear'];
    const maxYear = basicFilters['maxYear'];
  
    const url = `/api/v1/${dataType}/countries/${country}?startYear=${minYear}&endYear=${maxYear}`;
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok){
      throw new Error(json.error);
    }

    return json;
  }

  const [gdpData, proteinData] = await Promise.all([
    getDataForBasicFitlers('gdp', basicFilters),
    getDataForBasicFitlers('protein', basicFilters)
  ]);

  setGdp(gdpData);
  setProtein(proteinData);
}

async function updateDataWithCountryRankingFilter(
  setGdp,
  setProtein,
  countryRankingFilter,
  dataLayout) {

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
  
  const data = await getDataForCountryRankingFilter();

  if (countryRankingFilter['value'] === 'gdp'){
    setGdp(data);
    setProtein(dataLayout);
  } else if (countryRankingFilter['value'] === 'protein') {
    setProtein(data);
    setGdp(dataLayout);
  }
}  