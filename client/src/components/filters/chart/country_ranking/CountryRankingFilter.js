import './CountryRankingFilter.css';
import Select from '../../map/select/Select.js';

export default function CountryRankingFilter({ setCountryRankingFilter, disable }) {
  const orderByOptions = ['highest', 'lowest'];
  const values = ['gdp', 'protein'];
  
  const updateVariation = e => {
    const orderBy = e.target.value;
    if (orderByOptions.includes(orderBy)) {
      setCountryRankingFilter((prevFilter) => ({
        ...prevFilter,
        orderBy,
      }));
    }
  };
  
  const updateValue = e => {
    const value = e.target.value;
    if (values.includes(value)) {
      setCountryRankingFilter((prevFilter) => ({
        ...prevFilter,
        value,
      }));
    }
  };
  
  return (
    <div className={disable ? 'CountryRanking disabled' : 'CountryRanking'} >
      <Select
        options={orderByOptions}
        labelText="Select the country with the "
        onChange={updateVariation} />
      <Select
        options={values}
        labelText=""
        onChange={updateValue} />
    </div>
  );
}