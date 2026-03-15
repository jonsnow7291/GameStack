import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const cardRegex = /^\d{13,19}$/;
const expiryRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
const cvvRegex = /^\d{3,4}$/;

function CheckoutPage({ cart, token, clearCart, refreshInventory, setAlert }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (Object.values(form).some((value) => !value.trim())) {
      setAlert({ type: 'error', message: 'All checkout fields are required' });
      return;
    }
    if (!cardRegex.test(form.cardNumber) || !expiryRegex.test(form.expiry) || !cvvRegex.test(form.cvv)) {
      setAlert({ type: 'error', message: 'Invalid payment data' });
      return;
    }
    if (cart.length === 0) {
      setAlert({ type: 'error', message: 'Your cart is empty' });
      return;
    }

    try {
      await api.checkout(
        {
          ...form,
          items: cart.map((item) => ({ gameId: item.id, quantity: item.quantity })),
        },
        token
      );
      clearCart();
      await refreshInventory();
      setAlert({ type: 'success', message: 'Purchase completed successfully' });
      navigate('/profile');
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <input name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <input name="cardNumber" placeholder="Card number" value={form.cardNumber} onChange={handleChange} />
      <input name="cardHolder" placeholder="Card holder" value={form.cardHolder} onChange={handleChange} />
      <input name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange} />
      <input name="cvv" placeholder="CVV" value={form.cvv} onChange={handleChange} />
      <button type="submit">Pay now</button>
    </form>
  );
}

export default CheckoutPage;
