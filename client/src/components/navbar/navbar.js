// import navbar css
import './navbar.css';


/**
 * NavBar component used for displaying the navbar
 * @param {Function} setCurrentView - The function to set the current view
 * @param {Object} views - The views
 * @returns JSX NavBar Component with the navbar
 */

export default function NavBar({ setCurrentView, views}) {
  return (
    <header>
      <div className = "inner">
        <nav>
          <input type="checkbox" id="nav" /><label for="nav" className="nav-label"></label>
          <ul>
            <li><a href="/#" onClick={() => setCurrentView(views.Map)} className="elem">Map</a></li>
            <li><a href="/#"
              onClick={() => setCurrentView(views.Chart)} className="elem">Chart</a></li>
            <li><a href="/#" onClick={()=>setCurrentView(views.Quiz)} className="elem">Quiz</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}