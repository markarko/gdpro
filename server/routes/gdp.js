const express = require('express');
const router = express.Router();
const gdpUtils = require('./utils/apiUtils.js');
const DB = require('../db/db.js');
const db = new DB();
const gdpCollName = 'gdp-per-capita-worldbank.csv';

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
  if (!gdpUtils.containsOnlyLetters(country)) {
    gdpUtils.sendError(res, 400, 'The country name cannot contain numbers or special characters');
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
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;

  try {
    gdpUtils.validateYear(res, startYear, 'startYear');
    gdpUtils.validateYear(res, endYear, 'endYear');
    gdpUtils.validateYearRange(res, startYear, endYear);
  } catch {
    return;
  }

  const data = await db.readAllCountryData(gdpCollName, req.params.country);

  if (!data.length) {
    gdpUtils.sendError(res, 404, `No data found for ${req.params.country}`);
    return;
  }

  let results = data.sort((a, b) => a.year - b.year).map(row => { 
    return { year : row.year, gdp : row.gdp };
  });

  results = gdpUtils.filterByStartYear(startYear, results);
  results = gdpUtils.filterByEndYear(endYear, results);

  const responseBody = {
    country: data[0].country,
    code: data[0].code,
    results : results
  };

  gdpUtils.sendData(res, 200, responseBody);
});

module.exports = router;