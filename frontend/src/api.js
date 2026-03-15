const API_URL = 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  getGames: () => request('/games'),
  createGame: (payload, token) => request('/games', { method: 'POST', body: payload, token }),
  updateGame: (id, payload, token) => request(`/games/${id}`, { method: 'PUT', body: payload, token }),
  deleteGame: (id, token) => request(`/games/${id}`, { method: 'DELETE', token }),
  checkout: (payload, token) => request('/orders/checkout', { method: 'POST', body: payload, token }),
  getMyOrders: (token) => request('/orders/me', { token }),
  getSalesReport: (token) => request('/admin/reports/sales', { token }),
};
