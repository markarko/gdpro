import Select from '../select/Select';

export default function DataRangeFilter({ years, setDataRangeFilter, disable }) {
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
    }
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
    </div>
  );
}