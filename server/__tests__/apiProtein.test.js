const app = require('../app');
const request = require('supertest');

jest.mock('../db/db', () => {
  class DB {
    constructor() {
    }
    async readAllCountryData() {
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gppd' : '5000' }];
    }

    async readAllYearCountryData() {
      return [
        {
          country: 'canada',
          code: 'CAN',
          year: '2021',
          gppd: '5000',
        },
        {
          country: 'germany',
          code: 'GER',
          year: '2021',
          gppd: '5000',
        },
        {
          country: 'france',
          code: 'FRA',
          year: '2021',
          gppd: '5000',
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

    async getProteinRange(collName, country) {
      if (country === 'random') {
        return [];
      }
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gppd' : '5000' }];
    }

    async getYearRange(collName, country) {
      if (country === 'random') {
        return [];
      }
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gppd' : '5000' },
        { 'country' : 'canada', 'code' : 'CAN', 'year' : '2022', 'gppd' : '6000' },
        { 'country' : 'canada', 'code' : 'CAN', 'year' : '2023', 'gppd' : '7000' }];
    }

    async getAllCountries() {
      return ['canada', 'germany', 'france'];
    }

    async getCountryYearData() {
      return [{ 'country' : 'canada', 'code' : 'CAN', 'year' : '2021', 'gppd' : '5000' }];
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
        'gppd':99301.52, position:['49.815273', '6.129583']}];
    }

    async getDataRangeWithYear() {
      return [{'country':'canada', 'code':'CAN', 'year':'2021', 'gppd':'5000'}];
    }

    async readAll() {
      return [{'country':'lu', 'latitude':'49.815273', 'longitude':'6.129583',
        'name':'Luxembourg'},
      {'country':'ca', 'latitude':'56.130366', 'longitude':'-106.346771', 'name':'Canada'},];
    }
  }
  return DB;
});


