import '../Filters.css';
import BasicFilters from './basic/BasicFilters';
import { useState } from 'react';
import CountryRankingFilter from './country_ranking/CountryRankingFilter';

export default function ChartFilters({ years, validCountries }) {
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
    variation: 'highest',
    value: 'gdp'
  });

  const applyFilters = e => {
    e.preventDefault();
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

