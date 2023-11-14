import '../Filters.css';
import TopCountriesFilter from './top_countries/TopCountriesFilter';
import BasicFilters from './basic/BasicFilters';
import { useState } from 'react';

export default function MapFilters({ years, validCountries }) {
  const FilterType = {
    Basic: 'basic',
    TopCountries: 'top-countries'
  };

  const [selectedFilterType, setSelectedFilterType] = useState(FilterType.Basic);

  const [basicFilters, setBasicFilters] = useState({
    year: 1990,
    countries: [],
  });
  
  const [, setTopCountriesFilter] = useState({
    top: 3,
    variation: 'highest',
    value: 'gdp'
  });

  const applyFilters = e => {
    e.preventDefault();
  };

  return(
    <form className="MapFilters" onSubmit={applyFilters}>
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
        <input type="radio" name="filterType" value={FilterType.TopCountries}
          onChange={e => setSelectedFilterType(e.target.value)}
          checked={selectedFilterType === FilterType.TopCountries} />
        <TopCountriesFilter
          setTopCountriesFilter={setTopCountriesFilter}
          selectedFilterType={selectedFilterType}
          disable={selectedFilterType !== FilterType.TopCountries} />
      </div>
      <button>Apply</button>
    </form>
  );
}

