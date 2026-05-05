import { Link } from 'react-router-dom';

function NavBar({ user, cartCount, onLogout }) {
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        GameStack
      </Link>
      <nav>
        <Link className="nav-link" to="/">Catalog</Link>
        <Link className="nav-link" to="/cart">Cart ({cartCount})</Link>
        {user.token && user.role === 'customer' && <Link className="nav-link" to="/profile">Profile</Link>}
        {user.token && user.role === 'admin' && <Link className="nav-link" to="/admin">Admin Panel</Link>}
        {!user.token ? (
          <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
            <Link className="ghost-button" to="/login" style={{ padding: '8px 16px', borderRadius: '6px' }}>Login</Link>
            <Link className="cta-link" to="/register" style={{ padding: '8px 16px', borderRadius: '6px' }}>Register</Link>
          </div>
        ) : (
          <button type="button" className="ghost-button" onClick={onLogout} style={{ marginLeft: '12px' }}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
