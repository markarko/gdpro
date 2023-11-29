// Create a react component using plotly.js to display the plot
// Make a graph that shows the relationship between GDP and protein consumption

import Plot from 'react-plotly.js';

/**
 * PlotDisplay component used for displaying the plot
 * Implements Plot from react-plotly.js
 * Uses built in resize handler
 * @param {Object} data - The data
 * @param {Object} layout - The layout
 * @returns JSX PlotDisplay Component with the plot
 */
export default function PlotDisplay({ data, layout }) {
  return (
    <Plot
      data={data}
      layout={layout}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />);
};

