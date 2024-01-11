import React from 'react';

/**
 * Component that implements an html slider to select a year
 * 
 * @param {string} labelText - The text to display on the label of the slider
 * @param {Array<Number>} values - The years to display on the slider
 * @param {Object} filters - The state variable containing all values related to
 * the filter that has 'minYear' and 'maxYear' fields
 * @param {Function} setFilters - Function to set the corresponding filters state variable
 * @param {string} yearType - The year type that is being modified. 'minYear' or 'maxYear'
 */
export default function YearSlider({
  labelText,
  values,
  filters,
  setFilters,
  yearType,
}) {
  
  // Updates the filter based on the newly selected year
  const updateYear = (e) => {
    const year = parseInt(e.target.value, 10);

    setFilters((prevFilters) => {
      let newFilters = {
        ...prevFilters,
        [yearType]: year,
      };

      // Validation to prevent minYear going over maxYear and maxYear going under minYear
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
        className="year-slider"
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
