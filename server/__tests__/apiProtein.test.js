const app = require('../app');
const request = require('supertest');

jest.mock('../db/db', () => {
  class DB {
    constructor() {
    }
    async readAllCountryData() {
      return [{ 'country' : 'iran', 'code' : 'IRN', 'year' : 2021, 'gppd' : 50 }];
    }

    async readTopCountries() {
      return [{'code':'ISL', 'country':'iceland', 'gppd':123.44397, 'year':2000}];
    }

    async readAll() {
      return [{'country':'lc', 'latitude':'64.963051', 'longitude':'-19.020835',
        'name':'Iceland'}];
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
      'country':'Iran', 'code':'IRN', 'results':[{'year':2021, 'gppd':50}]
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

describe('GET /api/v1/protein/countries/Iran?endYear=2021', () => {
  test('responds with an array of gppd values filtered by end year', async () => {
    const url = '/api/v1/protein/countries/Iran?endYear=2021';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'iran', 'code':'IRN', 'results':[{'year':2021, 'gppd':50}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/protein/countries/Iran?endYear=2000', () => {
  test('responds with empty results', async () => {
    const url = '/api/v1/protein/countries/Iran?endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'iran', 'code':'IRN', 'results':[]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/protein/countries/Iran?startYear=2000&endYear=2050', () => {
  test('responds with an array of protein values filtered by end year', async () => {
    const url = '/api/v1/protein/countries/Iran?startYear=2021&endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'iran', 'code':'IRN', 'results':[{'year':2021, 'gppd':50}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/protein/countries/Canada?startYear=2050&endYear=2000', () => {
  test('responds with year range error', async () => {
    const url = '/api/v1/protein/countries/Canada?startYear=2050&endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startYear parameter cannot be greater than the endYear parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/protein/countries/Canada?startYear=2050&endYear=2000', () => {
  test('responds with year range error', async () => {
    const url = '/api/v1/protein/countries/Canada?startYear=2050&endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startYear parameter cannot be greater than the endYear parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/protein/countries/top/1?orderBy=highest&year=2000', () => {
  it('responds top 1 country with highest gdp', async () => {
    const url = '/api/v1/protein/countries/top/1?orderBy=highest&year=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'results':[{'country':'iceland', 'code':'ISL', 'year':2000,
          'protein':123.44397, position:['64.963051', '-19.020835']}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/protein/countries/top/-1?orderBy=highest', () => {
  it('responds with error', async () => {
    const url = '/api/v1/protein/countries/top/-1?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 'The value following top/ must be a number between 1 and 10'}
    );
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/protein/countries/top/100?orderBy=highest', () => {
  it('responds with error', async () => {
    const url = '/api/v1/protein/countries/top/100?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 'The value following top/ must be a number between 1 and 10'}
    );
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/protein/countries/top/1?orderBy=trash', () => {
  it('responds with error', async () => {
    const url = '/api/v1/protein/countries/top/1?orderBy=trash';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'orderBy query parameter can be one of the following values: \'highest\', \'lowest\''}
    );
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