const {csvToJson} = require('../utils/seed');
const path = require('path');

test('csvToJson converts a gdp.csv file to JSON array', async () => {
  const filePath = path.join(__dirname, '..', 'data', 'gdp-test.csv');
  const result = await csvToJson(filePath);
  expect(result).toEqual([
    {
      'Entity': 'Afghanistan',
      'Code': 'AFG',
      'GDP per capita, PPP (constant 2017 international $)': '943.367',
      'Year': '1990',
    },
    {
      'Entity': 'Afghanistan',
      'Code': 'AFG',
      'Year': '1991',
      'GDP per capita, PPP (constant 2017 international $)': '953.134'
    },
    {
      'Entity': 'Afghanistan',
      'Code': 'AFG',
      'Year': '1992',
      'GDP per capita, PPP (constant 2017 international $)': '1003.536'
    },
    {
      'Entity': 'Afghanistan',
      'Code': 'AFG',
      'Year': '1993',
      'GDP per capita, PPP (constant 2017 international $)': '1021.524'
    },
    {
      'Entity': 'Mexico',
      'Code': 'MEX',
      'Year': '2010',
      'GDP per capita, PPP (constant 2017 international $)': '18036.717'
    },
    {
      'Entity': 'Mexico',
      'Code': 'MEX',
      'Year': '2011',
      'GDP per capita, PPP (constant 2017 international $)': '18432.37'
    },
    {
      'Entity': 'Mexico',
      'Code': 'MEX',
      'Year': '2012',
      'GDP per capita, PPP (constant 2017 international $)': '18838.783'
    },
    {
      'Entity': 'Mexico',
      'Code': 'MEX',
      'Year': '2013',
      'GDP per capita, PPP (constant 2017 international $)': '18844.031'
    },
    {
      'Entity': 'Moldova',
      'Code': 'MDA',
      'Year': '2011',
      'GDP per capita, PPP (constant 2017 international $)': '9050.126'
    },
    {
      'Entity': 'Moldova',
      'Code': 'MDA',
      'Year': '2012',
      'GDP per capita, PPP (constant 2017 international $)': '8997.934'
    },
    {
      'Entity': 'Moldova',
      'Code': 'MDA',
      'Year': '2013',
      'GDP per capita, PPP (constant 2017 international $)': '9814.323'
    },
    {
      'Entity': 'Moldova',
      'Code': 'MDA',
      'Year': '2014',
      'GDP per capita, PPP (constant 2017 international $)': '10311.288'
    }
  ]);
});
  
test('csvToJson converts a protein.csv file to JSON array', async () => {
  const filePath = path.join(__dirname, '..', 'data', 'protein-test.csv');
  const result = await csvToJson(filePath);
  expect(result).toEqual([
    {
      'Entity': 'Afghanistan',
      'Code': 'AFG',
      'Year': '1961',
      'Grams of protein per day per capita': '86.49284'
    },
    {
      'Entity': 'Afghanistan',
      'Code': 'AFG',
      'Year': '1962',
      'Grams of protein per day per capita': '84.580055'
    },
    {
      'Entity': 'Afghanistan',
      'Code': 'AFG',
      'Year': '1963',
      'Grams of protein per day per capita': '78.65725'
    },
    {
      'Entity': 'Afghanistan',
      'Code': 'AFG',
      'Year': '1964',
      'Grams of protein per day per capita': '85.19888'
    },
    {
      'Entity': 'Albania',
      'Code': 'ALB',
      'Year': '1984',
      'Grams of protein per day per capita': '77.51333'
    },
    {
      'Entity': 'Albania',
      'Code': 'ALB',
      'Year': '1986',
      'Grams of protein per day per capita': '78.76583'
    },
    {
      'Entity': 'Albania',
      'Code': 'ALB',
      'Year': '1987',
      'Grams of protein per day per capita': '74.15662'
    },
    {
      'Entity': 'Albania',
      'Code': 'ALB',
      'Year': '1988',
      'Grams of protein per day per capita': '78.98801'
    },
    {
      'Entity': 'Iran',
      'Code': 'IRN',
      'Year': '1996',
      'Grams of protein per day per capita': '82.11965'
    },
    {
      'Entity': 'Iran',
      'Code': 'IRN',
      'Year': '1997',
      'Grams of protein per day per capita': '83.723625'
    },
    {
      'Entity': 'Iran',
      'Code': 'IRN',
      'Year': '1998',
      'Grams of protein per day per capita': '82.335106'
    },
    {
      'Entity': 'Iran',
      'Code': 'IRN',
      'Year': '1999',
      'Grams of protein per day per capita': '83.56507'
    }
  ]);
});
  