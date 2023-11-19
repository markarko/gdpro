/**
 * Checks if a string contains only alphabetic characters
 *
 * @param {string} str - The string to be checked for alphabetic characters
 * @returns {boolean} Returns true if the string contains only alphabetic characters,
 * false otherwise
 */
function containsOnlyLetters(str) {
  const regex = /^[a-zA-Z ]+$/;
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
function sendData(res, status, data) {
  res.status(status).send({ data: data });
}

/**
 * Validates the order of start year and end year parameters
 *
 * @param {Object} res - The express response object
 * @param {number} start - The start year parameter
 * @param {number} end - The end year parameter
 * @throws {Error} - If the start year parameter is greater than the end year parameter
 */
function validateRange(res, start, end, startParamName, endParamName) {
  if (start && end && start > end) {
    const error = `The ${startParamName} parameter
    cannot be greater than the ${endParamName} parameter`;

    sendError(res, 400, error);
    throw new Error();
  }
}

/**
 * Filters an array of objects by the start GDP
 * 
 * @param {number} startGDP - The start GDP to filter by
 * @param {Array<Object>} arr - An array of objects to be filtered
 * Each object must have a 'gdp' property
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
 * Filters an array of objects by the end GDP
 * 
 * @param {number} end - The end GDP to filter by
 * @param {Array<Object>} arr - An array of objects to be filtered
 * Each object must have a 'gdp' property
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
 * @throws {Error} - If the parameter is not a positive number
 */

function validateIntParam(res, param, paramName) {
  if (!param || isNaN(param) || Number(param) < 0) {
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

function getDefaultParams(start, end, defaultStart, defaultEnd) {
  start = start ? start : defaultStart;
  end = end ? end : defaultEnd;

  return [start, end];
}

function getDefaultYearParams(startYear, endYear) {
  return getDefaultParams(startYear, endYear, 1990, 2020);
}

function getDefaultGdpParams(startGdp, endGdp) {
  return getDefaultParams(startGdp, endGdp, 0, 100000);
}

function getDefaultProteinParams(startProtein, endProtein) {
  return getDefaultParams(startProtein, endProtein, 0, 500);
}

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

  let results = data.map(row => { 
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

async function getVariationSpecificCountry(req, res, db, collName, dataType) {
  let startYear = req.query.startYear;
  let endYear = req.query.endYear;
  const country = req.params.country;

  [startYear, endYear] = getDefaultYearParams(startYear, endYear);

  if (!country || !containsOnlyLetters(country)) {
    sendError(res, 400, 'The country name cannot contain numbers or special characters');
    return;
  }

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
  const results = data.map((row, index) => {
    if (index === 0) {
      return { year : row.year, growth : 0 };
    } else {
      return {
        year : row.year,
        growth : row[dataType] / 1000 - data[index - 1][dataType] / 10000
      };
    }
  });

  sendData (res, 200,
    {country: data[0].country,
      code: data[0].code,
      results: results}
  );
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
  getVariationSpecificCountry
};
