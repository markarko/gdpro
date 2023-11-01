const express = require('express');
const app = express();
const gdpRouter = require('./gdp');
const proteinRouter = require('./protein');
const DB = require('../db/db.js');

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/gdp/', gdpRouter);
app.use('/protein/', proteinRouter);

app.use(express.static('public'));

( async () => {
  let db;
  try {
    const dbName = 'gdpro';
    // TODO: modify database to handle multiple collections
    const collectionName = 'gdp-per-capita-worldbank.csv';
    db = new DB();
    await db.connect(dbName, collectionName);
    app.listen(port, () => console.log('Listening on port ' + port));
  } catch (e) {
    console.error('Could not connect');
    console.error(e);
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
