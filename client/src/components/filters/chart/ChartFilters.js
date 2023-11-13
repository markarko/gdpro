import '../Filters.css';
import BasicFilters from './basic/BasicFilters';
import CountryRankingFilter from './country_ranking/CountryRankingFilter';
import { useState, useEffect } from 'react';

export default function ChartFilters({ setGdp, setProtein }) {
  // currently hardcode, later take from an initial fetch
  const years = Array.from(Array(31).keys()).map(x => x + 1990);
  const validCountries = ['Canada', 'Ukraine', 'Mexico', 'Russia', 'England'];

  const FilterType = {
    Basic: 'basic',
    CountryRanking: 'country-ranking'
  };

  const [selectedFilterType, setSelectedFilterType] = useState(FilterType.Basic);

  const [basicFilters, setBasicFilters] = useState({
    country: validCountries[0],
    minYear: years[0],
    maxYear: years[years.length - 1]
  });

  const [countryRankingFilter, setCountryRankingFilter] = useState({
    orderBy: 'highest',
    value: 'gdp'
  });

  useEffect(() => {
    async function fetchDefaultData() {
      await updateDataWithBasicFilters();
    }
    fetchDefaultData();
  }, []);

  const applyFilters = async e => {
    e.preventDefault();
    switch (selectedFilterType) {
    case FilterType.Basic:
      await updateDataWithBasicFilters();
      break;
    case FilterType.CountryRanking:
      await updateDataWithCountryRankingFilter();
      break;
    default:
      break;
    }
  };

  async function updateDataWithBasicFilters() {
    try {
      const [gdpData, proteinData] = await Promise.all([
        getDataForBasicFitlers('gdp'),
        getDataForBasicFitlers('protein')
      ]);

      setGdp(gdpData);
      setProtein(proteinData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function updateDataWithCountryRankingFilter() {
    try {
      const data = await getDataForCountryRankingFilter();

      if (countryRankingFilter['value'] === 'gdp'){
        setGdp(data);
      } else if (countryRankingFilter['value'] === 'protein') {
        setProtein(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function getDataForBasicFitlers(dataType) {
    const country = basicFilters['country'];
    const minYear = basicFilters['minYear'];
    const maxYear = basicFilters['maxYear'];

    const url = `/api/v1/${dataType}/countries/${country}?startYear=${minYear}&endYear=${maxYear}`;
    const response = await fetch(url);

    return await response.json();
  }

  async function getDataForCountryRankingFilter() {
    const orderBy = countryRankingFilter['orderBy'];
    const value = countryRankingFilter['value'];

    const url = `/api/v1/${value}/countries/top/1?orderBy=${orderBy}`;
    const response = await fetch(url);

    return await response.json();
  }

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
          years={years}
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

