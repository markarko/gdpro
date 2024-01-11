import Select from '../select/Select';

/**
 * Represents a data range filter component.
 * @param {Object} props - The component props.
 * @param {number[]} props.years - The available years for selection.
 * @param {Object} props.dataRangeFilter - The current data range filter.
 * @param {number} props.dataRangeFilter.year - The selected year.
 * @param {string} props.dataRangeFilter.dataType - The selected data type.
 * @param {number} props.dataRangeFilter.min - The minimum value.
 * @param {number} props.dataRangeFilter.max - The maximum value.
 * @param {Function} props.setDataRangeFilter - The function to update the data range filter.
 * @param {boolean} props.disable - Whether the filter is disabled or not.
 * @returns {JSX.Element} The data range filter component.
 */
export default function DataRangeFilter({ years, dataRangeFilter, setDataRangeFilter, disable }) {
  /**
   * The available data type options.
   * @type {string[]}
   */
  const dataTypeOptions = ['gdp', 'protein'];

  /**
   * Updates the selected year in the data range filter.
   * @param {Event} e - The change event.
   */
  const updateYear = e => {
    const year = e.target.value;

    if (years.includes(Number(year))) {
      setDataRangeFilter((prevFilters) => ({
        ...prevFilters,
        year,
      }));
    }
  };

  /**
   * Updates the selected data type in the data range filter.
   * @param {Event} e - The change event.
   */
  const updateDataType = e => {
    const dataType = e.target.value;

    if (dataTypeOptions.includes(dataType)) {
      setDataRangeFilter((prevFilters) => ({
        ...prevFilters,
        dataType,
      }));

      validateMinValue(dataType);
      validateMaxValue(dataType);
    }
  };

  /**
   * Updates the value of a specific key in the data range filter.
   * @param {Event} e - The change event.
   * @param {string} key - The key to update.
   */
  const updateValue = (e, key) => {
    const value = Number(e.target.value);

    setDataRangeFilter((prevFilters) => ({
      ...prevFilters,
      [key]: value
    }));
  };

  /**
   * Validates and updates the minimum value in the data range filter.
   * @param {string} dataType - The data type to validate against.
   */
  const validateMinValue = dataType => {
    let min = dataRangeFilter.min;
    let max = dataRangeFilter.max;

    min = clampRangeValue(dataType || dataRangeFilter.dataType, dataTypeOptions, min);

    if (min > max) {
      max = min;
    }

    setDataRangeFilter((prevFilters) => ({
      ...prevFilters,
      min,
      max
    }));
  };

  /**
   * Validates and updates the maximum value in the data range filter.
   * @param {string} dataType - The data type to validate against.
   */
  const validateMaxValue = dataType => {
    let min = dataRangeFilter.min;
    let max = dataRangeFilter.max;

    max = clampRangeValue(dataType || dataRangeFilter.dataType, dataTypeOptions, max);

    if (max < min) {
      min = max;
    }

    setDataRangeFilter((prevFilters) => ({
      ...prevFilters,
      min,
      max
    }));
  };

  return (
    <div className={disable ? 'DataRangeFilter disabled' : 'DataRangeFilter'} >
      <Select
        options={years}
        labelText="Select the year: "
        onChange={e => updateYear(e)} />
      <Select
        options={dataTypeOptions}
        labelText="Select minimum and maximum values for "
        onChange={e => updateDataType(e)} />
      <ValueInput
        labelText="Min value: "
        onChange={e => updateValue(e, 'min')}
        onBlur={e => validateMinValue()}
        value={dataRangeFilter.min}
      />
      <ValueInput
        labelText="Max value: "
        onChange={e => updateValue(e, 'max')}
        onBlur={e => validateMaxValue()}
        value={dataRangeFilter.max}
      />
    </div>
  );
}

/**
 * Renders a value input component.
 *
 * @param {Object}  - The component props.
 * @param {string} labelText - The label text for the input.
 * @param {function} onChange - The event handler for the input change event.
 * @param {function} onBlur - The event handler for the input blur event.
 * @param {number} value - The value of the input.
 * @returns {JSX.Element} The rendered ValueInput component.
 */
function ValueInput({ labelText, onChange, onBlur, value }) {
  return (
    <div>
      <label>{labelText}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e)}
        onBlur={e => onBlur(e)} />
    </div>
  );
}

function clamp(num, min, max) {
  return num <= min 
    ? min 
    : num >= max 
      ? max 
      : num;
}

/**
 * Clamps the given value based on the data type.
 * @param {string} dataType - The data type.
 * @param {string[]} dataTypeOptions - The available data type options.
 * @param {number} value - The value to be clamped.
 * @returns {number} - The clamped value.
 */
function clampRangeValue(dataType, dataTypeOptions, value) {
  let clampedValue;

  switch(dataType) {
  // gdp
  case dataTypeOptions[0]:
    clampedValue = clamp(value, 0, 1000000);
    break;
  // protein
  case dataTypeOptions[1]:
    clampedValue = clamp(value, 0, 200);
    break;
  default:
    break;
  }

  return clampedValue;
}
