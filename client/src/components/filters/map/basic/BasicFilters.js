import '../../Filters.css';
import './BasicFilters.css';
import Select from '../select/Select';
import CountryFilter from '../country/CountryFilter';
import SelectedCountries from '../selected_countries/SelectedCountries';

export default function BasicFilters({
  years,
  validCountries,
  basicFilters,
  setBasicFilters,
  disable }) { 

  const updateYear = e => {
    const year = e.target.value;
    if (years.includes(year)) {
      setBasicFilters((prevFilters) => ({
        ...prevFilters,
        year,
      }));
    }
  };

  return (
    <div className={disable ? 'disabled' : ''}>
      <Select
        options={years}
        labelText="Select the year: "
        onChange={e => updateYear(e)} />
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