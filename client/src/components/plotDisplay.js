// Create a react component using plotly.js to display the plot
// Make a graph that shows the relationship between GDP and protein consumption

import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const PlotDisplay = (props) => {
  const data = props.data;
  const layout = props.layout;

  return (
    <Plot
      data={data}
      layout={layout}
    />);
};

export default PlotDisplay;
