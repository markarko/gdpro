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
 * @swagger
 * tags:
 *   name: Protein
 *   description: The protein managing API
 * /api/v1/protein/countries/{country}:
 *   get:
 *     summary: Gets all the data for a specific country
 *     tags: [Protein]
 *     parameters:
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: The country name
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: string
 *         description: The start year for the data
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: string
 *         description: The end year for the data
 *     responses:
 *       200:
 *         description: The fetched country data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/daily-per-capita-protein-supply'
 *       400:
 *         description: Invalid country name or year range
 *       404:
 *         description: No data found for the specified country
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     daily-per-capita-protein-supply:
 *       type: object
 *       required:
 *         - country
 *         - code
 *         - results
 *       properties:
 *         country:
 *           type: string
 *           description: The country name
 *         code:
 *           type: string
 *           description: The country code
 *         results:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               year:
 *                 type: string
 *                 description: The year
 *               gppd:
 *                 type: string
 *                 description: Grams of protein supply per person per day
 *       example:
 *         data:
 *           country: Canada
 *           code: CAN
 *           results:
 *             - year: "1961"
 *               gppd: "78.3"
 *             - year: "1962"
 *               gppd: "59.5"
 */

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

module.exports = router;