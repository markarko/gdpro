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
 * Filters an array of objects by the start year
 *
 * @param {number} startYear - The start year to filter by
 * @param {Array<Object>} arr - An array of objects to be filtered
 * Each object must have a 'year' property
 * @returns {Array<Object>} - The filtered array
 */
function filterByStartYear(startYear, arr) {
  if (!startYear) {
    return arr;
  }
  startYear = parseInt(startYear);
  return arr.filter(obj => obj.year >= startYear);
}

/**
 * Filters an array of results by the end year
 *
 * @param {number} endYear - The end year to filter by
 * @param {Array<Object>} arr - An array of objects to be filtered
 * Each object must have a 'year' property
 * @returns {Array<Object>} - The filtered array
 */
function filterByEndYear(endYear, arr) {
  if (!endYear) {
    return arr;
  }
  endYear = parseInt(endYear);
  return arr.filter(obj => obj.year <= endYear);
}

/**
 * Validates whether the year parameter is a number
 *
 * @param {Object} res - The express response object
 * @param {number} year - The year parameter to validate
 * @throws {Error} - If the year parameter is not a number
 */
function validateYear(res, year, paramName) {
  if (year && isNaN(year)) {
    sendError(res, 400, `The ${paramName} parameter must be a number`);
    throw new Error();
  }
}

/**
 * Validates the order of start year and end year parameters
 *
 * @param {Object} res - The express response object
 * @param {number} startYear - The start year parameter
 * @param {number} endYear - The end year parameter
 * @throws {Error} - If the start year parameter is greater than the end year parameter
 */
function validateYearRange(res, startYear, endYear) {
  if (startYear && endYear && startYear > endYear) {
    sendError(res, 400, 'The startYear parameter cannot be greater than the endYear parameter');
    throw new Error();
  }
}

function filterByStartGDP(startGDP, arr) {
  if (!startGDP) {
    return arr;
  }
  startGDP = parseInt(startGDP);
  return arr.filter(obj => obj.gdp >= startGDP);
}

function filterByEndGDP(endGDP, arr) {
  if (!endGDP) {
    return arr;
  }
  endGDP = parseInt(endGDP);
  return arr.filter(obj => obj.gdp <= endGDP);
}

function validateGDP(res, gdp, paramName) {
  if (gdp && isNaN(gdp)) {
    sendError(res, 400, `The ${paramName} parameter must be a number`);
    throw new Error();
  }
}

function validateGDPRange(res, startGDP, endGDP) {
  if (startGDP && endGDP && startGDP > endGDP) {
    sendError(res, 400, 'The startGDP parameter cannot be greater than the endGDP parameter');
    throw new Error();
  }
}

module.exports = {
  sendData,
  sendError,
  containsOnlyLetters,
  filterByStartYear,
  filterByEndYear,
  validateYear,
  validateYearRange,
  filterByStartGDP,
  filterByEndGDP,
  validateGDP,
  validateGDPRange
};
