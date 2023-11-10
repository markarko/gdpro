import React, { useEffect, useState } from 'react';
import PlotDisplay from './plotDisplay';

const PlotController = (props) => {
  const [newData, setNewData] = useState([]);
  const [country, setCountry] = useState([]);
  useEffect(() => {
    fetch('/api/v1/protein/countries/canada')
      .then(res => res.json())
      .then(data => setNewData(data['data']['results']));

      
    fetch('/api/v1/gdp/countries/canada')
      .then(res => res.json())
      .then(data => setCountry(data['data']['results']));

    console.log(newData);
  }
  , []);


  let data = [];
  // implement new data into the plot
  if (newData.length !== 0) {
    console.log(newData);
    data = [
      {
        x: newData.map(row => row.year),
        y: newData.map(row => row.gppd),
        name: 'Protein consumption',
        type: 'scatter',
        marker: {color: 'red'},
      },
      {
        x: country.map(row => row.year),
        y: country.map(row => row.gdp / 1000),
        name: 'GDP (in thousands)',
        type: 'scatter',
        yaxis: 'y2',
        marker: {color: 'blue'},
      }
    ];
  }
  const layout = {  
    title: 'GDP vs Protein Consumption',
    xaxis: {
      title: 'Year',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'Protein Consumption (g)',
      showline: false
    },
    yaxis2: {
      title: 'GDP (in thousands)',
      showline: false,
      overlaying: 'y',
      side: 'right'
    }
  };

  return(
    <div>
      <PlotDisplay data={data} layout={layout} />
    </div>
  );
};

export default PlotController;
