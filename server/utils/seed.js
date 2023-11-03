const {datasetToJson} = require('./parsing.js');
const {seedDatabase} = require('../db/db.js');

(async () => {
  const filesNames = ['daily-per-capita-protein-supply.csv', 'gdp-per-capita-worldbank.csv'];
  for (const fileName of filesNames) {
    const data = await datasetToJson(fileName);
    const filteredData = data.filter(row => !row.country.includes('FAO')).map(row => {
      const rowCopy = Object.assign(row);
      rowCopy.country = row.country.toLowerCase();
      return row;
    });
    seedDatabase('GDPRO', fileName, filteredData); 
  }
})();

// No need for this as this should be a standalone script