import { useState } from 'react';

function getValidImageUrl(url) {
  if (!url) return '';
  try {
    // Extract direct image URL if it's a Bing Image Search link
    if (url.includes('bing.com/images/search')) {
      const urlObj = new URL(url);
      const mediaUrl = urlObj.searchParams.get('mediaurl');
      if (mediaUrl) return decodeURIComponent(mediaUrl);
    }
    // Extract direct image URL if it's a Google Image Search link
    if (url.includes('google.com/imgres')) {
      const urlObj = new URL(url);
      const imgUrl = urlObj.searchParams.get('imgurl');
      if (imgUrl) return decodeURIComponent(imgUrl);
    }
    return url;
  } catch (e) {
    return url;
  }
}

function GameCard({ game, onAdd }) {
  const [imgSrc, setImgSrc] = useState(() => getValidImageUrl(game.imageURL));
  const [showModal, setShowModal] = useState(false);

  const handleImageError = () => {
    // Fallback gamer image if the original image fails to load
    setImgSrc('https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=900&q=80');
  };

  return (
    <>
      <article className="game-card">
        <div style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => setShowModal(true)}>
          <img src={imgSrc} alt={game.title} onError={handleImageError} />
        </div>
        <div className="game-card__content">
          <p className="tag">{game.category}</p>
          <h3 style={{ cursor: 'pointer', transition: 'color 0.2s' }} 
              onClick={() => setShowModal(true)}
              onMouseOver={(e) => e.target.style.color = 'var(--accent)'}
              onMouseOut={(e) => e.target.style.color = ''}
          >
            {game.title}
          </h3>
          <p style={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            flex: 1 
          }}>
            {game.description}
          </p>
          <div className="game-card__footer">
            <strong>${game.price.toFixed(2)}</strong>
            <button type="button" onClick={() => onAdd(game)} disabled={game.stock === 0}>
              {game.stock === 0 ? 'Sold out' : 'Add to cart'}
            </button>
          </div>
        </div>
      </article>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <img className="modal-image" src={imgSrc} alt={game.title} onError={handleImageError} />
            <div className="modal-body">
              <h2>{game.title}</h2>
              <div className="modal-meta">
                <span>{game.category}</span>
                <span>•</span>
                <span>Stock: {game.stock > 0 ? game.stock : 'Out of stock'}</span>
                {game.created_at && (
                  <>
                    <span>•</span>
                    <span>Added: {new Date(game.created_at).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              <p className="modal-description">{game.description}</p>
            </div>
            <div className="modal-footer">
              <span className="modal-price">${game.price.toFixed(2)}</span>
              <button 
                type="button" 
                onClick={() => { onAdd(game); setShowModal(false); }} 
                disabled={game.stock === 0}
              >
                {game.stock === 0 ? 'Sold out' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GameCard;
