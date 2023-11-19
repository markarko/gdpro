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
  await gdpUtils.getDataSpecificCountry(req, res, db, gdpCollName, 'gdp');
});

// Filter through countries with a range of gdp using apiUtils
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
  await gdpUtils.getVariationSpecificCountry(req, res, db, gdpCollName, 'gdp');
});

router.param('top', (req, res, next, top) => {
  if (isNaN(top) || Number(top) < 1 || Number(top) > 10){
    const error = `The value following top/ must be a number between 1 and 10`;
    gdpUtils.sendError(res, 400, error);
    return;
  }

  next();
});

// stub api endpoint to fiter by the top x countries with the highest or lowest gpd protein
router.get('/countries/top/:top', async (req, res) => {
  await gdpUtils.getTopCountries(req, res, db, gdpCollName, countryCollName, 'gdp');
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


// router.get('/countries/', async (req, res) => {
//   let countries = req.query.countries;
//   const year = req.query.year;
//   countries = countries.split(',');
//   const results = [];
//   const data = await db.readAllYearCountryData(gdpCollName, Number(year), countries);
//   const geoPosition = await db.readAll(countryCollName);
//   data.forEach(country => {
//     geoPosition.forEach(position => {
//       if (country.country === position.name.toLowerCase()) {
//         results.push({
//           country: country.country,
//           code: country.code,
//           year: country.year,
//           gdp: country.gdp,
//           position: [position.latitude, position.longitude]
//         });
//       }
//     });
//   });
//   gdpUtils.sendData(res, 200, { results : results });
// });

router.get('/countries/', async (req, res) => {
  // get all countries given in the query
  let reqCountries = req.query.countries;
  const year = req.query.year;

  gdpUtils.validateIntParam(res, year, 'year');

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