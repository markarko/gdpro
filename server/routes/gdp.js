const express = require('express');
const router = express.Router();
const gdpUtils = require('./utils/apiUtils.js');
const DB = require('../db/db.js');
const db = new DB();
const gdpCollName = 'gdp-per-capita-worldbank';
const countryCollName = 'country';

/**
 * Get the gdp for a specific year within a specified gdp range
 *
 * @route GET /countries/gdp-range
 * @param {number} req.query.year - The year to get the data for
 * @param {number} req.query.min - The starting gdp of the gdp range
 * to get the data for
 * @param {number} req.query.max - The ending gdp of the gdp range
 * to get the data for
 * @returns {object} 200 - An object containing gdp data for the specified year and range
 * @returns {object} 404 - If no data is found for the given year and gdp range
 * @returns {object} 400 - If the 'min' or 'max' params are not numbers or
 * if 'min' is greater than the 'max'
 */
router.get('/countries/gdp-range', async (req, res) => {
  await gdpUtils.getDataRangeSpecificYear(req, res, db, 
    gdpCollName, countryCollName, 'gdp');
});

/**
 * Middleware for handling the 'top' parameter in routes.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @param {string} top - The 'top' parameter value extracted from the route path.
 * @returns {object} 400 - If 'top' is not a number or is not between 1 and 10.
 */
router.param('top', (req, res, next, top) => {
  if (isNaN(top) || Number(top) < 1 || Number(top) > 10){
    const error = `The value following top/ must be a number between 1 and 10`;
    gdpUtils.sendError(res, 400, error);
    return;
  }

  next();
});

/**
 * Get the x highest or lowest GDP across all countries
 *
 * @route GET /countries/top/:top
 * @param {number} req.params.top - The amount of highest or lowest GDP to get in
 * descending or ascending order respectively. Number between 1 and 10.
 * (ex: if top is 5, it will return 5 highest or lowest GDP)
 * @param {number} req.query.year - Get top highest or lowest GDP for that specific year
 * @param {number} req.query.orderBy - Specify if the route should return the highest or lowest
 * GDP. Values: 'highest', 'lowest'
 * @returns {object} 200 - An object containing GDP data for the specified year and sorting.
 * @returns {object} 404 - If no data is found for that year (really means there is no data at all)
 * @returns {object} 400 - If the 'year' param is not a number or the 'orderBy' param is not a valid
 * value
 */ 
router.get('/countries/top/:top', async (req, res) => {
  await gdpUtils.getTopCountries(req, res, db, gdpCollName, countryCollName, 'gdp');
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
  if (!gdpUtils.containsOnlyLetters(parsedCountry)) {
    gdpUtils.sendError(res, 400, 'The country name cannot contain numbers or special characters');
    return;
  }

  req.params.country = country.toLowerCase();
  next();
});


/**
 * Get the GDP for a specific country
 *
 * @route GET /countries/:country
 * @param {string} req.params.country - The country to get the data for
 * @param {number} req.query.startYear - The starting year of the year range to get the data for
 * @param {number} req.query.endYear - The ending year of the year range to get the data for
 * @returns {object} 200 - An object containing the data for the specified year range and country
 * @returns {object} 404 - If no data is found for that country and year range
 * @returns {object} 400 - If the 'startYear' or 'endYear' params are not numbers or if 'startYear'
 * is greater than the 'endYear'
 */ 
router.get('/countries/all', async (req, res) => {
  const data = await db.readAll(gdpCollName);
  const nations = [...new Set(data.map(x => x.country))];
  const countries = nations.filter(x => !x.includes('(') && !x.includes('income'));
  gdpUtils.sendData(res, 200, countries);
});

/**
 * Get the GDP intake for a specific country
 *
 * @route GET /countries/:country
 * @param {string} req.params.country - The country to get the data for
 * @param {number} req.query.startYear - The starting year of the year range to get the data for
 * @param {number} req.query.endYear - The ending year of the year range to get the data for
 * @returns {object} 200 - An object containing the data for the specified year range and country
 * @returns {object} 404 - If no data is found for that country and year range
 * @returns {object} 400 - If the 'startYear' or 'endYear' params are not numbers or if 'startYear'
 * is greater than the 'endYear'
 */ 
router.get('/countries/:country', async (req, res) => {
  await gdpUtils.getDataSpecificCountry(req, res, db, gdpCollName, 'gdp');
});

/**
 * Get the growth / decline of GDP for a specific country over the years
 *
 * @route GET /countries/:country/variation
 * @param {string} req.params.country - The country to get the data for
 * @param {number} req.query.startYear - The starting year of the year range to get the data for
 * @param {number} req.query.endYear - The ending year of the year range to get the data for
 * @returns {object} 200 - An object containing the variation of GDP (in %)
 * for the specified year range and country
 * @returns {object} 404 - If no data is found for that country and year range
 * @returns {object} 400 - If the 'startYear' or 'endYear' params are not numbers or if 'startYear'
 * is greater than the 'endYear'
 */ 
router.get('/countries/:country/variation', async (req, res) => {
  await gdpUtils.getVariationSpecificCountry(req, res, db, gdpCollName, 'gdp');
});


/**
 * Get the GDP for a specific country within a specified range
 *
 * @route GET /countries/:country/gdp=range
 * @param {string} req.params.country - The country to get the data for
 * @param {number} req.query.startGdp - The starting GDP of the GDP range
 * to get the data for
 * @param {number} req.query.endGdp - The ending GDP of the GDP range
 * to get the data for
 * @returns {object} 200 - An object containing GDP data for the specified country and range
 * @returns {object} 404 - If no data is found for the given country and GDP range
 * @returns {object} 400 - If the 'startGDP' or 'endGDP' params are not numbers or
 * if 'startGDP' is greater than the 'endGDP'
 */
router.get('/countries/:country/gdp-range', async (req, res) => {
  let startGdp = req.query.startGdp;
  let endGdp = req.query.endGdp;
  const country = req.params.country;

  [startGdp, endGdp] = gdpUtils.getDefaultGdpParams(startGdp, endGdp);

  try {
    gdpUtils.validateIntParam(res, startGdp, 'startGdp');
    gdpUtils.validateIntParam(res, endGdp, 'endGdp');
    gdpUtils.validateRange(res, startGdp, endGdp, 'startGdp', 'endGdp');
  } catch {
    return;
  }

  const data = await db.getGDPRange(gdpCollName, country, startGdp, endGdp);

  if (!data.length) {
    const error = `No data found for ${country} with gdp between ${startGdp} and ${endGdp}`;
    gdpUtils.sendError(res, 404, error);
    return;
  }

  data.sort((a, b) => a.year - b.year);

  gdpUtils.sendData (res, 200,
    {
      country: data[0].country,
      code: data[0].code,
      results : data.map(row => {
        return { year : row.year, gdp : row.gdp };
      })
    });
});

/**
 * Get the GDP for multiple countries and a specific year
 *
 * @route GET /countries/
 * @param {string} req.query.countries - A comma separated list of country names
 * to get the data for
 * @param {number} req.query.year - The year to get the data for
 * @returns {object} 200 - An object containing gdp or protein data
 * for the specified countries and year
 * @returns {object} 404 - If no data is found for those countries and that year
 * @returns {object} 400 - If the 'year' param is not a number,
 * the 'countries' param was not provided, or if more than 10 countries were provided
 */
router.get('/countries/', async (req, res) => {
  await gdpUtils.getDataMultipleCountries(req, res, db, gdpCollName, 'gdp');
});

module.exports = router;