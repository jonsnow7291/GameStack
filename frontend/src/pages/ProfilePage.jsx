import { useEffect, useState } from 'react';
import { api } from '../api';

function ProfilePage({ token, setAlert }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        setOrders(await api.getMyOrders(token));
      } catch (error) {
        setAlert({ type: 'error', message: error.message });
      }
    }

    loadOrders();
  }, [token, setAlert]);

  return (
    <section className="form-card">
      <h2>Order history</h2>
      {orders.length === 0 ? (
        <p>You do not have orders yet.</p>
      ) : (
        orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card__header">
              <strong>Order #{order.id}</strong>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <p>{new Date(order.created_at).toLocaleString()}</p>
            {order.items.map((item) => (
              <p key={`${order.id}-${item.gameId}`}>
                {item.title} x{item.quantity}
              </p>
            ))}
          </article>
        ))
      )}
    </section>
  );
}

export default ProfilePage;
