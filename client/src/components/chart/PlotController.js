import PlotDisplay from './PlotDisplay';

/**
 * generateBaseLayout function used for generating the base layout
 * also used for generating the layout for the plot component
 * @param {String} title - The title
 * @returns the base layout
 */
const generateBaseLayout = (title) => {
  return {
    title: title,
    autosize: true,
    xaxis: {
      title: 'Year',
      showgrid: false,
      zeroline: false
    },
  };
};

/**
 * mapProteinData function used for mapping the protein data to the year for the chart
 * @param {Object} data - The data
 * @returns the mapped protein data
 */
const mapProteinData = (data) => {
  const newProtein = {
    x: data.map(row => row.year),
    y: data.map(row => row.gppd),
    name: 'Protein',
    type: 'scatter',
    marker: {color: 'red'},
  };
  return newProtein;
};

/**
 * generateProteinLayout function used for generating the layout for the protein chart
 * @returns the layout for the protein chart
 */
const generateProteinLayout = () => {
  return {
    yaxis: {
      title: 'Protein Consumption (g)',
      showline: false,
    }
  };
};

/**
 * mapGdpData function used for mapping the gdp data to the year for the chart
 * @param {Object} data - The data
 * @returns the mapped gdp data
 */
const mapGdpData = (data) => {
  return {
    x: data.map(row => row.year),
    y: data.map(row => row.gdp),
    name: 'GDP',
    type: 'scatter',
    yaxis: 'y2',
    marker: {color: 'blue'},
  };
};

/**
 * generateGdpLayout function used for generating the layout for the gdp chart
 * @returns the layout for the gdp chart
 */
const generateGdpLayout = () => {
  return {
    yaxis2: {
      title: 'GDP (in thousands)',
      showline: false,
      overlaying: 'y',
      side: 'right'
    }
  };
};


/**
 * PlotController component used for displaying the chart
 * Converts the data to the format required for the chart
 * @param {Object} gdp - The gdp data
 * @param {Object} protein - The protein data
 * @param {String} title - The title
 * @returns JSX PlotDisplay Component
 */
export default function PlotController({ gdp, protein, title }) {
  const data = [];

  const layout = generateBaseLayout(title);

  if (protein) {
    data.push(mapProteinData(protein));
    layout.yaxis = generateProteinLayout().yaxis;
  }

  if (gdp) {
    data.push(mapGdpData(gdp));
    layout.yaxis2 = generateGdpLayout().yaxis2;
  }

  return(
    <div>
      <PlotDisplay data={data} layout={layout} />
    </div>
  );
};


