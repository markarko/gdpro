import './SelectedCountries.css';

/**
 * Renders a list of selected countries.
 * @param {Object} basicFilters - The basic filters object.
 * @param {Function} setBasicFilters - The function to update the basic filters object.
 * @returns {JSX.Element} The SelectedCountries component.
 */
export default function SelectedCountries({ basicFilters, setBasicFilters }) {
  const selectedCountries = basicFilters['countries'];

  /**
   * Removes a country from the selected countries list.
   * @param {string} country - The country to be removed.
   */
  const removeCountry = (country) => {  
    setBasicFilters((prevFilters) => ({
      ...prevFilters,
      countries: selectedCountries.filter(c => c !== country),
    }));
  };

  return (
    <div className="SelectedCountries">
      {selectedCountries && selectedCountries.map(country => <SelectedCountry
        key={country}
        country={country}
        removeCountry={removeCountry} />)}
    </div>
  );
}

/**
 * Represents a selected country component.
 * @param {string} country - The name of the selected country.
 * @param {Function} removeCountry - The function to remove the selected country.
 * @returns {JSX.Element} The selected country component.
 */
function SelectedCountry({ country, removeCountry }) {
  return (
    <div className="SelectedCountry">
      <div>{country}</div>
      <button className = "delete-button" onClick={e => removeCountry(country)}>X</button>
    </div>
  );
}