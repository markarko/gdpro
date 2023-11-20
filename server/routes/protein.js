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

// Filter through countries with a range of gdp using apiUtils
router.get('/countries/:country/protein', async (req, res) => {
  let startProtein = req.query.startProtein;
  let endProtein = req.query.endProtein;
  const country = req.params.country;

  [startProtein, endProtein] = proteinUtils.getDefaultGdpParams(startProtein, endProtein);

  try {
    proteinUtils.validateIntParam(res, startProtein, 'startProtein');
    proteinUtils.validateIntParam(res, endProtein, 'endProtein');
    proteinUtils.validateRange(res, startProtein, endProtein, 'startProtein', 'endProtein');
  } catch {
    return;
  }

  const data = await db.getProteinRange(proteinCollName, country, startProtein, endProtein);

  if (!data.length) {
    const error = `No data found for ${country} with pro between ${startProtein} and ${endProtein}`;
    proteinUtils.sendError(res, 404, error);
    return;
  }

  proteinUtils.sendData (res, 200,
    {
      country: data[0].country,
      code: data[0].code,
      results : data.map(row => {
        return { year : row.year, gppd : row.gppd };
      })
    });
});

router.get('/countries/', async (req, res) => {
  // get all countries given in the query
  let reqCountries = req.query.countries;
  const year = req.query.year;

  try{
    proteinUtils.validateIntParam(res, year, 'year');
  } catch {
    return;
  }
  
 
  if (!reqCountries) {
    proteinUtils.sendError(res, 404, 'No countries specified');
    return;
  }

  reqCountries = reqCountries.split(',');
  if (reqCountries.length > 10 || reqCountries.length < 1) {
    proteinUtils.sendError(res, 404, 'Countries length can not be less then 1 or greater then 10');
    return;
  }
  //check if countries is in AllCountries
  const countries = proteinUtils
    .validateCountries(await db.getAllCountries(proteinCollName), reqCountries);
  if (countries.length === 0) {
    proteinUtils.sendError(res, 404, `Countries ${reqCountries} not found`);
    return;
  }

  const results = [];
  for (const country in countries) {
    // eslint-disable-next-line no-await-in-loop
    const data = await db.getCountryYearData(proteinCollName, countries[country], year);
    // eslint-disable-next-line no-await-in-loop
    const latLongData = await db.getCountryCountryData('country', countries[country]);
    data[0].position = [latLongData[0].latitude, latLongData[0].longitude];
    results.push(data[0]);
  }

  proteinUtils.sendData (res, 200,
    {results : results}
  );
});
  
module.exports = router;