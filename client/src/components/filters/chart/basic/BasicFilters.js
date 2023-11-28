import '../../Filters.css';
import './BasicFilters.css';
import Select from '../../map/select/Select';
import YearSlider from '../slider/Slider';

/**
 * Component that groups the input values and their logic for the basic filters
 * 
 * @param {Array<Number>} years - The range of years to display on the slider input
 * @param {Array<string>} validCountries - The countries to display in a dropdown input menu
 * @param {Object} basicFilters - The state variable containing all values related to
 * the basic filters
 * @param {Function} setBasicFilters - Function to set the basicFilters
 * state variable
 * @param {Boolean} disable - Boolean representing whether this filter should be disabled
 */
export default function BasicFilters({
  years,
  validCountries,
  basicFilters,
  setBasicFilters,
  disable }) {

  // Updates the filter based on the newly selected country
  const updateCountry = e => {
    const country = e.target.value;
    if (validCountries.includes(country)) {
      setBasicFilters((prevFilters) => ({
        ...prevFilters,
        country,
      }));
    }
  };

  return (
    <div className={disable ? 'disabled' : ''} style={{'display':'flex', 'flexDirection':'column'}}>
      <Select
        options={validCountries}
        labelText="Select the country: "
        onChange={e => updateCountry(e)} />
      <YearSlider
        labelText="Min year:"
        values={years}
        filters={basicFilters}
        setFilters={setBasicFilters}
        yearType="minYear" />
      <YearSlider
        labelText="Max year:"
        values={years}
        filters={basicFilters}
        setFilters={setBasicFilters}
        yearType="maxYear" />
    </div>
  );
}