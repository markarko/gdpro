import './MapFilters.css';
import Select from '../select/Select';
import CountryFilter from '../country/CountryFilter';
import SelectedCountries from '../selected_countries/SelectedCountries';
import TopCountriesFilter from '../top_countries/TopCountriesFilter';
import { useState } from 'react';

export default function MapFilters({ years, countries }) {
  const [selectedCountries, setSelectedCountries] = useState([]);

  return(
    <div className="MapFilters">
      <Select options={years} labelText="Select the year: " />
      <CountryFilter
        countries={countries}
        selectedCountries={selectedCountries}
        setSelectedCounties={setSelectedCountries} />
      <SelectedCountries
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries} />
      <TopCountriesFilter />
      <button>Apply</button>
    </div>
  );
}

