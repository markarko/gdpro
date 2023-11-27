import React from 'react';

export default function YearSlider({
  labelText,
  values,
  filters,
  setFilters,
  yearType,
}) {
  const updateYear = (e) => {
    const year = parseInt(e.target.value, 10);

    setFilters((prevFilters) => {
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
      <label className="year-slider">{labelText}</label>
      <br />
      <input
        id="year-slider"
        type="range"
        min={values[0]}
        max={values[values.length - 1]}
        value={filters[yearType]}
        onChange={(e) => {
          updateYear(e);
        }}
      />
      <span>{filters[yearType]}</span>
    </div>
  );
}
