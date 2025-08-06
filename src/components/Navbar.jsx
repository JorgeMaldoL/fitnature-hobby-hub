import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function Navbar() {
  const { userId } = useUser();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FitNature</Link>
      <div className="navbar-center">
        <span className="user-info">User: {userId}</span>
      </div>
      <div className="navbar-links">
        <Link to="/create" className="navbar-link">+ Create Workout Group</Link>
      </div>
    </nav>
  );
}
