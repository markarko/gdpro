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

// filter by a range of years
router.get('/countries/:country/yearRange', async (req, res) => {
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

// Filter through countries with a range of gdp using apiUtils
router.get('/countries/:country/gdpRange', async (req, res) => {
  console.log('in gdpRange');
  const startGdp = req.query.startGdp;
  const endGdp = req.query.endGdp;

  console.log('imthere');
  const data = await db.readAll('gdp-per-capita-worldbank.csv');

  if (!data.length) {
    gdpUtils.sendError(res, 404, `No data found for ${req.params.country}`);
    return;
  }

  let results = data.sort((a, b) => a.gdp - b.gdp).map(row => { 
    return { year : row.year, gdp : row.gdp };
  });

  results = gdpUtils.filterByStartGdp(startGdp, results);
  results = gdpUtils.filterByEndGdp(endGdp, results);

  const responseBody = {
    country: data[0].country,
    code: data[0].code,
    results : results
  };

  gdpUtils.sendData(res, 200, responseBody);
});


// stub api endpoint for growth / decline of gdp over all the years
router.get('/countries/:country/growthDecline', async (req, res) => {
  return (
    country: 'Canada',
    code: 'CAN',
    results : [
      {
        year : 1990,
        gdp : 5723
      },
      {
        year : 1991,
        gdp : 3723
      }
    ]
  )
});

// Stub api endpoint for filtering by a specific value of gdp
router.get('/countries/:country/gdpValue', async (req, res) => {
  return (
    country: 'Canada',
    code: 'CAN',
    results : [
      {
        year : 1990,
        gdp : 5723
      },
      {
        year : 1991,
        gdp : 5723
      }
    ]
  )
});

// stub api endpoint for filtering by a range of countries
router.get('/countries/countryRange', async (req, res) => {
  return (
    results : [
      {
        country: 'Canada',
        code: 'CAN',
        year : 2003,
        gdp : 1234
      },
      {
        country: 'Canada',
        code: 'CAN',
        year : 1995,
        gdp : 4321
      }
    ]
  )
});



module.exports = router;