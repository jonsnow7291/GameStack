import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Alert from './components/Alert';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const emptyUser = { name: '', role: '', token: '', email: '' };

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gamestack-user');
    return stored ? JSON.parse(stored) : emptyUser;
  });
  const [inventory, setInventory] = useState([]);
  const [alert, setAlert] = useState(null);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  async function loadInventory() {
    try {
      setInventory(await api.getGames());
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (user?.token) {
      localStorage.setItem('gamestack-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gamestack-user');
    }
  }, [user]);

  function addToCart(game) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === game.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === game.id
            ? { ...item, quantity: Math.min(item.quantity + 1, game.stock) }
            : item
        );
      }
      return [...currentCart, { ...game, quantity: 1 }];
    });
    setAlert({ type: 'success', message: `${game.title} added to cart` });
  }

  function updateCartQuantity(id, quantity) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((currentCart) =>
      currentCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  function removeFromCart(id) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  }

  function logout() {
    setUser(emptyUser);
    setCart([]);
    setAlert({ type: 'success', message: 'Session closed' });
  }

  return (
    <div className="app-shell">
      <NavBar user={user} cartCount={cartCount} onLogout={logout} />
      <main className="page-shell">
        {alert && <Alert alert={alert} onClose={() => setAlert(null)} />}
        <Routes>
          <Route
            path="/"
            element={<HomePage inventory={inventory} addToCart={addToCart} />}
          />
          <Route
            path="/login"
            element={<LoginPage setUser={setUser} setAlert={setAlert} />}
          />
          <Route
            path="/register"
            element={<RegisterPage setUser={setUser} setAlert={setAlert} />}
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              user.token ? (
                <CheckoutPage
                  cart={cart}
                  token={user.token}
                  clearCart={() => setCart([])}
                  refreshInventory={loadInventory}
                  setAlert={setAlert}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user.token ? <ProfilePage token={user.token} setAlert={setAlert} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user}>
                <AdminPage
                  inventory={inventory}
                  token={user.token}
                  refreshInventory={loadInventory}
                  setAlert={setAlert}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
