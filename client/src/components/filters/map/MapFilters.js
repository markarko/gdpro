import '../Filters.css';
import TopCountriesFilter from './top_countries/TopCountriesFilter';
import BasicFilters from './basic/BasicFilters';
import { useState, useEffect } from 'react';
import DataRangeFilter from './data_range/DataRangeFilter';

export default function MapFilters({
  setGdp,
  setProtein,
  years,
  validCountries,
  dataLayout,
  setError
}) {
  const FilterType = {
    Basic: 'basic',
    TopCountries: 'top-countries',
    DataRange: 'data-range'
  };

  const [selectedFilterType, setSelectedFilterType] = useState(FilterType.Basic);

  const [basicFilters, setBasicFilters] = useState({
    year: 1990,
    countries: ['iran', 'ukraine', 'united states'],
  });
  
  const [topCountriesFilter, setTopCountriesFilter] = useState({
    top: 3,
    variation: 'highest',
    value: 'gdp'
  });

  const [dataRangeFilter, setDataRangeFilter] = useState({
    year: 1990,
    dataType: 'gdp',
    min: 0,
    max: 10000
  });


  useEffect(() => {
    async function fetchDefaultData() {
      await updateDataWithBasicFilters(setGdp, setProtein, basicFilters);
    }
    fetchDefaultData();
  // This is the initial fetch so the should not be any dependencies
  // We will try to rewrite this code to not have the warning
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = async e => {
    e.preventDefault();

    try{
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
      case FilterType.DataRange:
        await updateDataWithDataRangeFilter(
          setGdp,
          setProtein,
          dataRangeFilter,
          dataLayout);
        break;  
      default: break;
      }
    } catch (err) {
      setError(err.message);
    }
    
  };

  return(
    <form onSubmit={applyFilters}>
      <div className="MapFilters">
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
        <div className="filterType">
          <input type="radio" name="filterType" value={FilterType.DataRange}
            onChange={e => setSelectedFilterType(e.target.value)}
            checked={selectedFilterType === FilterType.DataRange} />
          <DataRangeFilter
            dataRangeFilter={dataRangeFilter}
            setDataRangeFilter={setDataRangeFilter}
            years={years}
            disable={selectedFilterType !== FilterType.DataRange} />
        </div>
      </div>
      <button type="submit">Apply</button>
    </form>
  );
}

async function getDataForBasicFitlers(dataType, basicFilters) {
  const countries = basicFilters['countries'].join(',');
  const year = basicFilters['year'];   
  const url = `/api/v1/${dataType}/countries?countries=${countries}&year=${year}`;

  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json;
}

async function updateDataWithBasicFilters(
  setGdp,
  setProtein,
  basicFilters) {

  const gdpData = await getDataForBasicFitlers('gdp', basicFilters);
  const proteinData = await getDataForBasicFitlers('protein', basicFilters);
  setGdp(gdpData);
  setProtein(proteinData);
}

async function getDataForCountryRankingFilter(topCountriesFilter) {
  const top = topCountriesFilter['top'];
  const variation = topCountriesFilter['variation'];
  const value = topCountriesFilter['value'];
  
  const url = `/api/v1/${value}/countries/top/${top}?orderBy=${variation}&year=2020`;
  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json;
}

async function updateDataWithCountryRankingFilter(
  setGdp,
  setProtein,
  topCountriesFilter,
  dataLayout) {

  const data = await getDataForCountryRankingFilter(topCountriesFilter);

  if (topCountriesFilter['value'] === 'gdp'){
    setGdp(data);
    setProtein(dataLayout);
  } else if (topCountriesFilter['value'] === 'protein') {
    setProtein(data);
    setGdp(dataLayout);
  }
}  

async function getDataForDataRangeFilter(dataRangeFilter) {
  const year = dataRangeFilter['year'];
  const dataType = dataRangeFilter['dataType'];
  const min = dataRangeFilter['min'];
  const max = dataRangeFilter['max'];

  const url = `/api/v1/${dataType}/countries/${dataType}-range?year=${year}&min=${min}&max=${max}`;
  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }
  
  return json;
}

async function updateDataWithDataRangeFilter(
  setGdp,
  setProtein,
  dataRangeFilter,
  dataLayout) {

  const data = await getDataForDataRangeFilter(dataRangeFilter);

  if (dataRangeFilter['dataType'] === 'gdp'){
    setGdp(data);
    setProtein(dataLayout);
  } else if (dataRangeFilter['dataType'] === 'protein') {
    setProtein(data);
    setGdp(dataLayout);
  }
}  