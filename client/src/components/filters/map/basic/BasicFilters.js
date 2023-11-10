import '../MapFilters.css';
import Select from '../select/Select';
import CountryFilter from '../country/CountryFilter';
import SelectedCountries from '../selected_countries/SelectedCountries';

export default function BasicFilters({
  years,
  validCountries,
  basicFilters,
  setBasicFilters,
  disable }) {

  return (
    <div className={disable ? 'disabled' : ''}>
      <Select options={years} labelText="Select the year: " />
      <CountryFilter
        validCountries={validCountries}
        basicFilters={basicFilters}
        setBasicFilters={setBasicFilters} />
      <SelectedCountries
        basicFilters={basicFilters}
        setBasicFilters={setBasicFilters} />
    </div>
  );
}