// import navbar css
import './navbar.css';

export default function NavBar({ setCurrentView, views}) {
  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <a href="/#" onClick={() => setCurrentView(views.Map)} className="elem">Map</a>
          <a href="/#" onClick={() => setCurrentView(views.Chart)} className="elem">Chart</a>
          <a href="/#" onClick={() => setCurrentView(views.Quiz)} className="elem">Quiz</a>
        </div>
        {/* <div className="nav-right">
          <a href="Light" className="elem">Light</a>
        </div> */}
      </nav>
    </div>  );
}