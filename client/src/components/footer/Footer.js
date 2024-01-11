import './Footer.css';


/**
 * Simple Footer component used for displaying the footer
 * @returns JSX Footer Component with the footer
 */

export default function Footer() {
  return <footer className="Footer">
    <div>
      <h3>Goal:</h3>
      <p>Our goal is to provide an easy interface for visualizing the GDP all around the world,
        dating from the 1990s. At the same time, we want to demonstrate the correlation between a
        country's GDP and its average daily amount of protein intake
      </p>
    </div>
    
    <div>
      <h3>Attributions:</h3>
      <p>Click
        <a href="https://ourworldindata.org/grapher/gdp-per-capita-worldbank"> here </a>
        to view the gdp dataset
      </p>
      <p>Click
        <a href="https://ourworldindata.org/grapher/daily-per-capita-protein-supply"> here </a>
        to view the protein dataset
      </p>
      <p>Click
        <a href="https://developers.google.com/public-data/docs/canonical/countries_csv"> here </a>
        to view the countries dataset
      </p>
    </div>

    <div>
      <h3>Developers:</h3>
      <p>Marko Litovchenko</p>
      <p>Thomas Proctor</p>
      <p>Amirreza Mojtahedi</p>
    </div>
  </footer>;
}