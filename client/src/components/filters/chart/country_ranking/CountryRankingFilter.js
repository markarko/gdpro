import './CountryRankingFilter.css';
import Select from '../../map/select/Select.js';

export default function CountryRankingFilter({ setCountryRankingFilter, disable }) {
  const variations = ['highest', 'lowest'];
  const values = ['gdp', 'protein'];
  
  const updateVariation = e => {
    const variation = e.target.value;
    if (variations.includes(variation)) {
      setCountryRankingFilter((prevFilter) => ({
        ...prevFilter,
        variation,
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
        options={variations}
        labelText="Select the country with the "
        onChange={updateVariation} />
      <Select
        options={values}
        labelText=""
        onChange={updateValue} />
    </div>
  );
}