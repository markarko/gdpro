const {datasetToJson, seedDatabase} = require('./parsing.js');

(async () => {
  const filesNames = ['daily-per-capita-protein-supply.csv', 'gdp-per-capita-worldbank.csv',
    'countries.csv'];
  for (const fileName of filesNames) {
    const data = await datasetToJson(fileName);
    const filteredData = data.filter(row => !row.country.includes('FAO')).map(row => {
      const rowCopy = Object.assign(row);
      rowCopy.country = row.country.toLowerCase();
      if (rowCopy.year) {
        rowCopy.year = Number(row.year);
      
        if (row.gdp) {
          rowCopy.gdp = Number(row.gdp);
        }
        if (row.gppd){
          rowCopy.gppd = Number(row.gppd);
        }
      }
      

      return row;
    });
    seedDatabase('GDPRO', fileName.split('.')[0], filteredData); 
  }
})();