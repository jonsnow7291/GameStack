import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>GameStack</h2>
          <p>Your ultimate destination for the best curated games, fast checkout, and real-time stock updates.</p>
        </div>
        <div className="footer-links">
          <div>
            <h3>Explore</h3>
            <Link to="/">Catalog</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div>
            <h3>Support</h3>
            <Link to="/">FAQ</Link>
            <Link to="/">Contact Us</Link>
          </div>
          <div>
            <h3>Legal</h3>
            <Link to="/">Terms of Service</Link>
            <Link to="/">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GameStack. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
