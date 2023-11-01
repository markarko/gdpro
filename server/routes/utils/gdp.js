/**
 * Checks if a string contains only alphabetic characters
 *
 * @param {string} str - The string to be checked for alphabetic characters
 * @returns {boolean} Returns true if the string contains only alphabetic characters,
 * false otherwise
 */
function containsOnlyLetters(str) {
  const regex = /^[a-zA-Z]+$/;
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

function filterByStartYear(startYear, results) {
  if (!startYear) {
    return results;
  }
  startYear = parseInt(startYear);
  return results.filter(row => row.year >= startYear);
}

function filterByEndYear(endYear, results) {
  if (!endYear) {
    return results;
  }
  endYear = parseInt(endYear);
  return results.filter(row => row.year <= endYear);
}

function validateStartYear(res, startYear) {
  if (startYear && isNaN(startYear)) {
    sendError(res, 400, 'The startYear parameter must be a number');
    throw new Error();
  }
}

function validateEndYear(res, endYear){
  if (endYear && isNaN(endYear)) {
    sendError(res, 400, 'The endYear parameter must be a number');
    throw new Error();
  }
}

function startYearGreaterThanEndYear(res, startYear, endYear){
  if (startYear && endYear && startYear > endYear) {
    sendError(res, 400, 'The startYear parameter cannot be greater than the endYear parameter');
    throw new Error();
  }
}

module.exports = {
  sendData,
  sendError,
  containsOnlyLetters,
  filterByStartYear,
  filterByEndYear,
  validateStartYear,
  validateEndYear,
  startYearGreaterThanEndYear
};
