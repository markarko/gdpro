const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const DB = require('../db/db.js');
const fsPromises = fs.promises;

/**
 * Converts a stream to a promise that resolves with parsed CSV data
 * 
 * @param {Object} stream - The stream to be parsed
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array 
 * of objects representing the parsed CSV rows
 * @throws {Error} If an error occurs during the parsing of the stream
 */
async function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    const results = [];
    stream.pipe(csv()).on('data', (data) => results.push(data)).on('end', () => resolve(results));
    stream.on('error', (error) => reject(error));
  });
}

/**
 * Converts the content of a CSV file to JSON
 * 
 * @param {string} filePath - The path to the CSV file
 * @returns {Promise<Array<Object>>} - A promise that resolves with an 
 * array of objects representing the parsed CSV content
 * @throws {Error} If the specified file does not exist or an error occurs during parsing
 */
async function csvToJson(filePath) {
  try {
    await fsPromises.access(filePath);
  } catch (err) {
    throw new Error(`File at ${filePath} does not exist`);
  }

  const stream = fs.createReadStream(filePath);
  return await streamToPromise(stream);
}

/**
 * Converts a CSV file from a specified dataset directory to a JSON-like structure
 * 
 * @param {string} fileName - The name of the CSV file. 
 * The file should be located in 'server/data/' 
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of 
 * objects representing the parsed CSV content
 * @throws {Error} If the specified file does not exist or an error occurs during reading/parsing
 */
async function datasetToJson(fileName) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  return await csvToJson(filePath);
}

/**
 * Populates the database with some initial data
 * 
 * @param {string} dbName - The name of the database to be populated
 * @param {string} collectionName - The name of the collection in that database to be populated
 * @param {Array<Object>} data - The json data to be inserted into the collection
 */
async function seedDatabase(dbName, collectionName, data) {
  let db;
  try {
    const db = new DB();
    await db.connect(dbName, collectionName);
    const num = data.length;
    await db.createMany(data);
    console.log(`Inserted ${num} rows`);
  } catch (e) {
    console.error('Could not seed');
    console.error(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
}

(async () => {
  // Code not tested
  const filesNames = ['daily-per-capita-protein-supply.csv', 'gdp-per-capita-worldbank.csv'];
  for (const fileName of filesNames) {
    const data = await datasetToJson(fileName);
    seedDatabase('GDPRO', fileName, data);
  }
})();

// No need for this as this should be a standalone script
module.exports = {csvToJson};
/* module.exports = datasetToJson; */