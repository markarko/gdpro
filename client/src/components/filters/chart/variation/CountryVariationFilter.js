import '../../Filters.css';
import Select from '../../map/select/Select';
import YearSlider from '../slider/Slider';

export default function CountryVariationFilter({
  years,
  validCountries,
  countryVariationFilter,
  setCountryVariationFilter,
  disable }) {

  const select = ['gdp', 'protein'];

  const updateFilter = e => {
    const country = e.target.value;
    if (validCountries.includes(country)) {
      setCountryVariationFilter((prevFilters) => ({
        ...prevFilters,
        country,
      }));
    }
  };

  const updateValue = e => {
    const value = e.target.value;
    if (select.includes(value)) {
      setCountryVariationFilter((prevFilter) => ({
        ...prevFilter,
        value,
      }));
    }
  };

  return (
    <div className={disable ? 'disabled' : ''} style={{'display':'flex', 'flexDirection':'column'}}>
      <Select
        options={validCountries}
        labelText="Select the country: "
        onChange={e => updateFilter(e)} />
      <Select
        options={select}
        labelText="Select the variable: "
        onChange={e => updateValue(e)} />
      <YearSlider
        labelText="Start year:"
        values={years}
        filters={countryVariationFilter}
        setFilters={setCountryVariationFilter}
        yearType="minYear" />
      <YearSlider
        labelText="End year:"
        values={years}
        filters={countryVariationFilter}
        setFilters={setCountryVariationFilter}
        yearType="maxYear" />
    </div>
  );
}