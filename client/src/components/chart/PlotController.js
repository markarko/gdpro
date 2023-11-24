import PlotDisplay from './PlotDisplay';


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

const generateProteinLayout = () => {
  return {
    yaxis: {
      title: 'Protein Consumption (g)',
      showline: false,
    }
  };
};

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


