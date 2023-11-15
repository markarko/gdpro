// import navbar css
import './navbar.css';

export default function NavBar() {

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <a href="/" className="elem">Chart</a>
          <a href="/quiz" className="elem">Quiz</a>
          <a href="/map" className="elem">Map</a>
        </div>
        <div classname="nav-right">
          <a href="Light" className="elem">Light</a>
        </div>
      </nav>
    </div>  );
}