const request = require('supertest');
const app = require('../app');

jest.mock('../db/db', () => {
  class DB {
    constructor() {
    }
  
    async readAllCountryData() {
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gdp' : '5000' }];
    }

    async readTopCountries() {
      return [{'country':'luxembourg', 'code':'LUX', 'year':2000,
        'gdp':99301.52, position:['49.815273', '6.129583']}];
    }

    async readAll() {
      return [{'country':'lu', 'latitude':'49.815273', 'longitude':'6.129583',
        'name':'Luxembourg'}];
    }
  }
  
  return DB;
});
  

describe('GET /api/v1/gdp/countries/Canada', () => {
  test('responds with an array of gdp values', async () => {
    const url = '/api/v1/gdp/countries/Canada';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gdp':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/Canada?startYear=2000', () => {
  test('responds with an array of gdp values filtered by start year', async () => {
    const url = '/api/v1/gdp/countries/Canada?startYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gdp':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});


describe('GET /api/v1/gdp/countries/Canada?startYear=2050', () => {
  test('responds with empty results', async () => {
    const url = '/api/v1/gdp/countries/Canada?startYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/Canada?endYear=2050', () => {
  test('responds with an array of gdp values filtered by end year', async () => {
    const url = '/api/v1/gdp/countries/Canada?endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gdp':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/Canada?endYear=2000', () => {
  test('responds with empty results', async () => {
    const url = '/api/v1/gdp/countries/Canada?endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/Canada?startYear=2000&endYear=2050', () => {
  test('responds with an array of gdp values filtered by end year', async () => {
    const url = '/api/v1/gdp/countries/Canada?startYear=2000&endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gdp':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/Canada?startYear=2050&endYear=2000', () => {
  test('responds with year range error', async () => {
    const url = '/api/v1/gdp/countries/Canada?startYear=2050&endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startYear parameter cannot be greater than the endYear parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/gdp/countries/Canada?startYear=2050&endYear=2000', () => {
  test('responds with year range error', async () => {
    const url = '/api/v1/gdp/countries/Canada?startYear=2050&endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startYear parameter cannot be greater than the endYear parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/gdp/countries/top/1?orderBy=highest&year=2000', () => {
  test('responds top 1 country with highest gdp', async () => {
    const url = '/api/v1/gdp/countries/top/1?orderBy=highest&year=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'results':[{'country':'luxembourg', 'code':'LUX', 'year':2000,
          'gdp':99301.52, position:['49.815273', '6.129583']}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/top/-1?orderBy=highest', () => {
  test('responds with error', async () => {
    const url = '/api/v1/gdp/countries/top/-1?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 'The value following top/ must be a number between 1 and 10'}
    );
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/gdp/countries/top/100?orderBy=highest', () => {
  test('responds with error', async () => {
    const url = '/api/v1/gdp/countries/top/100?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 'The value following top/ must be a number between 1 and 10'}
    );
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/gdp/countries/top/1?orderBy=trash', () => {
  test('responds with error', async () => {
    const url = '/api/v1/gdp/countries/top/1?orderBy=trash';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'orderBy query parameter can be one of the following values: \'highest\', \'lowest\''}
    );
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/gdp/countries/top/1', () => {
  test('responds with error', async () => {
    const url = '/api/v1/gdp/countries/top/1';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'orderBy query parameter can be one of the following values: \'highest\', \'lowest\''}
    );
    expect(response.statusCode).toEqual(400);
  });
});