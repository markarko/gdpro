import './SelectedCountries.css';

export default function SelectedCountries({ selectedCountries }) {
  return (
    <div className="SelectedCountries">
      {selectedCountries.map(country => <SelectedCountry
        key={country}
        country={country}
        selectedCounties={selectedCountries} />)}
    </div>
  );
}

function SelectedCountry({ country }) {
  return (
    <div className="SelectedCountry">
      <div>{country}</div>
      <button>X</button>
    </div>
  );
}