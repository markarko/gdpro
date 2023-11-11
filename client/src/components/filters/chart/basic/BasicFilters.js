import '../../Filters.css';
import Select from '../../map/select/Select';
import Slider from '../slider/Slider';

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
      <Slider
        labelText="Min year:"
        values={years}
        basicFilters={basicFilters}
        setBasicFilters={setBasicFilters}
        yearType="minYear" />
      <Slider
        labelText="Max year:"
        values={years}
        basicFilters={basicFilters}
        setBasicFilters={setBasicFilters}
        yearType="maxYear" />
    </div>
  );
}