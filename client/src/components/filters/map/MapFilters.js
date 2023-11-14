import '../Filters.css';
import TopCountriesFilter from './top_countries/TopCountriesFilter';
import BasicFilters from './basic/BasicFilters';
import { useState, useEffect } from 'react';

export default function MapFilters({
  setGdp,
  setProtein,
  years,
  validCountries
}) {
  const FilterType = {
    Basic: 'basic',
    TopCountries: 'top-countries'
  };

  const [selectedFilterType, setSelectedFilterType] = useState(FilterType.Basic);

  const [basicFilters, setBasicFilters] = useState({
    year: 1990,
    countries: [],
  });
  
  const [, setTopCountriesFilter] = useState({
    top: 3,
    variation: 'highest',
    value: 'gdp'
  });

  useEffect(() => {
    async function fetchDefaultData() {
      await updateDataWithBasicFilters(setGdp, setProtein, basicFilters);
    }
    fetchDefaultData();
  }, []);

  const applyFilters = async e => {
    e.preventDefault();
    switch (selectedFilterType) {
    case FilterType.Basic:
      await updateDataWithBasicFilters(setGdp, setProtein, basicFilters); break;
    // case FilterType.CountryRanking:
    //   await updateDataWithCountryRankingFilter(
    //     setGdp,
    //     setProtein,
    //     countryRankingFilter,
    //     dataLayout);
    //   break;
    default: break;
    }
  };

  async function getDataForBasicFitlers(dataType, basicFilters) {
    const countries = basicFilters['countries'].join(',');
    const year = basicFilters['year'];   
    const url = `/api/v1/${dataType}/countries?countries=${countries}&year=${year}`;
    const response = await fetch(url);
    return await response.json();
  }

  async function updateDataWithBasicFilters(
    setGdp,
    setProtein,
    basicFilters) {
    try {
      const gdpData = await getDataForBasicFitlers('gdp', basicFilters);
      const proteinData = await getDataForBasicFitlers('protein', basicFilters);
      setGdp(gdpData);
      setProtein(proteinData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return(
    <form className="MapFilters" onSubmit={applyFilters}>
      <div className="filterType">
        <input
          type="radio"
          name="filterType"
          value={FilterType.Basic}
          onChange={e => setSelectedFilterType(e.target.value)}
          checked={selectedFilterType === FilterType.Basic} />
        <BasicFilters
          years={years}
          validCountries={validCountries}
          basicFilters={basicFilters}
          setBasicFilters={setBasicFilters}
          disable={selectedFilterType !== FilterType.Basic} />
      </div>
      <div className="filterType">
        <input type="radio" name="filterType" value={FilterType.TopCountries}
          onChange={e => setSelectedFilterType(e.target.value)}
          checked={selectedFilterType === FilterType.TopCountries} />
        <TopCountriesFilter
          setTopCountriesFilter={setTopCountriesFilter}
          selectedFilterType={selectedFilterType}
          disable={selectedFilterType !== FilterType.TopCountries} />
      </div>
      <button>Apply</button>
    </form>
  );
}
