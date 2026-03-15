import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

function RegisterPage({ setUser, setAlert }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

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
    if (!passwordRegex.test(form.password)) {
      setAlert({ type: 'error', message: 'Password must include uppercase, lowercase and number' });
      return;
    }

    try {
      const data = await api.register(form);
      setUser(data);
      setAlert({ type: 'success', message: 'Account created successfully' });
      navigate('/');
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Create account</h2>
      <input name="name" placeholder="Name" onChange={handleChange} value={form.name} />
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} value={form.password} />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterPage;
