const app = require('../app');
const request = require('supertest');

jest.mock('../db/db', () => {
  class DB {
    constructor() {
    }
    async readAllCountryData() {
      return [{ 'country' : 'Iran', 'code' : 'IRN', 'year' : '2021', 'gppd' : '50' }];
    }
  }
  return DB;
});

it('should get protein for a country', async () => {
  const url = '/api/v1/protein/countries/Iran';
  const response = await request(app).get(url).set('Accept', 'application/json');
  expect(response.body).toEqual(
    {'data': {
      'country':'Iran', 'code':'IRN', 'results':[{'year':'2021', 'gppd':'50'}]
    }
    });
  expect(response.statusCode).toEqual(200);
});

it('should return 400 since country is invalid', async () => {
  const url = '/api/v1/protein/countries/Ir@n';
  const response = await request(app).get(url).set('Accept', 'application/json');
  expect(response.statusCode).toEqual(400);
});
