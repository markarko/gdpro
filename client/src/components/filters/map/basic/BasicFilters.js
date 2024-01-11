import '../../Filters.css';
import './BasicFilters.css';
import Select from '../select/Select';
import CountryFilter from '../country/CountryFilter';
import SelectedCountries from '../selected_countries/SelectedCountries';

/**
 * Renders the basic filters component.
 * @param {number[]} years - The available years.
 * @param {string[]} validCountries - The valid countries.
 * @param {Object} basicFilters - The basic filters.
 * @param {Function} setBasicFilters - The function to update the basic filters.
 * @param {boolean} disable - Whether the component is disabled or not.
 * @returns {JSX.Element} The basic filters component.
 */
export default function BasicFilters({
  years,
  validCountries,
  basicFilters,
  setBasicFilters,
  disable }) { 

  const updateYear = e => {
    const year = e.target.value;
    if (years.includes(Number(year))) {
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