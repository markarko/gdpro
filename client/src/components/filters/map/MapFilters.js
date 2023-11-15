import '../Filters.css';
import TopCountriesFilter from './top_countries/TopCountriesFilter';
import BasicFilters from './basic/BasicFilters';
import { useState, useEffect } from 'react';

export default function MapFilters({
  setGdp,
  setProtein,
  years,
  validCountries,
  dataLayout,
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
  
  const [topCountriesFilter, setTopCountriesFilter] = useState({
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
    case FilterType.TopCountries:
      await updateDataWithCountryRankingFilter(
        setGdp,
        setProtein,
        topCountriesFilter,
        dataLayout);
      break;
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

  async function getDataForCountryRankingFilter() {
    const top = topCountriesFilter['top'];
    const variation = topCountriesFilter['variation'];
    const value = topCountriesFilter['value'];

    //This is a fake endpoint that will be deleted later. Since the real endpoint is
    //not ready yet, we are using this fake endpoint to test the UI.
    const url = `/api/v1/${value}/stub/countries/top/${top}?orderBy=${variation}`;
    const response = await fetch(url);

    return await response.json();
  }

  async function updateDataWithCountryRankingFilter(
    setGdp,
    setProtein,
    topCountriesFilter,
    dataLayout) {
    try {
      const data = await getDataForCountryRankingFilter();
  
      if (topCountriesFilter['value'] === 'gdp'){
        setGdp(data);
        setProtein(dataLayout);
      } else if (topCountriesFilter['value'] === 'protein') {
        setProtein(data);
        setGdp(dataLayout);
      }
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
