const app = require('../app');
const request = require('supertest');
const DB = require('../db/db'); 
let db = null;

beforeAll(async () => {
  try {
    const dbName = 'gdpro';
    const collectionName = 'daily-per-capita-protein-supply.csv';
    db = new DB();
    await db.connect(dbName, collectionName);
  } catch (e) {
    console.error('Could not connect');
    console.error(e);
    if (db) {
      db.close();
    }
    process.exit();
  }
});

afterAll(async () => {
  try {
    if (db) {
      await db.close();
    }
  } catch (e) {
    console.error('Could not close connection');
    console.error(e);
  }
});

it('should get protein for a country', async () => {
  await request(app).
    get('/api/v1/protein/countries/Iran').
    set('Accept', 'application/json').
    expect('Content-Type', /json/).
    expect(200);
});

it('should return 400 since country is invalid', async () => {
  await request(app).
    get('/api/v1/protein/countries/Ir@n').
    set('Accept', 'application/json').
    expect('Content-Type', /json/).
    expect(400);
});
