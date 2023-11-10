import './CountryFilter.css';
import Select from '../select/Select';

export default function CountryFilter({ countries, selectedCountries, setSelectedCounties }) {
  const addCountry = () => {
    const country = document.querySelector('.CountryFilter select').value;
    if (country && !selectedCountries.includes(country)) {
      setSelectedCounties([...selectedCountries, country]);
    }
  };

  return (
    <div className="CountryFilter">
      <Select options={countries} labelText="Select a country to be displayed: "/>
      <button onClick={addCountry} >Add</button>
    </div>
  );
}