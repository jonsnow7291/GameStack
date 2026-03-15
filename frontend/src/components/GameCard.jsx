function GameCard({ game, onAdd }) {
  return (
    <article className="game-card">
      <img src={game.imageURL} alt={game.title} />
      <div className="game-card__content">
        <p className="tag">{game.category}</p>
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        <div className="game-card__footer">
          <strong>${game.price.toFixed(2)}</strong>
          <button type="button" onClick={() => onAdd(game)} disabled={game.stock === 0}>
            {game.stock === 0 ? 'Sold out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default GameCard;
