import React, { useEffect, useState } from 'react';
import PlotDisplay from './plotDisplay';

const PlotController = (props) => {
  const [newData, setNewData] = useState([]);
  useEffect(() => {
    fetch('/api/v1/protein/countries/canada')
      .then(res => res.json())
      .then(data => setNewData(data['data']['results']));

  }
  , []);


  let data = [];
  // implement new data into the plot
  if (newData.length !== 0) {
    data = [
      {
        x: newData.map(row => row.year),
        y: newData.map(row => row.gppd),
        name: 'Protein consumption',
        type: 'scatter',
        marker: {color: 'red'},
      }
    ];
  }
  const layout = {  
    title: 'Protein Consumption',
    xaxis: {
      title: 'Year',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'Protein Consumption (g)',
      showline: false
    }
  };

  return(
    <div>
      <PlotDisplay data={data} layout={layout} />
    </div>
  );
};

export default PlotController;
