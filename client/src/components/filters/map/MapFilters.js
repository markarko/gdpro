import './MapFilters.css';
import Select from '../Select';
import CountryFilter from '../country/CountryFilter';
import SelectedCountries from '../selected_countries/SelectedCountries';
import TopCountriesFilter from '../top_countries/TopCountriesFilter';

export default function MapFilters({ years, countries }) {
  return(
    <div className="MapFilters">
      <Select options={years} labelText="Select the year: " />
      <CountryFilter countries={countries} />
      <SelectedCountries countries={countries.slice(2)}/>
      <TopCountriesFilter />
      <button>Apply</button>
    </div>
  );
}

