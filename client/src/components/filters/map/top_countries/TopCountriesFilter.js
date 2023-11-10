import './TopCountriesFilter.css';
import '../MapFilters.css';
import Select from '../select/Select';

export default function TopCountriesFilter({ setTopCountriesFilter, disable }) {
  const topRange = [3, 4, 5, 6, 7, 8, 9, 10];
  const variations = ['highest', 'lowest'];
  const values = ['gdp', 'protein'];

  const updateTopRange = e => {
    const top = e.target.value;
    if (topRange.includes(Number(top))) {
      setTopCountriesFilter((prevFilter) => ({
        ...prevFilter,
        top,
      }));
    }
  };

  const updateVariation = e => {
    const variation = e.target.value;
    if (variations.includes(variation)) {
      setTopCountriesFilter((prevFilter) => ({
        ...prevFilter,
        variation,
      }));
    }
  };

  const updateValue = e => {
    const value = e.target.value;
    if (values.includes(value)) {
      setTopCountriesFilter((prevFilter) => ({
        ...prevFilter,
        value,
      }));
    }
  };

  return (
    <div className={disable ? 'TopCountriesFilter disabled' : 'TopCountriesFilter'} >
      <Select 
        options={topRange}
        labelText="Select top "
        onChange={updateTopRange} />
      <Select
        options={variations}
        labelText=" countries with "
        onChange={updateVariation} />
      <Select
        options={values}
        labelText=""
        onChange={updateValue} />
    </div>
  );
}