const express = require('express');
const router = express.Router();
const gdpUtils = require('./utils/apiUtils.js');
const DB = require('../db/db.js');
const db = new DB();
const gdpCollName = 'gdp-per-capita-worldbank';
const countryCollName = 'country';

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
  const year = req.query.year;

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

  const results = [];
  const data = await db.readTopCountries(gdpCollName, top, orderBy, 'gdp', year);  
  const geoPosition = await db.readAll(countryCollName);

  data.forEach(country => {
    geoPosition.forEach(position => {
      if (country.country === position.name.toLowerCase()) {
        results.push({
          country: country.country,
          code: country.code,
          year: country.year,
          gdp: country.gdp,
          position: [position.latitude, position.longitude]
        });
      }
    });
  });

  gdpUtils.sendData(res, 200, { results : results });

});

// stub api endpoint to filter by specific country and year
router.get('/countries/:country/:year', async (req, res) => {
  res.status(200);
  req.query.year;
  gdpUtils.sendData(res, 200,
    {country: 'Canada',
      code: 'CAN',
      results : [
        {
          year : 1990,
          gdp : 5723
        }
      ]}
  );
});


router.get('/countries/', async (req, res) => {
  let countries = req.query.countries;
  if (!countries) {
    gdpUtils.sendError(res, 404, 'No countries specified');
    return;
  }
  const year = req.query.year;

  countries = countries.split(',');
  if (countries.length > 10 || countries.length < 1) {
    gdpUtils.sendError(res, 400, 'Countries length can not be less then 1 or greater then 10');
    return;
  }

  countries = gdpUtils.validateCountries(await db.getAllCountries(gdpCollName), countries);
  if (countries.length === 0) {
    gdpUtils.sendError(res, 404, `Countries ${req.query.countries} not found`);
    return;
  }
  const results = [];
  const data = await db.readAllYearCountryData(gdpCollName, Number(year), countries);
  const geoPosition = await db.readAllYearCountryGeo(countries);
  data.forEach(country => {
    geoPosition.forEach(position => {
      if (country.country === position.name) {
        results.push({
          country: country.country,
          code: country.code,
          year: country.year,
          gdp: country.gdp,
          position: [position.latitude, position.longitude]
        });
      }
    });
  });  
  gdpUtils.sendData(res, 200, { results : results });
});

module.exports = router;