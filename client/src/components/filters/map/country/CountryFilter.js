import './CountryFilter.css';
import Select from '../select/Select';

export default function CountryFilter({ validCountries, basicFilters, setBasicFilters }) {
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
      <button type="button" onClick={addCountry} >Add</button>
    </div>
  );
}