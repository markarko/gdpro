/* eslint-disable no-loop-func */

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
  const numQuestion = req.params.number;

  if (!numQuestion) {
    apiUtils.sendError(res, 400, 'No questions specified');
    return;
  }
  // check if the number of questions is valid (between 1 and 10)
  if (numQuestion < 1 || numQuestion > 10) {
    apiUtils.sendError(res, 400, 'Invalid number of questions');
    return;
  }

  const questions = [];
  for (let i = 0; i < numQuestion; i++) {
    // eslint-disable-next-line no-await-in-loop
    const question = await generateQuestion();
    questions.push(question);
  }

  async function generateQuestion() {
    // read all for now (dataset is quite small)
    // But we can change this to read only the country names and then make query for the data
    const countries = await db.readAll(countriesCollName);

    // Shuffle the countries
    countries.sort(() => Math.random() - 0.5);

    let cGDP = '';
    let cPro = '';
    let country = '';
    let found = false;

    // Used to be a while loop, but its better to have a limit
    for (let i = 0; i < countries.length; i++) {
      country = countries[i];

      // This isn't great coding style, I understand, this is just a quick fix
      // eslint-disable-next-line no-await-in-loop
      cGDP = await db.readAllCountryData(gdpCollName, country.name.toLowerCase());
      // eslint-disable-next-line no-await-in-loop
      cPro = await db.readAllCountryData(proteinCollName, country.name.toLowerCase());
        
      if (cGDP && cPro) {
        found = true;
        break;
      }
    }


    if (!found) {
      apiUtils.sendError(res, 404, 'No questions found');
      return;
    }
  
    const otherCountries = [];
    for (let i = 0; i < 2; i++) {
      const otherCountry = countries[Math.floor(Math.random() * countries.length)];
      otherCountries.push(otherCountry);
    }
    otherCountries.push(country);

  
    // randomize the order of the countries
    otherCountries.sort(() => Math.random() - 0.5);

    const mapData = [];

    for (const newCountry in otherCountries) {
      const countryData = otherCountries[newCountry];
      mapData.push({
        lat: countryData.latitude,
        lon: countryData.longitude,
        name: countryData.name
      });
    }

    // filter cGDP to only have {year: 213, gdp: 123}
    cGDP = cGDP.map((row) => {
      return {
        year: row.year,
        gdp: row.gdp
      };
    });

    // filter cPro the same way
    cPro = cPro.map((row) => {
      return {
        year: row.year,
        gppd: row.gppd
      };
    });

    return {
      chart: {
        gdp: cGDP,
        gppd: cPro
      },
      map: mapData,
      answer: country.name
    };
  }

  const responseBody = {
    'questions': questions
  };

  apiUtils.sendData(res, 200, responseBody);
});




module.exports = router;