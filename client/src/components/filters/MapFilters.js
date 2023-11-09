import Select from './Select';
import CountryFilter from './CountryFilter';
import SelectedCountries from './SelectedCountries';
import TopCountriesFilter from './TopCountriesFilter';

export default function MapFilters({ years, countries }) {
  return(
    <div>
      <Select options={years} labelText="Select the year: " />
      <CountryFilter countries={countries} />
      <SelectedCountries countries={countries.slice(2)}/>
      <TopCountriesFilter />
    </div>
  );
}

