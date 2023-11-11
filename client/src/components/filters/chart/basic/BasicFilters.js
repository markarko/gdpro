import '../../Filters.css';
// import './BasicFilters.css';
import Select from '../../map/select/Select';

export default function BasicFilters({
  years,
  validCountries,
  basicFilters,
  setBasicFilters,
  disable }) {

  const updateCountry = e => {
    const country = e.target.value;
    if (validCountries.includes(Number(country))) {
      setBasicFilters((prevFilters) => ({
        ...prevFilters,
        country,
      }));
    }
  };

  return (
    <div className={disable ? 'disabled' : ''}>
      <Select
        options={validCountries}
        labelText="Select the country: "
        onChange={e => updateCountry(e)} />
    </div>
  );
}