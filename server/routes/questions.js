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
const gdpCollName = 'gdp-per-capita-worldbank';
const countriesCollName = 'country';


/**
 * GET handler for getting the protein intake of a specific country
 * TO BE UPDATED
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/random-questions/:number', async (req, res) => {
  const questions = req.params.number;
  if (!questions) {
    apiUtils.sendError(res, 400, 'No questions specified');
    return;
  }
  const countries = await db.readAll(countriesCollName);
  let cGDP = '';
  let cPro = '';
  let country = '';

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // This isn't great coding style, I understand, this is just a quick fix
    country = countries[Math.floor(Math.random() * countries.length)];
    // eslint-disable-next-line no-await-in-loop
    cGDP = await db.readAllCountryData(gdpCollName, country.name.toLowerCase());
    // eslint-disable-next-line no-await-in-loop
    cPro = await db.readAllCountryData(proteinCollName, country.name.toLowerCase());

    try {
      cGDP = cGDP.find(gdp => cPro.some(pro => pro.year === gdp.year));
      cPro = cPro.find(pro => pro.year === cGDP.year);
    } catch {
      continue;
    }
    
    if (cGDP && cPro) {
      break;
    }
  }

  
  const Lon = country.longitude;
  const Lat = country.lattitude;

  const otherCountries = [];
  for (let i = 0; i < 2; i++) {
    const otherCountry = countries[Math.floor(Math.random() * countries.length)];
    otherCountries.push(otherCountry);
  }
  otherCountries.push(country);

  // randomize the order of the countries
  otherCountries.sort(() => Math.random() - 0.5);

  const responseBody = {
    'questions': [
      {'Question': 'Which of the following countries has the',
        'QData': {'GDP': cGDP.gdp, 'Protein': cPro.gppd, 'Lan': Lat, 'Lon': Lon, 'year': cGDP.year},
        'Answers': [otherCountries[0].name, otherCountries[1].name, otherCountries[2].name],
        'Correct': country.name},
      {'Question': 'Which of the following countries has the',
        'QData': {'GDP': cGDP.gdp, 'Protein': cPro.gppd, 'Lan': Lat, 'Lon': Lon, 'year': cGDP.year},
        'Answers': [otherCountries[0].name, otherCountries[1].name, otherCountries[2].name],
        'Correct': country.name},
      {'Question': 'Which of the following countries has the',
        'QData': {'GDP': cGDP.gdp, 'Protein': cPro.gppd, 'Lan': Lat, 'Lon': Lon, 'year': cGDP.year},
        'Answers': [otherCountries[0].name, otherCountries[1].name, otherCountries[2].name],
        'Correct': country.name},
      {'Question': 'Which of the following countries has the',
        'QData': {'GDP': cGDP.gdp, 'Protein': cPro.gppd, 'Lan': Lat, 'Lon': Lon, 'year': cGDP.year},
        'Answers': [otherCountries[0].name, otherCountries[1].name, otherCountries[2].name],
        'Correct': country.name},
    ]
  };

  apiUtils.sendData(res, 200, responseBody);
});




module.exports = router;