/**
 * Checks if a string contains only alphabetic characters
 *
 * @param {string} str - The string to be checked for alphabetic characters
 * @returns {boolean} Returns true if the string contains only alphabetic characters, false otherwise
 */
function containsOnlyLetters(str) {
    let regex = /^[a-zA-Z]+$/;
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

module.exports = {
    sendData,
    sendError,
    containsOnlyLetters
}
