import React from 'react';

export default function YearSlider({
  labelText,
  values,
  basicFilters,
  setBasicFilters,
  yearType,
}) {
  const updateYear = (e) => {
    const year = parseInt(e.target.value, 10);

    setBasicFilters((prevFilters) => {
      let newFilters = {
        ...prevFilters,
        [yearType]: year,
      };

      if (yearType === 'minYear' && newFilters.minYear > newFilters.maxYear) {
        newFilters = {
          ...newFilters,
          maxYear: newFilters.minYear,
        };
      } else if (yearType === 'maxYear' && newFilters.maxYear < newFilters.minYear) {
        newFilters = {
          ...newFilters,
          minYear: newFilters.maxYear,
        };
      }

      return newFilters;
    });
  };

  return (
    <div>
      <label>{labelText}</label>
      <input
        type="range"
        min={values[0]}
        max={values[values.length - 1]}
        value={basicFilters[yearType]}
        onChange={(e) => {
          updateYear(e);
        }}
      />
      <span>{basicFilters[yearType]}</span>
    </div>
  );
}
