import Select from '../select/Select';

export default function DataRangeFilter({ years, setDataRangeFilter, disable }) {
  const updateYear = e => {
    const year = e.target.value;
    if (years.includes(Number(year))) {
      setDataRangeFilter((prevFilters) => ({
        ...prevFilters,
        year,
      }));
    }
  };

  return (
    <div className={disable ? 'DataRangeFilter disabled' : 'DataRangeFilter'} >
      <Select
        options={years}
        labelText="Select the year: "
        onChange={e => updateYear(e)} />
    </div>
  );
}