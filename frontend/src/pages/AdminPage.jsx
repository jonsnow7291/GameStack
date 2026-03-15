import { useEffect, useState } from 'react';
import { api } from '../api';

const initialForm = {
  title: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  imageURL: '',
};

function AdminPage({ inventory, token, refreshInventory, setAlert }) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        setReport(await api.getSalesReport(token));
      } catch (error) {
        setAlert({ type: 'error', message: error.message });
      }
    }

    loadReport();
  }, [token, setAlert, inventory]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(game) {
    setEditingId(game.id);
    setForm({
      title: game.title,
      description: game.description,
      price: game.price,
      stock: game.stock,
      category: game.category,
      imageURL: game.imageURL,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await api.updateGame(editingId, payload, token);
        setAlert({ type: 'success', message: 'Game updated' });
      } else {
        await api.createGame(payload, token);
        setAlert({ type: 'success', message: 'Game created' });
      }
      setForm(initialForm);
      setEditingId(null);
      await refreshInventory();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteGame(id, token);
      setAlert({ type: 'success', message: 'Game deleted' });
      await refreshInventory();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  }

  return (
    <section className="admin-layout">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit game' : 'Create game'}</h2>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="imageURL" placeholder="Image URL" value={form.imageURL} onChange={handleChange} />
        <button type="submit">{editingId ? 'Save changes' : 'Create game'}</button>
      </form>

      <div className="form-card">
        <h2>Sales report</h2>
        <p>Total orders: {report?.total_orders ?? 0}</p>
        <p>Total revenue: ${report?.total_revenue?.toFixed(2) ?? '0.00'}</p>
      </div>

      <div className="form-card">
        <h2>Inventory</h2>
        {inventory.map((game) => (
          <div className="inventory-row" key={game.id}>
            <div>
              <strong>{game.title}</strong>
              <p>{game.stock} units - ${game.price.toFixed(2)}</p>
            </div>
            <div className="inventory-actions">
              <button type="button" onClick={() => startEdit(game)}>
                Edit
              </button>
              <button type="button" className="danger-button" onClick={() => handleDelete(game.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminPage;
