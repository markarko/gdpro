const {datasetToJson, seedDatabase} = require('./parsing.js');

(async () => {
  const filesNames = ['daily-per-capita-protein-supply.csv', 'gdp-per-capita-worldbank.csv'];
  for (const fileName of filesNames) {
    const data = await datasetToJson(fileName);
    const filteredData = data.filter(row => !row.country.includes('FAO')).map(row => {
      const rowCopy = Object.assign(row);
      rowCopy.country = row.country.toLowerCase();
      return row;
    });
    seedDatabase('gdpro', fileName.split('.')[0], filteredData); 
  }
})();