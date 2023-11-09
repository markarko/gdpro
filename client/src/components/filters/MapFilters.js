import Select from './SelectFilter';
import CountryFilter from './CountryFilter';

export default function MapFilters({ years, countries }) {
  return(
    <div>
      <Select options={years} labelText="Select the year: " />
      <CountryFilter countries={countries} />
    </div>
  );
}

