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

/**
 * Get the protein intake for a specific year within a specified protein range
 *
 * @route GET /countries/protein-range
 * @param {number} req.query.year - The year to get the data for
 * @param {number} req.query.min - The starting protein of the protein range
 * to get the data for
 * @param {number} req.query.max - The ending protein of the protein range
 * to get the data for
 * @returns {object} 200 - An object containing protein data for the specified year and range
 * @returns {object} 404 - If no data is found for the given year and protein range
 * @returns {object} 400 - If the 'min' or 'max' params are not numbers or
 * if 'min' is greater than the 'max'
 */
router.get('/countries/protein-range', async (req, res) => {
  await proteinUtils.getDataRangeSpecificYear(req, res, db, 
    proteinCollName, countryCollName, 'gppd');
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
    proteinUtils.sendError(res, 400, error);
    return;
  }

  next();
});

/**
 * Get the x highest or lowest protein intakes across all countries
 *
 * @route GET /countries/top/:top
 * @param {number} req.params.top - The amount of highest or lowest protein intakes to get in
 * descending or ascending order respectively. Number between 1 and 10.
 * (ex: if top is 5, it will return 5 highest or lowest protein intakes)
 * @param {number} req.query.year - Get top highest or lowest protein intakes for that specific year
 * @param {number} req.query.orderBy - Specify if the route should return the highest or lowest
 * protein intake. Values: 'highest', 'lowest'
 * @returns {object} 200 - An object containing protein data for the specified year and sorting.
 * @returns {object} 404 - If no data is found for that year (really means there is no data at all)
 * @returns {object} 400 - If the 'year' param is not a number or the 'orderBy' param is not a valid
 * value
 */ 
router.get('/countries/top/:top', async (req, res) => {
  await proteinUtils.getTopCountries(req, res, db, proteinCollName, countryCollName, 'gppd');
});

/**
 * Middleware for validating the 'country' parameter in the route
 *
 * @param {string} country - The 'country' parameter from the URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
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
 * Get the protein intake for a specific country
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
  await proteinUtils.getDataSpecificCountry(req, res, db, proteinCollName, 'gppd');
});

/**
 * Get the growth / decline of protein intake for a specific country over the years
 *
 * @route GET /countries/:country/variation
 * @param {string} req.params.country - The country to get the data for
 * @param {number} req.query.startYear - The starting year of the year range to get the data for
 * @param {number} req.query.endYear - The ending year of the year range to get the data for
 * @returns {object} 200 - An object containing the variation of protein intake (in %)
 * for the specified year range and country
 * @returns {object} 404 - If no data is found for that country and year range
 * @returns {object} 400 - If the 'startYear' or 'endYear' params are not numbers or if 'startYear'
 * is greater than the 'endYear'
 */ 
router.get('/countries/:country/variation', async (req, res) => {
  await proteinUtils.getVariationSpecificCountry(req, res, db, proteinCollName, 'gppd');
});

/**
 * Get the protein intake for a specific country within a specified range
 *
 * @route GET /countries/:country/protein
 * @param {string} req.params.country - The country to get the data for
 * @param {number} req.query.startProtein - The starting protein of the protein range
 * to get the data for
 * @param {number} req.query.endProtein - The ending protein of the protein range
 * to get the data for
 * @returns {object} 200 - An object containing protein data for the specified country and range
 * @returns {object} 404 - If no data is found for the given country and protein range
 * @returns {object} 400 - If the 'startProtein' or 'endProtein' params are not numbers or
 * if 'startProtein' is greater than the 'endProtein'
 */
router.get('/countries/:country/protein-range', async (req, res) => {
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

/**
 * Get the protein intake for multiple countries and a specific year
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
  await proteinUtils.getDataMultipleCountries(req, res, db, proteinCollName, 'gppd');
});
  
module.exports = router;