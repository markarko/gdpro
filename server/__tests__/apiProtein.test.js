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

describe('should get protein for a country', () => {
  it('should return 200 for valid country', async () => {
    const url = '/api/v1/protein/countries/Iran';
    const response = await request(app).get(url).set({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }).send({
      'country':'Iran', 'code':'IRN', 'results':[{'year':'2021', 'gppd':'50'}]
    });
    expect(response.statusCode).toEqual(200);
  });
});

describe('should return 400 since country is invalid', () => {
  it('should return 400 since country is invalid', async () => {
    const url = '/api/v1/protein/countries/Ir@n';
    const response = await request(app).get(url).set('Accept', 'application/json');
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/protein/countries/top/1', () => {
  test('responds with error', async () => {
    const url = '/api/v1/protein/countries/top/1';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'orderBy query parameter can be one of the following values: \'highest\', \'lowest\''}
    );
    expect(response.statusCode).toEqual(400);
  });
});