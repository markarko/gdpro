import './App.css';
import QuizComponent from './components/quiz/QuizComponent';
import NavBar from './components/navbar/navbar';
import ChartView from './components/chart/ChartView';
import Footer from './components/footer/Footer';
import MapView from './components/Map/MapView';
import { useState, useEffect } from 'react';


/**
 * The main app component that handles the navbar, the views and the footer
 * @returns JSX App Component
 */
function App() {
  const views = {
    Chart : 'chart',
    Map : 'map',
    Quiz : 'quiz'
  };

  const [validYears, setValidYears] = useState([1990, 2020]);
  const [validCountries, setValidCountries] = useState(['afghanistan']);
  const [error, setError] = useState('');

  const [currentView, setCurrentView] = useState(views.Chart);

  useEffect(() => {
    async function getJson(url) {
      const response = await fetch(url);
      return await response.json();
    }
    
    async function fetchInitialData() {
      try{
        const yearsUrl = '/api/v1/gdp/countries/ukraine';
        const countriesUrl = '/api/v1/gdp/countries/all'; 
  
        const fetches = [getJson(yearsUrl), getJson(countriesUrl)];
        const [yearsData, countriesData] = await Promise.all(fetches);
      
        const years = yearsData.data.results.map(x => x.year); 
        setValidYears(years);
  
        const countries = countriesData.data;
        setValidCountries(countries);
      } catch(err) {
        setError(err);
      }
    }

    fetchInitialData();
  }, []);

  return <div>
    <NavBar setCurrentView={setCurrentView} views={views} />
    <View
      currentView={currentView}
      views={views}
      validYears={validYears}
      validCountries={validCountries}
      error={error}
      setError={setError} />
    <Footer />
  </div>;
}


/**
 * The view component that handles the view logic and switches the views
 * @param {*} currentView - The current view
 * @param {*} views - The views
 * @param {*} validYears - The valid years
 * @param {*} validCountries - The valid countries
 * @param {*} error - The error
 * 
 * @returns JSX View Component
 * 
 */
function View({ currentView, views, validYears, validCountries, error, setError }) {
  switch (currentView){
  case views.Chart:
    return <ChartView
      validYears={validYears}
      validCountries={validCountries}
      error={error}
      setError={setError} />;
  case views.Map:
    return <MapView 
      validYears={validYears}
      validCountries={validCountries}
      error={error}
      setError={setError} />;
  case views.Quiz:
    return <QuizComponent />;
  default:
    return <div>Unsupported view</div>;
  }
}

export default App;
