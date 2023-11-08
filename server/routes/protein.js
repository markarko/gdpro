const express = require('express');
const router = express.Router();
const apiUtils = require('./utils/apiUtils.js');
const DB = require('../db/db.js');
const db = new DB();
const proteinCollName = 'daily-per-capita-protein-supply.csv';

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
  if (!apiUtils.containsOnlyLetters(country)) {
    apiUtils.sendError(res, 400, 'The country name cannot contain numbers or special characters');
    return;
  }

  req.params.country = country.toLowerCase();
  next();
});

/**
 * GET handler for getting the protein intake of a specific country
 * TO BE UPDATED
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/countries/:country', async (req, res) => {
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;
  try {
    if (startYear && endYear) {
      apiUtils.validateYear(res, startYear, 'startYear');
      apiUtils.validateYear(res, endYear, 'endYear');
      apiUtils.validateYearRange(res, startYear, endYear);
    } 
  } catch {
    return;
  }

  const data = await db.readAllCountryData(proteinCollName, req.params.country);

  if (!data.length) {
    apiUtils.sendError(res, 404, `No data found for ${req.params.country}`);
    return;
  }

  let results = data.sort((a, b) => a.year - b.year).map(row => { 
    return { year : row.year, gppd : row.gppd };
  });

  results = apiUtils.filterByStartYear(startYear, results);
  results = apiUtils.filterByEndYear(endYear, results);

  const responseBody = {
    country: data[0].country,
    code: data[0].code,
    results : results
  };

  apiUtils.sendData(res, 200, responseBody);
});

// write a stub endpoint for filtering by a range of years
router.get('/countries/:country/yearRange', async (req, res) => {
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;
  apiUtils.sendData(
    {
      country: 'Canada',
      code: 'CAN',
      results : [
        {
          year : 1990,
          protein : 123.12
        },
        {
          year : 1991,
          protein : 234.12
        }
      ]
    }
  );
});

// write a stub endpoint for filtering by a range of protein intake
router.get('/countries/:country/proteinRange', async (req, res) => {
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;
  apiUtils.sendData(
    {
      country: 'Canada',
      code: 'CAN',
      results : [
        {
          year : 1990,
          protein : 100.00
        },
        {
          year : 2005,
          protein : 101.00
        }
      ]
    }
  );
});

// write a stub endpoint for filtering by a specific value of protein intake
router.get('/countries/:country/proteinValue', async (req, res) => {
  const proteinValue = req.query.proteinValue;
  apiUtils.sendData(
    {
      country: 'Canada',
      code: 'CAN',
      results : [
        {
          year : 1990,
          protein : 100.00
        },
        {
          year : 2005,
          protein : 100.00
        }
      ]
    }
  );
});

// stub api endpoint for growth / decline of protein over all the years
router.get('/countries/:country/growthDecline', async (req, res) => {
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;
  apiUtils.sendData (
    {country: 'Canada',
      code: 'CAN',
      results : [
        {
          years : [1990, 1991],
          proteinGrowth : 7
        },
        {
          years : [1991, 1992],
          proteinGrowth : -2
        }
      ]}
  );
});

// stub api endpoint to filter by specific country and year
router.get('/countries/:country/:year', async (req, res) => {
  apiUtils.sendData (
    {country: 'Canada',
      code: 'CAN',
      results : [
        {
          year : 1990,
          protein : 100.00
        }
      ]}
  );
});

// stub api endpoint to fiter by the top x countries with the highest or lowest protein intake
router.get('/countries/top', async (req, res) => {
  const top = req.query.top;
  const order = req.query.order;
  apiUtils.sendData (
    {results : [
      {
        country: 'Canada',
        code: 'CAN',
        protein : 100.00,
        position: 1
      },
      {
        country: 'United States',
        code: 'USA',
        protein : 99.00,
        position: 2
      },
      {
        country: 'Mexico',
        code: 'MEX',
        protein : 98.00,
        position: 3
      }
    ]}
  );
});



module.exports = router;