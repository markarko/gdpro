// React component for displaying data from an API


import React, { useEffect } from 'react';
import { Table } from 'reactstrap';
import { useState } from 'react';

const country = 'canada';


const DataDisplay = (props) => {
  const [data, setData] = useState({
    'data' : {
      'code': 'CAN',
      'country' : 'Canada',
      'results' : [
        {
          year : 1990,
          gdp : 5723
        },
        {
          year : 1991,
          gdp : 3723
        }
      ]
    }
  }); 

  // Fetch data from api using await and useffect
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/countries/${country}`);
      const body = await response.json();
      setData(body);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>{data['data']['country']}</h1>
      <Table striped>
        <thead>
          <tr>
            <th>Year</th>
            <th>gdp</th>
          </tr>
        </thead>
        <tbody>
          {data['data']['results'].map((item, index) => 
            <tr key={index}>
              <td>{item.year}</td>
              <td>{item.gdp}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>

  );
};

export default DataDisplay;