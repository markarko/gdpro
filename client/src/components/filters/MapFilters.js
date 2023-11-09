import Select from './SelectFilter';
import CountryFilter from './CountryFilter';
import SelectedCountries from './SelectedCountries';

export default function MapFilters({ years, countries }) {
  return(
    <div>
      <Select options={years} labelText="Select the year: " />
      <CountryFilter countries={countries} />
      <SelectedCountries countries={countries.slice(2)}/>
    </div>
  );
}

