const express = require('express');
const router = express.Router();
const gdpUtils = require('./utils/apiUtils.js');
const DB = require('../db/db.js');
const db = new DB();
const gdpCollName = 'gdp-per-capita-worldbank';

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

router.get('/countries/all', async (req, res) => {
  const data = await db.readAll(gdpCollName);
  const nations = [...new Set(data.map(x => x.country))];
  const countries = nations.filter(x => !x.includes('(') && !x.includes('income'));
  gdpUtils.sendData(res, 200, countries);
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

// Filter through countries with a range of gdp using apiUtils
router.get('/countries/:country/gdp-range', async (req, res) => {
  const startGdp = req.query.startGdp;
  const endGdp = req.query.endGdp;
  const country = req.params.country;

  if (!startGdp || !endGdp) {
    gdpUtils.sendError(res, 400, 'The startGdp or endGdp parameters cannot both be empty');
    return;
  }

  try {
    gdpUtils.validateGDP(res, startGdp, 'startGdp');
    gdpUtils.validateGDP(res, endGdp, 'endGdp');
    gdpUtils.validateGDPRange(res, startGdp, endGdp);
  } catch {
    return;
  }

  const data = await db.getGDPRange(gdpCollName, country, startGdp, endGdp);

  if (!data.length) {
    gdpUtils.sendError(res, 404, `No data found for ${req.params.country}`);
    return;
  }

  gdpUtils.sendData (res, 200,
    {
      country: data[0].country,
      code: data[0].code,
      results : data.map(row => {
        return { year : row.year, gdp : row.gdp };
      })
    });
});


// Api endpoint for growth / decline of gdp over all the years
router.get('/countries/:country/variation', async (req, res) => {
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;
  const country = req.params.country;

  if (!startYear || !endYear) {
    gdpUtils.sendError(res, 400, 'The startYear or endYear parameters cannot both be empty');
    return;
  }

  if (!country || !gdpUtils.containsOnlyLetters(country)) {
    gdpUtils.sendError(res, 400, 'The country name cannot contain numbers or special characters');
    return;
  }

  // validate start and end year
  try {
    gdpUtils.validateYear(res, startYear, 'startYear');
    gdpUtils.validateYear(res, endYear, 'endYear');
    gdpUtils.validateYearRange(res, startYear, endYear);
  } catch {
    return;
  }


  const data = await db.getYearRange(gdpCollName, country, startYear, endYear);

  if (!data.length) {
    gdpUtils.sendError(res, 404, `No data found for ${req.params.country}`);
    return;
  }

  // Compare each year to the previous year and calculate the growth/decline
  const results = data.map((row, index) => {
    if (index === 0) {
      return { year : row.year, gdpGrowth : 0 };
    } else {
      return { year : row.year, gdpGrowth : row.gdp / 1000 - data[index - 1].gdp / 10000 };
    }
  });

  gdpUtils.sendData (res, 200,
    {country: data[0].country,
      code: data[0].code,
      results: results}
  );
});

// stub api endpoint to fiter by the top x countries with the highest or lowest gpd protein
router.get('/countries/top/:top', async (req, res) => {
  const top = req.params.top;

  if (isNaN(top) || Number(top) < 1 || Number(top) > 10){
    const error = `The value following top/ must be a number between 1 and 10`;
    gdpUtils.sendError(res, 400, error);
    return;
  }

  const orderBy = req.query.orderBy;
  const orderByOptions = ['highest', 'lowest'];

  if (!orderBy || !orderByOptions.includes(orderBy)) {
    const error = `orderBy query parameter can be one of the following values: 'highest', 'lowest'`;
    gdpUtils.sendError(res, 400, error);
    return;
  }

  const data = await db.readTopCountries(gdpCollName, top, orderBy, 'gdp');  

  gdpUtils.sendData(res, 200, { results : data });
});

//Stub and temporary endpoint for the sake of map filters. This will be deleted later.
router.get('/stub/countries/top/:top', async (req, res) => {
  gdpUtils.sendData (res, 200,
    {results : [
      {
        country: 'Iran',
        code: 'IRN',
        year : 2005,
        gdp : 9876,
        position : [32.4279, 53.6880]
      },
      {
        country: 'Brazil',
        code: 'BRZ',
        year : 2015,
        gdp : 5432,
        position : [-14.2350, -51.9253]
      },
      {
        country: 'United States',
        code: 'USA',
        year : 2018,
        gdp : 1234,
        position : [37.0902, -95.7129]
      },
      {
        country: 'France',
        code: 'FRA',
        year : 2011,
        gdp : 5678,
        position : [46.2276, 2.2137]
      },
      {
        country: 'Japan',
        code: 'JAP',
        year : 2000,
        gdp : 9999,
        position : [36.2048, 138.2529]
      }
    ]}
  );
});

// stub api endpoint for filtering by a range of countries
router.get('/countries/', async (req, res) => {
  // get all countries given in the query
  let reqCountries = req.query.countries;
  const year = req.query.year;

  gdpUtils.validateYear(res, year, 'year');

  if (reqCountries.length === 0) {
    gdpUtils.sendError(res, 404, 'No countries specified');
    return;
  }

  reqCountries = reqCountries.split(',');
  if (reqCountries.length > 10 || reqCountries.length < 1) {
    gdpUtils.sendError(res, 404, 'Countries length can not be less then 1 or greater then 10');
    return;
  }
  //check if countries is in AllCountries
  const countries = gdpUtils.validateCountries(await db.getAllCountries(gdpCollName), reqCountries);
  if (countries.length === 0) {
    gdpUtils.sendError(res, 404, `Countries ${reqCountries} not found`);
    return;
  }

  const results = [];
  for (const country in countries) {
    // eslint-disable-next-line no-await-in-loop
    const data = await db.getCountryYearData(gdpCollName, countries[country], year);
    // eslint-disable-next-line no-await-in-loop
    const latLongData = await db.getCountryCountryData('country', countries[country]);
    data[0].position = [latLongData[0].latitude, latLongData[0].longitude];
    results.push(data[0]);
  }

  gdpUtils.sendData (res, 200,
    {results : results}
  );
});

module.exports = router;