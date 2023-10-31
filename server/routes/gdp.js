const express = require('express');
const router = express.Router();
const { sendData, sendError, containsOnlyLetters } = require('./utils/gdp.js');

/**
 * Middleware for validating the 'country' parameter in the route
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @param {string} country - The 'country' parameter from the URL
 */
router.param('country', (req, res, next, country) => {
  if (!containsOnlyLetters(country)) {
    sendError(res, 400, 'The country name cannot contain numbers or special characters');
    return;
  }

  req.params.country = country.toLowerCase();
  next();
});

/**
 * GET handler for getting the gdp of a specific country
 * TO BE UPDATED
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/countries/:country', (req, res) => {
  // mock data that will be replaced when the db queries are implemented
  const data = {
    'country' : req.params.country,
    'gdp' : 12382
  };

  sendData(res, 200, data);
});

module.exports = router;