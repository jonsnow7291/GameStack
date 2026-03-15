import { Link } from 'react-router-dom';

function NavBar({ user, cartCount, onLogout }) {
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        GameStack
      </Link>
      <nav>
        <Link to="/">Catalog</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        {user.token && user.role === 'customer' && <Link to="/profile">Profile</Link>}
        {user.token && user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
        {!user.token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button type="button" className="ghost-button" onClick={onLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
