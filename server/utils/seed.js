const {datasetToJson, seedDatabase} = require('./parsing.js');
const DB = require('../db/db.js');

(async () => {
  let db;

  try{
    const dbName = 'GDPRO';
    const db = new DB();
    await db.connect(dbName);  
  
    const filesNames = [
      'gdp-per-capita-worldbank.csv',
      'daily-per-capita-protein-supply.csv',
      'country.csv'
    ];

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

        if (rowCopy.name) {
          rowCopy.name = row.name.toLowerCase();
        }
        

        return rowCopy;
      });

      await seedDatabase(db, fileName.split('.')[0], filteredData); 
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();