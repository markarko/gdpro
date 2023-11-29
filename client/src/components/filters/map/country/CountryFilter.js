import './CountryFilter.css';
import Select from '../select/Select';

/**
 * Renders a country filter component.
 * @param {Array} validCountries - The list of valid countries.
 * @param {Object} basicFilters - The basic filters object.
 * @param {Function} setBasicFilters - The function to update the basic filters.
 * @returns {JSX.Element} The country filter component.
 */
export default function CountryFilter({ validCountries, basicFilters, setBasicFilters }) {
  /**
   * Adds a selected country to the basic filters.
   */
  const addCountry = () => {
    const country = document.querySelector('.CountryFilter select').value;
    const selectedCountries = basicFilters['countries'];

    if (country && !selectedCountries.includes(country)) {
      const updatedCountries = [...selectedCountries, country];
      setBasicFilters((prevFilters) => ({
        ...prevFilters,
        countries: updatedCountries,
      }));
    }
  };

  return (
    <div className="CountryFilter">
      <Select
        options={validCountries}
        labelText="Select a country to be displayed: "/>
      <button className="add-button" type="button" onClick={addCountry}>Add</button>
    </div>
  );
}