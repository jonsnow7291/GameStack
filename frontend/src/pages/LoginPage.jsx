import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage({ setUser, setAlert }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!emailRegex.test(form.email)) {
      setAlert({ type: 'error', message: 'Invalid email format' });
      return;
    }

    try {
      const data = await api.login(form);
      setUser(data);
      setAlert({ type: 'success', message: 'Welcome back' });
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} value={form.password} />
      <button type="submit">Sign in</button>
    </form>
  );
}

export default LoginPage;
