const request = require('supertest');
const app = require('../app');

jest.mock('../db/db', () => {
  class DB {
    constructor() {
    }
  
    async readAllCountryData() {
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gdp' : '5000' }];
    }

    async readAllYearCountryData() {
      return [
        {
          country: 'canada',
          code: 'CAN',
          year: '2021',
          gdp: '5000',
        },
        {
          country: 'germany',
          code: 'GER',
          year: '2021',
          gdp: '5000',
        },
        {
          country: 'france',
          code: 'FRA',
          year: '2021',
          gdp: '5000',
        }
      ];
    }

    async readAllYearCountryGeo() {
      return [
        {
          country: 'ca',
          latitude: '56.130366',
          longitude: '-106.346771',
          name: 'canada',
        },
        {
          country: 'ca',
          latitude: '56.130366',
          longitude: '-106.346771',
          name: 'canada',
        },
        {
          country: 'ca',
          latitude: '56.130366',
          longitude: '-106.346771',
          name: 'canada',
        }
      ];
    }

    async getGDPRange(collName, country) {
      if (country === 'random') {
        return [];
      }
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gdp' : '5000' }];
    }

    async getYearRange(collName, country) {
      if (country === 'random') {
        return [];
      }
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gdp' : '5000' },
        { 'country' : 'canada', 'code' : 'CAN', 'year' : '2022', 'gdp' : '6000' },
        { 'country' : 'canada', 'code' : 'CAN', 'year' : '2023', 'gdp' : '7000' }];
    }

    async getAllCountries() {
      return ['canada', 'germany', 'france'];
    }

    async getCountryYearData() {
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gdp' : '5000' }];
    }

    async getCountryCountryData() {
      return [{
        'country': 'ca',
        'latitude': '56.130366',
        'longitude': '-106.346771',
        'name': 'canada'
      }];
    }
    
    async readTopCountries() {
      return [{'country':'luxembourg', 'code':'LUX', 'year':2000,
        'gdp':99301.52, position:['49.815273', '6.129583']}];
    }

    async getDataRangeWithYear() {
      return [{'country':'canada', 'code':'CAN', 'year':'2021', 'gdp':'5000'}];
    }

    async readAll() {
      return [{'country':'lu', 'latitude':'49.815273', 'longitude':'6.129583',
        'name':'Luxembourg'},
      {'country':'ca', 'latitude':'56.130366', 'longitude':'-106.346771', 'name':'Canada'},];
    }
  }
  
  return DB;
});


