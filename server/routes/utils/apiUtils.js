/**
 * Checks if a string contains only alphabetic characters and spaces
 *
 * @param {string} str - The string to be checked for alphabetic characters
 * @returns {boolean} Returns true if the string contains only alphabetic characters,
 * false otherwise
 */
function containsOnlyLetters(str) {
  const regex = /^['\-a-zA-Z ]+$/;
  return regex.test(str);
}

/**
 * Formats the error and sends it back to the client
 *
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code for the response
 * @param {string} error - Error message to send
 */
function sendError(res, status, error) {
  res.status(status).send({ error: error });
}

/**
 * Formats the data and sends it back to the client
 *
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code for the response
 * @param {any} data - Data to send
 */
function sendData(res, status, data, cache = true) {
  if (cache) res.set('Cache-Control', 'public, max-age=31557600, s-maxage=31557600');
  res.status(status).send({ data: data });
}

/**
 * Validates whether the start param is not greater than the end param 
 *
 * @param {Object} res - The express response object
 * @param {number} start - The start parameter
 * @param {number} end - The end parameter
 * @param {string} startParam - The name of the start param in the query
 * @param {string} endParam - The name of the end param in the query
 * @throws {Error} - If the start parameter is greater than the end parameter
 */
function validateRange(res, start, end, startParam, endParam) {
  if (start && end && start > end) {
    const error = `The ${startParam} parameter cannot be greater than the ${endParam} parameter`;

    sendError(res, 400, error);
    throw new Error();
  }
}

/**
 * Filters an array of objects based on a minimum value for each object
 * 
 * @param {number} start - The min value to filter by
 * @param {Array<Object>} arr - An array of objects to be filtered
 * Each object must have a key property that matches the 3rd argument
 * @param {string} key - The key of the objects by the value of which the array should be filtered
 * @returns {Array<Object>} - The filtered array
 */
function filterByStartInt(start, arr, key) {
  if (!start) {
    return arr;
  }
  start = parseInt(start);
  return arr.filter(obj => obj[key] >= start);
}

/**
 * Filters an array of objects based on a maximum value for each object
 * 
 * @param {number} end - The max value to filter by
 * @param {Array<Object>} arr - An array of objects to be filtered
 * Each object must have a key property that matches the 3rd argument
 * @param {string} key - The key of the objects by the value of which the array should be filtered
 * @returns {Array<Object>} - The filtered array
 */
function filterByEndInt(end, arr, key) {
  if (!end) {
    return arr;
  }
  end = parseInt(end);
  return arr.filter(obj => obj[key] <= end);
}

/**
 * Validates whether a parameter is a positive number
 * 
 * @param {Object} res - The express response object
 * @param {number} param - The parameter to validate
 * @param {string} paramName - The parameter name in the query
 * @throws {Error} - If the parameter is not a positive number
 */

function validateIntParam(res, param, paramName) {
  if (param === undefined || isNaN(param) || Number(param) < 0) {
    sendError(res, 400, `The ${paramName} parameter must be a positive number`);
    throw new Error();
  }
}

/**
 * Validates whether the countries parameter is a string
 * 
 * @param {Object} res - The express response object
 * @param {string} countries - The countries parameter to validate
 * @throws {Error} - If the countries parameter is not a string
 */
function validateCountries(validCountries, countries) {
  const returnCountries = [];
  for (let i = 0; i < countries.length; i++) {
    if (validCountries.includes(countries[i])) {
      returnCountries.push(countries[i]);
    }
  }
  return returnCountries;
}

/**
 * General purpose function that returns default values for a range if 'start' or 'end'
 * are not provided
 * 
 * @param {number} start - The start value for a range
 * @param {number} end - The end value for a range
 * @param {number} defaultStart - The default value to assign 'start' in case it's undefined
 * @param {number} defaultEnd - The default value to assign 'end' in case it's undefined
 * @returns {Array<number>} - The 'start' and 'end' numbers with default values if one of them
 * is not provided
 */
function getDefaultParams(start, end, defaultStart, defaultEnd) {
  start = start ? start : defaultStart;
  end = end ? end : defaultEnd;

  return [start, end];
}

/**
 * Gets the default values for a range of years
 * 
 * @param {number} startYear - The start year
 * @param {number} endYear - The end year
 * @returns {Array<number>} - The 'startYear' and 'endYear' numbers
 * with default values if one of them is not provided
 */
function getDefaultYearParams(startYear, endYear) {
  return getDefaultParams(startYear, endYear, 1990, 2020);
}

/**
 * Gets the default values for a range of gdp
 * 
 * @param {number} startGdp - The start gdp
 * @param {number} endGdp - The end gdp
 * @returns {Array<number>} - The 'startGdp' and 'endGdp' numbers
 * with default values if one of them is not provided
 */
function getDefaultGdpParams(startGdp, endGdp) {
  return getDefaultParams(startGdp, endGdp, 1, 1000000);
}

/**
 * Gets the default values for a range of protein
 * 
 * @param {number} startProtein - The start protein
 * @param {number} endProtein - The end protein
 * @returns {Array<number>} - The 'startProtein' and 'endProtein' numbers
 * with default values if one of them is not provided
 */
function getDefaultProteinParams(startProtein, endProtein) {
  return getDefaultParams(startProtein, endProtein, 1, 500);
}

/**
 * Get the gdp or protein intake for a specific country
 *
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @param {Object} db - The database object containing db function queries
 * @param {string} collName - The db collection name which to get the data from
 * @param {dataType} dataType - Value for which to get the data. Either 'gdp' or 'gppd'
 * @returns {object} 200 - An object containing the data for the specified year range and country
 * @returns {object} 404 - If no data is found for that country and year range
 * @throws {string} 400 - If the 'startYear' or 'endYear' params are not numbers or if 'startYear'
 * is greater than the 'endYear'
 */
async function getDataSpecificCountry(req, res, db, collName, dataType){
  let startYear = req.query.startYear;
  let endYear = req.query.endYear;

  [startYear, endYear] = getDefaultYearParams(startYear, endYear);

  try {
    validateIntParam(res, startYear, 'startYear');
    validateIntParam(res, endYear, 'endYear');
    validateRange(res, startYear, endYear, 'startYear', 'endYear');
  } catch {
    return;
  }
  
  const data = await db.readAllCountryData(collName, req.params.country);

  if (!data.length) {
    sendError(res, 404, `No data found for ${req.params.country}`);
    return;
  }

  let results = data.sort((a, b) => a.year - b.year).map(row => { 
    return { year : row.year, [dataType] : row[dataType] };
  });

  results = filterByStartInt(startYear, results, 'year');
  results = filterByEndInt(endYear, results, 'year');

  const responseBody = {
    country: data[0].country,
    code: data[0].code,
    results : results
  };

  sendData(res, 200, responseBody);
}

/**
 * Get the growth / decline of gdp or protein intake for a specific country over the years
 *
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @param {Object} db - The database object containing db function queries
 * @param {string} collName - The db collection name which to get the data from
 * @param {dataType} dataType - Value for which to get the data. Either 'gdp' or 'gppd'
 * @returns {object} 200 - An object containing the variation of protein intake (in %)
 * for the specified year range and country
 * @returns {object} 404 - If no data is found for that country and year range
 * @throws {string} 400 - If the 'startYear' or 'endYear' params are not numbers or if 'startYear'
 * is greater than the 'endYear'
 */ 
async function getVariationSpecificCountry(req, res, db, collName, dataType) {
  let startYear = req.query.startYear;
  let endYear = req.query.endYear;
  const country = req.params.country;

  [startYear, endYear] = getDefaultYearParams(startYear, endYear);

  // validate start and end year
  try {
    validateIntParam(res, startYear, 'startYear');
    validateIntParam(res, endYear, 'endYear');
    validateRange(res, startYear, endYear, 'startYear', 'endYear');
  } catch {
    // the validate methods already send the response errors
    return;
  }

  const data = await db.getYearRange(collName, country, startYear, endYear);

  if (!data.length) {
    sendError(res, 404, `No data found for ${req.params.country}`);
    return;
  }

  // Compare each year to the previous year and calculate the growth/decline
  const results = data.sort((a, b) => a.year - b.year).map((row, index) => {
    if (index === 0) {
      return { year : row.year, growth : 0 };
    }

    let growth = (row[dataType] - data[index - 1][dataType]) * 100 / row[dataType];
    growth = Math.round(growth * 100) / 100;

    return {
      year : row.year,
      growth : growth
    };
  });
  
  sendData (res, 200,
    {country: data[0].country,
      code: data[0].code,
      results: results}
  );
}

/**
 * Get the x highest or lowest gdps or protein intakes across all countries
 *
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @param {Object} db - The database object containing db function queries
 * @param {string} collName - The db collection name which to get the data from
 * @param {string} countryCollName - The db collection name which to get the countries from
 * @param {dataType} dataType - Value for which to get the data. Either 'gdp' or 'gppd'
 * @returns {object} 200 - An object containing protein data for the specified year and sorting.
 * @returns {object} 404 - If no data is found for that year (really means there is no data at all)
 * @throws {string} 400 - If the 'year' param is not a number or the 'orderBy' param is not a valid
 * value
 */ 
async function getTopCountries(req, res, db, collName, countryCollName, dataType) {
  const top = req.params.top;
  const year = req.query.year;

  if (year) {
    try {
      validateIntParam(res, year, 'year');
    } catch {
      return;
    }
  }

  const orderBy = req.query.orderBy;
  const orderByOptions = ['highest', 'lowest'];

  if (!orderBy || !orderByOptions.includes(orderBy)) {
    const error = `orderBy query parameter can be one of the following values: 'highest', 'lowest'`;
    sendError(res, 400, error);
    return;
  }

  const results = [];
  const data = await db.readTopCountries(collName, top, orderBy, dataType, year); 
  data.sort((a, b) => a.year - b.year); 
  const geoPosition = await db.readAll(countryCollName);

  data.forEach(country => {
    geoPosition.forEach(position => {
      if (country.country === position.name.toLowerCase()) {
        results.push({
          country: country.country,
          code: country.code,
          year: country.year,
          [dataType]: country[dataType],
          position: [position.latitude, position.longitude]
        });
      }
    });
  });

  sendData(res, 200, { results : results });
}

/**
 * Get the gdp or protein intake for multiple countries and a specific year
 *
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @param {Object} db - The database object containing db function queries
 * @param {string} collName - The db collection name which to get the data from
 * @param {dataType} dataType - Value for which to get the data. Either 'gdp' or 'gppd'
 * @returns {object} 200 - An object containing gdp or protein data
 * for the specified countries and year
 * @returns {object} 404 - If no data is found for those countries and that year
 * @throws {string} 400 - If the 'year' param is not a number,
 * the 'countries' param was not provided, or if more than 10 countries were provided
 */
async function getDataMultipleCountries(req, res, db, collName, dataType) {
  let countries = req.query.countries;

  if (!countries) {
    sendError(res, 400, 'No countries specified');
    return;
  }

  let year = req.query.year;
  [year] = getDefaultYearParams(year, null, 'year', null);

  try{
    validateIntParam(res, year, 'year');
  } catch {
    return;
  }

  countries = countries.split(',');

  if (countries.length < 1 || countries.length > 10) {
    sendError(res, 400, 'Countries length can not be less then 1 or greater then 10');
    return; 
  }

  countries = validateCountries(await db.getAllCountries(collName), countries);

  if (!countries.length) {
    sendError(res, 404, `Countries ${req.query.countries} not found`);
    return;
  }

  const results = [];
  const data = await db.readAllYearCountryData(collName, Number(year), countries);
  data.sort((a, b) => a.year - b.year);
  const geoPosition = await db.readAllYearCountryGeo(countries);
  data.forEach(country => {
    geoPosition.forEach(position => {
      if (country.country === position.name) {
        results.push({
          country: country.country,
          code: country.code,
          year: country.year,
          [dataType]: country[dataType],
          position: [position.latitude, position.longitude]
        });
      }
    });
  });  

  if (!results.length) {
    const error = `No data found for countries '${req.query.countries}' during the year ${year}`;
    sendError(res, 404, error);
    return; 
  }

  sendData(res, 200, { results : results });
}

/**
 * Get the gdp or protein intake for a specific year across all countries that fall between
 * a certain range
 *
 * @param {Object} req - The express request object
 * @param {Object} res - The express response object
 * @param {Object} db - The database object containing db function queries
 * @param {string} collName - The db collection name which to get the data from
 * @param {string} countryCollName - The db collection name which to get the countries from
 * @param {dataType} dataType - Value for which to get the data. Either 'gdp' or 'gppd'
 * @returns {object} 200 - An object containing gdp or protein data for the specified year and range
 * @returns {object} 404 - If no data is found for that year and range
 * @throws {string} 400 - If the 'year' param is not a number, the 'min' or 'max' params are not 
 * numbers or if 'min' is greater than 'max'
 */ 
async function getDataRangeSpecificYear(req, res, db, collName, countryCollName, dataType) {
  let min = req.query.min;
  let max = req.query.max;
  let year = req.query.year;

  if (dataType === 'gppd') {
    [min, max] = getDefaultProteinParams(min, max);
  } else if (dataType === 'gdp') {
    [min, max] = getDefaultGdpParams(min, max);
  }

  if (!year || isNaN(year) || Number(year) < 0) {
    sendError(res, 400, 'The year parameter must be a positive number');
    return;
  }

  [year] = getDefaultYearParams(year);

  try {
    validateIntParam(res, min, 'min');
    validateIntParam(res, max, 'max');
    validateRange(res, Number(min), Number(max), 'min', 'max');
  } catch {
    return;
  }

  const results = [];
  const data = await db.getDataRangeWithYear(collName, year, min, max, dataType);
  
  if (!data.length) {
    const error = `No data found for the protein range ${min}-${max} and the year ${year}`;
    sendError(res, 404, error);
    return;
  }

  data.sort((a, b) => a.year - b.year);
  const geoPosition = await db.readAll(countryCollName);

  data.forEach(country => {
    geoPosition.forEach(position => {
      if (country.country === position.name.toLowerCase()) {
        results.push({
          country: country.country,
          code: country.code,
          year: country.year,
          [dataType]: country[dataType],
          position: [position.latitude, position.longitude]
        });
      }
    });
  });

  sendData (res, 200,
    {
      results : results
    });
}


module.exports = {
  sendData,
  sendError,
  containsOnlyLetters,
  validateRange,
  filterByStartInt,
  filterByEndInt,
  validateIntParam,
  validateCountries,
  getDefaultYearParams,
  getDefaultGdpParams,
  getDefaultProteinParams,
  getDataSpecificCountry,
  getVariationSpecificCountry,
  getTopCountries,
  getDataMultipleCountries,
  getDataRangeSpecificYear
};
