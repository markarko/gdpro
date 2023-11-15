/**
 * Express router for managing protein data by country.
 * @module proteinRouter
 */

const express = require('express');
const router = express.Router();
const apiUtils = require('./utils/apiUtils.js');
const DB = require('../db/db.js');
const db = new DB();
const proteinCollName = 'daily-per-capita-protein-supply';

/**
 * Middleware for validating the 'country' parameter in the route
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @param {string} country - The 'country' parameter from the URL
 */
router.param('country', (req, res, next, country) => {
  const parsedCountry = country.replace('%20', ' ');
  if (!apiUtils.containsOnlyLetters(parsedCountry)) {
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

// stub endpoint for filtering by a range of years
router.get('/countries/:country', async (req, res) => {
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;
  startYear.charAt(0);
  endYear.charAt(0);
  res.status(200);
  apiUtils.sendData(res, 200,
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

// stub api endpoint for growth / decline of protein over all the years
router.get('/countries/:country/variation', async (req, res) => {
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;
  res.status(200);
  startYear.charAt(0);
  endYear.charAt(0);
  apiUtils.sendData (res, 200, 
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

// stub api endpoint to fiter by the top x countries with the highest or lowest protein intake
router.get('/countries/top/:top', async (req, res) => {
  const orderby = req.query.orderby;
  orderby.charAt(0);
  apiUtils.sendData (res, 200,
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

// stub endpoint for filtering by a range of protein intake
router.get('/countries/:country/protein', async (req, res) => {
  const startProtein = req.query.startProtein;
  const endProtein = req.query.endProtein;
  startProtein.charAt(0);
  endProtein.charAt(0);
  res.status(200);
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

// stub api endpoint to filter by specific country and year
router.get('/countries/:country/:year', async (req, res) => {
  req.query.year;
  res.status(200);

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

// stub api endpoint for filtering by a range of countries
router.get('/countries/', async (req, res) => {
  // get all countries given in the query
  // let countries = req.query.countries;
  // countries = countries.split(',');
  // res.status(200);
  // countries.charAt(0);

  // FOR THOMAS: Make sure that the countries all share the same year e.g. 2003. So basically
  // this endpoint returns the protein for all the queried countries in the same year
  apiUtils.sendData (res, 200,
    {results : [
      {
        country: 'Canada',
        code: 'CAN',
        year : 2003,
        protein : 100.00,
        position : [56.1304, 106.3468]
      },
      {
        country: 'United States',
        code: 'USA',
        year : 2003,
        protein : 99.00,
        position : [37.0902, 95.7129]
      },
      {
        country: 'Mexico',
        code: 'MEX',
        year : 2003,
        protein : 98.00,
        position : [23.6345, 102.5528]
      }
    ]}
  );
});



module.exports = router;