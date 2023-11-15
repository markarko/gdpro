import './Footer.css';

export default function Footer() {
  return <div className="Footer">
    <div>
      <h3>Goal:</h3>
      <div>Our goal is to provide an easy interface for visualizing the GDP all around the world,
        dating from the 1990s. At the same time, we want to demonstrate the correlation between a
        country's GDP and its average daily amount of protein intake
      </div>
    </div>
    
    <div>
      <h3>Attributions:</h3>
      <div>Click
        <a href="https://ourworldindata.org/grapher/gdp-per-capita-worldbank"> here </a>
        to view the gdp dataset
      </div>
      <div>Click
        <a href="https://ourworldindata.org/grapher/daily-per-capita-protein-supply"> here </a>
        to view the protein dataset
      </div>
    </div>

    <div>
      <h3>Developers:</h3>
      <div>Marko Litovchenko</div>
      <div>Thomas Proctor</div>
      <div>Amir</div>
    </div>
  </div>;
}