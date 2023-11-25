import './SelectedCountries.css';

export default function SelectedCountries({ basicFilters, setBasicFilters }) {
  const selectedCountries = basicFilters['countries'];

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

function SelectedCountry({ country, removeCountry }) {
  return (
    <div className="SelectedCountry">
      <div>{country}</div>
      <button className = "delete-button" onClick={e => removeCountry(country)}>X</button>
    </div>
  );
}