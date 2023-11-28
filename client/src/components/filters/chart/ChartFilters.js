import '../Filters.css';
import BasicFilters from './basic/BasicFilters';
import CountryRankingFilter from './country_ranking/CountryRankingFilter';
import CountryVariationFilter from './variation/CountryVariationFilter';
import { useState, useEffect } from 'react';

/**
 * Component that groups all fitlers related to the chart
 * 
 * @param {Function} setGdp - Function to set the gdp state variable
 * @param {Function} setProtein - Function to set the protein state variable
 * @param {Array<Number>} validYears - Array representing the range of years to display in a filter
 * @param {Array<string>} validCountries - Array representing countries to display in a filter
 * @param {Object} dataLayout - Json structure that the api returns without the data results
 * @param {Function} setError - Function to set the error state variable
 * @param {Function} setChartTitle - Function to set the chart title state variable
 */
export default function ChartFilters({
  setGdp,
  setProtein,
  validYears,
  validCountries,
  dataLayout,
  setError,
  setChartTitle }) {

  const FilterType = {
    Basic: 'basic',
    CountryRanking: 'country-ranking',
    CountryVariation: 'country-variation'
  };

  const [selectedFilterType, setSelectedFilterType] = useState(FilterType.Basic);

  const [basicFilters, setBasicFilters] = useState({
    country: validCountries[0],
    minYear: validYears[0],
    maxYear: validYears[validYears.length - 1]
  });

  const [countryRankingFilter, setCountryRankingFilter] = useState({
    orderBy: 'highest',
    value: 'gdp'
  });

  const [countryVariationFilter, setCountryVariationFilter] = useState({
    country: validCountries[0],
    minYear: validYears[0],
    maxYear: validYears[validYears.length - 1],
    value: 'gdp'
  });

  useEffect(() => {
    async function fetchDefaultData() {
      await updateDataWithBasicFilters(setGdp, setProtein, basicFilters, setChartTitle);
    }

    fetchDefaultData();
  // this is the initial fetch, so it should be ran only on the initial render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = async e => {
    e.preventDefault();
    try{
      switch (selectedFilterType) {
      case FilterType.Basic:
        await updateDataWithBasicFilters(setGdp, setProtein, basicFilters, setChartTitle);
        break;
      case FilterType.CountryRanking:
        await updateDataWithCountryRankingFilter(
          setGdp,
          setProtein,
          countryRankingFilter,
          dataLayout,
          setChartTitle);
        break;

      case FilterType.CountryVariation:
        await updateDataWithCountryVariationFilter(
          setGdp,
          setProtein,
          countryVariationFilter,
          dataLayout,
          setChartTitle);
        break;
      default: break;
      }
    } catch(err) {
      setError(err.message);
    }
  };

  return(
    <form  onSubmit={applyFilters}>
      <div className="ChartFilters">
        <div className="filterType">
          <input
            type="radio"
            name="filterType"
            value={FilterType.Basic}
            onChange={e => setSelectedFilterType(e.target.value)}
            checked={selectedFilterType === FilterType.Basic} />
          <BasicFilters
            years={validYears}
            validCountries={validCountries}
            basicFilters={basicFilters}
            setBasicFilters={setBasicFilters}
            disable={selectedFilterType !== FilterType.Basic} />
        </div>
        <div className="filterType">
          <input
            type="radio"
            name="filterType"
            value={FilterType.CountryRanking}
            onChange={e => setSelectedFilterType(e.target.value)}
            checked={selectedFilterType === FilterType.CountryRanking} />
          <CountryRankingFilter
            setCountryRankingFilter={setCountryRankingFilter}
            disable={selectedFilterType !== FilterType.CountryRanking} />
        </div>
        <div className="filterType">
          <input
            type="radio"
            name="filterType"
            value={FilterType.CountryVariation}
            onChange={e => setSelectedFilterType(e.target.value)}
            checked={selectedFilterType === FilterType.CountryVariation} />
          <CountryVariationFilter
            years={validYears}
            validCountries={validCountries}
            countryVariationFilter={countryVariationFilter}
            setCountryVariationFilter={setCountryVariationFilter}
            disable={selectedFilterType !== FilterType.CountryVariation} />
        </div>
      </div>
      <button>Apply</button>
    </form>
  );
}

/**
 * Extracts the values from basic filters, fetches corresponding data from the api, and
 * updates the gdp and protein state variables with the new data
 * 
 * @param {Function} setGdp - Function to set the gdp state variable
 * @param {Function} setProtein - Function to set the protein state variable
 * @param {Object} basicFilters - The state variables that contains values for basic filters
 * @param {Function} setChartTitle - Function to set the chart title state variable
 */
async function updateDataWithBasicFilters(
  setGdp,
  setProtein,
  basicFilters,
  setChartTitle) {

  /**
   * Fetches the json data from the api based on the basic filter values
   * 
   * @param {string} dataType - the data type to fetch in the api. 'gdp' or 'protein'
   * @param {Object} basicFilters - The state variables that contains values for basic filters
   * @param {Function} setChartTitle - Function to set the chart title state variable
   * @throws {Error} If the api response is not successfull
   * @returns {Object} The fetched json data
   */
  async function getDataForBasicFitlers(dataType, basicFilters, setChartTitle) {
    const country = basicFilters['country'];
    const minYear = basicFilters['minYear'];
    const maxYear = basicFilters['maxYear'];
  
    const url = `/api/v1/${dataType}/countries/${country}?startYear=${minYear}&endYear=${maxYear}`;
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok){
      throw new Error(json.error);
    }

    setChartTitle(createChartTitle(true, true, country));

    return json;
  }

  const [gdpData, proteinData] = await Promise.all([
    getDataForBasicFitlers('gdp', basicFilters, setChartTitle),
    getDataForBasicFitlers('protein', basicFilters, setChartTitle)
  ]);

  setGdp(gdpData);
  setProtein(proteinData);
}

