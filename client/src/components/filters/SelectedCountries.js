export default function SelectedCountries({ countries }) {
  return (
    <div>
      {countries.map(country => <SelectedCountry country={country} />)}
    </div>
  );
}

function SelectedCountry({ country }) {
  return (
    <div>
      <div key={country}>{country}</div>
      <button>X</button>
    </div>
  );
}