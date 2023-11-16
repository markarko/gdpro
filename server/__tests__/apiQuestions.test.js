const request = require('supertest');
const app = require('../app');
const proteinCollName = 'daily-per-capita-protein-supply';

jest.mock('../db/db', () => {
  class DB {
    constructor() {
    }
  
    async readAllCountryData(collName, country) {
      if (country === proteinCollName) {
        return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : 2021, 'gppd' : 5000 }];
      } else {
        return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : 2021, 'gdp' : 5000 }];
      }
    }

    async getAllCountries() {
      return ['canada', 'germany', 'france'];
    }

    async getCountryYearData() {
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : 2021, 'gdp' : 5000 }];
    }

    async getCountryCountryData() {
      return [{
        'country': 'ca',
        'latitude': '56.130366',
        'longitude': '-106.346771',
        'name': 'canada'
      }];
    }

    async readAll() {
      return [{
        'country': 'ca',
        'latitude': '56.130366',
        'longitude': '-106.346771',
        'name': 'canada'
      },
      {
        'country': 'de',
        'latitude': '51.165691',
        'longitude': '10.451526',
        'name': 'germany'
      }];
    }
  }
  
  return DB;
});

describe('GET /api/v1/questions/random-questions/1', () => {
  test('responds with an array of questions', async () => {
    const url = '/api/v1/questions/random-questions/1';
    const response = await request(app).get(url);
    // check if the response contains an array
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/questions/random-questions/0', () => {
  test('responds with an error', async () => {
    const url = '/api/v1/questions/random-questions/0';
    const response = await request(app).get(url);
    // check if the response contains an array
    expect(response.body).toEqual({ error: 'Invalid number of questions' });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/questions/random-questions/11', () => {
  test('responds with an error', async () => {
    const url = '/api/v1/questions/random-questions/11';
    const response = await request(app).get(url);
    // check if the response contains an array
    expect(response.body).toEqual({ error: 'Invalid number of questions' });
    expect(response.statusCode).toEqual(400);
  });
});