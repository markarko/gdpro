import '../../Filters.css';
import Select from '../../map/select/Select';
import YearSlider from '../slider/Slider';

/**
 * Component that groups the input values and their logic for the country
 * variation filter
 * 
 * @param {Array<Number>} years - The range of years to display on the slider input
 * @param {Array<string>} validCountries - The countries to display in a dropdown input menu
 * @param {Object} countryVariationFilter - The state variable containing all values related to
 * the country variation filter
 * @param {Function} setCountryVariationFilter - Function to set the countryVariationFilter
 * state variable
 * @param {Boolean} disable - Boolean representing whether this filter should be disabled
 */
export default function CountryVariationFilter({
  years,
  validCountries,
  countryVariationFilter,
  setCountryVariationFilter,
  disable }) {

  const select = ['gdp', 'protein'];

  // Updates the filter based on the newly selected country 
  const updateFilter = e => {
    const country = e.target.value;
    if (validCountries.includes(country)) {
      setCountryVariationFilter((prevFilters) => ({
        ...prevFilters,
        country,
      }));
    }
  };

  // Updates the filter based on the newly selected data set
  const updateValue = e => {
    const value = e.target.value;
    if (select.includes(value)) {
      setCountryVariationFilter((prevFilter) => ({
        ...prevFilter,
        value,
      }));
    }
  };

  return (
    <div className={disable ? 'disabled' : ''} style={{'display':'flex', 'flexDirection':'column'}}>
      <Select
        options={validCountries}
        labelText="Select the country: "
        onChange={e => updateFilter(e)} />
      <Select
        options={select}
        labelText="Select the variable: "
        onChange={e => updateValue(e)} />
      <YearSlider
        labelText="Start year:"
        values={years}
        filters={countryVariationFilter}
        setFilters={setCountryVariationFilter}
        yearType="minYear" />
      <YearSlider
        labelText="End year:"
        values={years}
        filters={countryVariationFilter}
        setFilters={setCountryVariationFilter}
        yearType="maxYear" />
    </div>
  );
}