import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FitNature</Link>
      <Link to="/create" className="navbar-link">+ Create Workout Group</Link>
    </nav>
  );
}
