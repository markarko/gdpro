import './CountryRankingFilter.css';
import Select from '../../map/select/Select.js';

/**
 * Component that groups the input values and their logic for the country
 * ranking filter
 * 
 * @param {Function} setCountryRankingFilter - Function to set the country ranking filter
 * state variable
 * @param {boolean} disable - Boolean representing whether the filter should be disabled
 */
export default function CountryRankingFilter({ setCountryRankingFilter, disable }) {
  const orderByOptions = ['highest', 'lowest'];
  const values = ['gdp', 'protein'];
  
  // Updates the filter based on the newly selected variation type
  const updateVariation = e => {
    const orderBy = e.target.value;
    if (orderByOptions.includes(orderBy)) {
      setCountryRankingFilter((prevFilter) => ({
        ...prevFilter,
        orderBy,
      }));
    }
  };
  
  // Updates the filter based on the newly selected data type
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