export default function Slider({ labelText, values, basicFilters, setBasicFilters, yearType }) {
  const updateYear = e => {
    const year = e.target.value;
    setBasicFilters((prevFilters) => ({
      ...prevFilters,
      [yearType]: year,
    }));
  };

  return (
    <div>
      <label for="volume">{labelText}</label>
      <input
        type="range"
        min={values[0]}
        max={values[values.length - 1]}
        value={basicFilters[yearType]}
        onChange={e => updateYear(e)} />
      <span>{basicFilters[yearType]}</span>
    </div>
  );
}