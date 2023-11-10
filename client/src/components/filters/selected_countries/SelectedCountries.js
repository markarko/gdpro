import './SelectedCountries.css';

export default function SelectedCountries({ selectedCountries, setSelectedCountries }) {
  const removeCountry = (country) => {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
  };

  return (
    <div className="SelectedCountries">
      {selectedCountries.map(country => <SelectedCountry
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
      <button onClick={e => removeCountry(country)}>X</button>
    </div>
  );
}