describe('Test get the gdp for a specific year within a specified gdp range', () => {
  test('responds with an array of gdp values filtered by year', async () => {
    const url = '/api/v1/gdp/countries/gdp-range?year=2021&min=1&max=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'results':[{'country':'canada', 'code':'CAN', 'year':'2021', 'gdp':'5000', 
          'position':['56.130366', '-106.346771']}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test get the gdp for a specific year within a specified gdp range', () => {
  test('responds with The min parameter cannot be greater than the max parameter', async () => {
    const url = '/api/v1/gdp/countries/gdp-range?year=2021&min=100000&max=1';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The min parameter cannot be greater than the max parameter'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the gdp for a specific year within a specified gdp range', () => {
  test('respond with The min parameter must be a number', async () => {
    const url = '/api/v1/gdp/countries/gdp-range?year=2021&min=abc&max=1';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The min parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
});


describe('Test get the gdp for a specific year within a specified gdp range', () => {
  test('respond with The max parameter must be a number', async () => {
    const url = '/api/v1/gdp/countries/gdp-range?year=2021&min=1&max=abc';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The max parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the gdp for a specific year within a specified gdp range', () => {
  test('respond with The year parameter must be a number', async () => {
    const url = '/api/v1/gdp/countries/gdp-range?year=abc&min=1&max=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The year parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the gdp for a specific year within a specified gdp range', () => {
  test('respond with The year parameter must be a positive number', async () => {
    const url = '/api/v1/gdp/countries/gdp-range?year=-1&min=1&max=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The year parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  }); 
});
  
describe('Test get the top x highest or lowest GDP across all countries', () => {
  test('responds with an array of gdp values filtered by year', async () => {
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

describe('Test get the top x highest or lowest GDP across all countries', () => {
  test('responds with The year parameter must be a number', async () => {
    const url = '/api/v1/gdp/countries/top/1?orderBy=highest&year=abc';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The year parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the top x highest or lowest GDP across all countries', () => {
  test('responds with The year parameter must be a positive number', async () => {
    const url = '/api/v1/gdp/countries/top/1?orderBy=highest&year=-1';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The year parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
}
);

describe('Test get the top x highest or lowest GDP across all countries', () => {
  test('responds with The value following top/ must be a number between 1 and 10', async () => {
    const url = '/api/v1/gdp/countries/top/-1?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The value following top/ must be a number between 1 and 10'
      });
    expect(response.statusCode).toEqual(400);
  });
}
);

describe('Test get the top x highest or lowest GDP across all countries', () => {
  test('responds with The value following top/ must be a number between 1 and 10', async () => {
    const url = '/api/v1/gdp/countries/top/100?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The value following top/ must be a number between 1 and 10'
      });
    expect(response.statusCode).toEqual(400);
  });
}
);


describe('Test getting all countries', () => {
  test('responds with an array of countries', async () => {
    const url = '/api/v1/gdp/countries/all';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': ['lu', 'ca']}
    );
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the GDP for a specific country over a range of years', () => {
  test('responds with an array of gdp values', async () => {
    const url = '/api/v1/gdp/countries/Canada?endYear=2021';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gdp':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the GDP for a specific country over a range of years', () => {
  test('responds with an array of gdp values filtered by start year', async () => {
    const url = '/api/v1/gdp/countries/Canada?startYear=2000&endYear=2021';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gdp':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});


describe('Test getting the GDP for a specific country over a range of years', () => {
  test('responds with empty results', async () => {
    const url = '/api/v1/gdp/countries/Canada?startYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the GDP for a specific country over a range of years', () => {
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

describe('Test getting the GDP for a specific country over a range of years', () => {
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

describe('Test getting the GDP for a specific country over a range of years', () => {
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

describe('Test getting the GDP for a specific country over a range of years', () => {
  test('responds with year range error', async () => {
    const url = '/api/v1/gdp/countries/Canada?startYear=2050&endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startYear parameter cannot be greater than the endYear parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test Get the growth / decline of GDP for a specific country over the years', () => {
  test('responds with an array of gdp values filtered by start year', async () => {
    const url = '/api/v1/gdp/countries/canada/variation?startYear=2020&endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual({
      'data': {
        'code': 'CAN',
        'country': 'canada',
        'results':  [
          {
            'growth': 0,
            'year': '2021',
          },
          {
            'growth': 16.67,
            'year': '2022',
          },
          {
            'growth': 14.29,
            'year': '2023',
          },
        ],
      },
    });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/canada/variation?startYear=2020&endYear=2050', () => {
  test('responds with an array of gdp values filtered by start year', async () => {
    const url = '/api/v1/gdp/countries/canada/variation?startYear=2020&endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual({
      'data': {
        'code': 'CAN',
        'country': 'canada',
        'results':  [
          {
            'growth': 0,
            'year': '2021',
          },
          {
            'growth': 16.67,
            'year': '2022',
          },
          {
            'growth': 14.29,
            'year': '2023',
          },
        ],
      },
    });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/canada/variation?startYear=2050&endYear=2020', () => {
  test('responds with year range error', async () => {
    const url = '/api/v1/gdp/countries/canada/variation?startYear=2050&endYear=2020';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startYear parameter cannot be greater than the endYear parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/gdp/countries/Random/variation?startYear=2020&endYear=2050', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/gdp/countries/Random/variation?startYear=2020&endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'No data found for random'
      });
    expect(response.statusCode).toEqual(404);
  });
});


describe('GET /api/v1/gdp/countries/canada/gdp-range?startGdp=1&endGdp=100000', () => {
  test('responds with an array of gdp values filtered by start gdp', async () => {
    const url = '/api/v1/gdp/countries/canada/gdp-range?startGdp=1&endGdp=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gdp':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/canada/gdp-range?startGdp=100000&endGdp=1', () => {
  test('responds with gdp range error', async () => {
    const url = '/api/v1/gdp/countries/canada/gdp-range?startGdp=100000&endGdp=1';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startGdp parameter cannot be greater than the endGdp parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/gdp/countries/Random/gdp-range?startGdp=1&endGdp=100000', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/gdp/countries/Random/gdp-range?startGdp=1&endGdp=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'No data found for random with gdp between 1 and 100000'
      });
    expect(response.statusCode).toEqual(404);
  });
});



describe('GET /api/v1/gdp/countries/?countries=canada,germany,france', () => {
  test('responds with an array of gdp values filtered by countries', async () => {
    const url = '/api/v1/gdp/countries/?countries=canada,germany,france';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'results':[
          {
            'code': 'CAN',
            'country': 'canada',
            'gdp': '5000',
            'position': [
              '56.130366',
              '-106.346771',
            ],
            'year': '2021',
          },
          {
            'code': 'CAN',
            'country': 'canada',
            'gdp': '5000',
            'position': [
              '56.130366',
              '-106.346771',
            ],
            'year': '2021'
          },
          {
            'code': 'CAN',
            'country': 'canada',
            'gdp': '5000',
            'position': [
              '56.130366',
              '-106.346771',
            ],
            'year': '2021'
          }
        ]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET /api/v1/gdp/countries/top/1?orderBy=highest', () => {
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

describe('GET /api/v1/gdp/countries/?countries=random,random,random', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/gdp/countries/?countries=random,random,random';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'Countries random,random,random not found'
      });
    expect(response.statusCode).toEqual(404);
  });
});

describe('GET /api/v1/gdp/countries/?countries=', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/gdp/countries/?countries=';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'No countries specified'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /api/v1/gdp/countries/?countries=1,2,3,4,5,6,7,8,9,0,1,2,3,4', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/gdp/countries/?countries=1,2,3,4,5,6,7,8,9,0,1,2,3,4';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'Countries length can not be less then 1 or greater then 10'
      });
    expect(response.statusCode).toEqual(400);
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