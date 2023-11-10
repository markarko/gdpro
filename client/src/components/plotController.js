import React, { useEffect, useState } from 'react';
import PlotDisplay from './plotDisplay';

const PlotController = ({ gdp, protein, title }) => {
  let data = [];

  if (protein) {
    let newProtein = {
      x: protein.map(row => row.year),
      y: protein.map(row => row.gppd),
      name: 'Protein consumption',
      type: 'scatter',
      marker: {color: 'red'},
    };
    data.push(newProtein);
  }

  if (gdp) {
    let newGdp = {
      x: gdp.map(row => row.year),
      y: gdp.map(row => row.gdp),
      name: 'GDP per capita',
      type: 'scatter',
      yaxis: 'y2',
      marker: {color: 'blue'},
    };
    data.push(newGdp);
  }

  const layout = {  
    title: title,
    xaxis: {
      title: 'Year',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'Protein Consumption (g)',
      showline: false,
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
