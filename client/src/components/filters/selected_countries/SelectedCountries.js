import './SelectedCountries.css';

export default function SelectedCountries({ countries }) {
  return (
    <div className="SelectedCountries">
      {countries.map(country => <SelectedCountry key={country} country={country} />)}
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