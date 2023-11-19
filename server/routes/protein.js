/**
 * Express router for managing protein data by country.
 * @module proteinRouter
 */

const express = require('express');
const router = express.Router();
const proteinUtils = require('./utils/apiUtils.js');
const DB = require('../db/db.js');
const db = new DB();
const proteinCollName = 'daily-per-capita-protein-supply';
const countryCollName = 'country';

router.param('top', (req, res, next, top) => {
  if (isNaN(top) || Number(top) < 1 || Number(top) > 10){
    const error = `The value following top/ must be a number between 1 and 10`;
    proteinUtils.sendError(res, 400, error);
    return;
  }

  next();
});

router.get('/countries/top/:top', async (req, res) => {
  await proteinUtils.getTopCountries(req, res, db, proteinCollName, countryCollName, 'gppd');
});

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
  if (!proteinUtils.containsOnlyLetters(parsedCountry)) {
    const error = 'The country name cannot contain numbers or special characters';
    proteinUtils.sendError(res, 400, error);
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
  await proteinUtils.getDataSpecificCountry(req, res, db, proteinCollName, 'gppd');
});

// stub api endpoint for growth / decline of protein over all the years
router.get('/countries/:country/variation', async (req, res) => {
  await proteinUtils.getVariationSpecificCountry(req, res, db, proteinCollName, 'gppd');
});

// stub endpoint for filtering by a range of protein intake
router.get('/countries/:country/protein', async (req, res) => {
  const startProtein = req.query.startProtein;
  const endProtein = req.query.endProtein;
  startProtein.charAt(0);
  endProtein.charAt(0);
  res.status(200);
  proteinUtils.sendData(
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

  proteinUtils.sendData (
    {country: 'Canada',
      code: 'CAN',
      results : [
        {
          year : 1990,
          protein : 100.00
        }
      ]}
  );
  proteinUtils.sendData(res, 200, { results : data });
});

router.get('/countries/', async (req, res) => {
  let countries = req.query.countries;
  const year = req.query.year;
  countries = countries.split(',');
  const results = [];
  const data = await db.readAllYearCountryData(proteinCollName, Number(year), countries);
  const geoPosition = await db.readAll(countryCollName);
  data.forEach(country => {
    geoPosition.forEach(position => {
      if (country.country === position.name.toLowerCase()) {
        results.push({
          country: country.country,
          code: country.code,
          year: country.year,
          protein: country.gppd,
          position: [position.latitude, position.longitude]
        });
      }
    });
  });  
  proteinUtils.sendData(res, 200, { results : results });
  // BELOW IS THOMAS'S CODE BUT IT DOESN'T WORK WITH MY CODE FOR SOME REASON. WE WILL
  // COME BACK AND DEBUG IT LATER. THE PLAN IS TO USE HIS CODE BUT FOR NOW WE USE THE VERSION
  // ABOVE THAT WORKS WITH MY CODE.

  // get all countries given in the query
  // let countries = req.query.countries;
  // const year = req.query.year;

  // countries = countries.split(',');
  // if (countries.length > 10 || countries.length < 1) {
  // proteinUtils.sendError(res, 404, 'Countries length can not be less then 1 or greater then 10');
  //   return;
  // }

  //countries= proteinUtils.validateCountries(await db.getAllCountries(proteinCollName), countries);
  // if (countries.length === 0) {
  //   proteinUtils.sendError(res, 404, `Countries ${countries} not found`);
  //   return;
  // }

  // const results = [];
  // for (const country in countries) {
  //   // eslint-disable-next-line no-await-in-loop
  //   const data = await db.getCountryYearData(proteinCollName, countries[country], year);
  //   // eslint-disable-next-line no-await-in-loop
  //   const latLongData = await db.getCountryCountryData('country', countries[country]);
  //   data[0].position = [latLongData[0].latitude, latLongData[0].longitude];
  //   results.push(data[0]);
  // }

  // proteinUtils.sendData (res, 200,
  //   {results : results}
  // );
});
  
module.exports = router;