/**
 * Extracts the values from country ranking filters, fetches corresponding data from the api, and
 * updates the gdp and protein state variables with the new data
 * 
 * @param {Function} setGdp - Function to set the gdp state variable
 * @param {Function} setProtein - Function to set the protein state variable
 * @param {Object} countryRankingFilter - The state variables that contains values for
 * country ranking filters
 * @param {Object} dataLayout - Json structure that the api returns without the data results
 * @param {Function} setChartTitle - Function to set the chart title state variable
 */
async function updateDataWithCountryRankingFilter(
  setGdp,
  setProtein,
  countryRankingFilter,
  dataLayout,
  setChartTitle ) {

  /**
   * Fetches the json data from the api based on the country ranking filter values
   * 
   * @throws {Error} If the api response is not successfull
   * @returns {Object} The fetched json data
   */
  async function getDataForCountryRankingFilter() {
    const orderBy = countryRankingFilter['orderBy'];
    const value = countryRankingFilter['value'];

    const url = `/api/v1/${value}/countries/top/1?orderBy=${orderBy}`;
    const response = await fetch(url);
    const json = await response.json();
    
    if (!response.ok){
      throw new Error(json.error);
    }

    return json;
  }
  
  const dataSingleYear = await getDataForCountryRankingFilter();
  const countryName = dataSingleYear.data.results[0].country;
  const dataType = countryRankingFilter['value'];
  
  const url = `/api/v1/${dataType}/countries/${countryName}`;
  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok){
    throw new Error(json.error);
  }

  if (countryRankingFilter['value'] === 'gdp'){
    setGdp(json);
    setProtein(dataLayout);
    setChartTitle(createChartTitle(true, false, countryName));
  } else if (countryRankingFilter['value'] === 'protein') {
    setProtein(json);
    setGdp(dataLayout);
    setChartTitle(createChartTitle(false, true, countryName));
  }

}

/**
 * Creates an appropriate title for the chart based on some input values 
 * 
 * @param {boolean} gdpSelected - Boolean whether the gdp dataset is selected
 * @param {boolean} proteinSelected - Boolean whether the protein dataset is selected
 * @param {string} countryName - The selected country name in the filter
 * @returns {string} - The formatted chart title
 */
function createChartTitle(gdpSelected, proteinSelected, countryName){
  let title = '';

  title += gdpSelected ? 'gdp ' : '';
  title += gdpSelected && proteinSelected ? 'and ' : '';
  title += proteinSelected ? 'daily protein intake <br>' : '<br>';
  title += `of ${countryName} `;

  return title;
}

/**
 * Extracts the values from country variation filters, fetches corresponding data from the api, and
 * updates the gdp and protein state variables with the new data
 * 
 * @param {Function} setGdp - Function to set the gdp state variable
 * @param {Function} setProtein - Function to set the protein state variable
 * @param {Object} countryVariationFilter - The state variables that contains values for
 * country variation filters
 * @param {Object} dataLayout - Json structure that the api returns without the data results
 * @param {Function} setChartTitle - Function to set the chart title state variable
 */
async function updateDataWithCountryVariationFilter(
  setGdp,
  setProtein,
  countryVariationFilter,
  dataLayout,
  setChartTitle ) {

  /**
   * Fetches the json data from the api based on the country ranking filter values
   * and formats it into an object that is equivalent to the api json structure
   * 
   * @throws {Error} If the api response is not successfull
   * @returns {Object} The formatted json objects with the results from the api
   */
  async function getDataForCountryVariationFilter() {
    const country = countryVariationFilter['country'];
    const startYear = countryVariationFilter['minYear'];
    const endYear = countryVariationFilter['maxYear'];
    const value = countryVariationFilter['value'];
    let u = '';

    u = `/api/v1/${value}/countries/${country}/variation?startYear=${startYear}&endYear=${endYear}`;

    const response = await fetch(u);
    const json = await response.json();
    
    if (!response.ok){
      throw new Error(json.error);
    }
    
    const yearData = [];
    for (const row in json.data['results']) {
      const data = json.data['results'][row];
      yearData.push({
        year: data.year,
        [value === 'gdp' ? 'gdp' : 'gppd']: data['growth']
      });
      
    }

    return {data: {
      results: yearData}, country: country};
  }
  
  const dataAllYears = await getDataForCountryVariationFilter();
  const title = `${countryVariationFilter['value']} % growth and decline 
  <br> of ${dataAllYears.country}`;

  if (countryVariationFilter['value'] === 'gdp'){
    setGdp(dataAllYears);
    setProtein(dataLayout);
    setChartTitle(title);
  } else if (countryVariationFilter['value'] === 'protein') {
    setProtein(dataAllYears);
    setGdp(dataLayout);
    setChartTitle(title);
  }

}