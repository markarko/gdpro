// Create a react component using plotly.js to display the plot
// Make a graph that shows the relationship between GDP and protein consumption

import Plot from 'react-plotly.js';

export default function PlotDisplay({ data, layout }) {

  return (
    <Plot
      data={data}
      layout={layout}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />);
};

