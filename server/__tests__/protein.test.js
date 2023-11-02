const app = require('../app');
const request = require('supertest');

jest.mock('../db/db', () => {
  class DB {
    constructor() {
    }
  
    async readAllCountryData() {
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gppd' : '50' }];
    }
  }
  
  return DB;
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
