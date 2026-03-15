import GameCard from '../components/GameCard';

function HomePage({ inventory, addToCart }) {
  return (
    <section>
      <div className="hero">
        <div>
          <p className="hero__eyebrow">Digital storefront</p>
          <h1>Build your next gaming library with GameStack</h1>
          <p>Discover curated games, fast checkout and stock updates in real time.</p>
        </div>
      </div>

      <div className="grid cards-grid">
        {inventory.map((game) => (
          <GameCard key={game.id} game={game} onAdd={addToCart} />
        ))}
      </div>
    </section>
  );
}

export default HomePage;
