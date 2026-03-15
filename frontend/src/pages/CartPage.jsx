import { Link } from 'react-router-dom';

function CartPage({ cart, updateCartQuantity, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="form-card">
      <h2>Your cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={(event) => updateCartQuantity(item.id, Number(event.target.value))}
              />
              <button type="button" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <Link className="cta-link" to="/checkout">
            Continue to checkout
          </Link>
        </>
      )}
    </section>
  );
}

export default CartPage;
