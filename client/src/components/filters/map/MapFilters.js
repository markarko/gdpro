import './MapFilters.css';
import TopCountriesFilter from './top_countries/TopCountriesFilter';
import BasicFilters from './basic/BasicFilters';
import { useState } from 'react';

export default function MapFilters({ years, validCountries }) {
  const [basicFilters, setBasicFilters] = useState({
    year: 1990,
    countries: [],
  });

  const applyFilters = e => {
    e.preventDefault();
  };

  return(
    <form className="MapFilters" onSubmit={applyFilters}>
      <BasicFilters
        years={years}
        validCountries={validCountries}
        basicFilters={basicFilters}
        setBasicFilters={setBasicFilters} />
      <TopCountriesFilter />
      <button>Apply</button>
    </form>
  );
}

