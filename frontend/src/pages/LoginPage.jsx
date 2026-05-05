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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
      <form className="form-card" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', borderTop: '4px solid var(--accent)' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '8px', textShadow: '0 0 10px var(--accent-glow)' }}>System Access</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>Enter your credentials to continue</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Email Address</label>
          <input name="email" placeholder="player@gamestack.com" onChange={handleChange} value={form.email} style={{ background: 'rgba(0,0,0,0.6)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Password</label>
          <input name="password" placeholder="••••••••" type="password" onChange={handleChange} value={form.password} style={{ background: 'rgba(0,0,0,0.6)' }} />
        </div>

        <button type="submit" style={{ marginTop: '20px', width: '100%', padding: '14px' }}>Initialize Session</button>
      </form>
    </div>
  );
}

export default LoginPage;
