import { useState, useMemo } from 'react';
import GameCard from '../components/GameCard';

function HomePage({ inventory, addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'asc', 'desc'

  // Extract unique categories dynamically from the inventory
  const categories = useMemo(() => {
    const cats = inventory.map(game => game.category).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [inventory]);

  // Filter and Sort inventory
  const filteredInventory = useMemo(() => {
    let result = inventory;
    if (selectedCategory !== 'All') {
      result = result.filter(game => game.category === selectedCategory);
    }
    
    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [inventory, selectedCategory, sortOrder]);

  return (
    <section>
      <div className="hero">
        <div>
          <p className="hero__eyebrow">Digital storefront</p>
          <h1>Build your next gaming library with GameStack</h1>
          <p>Discover curated games, fast checkout and stock updates in real time.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? '' : 'ghost-button'}
                style={{ padding: '8px 20px', fontSize: '0.9rem', minWidth: '80px' }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor="sort-select" style={{ color: 'var(--muted)', fontWeight: 'bold' }}>Sort By:</label>
          <select 
            id="sort-select"
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              background: 'rgba(0,0,0,0.4)', 
              color: '#fff', 
              border: '1px solid var(--line)' 
            }}
          >
            <option value="default">Default</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid cards-grid">
        {filteredInventory.map((game) => (
          <GameCard key={game.id} game={game} onAdd={addToCart} />
        ))}
        {filteredInventory.length === 0 && (
          <p style={{ color: 'var(--muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
            No games found in this category.
          </p>
        )}
      </div>
    </section>
  );
}

export default HomePage;
