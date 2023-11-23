import Select from '../select/Select';

export default function DataRangeFilter({ years, dataRangeFilter, setDataRangeFilter, disable }) {
  const dataTypeOptions = ['gdp', 'protein'];

  const updateYear = e => {
    const year = e.target.value;

    if (years.includes(Number(year))) {
      setDataRangeFilter((prevFilters) => ({
        ...prevFilters,
        year,
      }));
    }
  };

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

  /* Explanation for the need of update and validate functions:

    The ValueInput component's value is determined by the state variable
    dataRangeFilter in the parent component (min or max fields). It has an
    onChange event, which updates the state variable. If you try to add the
    validation, within the update functions, then the validation becomes
    very clunky from the user's perspective (I tried it myself). Hence, I
    decided to separate the value updating and its validation into separate
    functions, and call the validation only when the user typed their input and
    exited the input field, i.e. on the onBlur event in the ValueInput component.
  */

  const updateValue = (e, key) => {
    const value = Number(e.target.value);

    setDataRangeFilter((prevFilters) => ({
      ...prevFilters,
      [key] : value
    }));
  };

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
