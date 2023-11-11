import '../Filters.css';
import BasicFilters from './basic/BasicFilters';
import { useState } from 'react';

export default function ChartFilters({ years, validCountries }) {
  const FilterType = {
    Basic: 'basic'
  };

  const [selectedFilterType, setSelectedFilterType] = useState(FilterType.Basic);

  const [basicFilters, setBasicFilters] = useState({
    country: validCountries[0],
    minYear: years[0],
    maxYear: years[years.length - 1]
  });

  const applyFilters = e => {
    e.preventDefault();
  };

  return(
    <form className="MapFilters" onSubmit={applyFilters}>
      <div className="filterType">
        <BasicFilters
          years={years}
          validCountries={validCountries}
          basicFilters={basicFilters}
          setBasicFilters={setBasicFilters}
          disable={selectedFilterType !== FilterType.Basic} />
      </div>
      <button>Apply</button>
    </form>
  );
}

