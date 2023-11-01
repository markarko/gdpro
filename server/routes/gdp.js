const express = require('express');
const router = express.Router();
const { sendData, sendError, containsOnlyLetters } = require('./utils/gdp.js');
const DB = require('../db/db.js');
const db = new DB();

/**
 * Middleware for validating the 'country' parameter in the route
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @param {string} country - The 'country' parameter from the URL
 */
router.param('country', (req, res, next, country) => {
  // TODO: decode url (spaces are replaced with %20)
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
router.get('/countries/:country', async (req, res) => {
  const data = await db.readAllCountryData(req.params.country);

  if (!data.length) {
    sendError(res, 404, `No data found for ${req.params.country}`);
    return;
  }

  const results = data.map(row => { 
    return { year : row.year, gdp : row.gdp };
  });

  const responseBody = {
    country: data[0].country,
    code: data[0].code,
    results : results
  };

  sendData(res, 200, responseBody);
});

module.exports = router;