describe('Test get the protein for a specific year within a specified protein range', () => {
  test('responds with an array of protein values filtered by year', async () => {
    const url = '/api/v1/protein/countries/protein-range?year=2021&min=1&max=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'results':[{'country':'canada', 'code':'CAN', 'year':'2021', 'gppd':'5000', 
          'position':['56.130366', '-106.346771']}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test get the protein for a specific year within a specified protein range', () => {
  test('responds with The min parameter cannot be greater than the max parameter', async () => {
    const url = '/api/v1/protein/countries/protein-range?year=2021&min=100000&max=1';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The min parameter cannot be greater than the max parameter'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the protein for a specific year within a specified protein range', () => {
  test('respond with The min parameter must be a number', async () => {
    const url = '/api/v1/protein/countries/protein-range?year=2021&min=abc&max=1';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The min parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
});


describe('Test get the protein for a specific year within a specified protein range', () => {
  test('respond with The max parameter must be a number', async () => {
    const url = '/api/v1/protein/countries/protein-range?year=2021&min=1&max=abc';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The max parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the protein for a specific year within a specified protein range', () => {
  test('respond with The year parameter must be a number', async () => {
    const url = '/api/v1/protein/countries/protein-range?year=abc&min=1&max=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The year parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the protein for a specific year within a specified protein range', () => {
  test('respond with The year parameter must be a positive number', async () => {
    const url = '/api/v1/protein/countries/protein-range?year=-1&min=1&max=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The year parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  }); 
});
  
describe('Test get the top x highest or lowest protein across all countries', () => {
  test('responds with an array of protein values filtered by year', async () => {
    const url = '/api/v1/protein/countries/top/1?orderBy=highest&year=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'results':[{'country':'luxembourg', 'code':'LUX', 'year':2000,
          'gppd':99301.52, position:['49.815273', '6.129583']}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test get the top x highest or lowest protein across all countries', () => {
  test('responds with The year parameter must be a number', async () => {
    const url = '/api/v1/protein/countries/top/1?orderBy=highest&year=abc';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The year parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the top x highest or lowest protein across all countries', () => {
  test('responds with The year parameter must be a positive number', async () => {
    const url = '/api/v1/protein/countries/top/1?orderBy=highest&year=-1';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The year parameter must be a positive number'
      });
    expect(response.statusCode).toEqual(400);
  });
}
);

describe('Test get the top x highest or lowest protein across all countries', () => {
  test('responds with The value following top/ must be a number between 1 and 10', async () => {
    const url = '/api/v1/protein/countries/top/-1?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The value following top/ must be a number between 1 and 10'
      });
    expect(response.statusCode).toEqual(400);
  });
}
);

describe('Test get the top x highest or lowest protein across all countries', () => {
  test('responds with The value following top/ must be a number between 1 and 10', async () => {
    const url = '/api/v1/protein/countries/top/100?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'The value following top/ must be a number between 1 and 10'
      });
    expect(response.statusCode).toEqual(400);
  });
}
);

describe('Test get the top x highest or lowest protein across all countrie', () => {
  test('responds with error', async () => {
    const url = '/api/v1/protein/countries/top/-1?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 'The value following top/ must be a number between 1 and 10'}
    );
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the top x highest or lowest protein across all countrie', () => {
  test('responds with error', async () => {
    const url = '/api/v1/protein/countries/top/100?orderBy=highest';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 'The value following top/ must be a number between 1 and 10'}
    );
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the top x highest or lowest protein across all countrie', () => {
  test('responds with error', async () => {
    const url = '/api/v1/protein/countries/top/1?orderBy=trash';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error':
      'orderBy query parameter can be one of the following values: \'highest\', \'lowest\''}
    );
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test get the top x highest or lowest protein across all countrie', () => {
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

describe('Test get the top x highest or lowest protein across all countrie', () => {
  test('responds top 1 country with highest protein', async () => {
    const url = '/api/v1/protein/countries/top/1?orderBy=highest&year=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'results':[{'country':'luxembourg', 'code':'LUX', 'year':2000,
          'gppd':99301.52, position:['49.815273', '6.129583']}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the protein for a specific country over a range of years', () => {
  test('responds with an array of protein values', async () => {
    const url = '/api/v1/protein/countries/Canada?endYear=2021';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gppd':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the protein for a specific country over a range of years', () => {
  test('responds with an array of protein values filtered by start year', async () => {
    const url = '/api/v1/protein/countries/Canada?startYear=2000&endYear=2021';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gppd':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});


describe('Test getting the protein for a specific country over a range of years', () => {
  test('responds with empty results', async () => {
    const url = '/api/v1/protein/countries/Canada?startYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the protein for a specific country over a range of years', () => {
  test('responds with an array of protein values filtered by end year', async () => {
    const url = '/api/v1/protein/countries/Canada?endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gppd':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the protein for a specific country over a range of years', () => {
  test('responds with empty results', async () => {
    const url = '/api/v1/protein/countries/Canada?endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the protein for a specific country over a range of years', () => {
  test('responds with an array of protein values filtered by end year', async () => {
    const url = '/api/v1/protein/countries/Canada?startYear=2000&endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gppd':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test getting the protein for a specific country over a range of years', () => {
  test('responds with year range error', async () => {
    const url = '/api/v1/protein/countries/Canada?startYear=2050&endYear=2000';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startYear parameter cannot be greater than the endYear parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test Get the growth / decline of protein for a specific country over the years', () => {
  test('responds with an array of protein values filtered by start year', async () => {
    const url = '/api/v1/protein/countries/canada/variation?startYear=2020&endYear=2050';
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

describe('Test Get the growth / decline of protein for a specific country over the years', () => {
  test('responds with an array of protein values filtered by start year', async () => {
    const url = '/api/v1/protein/countries/canada/variation?startYear=2020&endYear=2050';
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

describe('Test Get the growth / decline of protein for a specific country over the years', () => {
  test('responds with year range error', async () => {
    const url = '/api/v1/protein/countries/canada/variation?startYear=2050&endYear=2020';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startYear parameter cannot be greater than the endYear parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test Get the growth / decline of protein for a specific country over the years', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/protein/countries/Random/variation?startYear=2020&endYear=2050';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'No data found for random'
      });
    expect(response.statusCode).toEqual(404);
  });
});

describe('Test Get the protein for a specific country within a specified range', () => {
  test('responds with an array of protein values filtered by start protein', async () => {
    const url = '/api/v1/protein/countries/canada/protein-range?startProtein=1&endProtein=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'country':'canada', 'code':'CAN', 'results':[{'year':'2021', 'gppd':'5000'}]
      }
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Test Get the protein for a specific country within a specified range', () => {
  test('responds with protein range error', async () => {
    const url = '/api/v1/protein/countries/canada/protein-range?startProtein=100000&endProtein=1';
    const response = await request(app).get(url);
    expect(response.body).toEqual({'error' : 
    'The startProtein parameter cannot be greater than the endProtein parameter'
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test Get the protein for a specific country within a specified range', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/protein/countries/Random/protein-range?startProtein=1&endProtein=100000';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'No data found for random with pro between 1 and 100000'
      });
    expect(response.statusCode).toEqual(404);
  });
});

describe('Test Get the protein for multiple countries and a specific year', () => {
  test('responds with an array of protein values filtered by countries', async () => {
    const url = '/api/v1/protein/countries/?countries=canada,germany,france';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'data': {
        'results':[
          {
            'code': 'CAN',
            'country': 'canada',
            'gppd': '5000',
            'position': [
              '56.130366',
              '-106.346771',
            ],
            'year': '2021',
          },
          {
            'code': 'CAN',
            'country': 'canada',
            'gppd': '5000',
            'position': [
              '56.130366',
              '-106.346771',
            ],
            'year': '2021'
          },
          {
            'code': 'CAN',
            'country': 'canada',
            'gppd': '5000',
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



describe('Test Get the protein for multiple countries and a specific year', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/protein/countries/?countries=random,random,random';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'Countries random,random,random not found'
      });
    expect(response.statusCode).toEqual(404);
  });
});

describe('Test Get the protein for multiple countries and a specific year', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/protein/countries/?countries=';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'No countries specified'
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Test Get the protein for multiple countries and a specific year', () => {
  test('responds with an empty array', async () => {
    const url = '/api/v1/protein/countries/?countries=1,2,3,4,5,6,7,8,9,0,1,2,3,4';
    const response = await request(app).get(url);
    expect(response.body).toEqual(
      {'error': 
      'Countries length can not be less then 1 or greater then 10'
      });
    expect(response.statusCode).toEqual(400);
  });
});