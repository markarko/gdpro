import '../../Filters.css';
import './TopCountriesFilter.css';
import Select from '../select/Select';

/**
 * Renders a filter component for selecting top countries based on various criteria.
 * @param {Object} setTopCountriesFilter - A function to update the top countries filter state.
 * @param {boolean} disable - A flag to disable the filter component.
 * @returns {JSX.Element} The rendered filter component.
 */
export default function TopCountriesFilter({ setTopCountriesFilter, disable }) {
  const topRange = [3, 4, 5, 6, 7, 8, 9, 10];
  const variations = ['highest', 'lowest'];
  const values = ['gdp', 'protein'];

  /**
   * Updates the top range value in the filter state.
   * @param {Event} e - The change event.
   */
  const updateTopRange = e => {
    const top = e.target.value;
    if (topRange.includes(Number(top))) {
      setTopCountriesFilter((prevFilter) => ({
        ...prevFilter,
        top,
      }));
    }
  };

  /**
   * Updates the variation value in the filter state.
   * @param {Event} e - The change event.
   */
  const updateVariation = e => {
    const variation = e.target.value;
    if (variations.includes(variation)) {
      setTopCountriesFilter((prevFilter) => ({
        ...prevFilter,
        variation,
      }));
    }
  };

  /**
   * Updates the value in the filter state.
   * @param {Event} e - The change event.
   */
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